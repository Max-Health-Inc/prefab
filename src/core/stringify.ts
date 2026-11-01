/**
 * A value as display text, never `[object Object]`: nullish → `''`, Date → ISO, arrays joined with `', '`,
 * other objects as compact JSON. Loose by design, so `1` and `'1'` give the same string.
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
    // JSON.stringify returns undefined when toJSON() does, despite its declared type.
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return JSON.stringify(value) ?? ''
  } catch {
    // Circular structure — nothing better to offer than an empty cell.
    return ''
  }
}
