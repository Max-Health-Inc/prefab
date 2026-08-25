/**
 * `{{ }}` template → A2UI data binding.
 *
 * `$prefab` interpolates arbitrary expressions client-side. A2UI binds values
 * through JSON Pointers and, for text that mixes literals with values, through
 * the `formatString` catalog function. Between them those cover more than a
 * plain-path conversion would suggest:
 *
 *   - `{{ user.name }}` → `{ path: '/user/name' }`
 *   - `Hi {{ name }}!`  → `{ call: 'formatString', args: { value: 'Hi ${/name}!' } }`
 *   - `{{ count + 1 }}` → nothing; A2UI has no expression language
 *
 * What does not survive is arithmetic, pipes and conditionals. Those are
 * reported as `expression` diagnostics rather than emitted as a binding that
 * would render an empty string in someone's renderer.
 *
 * ## Scopes
 *
 * A binding is resolved against a {@link BindScope}, which is how names local to
 * a region become pointers. Inside a list template A2UI resolves relative paths
 * against the current item, so prefab's `$item` maps to the empty prefix; inside
 * an inlined definition, a `Use`'s overrides map to wherever the emitter seeded
 * them. Without this, a name that means something local would silently bind to
 * the root of the data model and read whatever happened to be there.
 */

import type { A2uiDataBinding, A2uiDynamicString, A2uiFunctionCall } from './types.js'

/** Matches a string that is exactly one `{{ … }}` template and nothing else. */
const SOLE_TEMPLATE = /^\s*\{\{\s*(.+?)\s*\}\}\s*$/s

/** Matches every `{{ … }}` occurrence, for interpolating mixed text. */
const EVERY_TEMPLATE = /\{\{\s*(.+?)\s*\}\}/g

/**
 * A plain member path: `user.name`, `items.0.label`, `count`, `$item.title`.
 *
 * Deliberately narrow. Anything outside this shape (operators, pipes, calls,
 * ternaries, string literals) has no A2UI equivalent.
 */
const PLAIN_PATH = /^\$?[A-Za-z_][\w$]*(?:\.(?:[A-Za-z_$][\w$]*|\d+))*$/

/**
 * Names local to a region, mapped to the pointer they resolve to.
 *
 * An empty-string value means "relative to the current template item", which is
 * how A2UI addresses fields inside a list template.
 */
export type BindScope = Record<string, string>

/** prefab's loop index. A2UI exposes the same thing as a system function. */
const LOOP_INDEX = '$index'

/**
 * Escape one JSON Pointer reference token (RFC 6901 §3).
 *
 * `~` must be escaped before `/`, otherwise the `~1` produced for a slash gets
 * re-escaped into `~01` on the second pass.
 */
export function escapePointerToken(token: string): string {
  return token.replace(/~/g, '~0').replace(/\//g, '~1')
}

/** Build a JSON Pointer from already-split path segments. */
export function toJsonPointer(segments: string[]): string {
  return '/' + segments.map(escapePointerToken).join('/')
}

/**
 * prefab state expressions address state keys directly (`count`), but actions
 * and docs also spell the same key as `state.count`. Both mean the root of the
 * data model, so the prefix is stripped before the pointer is built.
 */
function stripStatePrefix(path: string): string {
  return path.startsWith('state.') ? path.slice('state.'.length) : path
}

/**
 * Resolve a member path to a JSON Pointer under `scope`.
 *
 * A leading segment named in the scope is replaced by its prefix; everything
 * else resolves from the data-model root.
 */
function pathToPointer(expr: string, scope: BindScope): string | undefined {
  if (!PLAIN_PATH.test(expr)) return undefined

  const segments = stripStatePrefix(expr).split('.')
  const head = segments[0]
  // `hasOwn` rather than a truthiness check: '' is a meaningful prefix, meaning
  // "relative to the current template item".
  const prefix = Object.hasOwn(scope, head) ? scope[head] : undefined

  if (prefix === undefined) {
    // A `$`-prefixed name is a runtime binding prefab supplies ($event, $error,
    // $result). Outside a scope that defines it, there is nothing to point at.
    if (head.startsWith('$')) return undefined
    return toJsonPointer(segments)
  }

  const rest = segments.slice(1)
  if (prefix === '') {
    // Relative to the current template item. `{{ $item }}` alone has no field to
    // address, so it cannot become a pointer.
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
  /** Mixed literal and template text, interpolated through `formatString`. */
  | { kind: 'format'; value: A2uiFunctionCall }
  /** The loop index, which A2UI exposes as a system function. */
  | { kind: 'index'; value: A2uiFunctionCall }
  /** A template too rich for A2UI. `expression` is the source, for diagnostics. */
  | { kind: 'unbindable'; expression: string }

/**
 * Escape a literal segment for a `formatString` template.
 *
 * `${` is the interpolation opener, so a literal one has to be escaped or the
 * renderer reads the surrounding text as an expression.
 */
function escapeFormatLiteral(text: string): string {
  return text.replace(/\$\{/g, '\\${')
}

/**
 * Convert mixed literal and template text into a `formatString` call.
 *
 * @returns `undefined` when any embedded expression is richer than a path, in
 *   which case the whole string is unbindable rather than partly interpolated.
 */
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

/**
 * Convert a prefab string value into an A2UI dynamic value.
 *
 * A whole-string template over a plain path becomes a binding, mixed text
 * becomes a `formatString` call, a string with no template passes through, and
 * anything else is unbindable.
 */
export function toBinding(value: string, scope: BindScope = {}): BindingResult {
  const sole = SOLE_TEMPLATE.exec(value)

  // The capture is lazy but still spans `}} … {{`, so `{{ a }} of {{ b }}`
  // matches as one template whose body is `a }} of {{ b`. Rejecting a capture
  // that contains delimiters sends those strings down the interpolation path,
  // which is where they belong.
  const isSole = sole != null && !sole[1].includes('{{') && !sole[1].includes('}}')

  if (isSole) {
    const expr = sole[1].trim()

    if (expr === LOOP_INDEX && LOOP_INDEX in scope) {
      return { kind: 'index', value: { call: '@index' } }
    }

    const pointer = pathToPointer(expr, scope)
    if (pointer != null) return { kind: 'binding', value: { path: pointer } }
    return { kind: 'unbindable', expression: expr }
  }

  if (!value.includes('{{')) return { kind: 'literal', value }

  const format = toFormatString(value, scope)
  if (format != null) return { kind: 'format', value: format }
  return { kind: 'unbindable', expression: value }
}

/**
 * Resolve a value to an `A2uiDynamicString`, or `undefined` when it cannot be
 * expressed. Callers pair this with a diagnostic when it returns `undefined`.
 */
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
