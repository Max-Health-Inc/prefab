/**
 * HTML escaping for server-built markup.
 *
 * One function, safe in every context prefab emits: element text, and attribute
 * values whether they are double- or single-quoted. Callers do not have to know
 * which context they are in, which is the point — the three previous copies of
 * this logic each escaped a different subset and each happened to be correct only
 * for its own call site.
 *
 * `'` is escaped as `&#39;` rather than `&apos;`: the numeric reference is
 * understood by HTML4 parsers too, and costs nothing here.
 */

const HTML_ESCAPES: Readonly<Record<string, string>> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

/**
 * Escape `& < > " '` for safe interpolation into HTML.
 *
 * Escaping is not sanitizing. This makes a value inert as *markup*; it does not
 * make a URL safe to put in `href`/`src`. Scheme filtering is a separate concern
 * (see `MD_UNSAFE_SCHEMES` in the markdown renderer).
 */
export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, c => HTML_ESCAPES[c] ?? c)
}
