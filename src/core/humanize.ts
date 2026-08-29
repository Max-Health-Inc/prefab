/**
 * Key humanization — turn a data key into a label a person reads.
 *
 * Four copies of this had accumulated (`autoDetail`/`autoTable`, `autoForm`,
 * `autoComparison`, and now the schema converter), three of them byte-identical.
 * They are one function with one optional extra rule, so they live here.
 */

/**
 * `firstName` / `first_name` / `first-name` → `First name`.
 *
 * Only the first word is capitalized: these are labels in a sentence-case UI,
 * not headings.
 */
export function humanizeKey(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]/g, ' ')
    .trim()
    .replace(/^\w/, c => c.toUpperCase())
}

/**
 * {@link humanizeKey} plus the `id` → `ID` rule, for table headers and detail
 * rows where `User Id` reads as a typo.
 */
export function humanizeColumnKey(key: string): string {
  return humanizeKey(key).replace(/\bid\b/gi, 'ID')
}
