/**
 * `{{ }}` template → A2UI data binding.
 *
 * `$prefab` interpolates arbitrary expressions client-side — `{{ count + 1 }}`,
 * `{{ price | currency:'USD' }}`, `{{ active ? 'Yes' : 'No' }}`. A2UI binds
 * values through JSON Pointer paths into the data model and has no expression
 * language, so only the plain-path subset crosses over: `{{ user.name }}`
 * becomes `{ path: '/user/name' }`, and anything with an operator, pipe or
 * conditional does not survive.
 *
 * Rather than silently emitting a broken binding, richer expressions are
 * reported back to the caller as an `expression` diagnostic and the property is
 * dropped, so the failure shows up at emit time instead of as an empty widget
 * in someone's renderer.
 */

import type { A2uiDataBinding, A2uiDynamicString } from './types.js'

/** Matches a string that is exactly one `{{ … }}` template and nothing else. */
const SOLE_TEMPLATE = /^\s*\{\{\s*(.+?)\s*\}\}\s*$/s

/**
 * A plain member path: `user.name`, `items.0.label`, `count`.
 *
 * Deliberately narrow. Anything outside this shape (operators, pipes, calls,
 * ternaries, string literals) has no A2UI equivalent.
 */
const PLAIN_PATH = /^[A-Za-z_$][\w$]*(?:\.(?:[A-Za-z_$][\w$]*|\d+))*$/

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

/** The outcome of converting one prefab value into an A2UI dynamic value. */
export type BindingResult =
  /** A literal with no template in it. */
  | { kind: 'literal'; value: string }
  /** A `{{ path }}` that mapped cleanly onto a JSON Pointer. */
  | { kind: 'binding'; value: A2uiDataBinding }
  /** A template too rich for A2UI. `expression` is the source, for diagnostics. */
  | { kind: 'unbindable'; expression: string }

/**
 * Convert a prefab string value into an A2UI dynamic value.
 *
 * Whole-string templates over a plain member path become bindings; strings with
 * no template at all pass through as literals; everything else is unbindable.
 * Mixed text such as `Hello {{ name }}` is unbindable too — A2UI has no string
 * interpolation, and `formatString` would need an argument list this function
 * has no way to name.
 */
export function toBinding(value: string): BindingResult {
  const sole = SOLE_TEMPLATE.exec(value)
  if (sole == null) {
    if (value.includes('{{')) return { kind: 'unbindable', expression: value }
    return { kind: 'literal', value }
  }

  const expr = stripStatePrefix(sole[1].trim())
  if (!PLAIN_PATH.test(expr)) return { kind: 'unbindable', expression: sole[1].trim() }

  return { kind: 'binding', value: { path: toJsonPointer(expr.split('.')) } }
}

/**
 * Resolve a value to an `A2uiDynamicString`, or `undefined` when it cannot be
 * expressed. Callers pair this with a diagnostic when it returns `undefined`.
 */
export function dynamicString(value: string | undefined): A2uiDynamicString | undefined {
  if (value == null) return undefined
  const r = toBinding(value)
  if (r.kind === 'literal') return r.value
  if (r.kind === 'binding') return r.value
  return undefined
}

/** True when the value contains a template prefab would interpolate. */
export function hasTemplate(value: unknown): boolean {
  return typeof value === 'string' && value.includes('{{')
}
