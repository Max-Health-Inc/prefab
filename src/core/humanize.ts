/** `firstName` / `first_name` / `first-name` → `First name`: sentence case, acronyms (`userID` → `User ID`) kept whole. */
export function humanizeKey(key: string): string {
  return key
    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .split(/[\s_-]+/)
    .filter(word => word !== '')
    .map(word => (/^[A-Z\d]{2,}$/.test(word) ? word : word.toLowerCase()))
    .join(' ')
    .replace(/^\w/, c => c.toUpperCase())
}

/** {@link humanizeKey} plus `id` → `ID`, for table headers and detail rows. */
export function humanizeColumnKey(key: string): string {
  return humanizeKey(key).replace(/\bid\b/gi, 'ID')
}
