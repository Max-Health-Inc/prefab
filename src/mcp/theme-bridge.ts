/**
 * VS Code theme bridge: re-declares tokens with the `--vscode-*` variable first, so a host's MCP Apps `--color-*`
 * layer no longer shadows the editor theme. `test/theme-bridge.test.ts` checks the table against `prefab.css`.
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

/** prefab tokens VS Code can supply, with `prefab.css`'s own fallbacks; tokens it cannot supply are absent. */
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

/** Runtime list of {@link ThemeBridge}, so untyped JS callers are validated too. */
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
 * The theme-bridge CSS, matching `prefab.css`'s host-driven selectors in both schemes. `[data-theme="dark"]` is
 * left alone, so an app that pins it keeps its own palette.
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
