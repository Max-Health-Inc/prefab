/**
 * `{{ }}` templates as A2UI values: `{{ user.name }}` → `{ path: '/user/name' }`, `Hi {{ name }}!` → `formatString`,
 * `{{ p | currency }}` → `formatCurrency`. Arithmetic, conditionals and data pipes (also inside mixed text) are unbindable.
 */

import { parsePipe, pipeCall } from './pipes.js'
import type { A2uiDataBinding, A2uiDynamicString, A2uiDynamicValue, A2uiFunctionCall } from './types.js'

/** Matches a string that is exactly one `{{ … }}` template and nothing else. */
const SOLE_TEMPLATE = /^\s*\{\{\s*(.+?)\s*\}\}\s*$/s

/** Matches every `{{ … }}` occurrence, for interpolating mixed text. */
const EVERY_TEMPLATE = /\{\{\s*(.+?)\s*\}\}/g

/** A plain member path (`user.name`, `items.0.label`, `$item.title`); anything richer has no A2UI equivalent. */
const PLAIN_PATH = /^\$?[A-Za-z_][\w$]*(?:\.(?:[A-Za-z_$][\w$]*|\d+))*$/

/** Names local to a region (`$item`, a `Use`'s overrides) mapped to their pointer; `''` means relative to the current list item. */
export type BindScope = Record<string, string>

/** prefab's loop index. A2UI exposes the same thing as a system function. */
const LOOP_INDEX = '$index'

/** Escape one JSON Pointer token (RFC 6901): `~` before `/`, or the `~1` for a slash becomes `~01`. */
export function escapePointerToken(token: string): string {
  return token.replace(/~/g, '~0').replace(/\//g, '~1')
}

/** Build a JSON Pointer from already-split path segments. */
export function toJsonPointer(segments: string[]): string {
  return '/' + segments.map(escapePointerToken).join('/')
}

/** `state.count` and `count` both address the data-model root. */
function stripStatePrefix(path: string): string {
  return path.startsWith('state.') ? path.slice('state.'.length) : path
}

/** A member path as a JSON Pointer: a leading scoped name takes its prefix, anything else resolves from the root. */
function pathToPointer(expr: string, scope: BindScope): string | undefined {
  if (!PLAIN_PATH.test(expr)) return undefined

  const segments = stripStatePrefix(expr).split('.')
  const head = segments[0]
  const prefix = Object.hasOwn(scope, head) ? scope[head] : undefined

  if (prefix === undefined) {
    // $event, $error, $result: runtime-only names with nothing to point at.
    if (head.startsWith('$')) return undefined
    return toJsonPointer(segments)
  }

  const rest = segments.slice(1)
  if (prefix === '') {
    return rest.length === 0 ? undefined : rest.map(escapePointerToken).join('/')
  }
  return rest.length === 0 ? prefix : `${prefix}/${rest.map(escapePointerToken).join('/')}`
}

/** The outcome of converting one prefab value into an A2UI dynamic value. */
export type BindingResult =
  /** A literal with no template in it. */
  | { kind: 'literal'; value: string }
  /** A `{{ path }}` that mapped cleanly onto a JSON Pointer. */
  | { kind: 'binding'; value: A2uiDataBinding }
  /** Interpolated text or a formatting pipe as a catalog function; `note` is what the mapping cost. */
  | { kind: 'format'; value: A2uiFunctionCall; note?: string }
  /** The loop index, which A2UI exposes as a system function. */
  | { kind: 'index'; value: A2uiFunctionCall }
  /** A template too rich for A2UI. `expression` is the source, for diagnostics. */
  | { kind: 'unbindable'; expression: string }

/** Escape a literal `${` so `formatString` does not read it as an interpolation. */
function escapeFormatLiteral(text: string): string {
  return text.replace(/\$\{/g, '\\${')
}

/** Mixed text as a `formatString` call, or `undefined` when any embedded expression is richer than a path. */
function toFormatString(value: string, scope: BindScope): A2uiFunctionCall | undefined {
  let failed: string | undefined
  let interpolated = ''
  let cursor = 0

  for (const match of value.matchAll(EVERY_TEMPLATE)) {
    const expr = match[1].trim()
    const pointer = pathToPointer(expr, scope)
    if (pointer == null) {
      failed = expr
      break
    }
    interpolated += escapeFormatLiteral(value.slice(cursor, match.index))
    interpolated += `\${${pointer}}`
    cursor = match.index + match[0].length
  }

  if (failed != null) return undefined
  interpolated += escapeFormatLiteral(value.slice(cursor))
  return { call: 'formatString', args: { value: interpolated } }
}

/** A piped expression as a catalog-function call; its base must be a plain path or a number literal. */
function toPipeCall(expr: string, scope: BindScope): BindingResult | undefined {
  const pipe = parsePipe(expr)
  if (pipe == null) return undefined

  const pointer = pathToPointer(pipe.base, scope)
  const value: A2uiDynamicValue | undefined = pointer != null
    ? { path: pointer }
    : /^-?\d+(\.\d+)?$/.test(pipe.base) ? Number(pipe.base) : undefined
  if (value === undefined) return undefined

  const mapped = pipeCall(pipe, value)
  if (mapped == null) return undefined

  return { kind: 'format', value: mapped.call, ...(mapped.note != null && { note: mapped.note }) }
}

/** A prefab string as an A2UI dynamic value: binding, catalog-function call, `formatString`, literal, or unbindable. */
export function toBinding(value: string, scope: BindScope = {}): BindingResult {
  const sole = SOLE_TEMPLATE.exec(value)

  // The lazy capture still spans `{{ a }} of {{ b }}`; such strings belong to the interpolation path.
  const isSole = sole != null && !sole[1].includes('{{') && !sole[1].includes('}}')

  if (isSole) {
    const expr = sole[1].trim()

    if (expr === LOOP_INDEX && LOOP_INDEX in scope) {
      return { kind: 'index', value: { call: '@index' } }
    }

    const pointer = pathToPointer(expr, scope)
    if (pointer != null) return { kind: 'binding', value: { path: pointer } }

    const piped = toPipeCall(expr, scope)
    if (piped != null) return piped

    return { kind: 'unbindable', expression: expr }
  }

  if (!value.includes('{{')) return { kind: 'literal', value }

  const format = toFormatString(value, scope)
  if (format != null) return { kind: 'format', value: format }
  return { kind: 'unbindable', expression: value }
}

/** A value as an `A2uiDynamicString`, or `undefined` (which callers report as a diagnostic). */
export function dynamicString(value: string | undefined, scope: BindScope = {}): A2uiDynamicString | undefined {
  if (value == null) return undefined
  const r = toBinding(value, scope)
  switch (r.kind) {
    case 'literal': return r.value
    case 'binding': return r.value
    case 'format': return r.value
    case 'index': return r.value
    default: return undefined
  }
}
