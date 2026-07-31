/**
 * Value → string coercion for display and identity.
 *
 * Component props, state entries and row cells are all typed `unknown` because
 * they arrive from JSON. Passing those straight to `String()` renders every
 * object as `[object Object]`, which blanks out table cells and chart labels
 * and — worse — makes every distinct object collide when the result is used as
 * a lookup key. Route those coercions through {@link stringifyValue} instead.
 */

/**
 * Coerce an arbitrary value to a string for display or identity comparison.
 *
 * - `null` / `undefined` → `''`
 * - strings pass through verbatim, other primitives use `String()`
 * - `Date` → ISO string (invalid dates → `''`)
 * - arrays → members stringified and joined with `', '`
 * - any other object → compact JSON (honouring `toJSON()`), never `[object Object]`
 *
 * The result is stable for a given value, so it is also safe to use as a map
 * key or for equality checks between two loosely-typed values.
 */
export function stringifyValue(value: unknown): string {
  if (value == null) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') return String(value)
  if (typeof value === 'symbol') return value.description ?? ''
  if (typeof value === 'function') return value.name
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? '' : value.toISOString()
  if (Array.isArray(value)) return value.map(stringifyValue).join(', ')
  try {
    // The lib types declare `string`, but an object whose `toJSON()` returns
    // undefined makes JSON.stringify return undefined too — hence the guard.
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return JSON.stringify(value) ?? ''
  } catch {
    // Circular structure — nothing better to offer than an empty cell.
    return ''
  }
}
