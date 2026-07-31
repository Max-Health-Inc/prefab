/**
 * VS Code theme bridge for the viewer HTML.
 *
 * `prefab.css` resolves every token through a fallback chain: MCP Apps host
 * variable first, then the VS Code webview variable, then a static default.
 * That ordering is right in general, but it means a host which defines the MCP
 * Apps `--color-*` variables shadows the VS Code ones entirely, and the viewer
 * stops following the user's editor theme.
 *
 * This module emits a stylesheet that re-declares the affected tokens with the
 * VS Code variable *first* and the MCP Apps layer dropped, at a specificity and
 * document position that beat each of `prefab.css`'s four token blocks. It is
 * opt-in via `rendererHtml({ themeBridge: 'vscode' })`.
 *
 * The table below is the single source of truth for the mapping.
 * `test/theme-bridge.test.ts` cross-checks every entry against `prefab.css`, so
 * the bridge cannot drift from the base theme it overrides.
 */

/** How one prefab token is sourced from the VS Code webview. */
export interface VsCodeTokenSource {
  /** VS Code webview variable supplying the value. */
  vscode: string
  /** Static fallback when VS Code does not define it (light scheme). */
  light: string
  /** Dark-scheme fallback. Omitted for scheme-independent tokens (fonts). */
  dark?: string
}

/**
 * prefab tokens that VS Code can supply, with the same variables and static
 * fallbacks `prefab.css` uses. Tokens VS Code has no equivalent for (`--success`,
 * `--warning`, shadows, radii) are deliberately absent: the bridge only overrides
 * what the editor can actually provide.
 */
export const VSCODE_BRIDGE: Readonly<Record<string, VsCodeTokenSource>> = {
  'background': { vscode: 'vscode-editor-background', light: '#ffffff', dark: '#09090b' },
  'foreground': { vscode: 'vscode-editor-foreground', light: '#09090b', dark: '#fafafa' },
  'card': { vscode: 'vscode-editorWidget-background', light: '#ffffff', dark: '#111113' },
  'card-foreground': { vscode: 'vscode-editorWidget-foreground', light: '#09090b', dark: '#fafafa' },
  'popover': { vscode: 'vscode-editorHoverWidget-background', light: '#ffffff', dark: '#111113' },
  'popover-foreground': { vscode: 'vscode-editorHoverWidget-foreground', light: '#09090b', dark: '#fafafa' },
  'primary': { vscode: 'vscode-button-background', light: '#3b82f6', dark: '#60a5fa' },
  'primary-foreground': { vscode: 'vscode-button-foreground', light: '#ffffff', dark: '#09090b' },
  'secondary': { vscode: 'vscode-button-secondaryBackground', light: '#f3f4f6', dark: '#1f2937' },
  'secondary-foreground': { vscode: 'vscode-button-secondaryForeground', light: '#1f2937', dark: '#f3f4f6' },
  'muted': { vscode: 'vscode-editorWidget-background', light: '#f3f4f6', dark: '#1f2937' },
  'muted-foreground': { vscode: 'vscode-descriptionForeground', light: '#6b7280', dark: '#9ca3af' },
  'accent': { vscode: 'vscode-list-hoverBackground', light: '#eff6ff', dark: '#1e3a5f' },
  'accent-foreground': { vscode: 'vscode-list-hoverForeground', light: '#1e40af', dark: '#93c5fd' },
  'destructive': { vscode: 'vscode-errorForeground', light: '#ef4444', dark: '#f87171' },
  'border': { vscode: 'vscode-panel-border', light: '#e5e7eb', dark: '#27272a' },
  'input': { vscode: 'vscode-input-background', light: '#e5e7eb', dark: '#27272a' },
  'ring': { vscode: 'vscode-focusBorder', light: '#3b82f6', dark: '#60a5fa' },
  'font-sans': {
    vscode: 'vscode-font-family',
    light: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  'font-mono': {
    vscode: 'vscode-editor-font-family',
    light: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
}

/** Supported theme bridges. */
export type ThemeBridge = 'vscode'

/**
 * Runtime whitelist for {@link ThemeBridge}.
 *
 * Kept as a value, not just the union type, so the guard in `themeBridgeCss`
 * still rejects a bad name handed over from untyped JS. A `!==` chain against a
 * single-member union narrows itself away and validates nothing.
 */
const THEME_BRIDGES: readonly ThemeBridge[] = ['vscode']

function declarations(scheme: 'light' | 'dark', indent: string): string {
  return Object.entries(VSCODE_BRIDGE)
    .filter(([, src]) => scheme === 'light' || src.dark !== undefined)
    .map(([token, src]) => {
      const fallback = scheme === 'dark' ? src.dark ?? src.light : src.light
      return `${indent}--${token}: var(--${src.vscode}, ${fallback});`
    })
    .join('\n')
}

/**
 * Generate the theme-bridge CSS (the contents of a `<style>` element).
 *
 * Mirrors the selectors `prefab.css` uses for *host-driven* tokens, so the
 * override lands in both schemes rather than only in light mode: the `:root`
 * default (alongside `[data-theme="light"]`, whose higher specificity would
 * otherwise win) and the `prefers-color-scheme: dark` media block. Each selector
 * matches its counterpart's specificity and is emitted after `prefab.css`, so it
 * wins on document order.
 *
 * `:root[data-theme="dark"]` is deliberately NOT bridged. That block is
 * prefab's standalone dark palette with static values and no host chain at all,
 * the explicit separation of host theming (which cascades) from the manual theme
 * toggle. Overriding it would make an app that pins `data-theme="dark"` follow
 * the editor instead of its own choice.
 *
 * @example
 * ```ts
 * const html = rendererHtml({ themeBridge: 'vscode' })
 * ```
 */
export function themeBridgeCss(bridge: ThemeBridge): string {
  if (!THEME_BRIDGES.includes(bridge)) {
    throw new RangeError(`unknown themeBridge: ${bridge}`)
  }

  return `:root,
:root[data-theme="light"] {
${declarations('light', '  ')}
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
${declarations('dark', '    ')}
  }
}`
}
