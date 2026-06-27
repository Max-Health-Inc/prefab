/**
 * Theme → CSS compilation.
 *
 * Shared between the serializer ([app.ts]) and the renderer ([renderer/theme.ts]).
 * Protocol 0.3 (upstream PrefectHQ/prefab PR #431) folds the theme into the
 * wire `css` array instead of shipping a structured `theme` object, so the
 * builder compiles `{ light, dark }` variable maps into a CSS string here.
 *
 * Selector convention: light variables target `:root`; dark variables target
 * BOTH `.dark` (upstream's class convention) and `[data-theme="dark"]`
 * (this port's attribute convention) so the emitted CSS renders correctly
 * under either renderer.
 */

export interface ThemeVars {
  light?: Record<string, string>
  dark?: Record<string, string>
}

/** Strip characters that could break out of a CSS property name. */
export function sanitizeCssIdent(key: string): string {
  return key.replace(/[^a-zA-Z0-9_-]/g, '')
}

/** Strip characters/patterns that could escape CSS value context. */
export function sanitizeCssValue(value: string): string {
  // Remove braces/angle brackets/semicolons and url()/expression() to prevent injection.
  return value.replace(/[{}<>;]/g, '').replace(/\b(url|expression)\s*\(/gi, '')
}

/** Render a variable map as indented `--key: value;` declaration lines. */
function declarations(vars: Record<string, string>, indent = '  '): string {
  return Object.entries(vars)
    .map(([key, value]) => `${indent}--${sanitizeCssIdent(key)}: ${sanitizeCssValue(value)};`)
    .join('\n')
}

/**
 * Compile a `{ light, dark }` theme into a single CSS string.
 *
 * - `light` vars target `:root`
 * - `dark` vars target `.dark, [data-theme="dark"]` plus a
 *   `prefers-color-scheme: dark` block (unless an explicit light scope opts out)
 *
 * Returns an empty string when the theme has no variables.
 */
export function compileThemeCss(theme: ThemeVars | undefined): string {
  if (!theme) return ''

  const blocks: string[] = []

  if (theme.light && Object.keys(theme.light).length > 0) {
    blocks.push(`:root {\n${declarations(theme.light)}\n}`)
  }

  if (theme.dark && Object.keys(theme.dark).length > 0) {
    const decls = declarations(theme.dark)
    blocks.push(`.dark, [data-theme="dark"] {\n${decls}\n}`)
    blocks.push(
      `@media (prefers-color-scheme: dark) {\n` +
        `  :root:not([data-theme="light"]):not(.light) {\n` +
        `${declarations(theme.dark, '    ')}\n` +
        `  }\n}`,
    )
  }

  return blocks.join('\n')
}
