/**
 * VS Code theme bridge (issue #1).
 *
 * The bridge re-declares tokens that `prefab.css` already declares, so the risk
 * is not that it fails to work but that it silently *diverges* from the base
 * theme. The cross-check block below is the point of this file: every entry in
 * `VSCODE_BRIDGE` is verified against `prefab.css` itself, so a token, variable
 * or fallback changed in one place and not the other fails the suite.
 */

import { describe, it, expect } from 'bun:test'
import { readFileSync } from 'node:fs'
import { rendererHtml, themeBridgeCss, VSCODE_BRIDGE } from '../src/index'
import type { ThemeBridge } from '../src/index'

const css = readFileSync(new URL('../src/prefab.css', import.meta.url), 'utf8')

/** Declarations of one prefab.css block, as `token -> value`. */
function block(pattern: RegExp): Record<string, string> {
  const m = pattern.exec(css)
  if (m === null) throw new Error(`prefab.css: block not found for ${String(pattern)}`)
  const out: Record<string, string> = {}
  for (const d of m[1].matchAll(/--([a-z0-9-]+):\s*([^;]+);/g)) {
    out[d[1]] = d[2].replace(/\s+/g, ' ').trim()
  }
  return out
}

const LIGHT = block(/:root \{([\s\S]*?)\n\}/)

/**
 * The host-driven dark block. Note this is the `prefers-color-scheme` media
 * block, NOT `:root[data-theme="dark"]` — the latter is prefab's standalone dark
 * palette with static values and no host chain, which the bridge deliberately
 * leaves alone.
 */
const DARK = block(
  /@media \(prefers-color-scheme: dark\) \{\s*:root:not\(\[data-theme="light"\]\) \{([\s\S]*?)\n {2}\}/,
)

/** The standalone toggle palette, which must stay free of host variables. */
const TOGGLE_DARK = block(/:root\[data-theme="dark"\] \{([\s\S]*?)\n\}/)

describe('VSCODE_BRIDGE stays in sync with prefab.css', () => {
  it('extracted the prefab.css blocks', () => {
    // Without this, an extraction that silently returned {} would make every
    // per-token check below vacuous.
    expect(Object.keys(LIGHT).length).toBeGreaterThan(20)
    expect(Object.keys(DARK).length).toBeGreaterThan(10)
    expect(Object.keys(VSCODE_BRIDGE).length).toBeGreaterThan(15)
  })

  for (const [token, src] of Object.entries(VSCODE_BRIDGE)) {
    it(`--${token} matches prefab.css`, () => {
      const declared = LIGHT[token]
      expect(declared).toBeDefined()

      // Same VS Code variable...
      expect(declared).toContain(`--${src.vscode}`)
      // ...and the same static fallback as the base theme's light value.
      expect(declared).toContain(src.light)

      if (src.dark !== undefined) {
        expect(DARK[token]).toBeDefined()
        expect(DARK[token]).toContain(`--${src.vscode}`)
        expect(DARK[token]).toContain(src.dark)
      } else {
        // Scheme-independent (fonts): prefab.css must not re-declare it dark.
        expect(DARK[token]).toBeUndefined()
      }
    })
  }

  it('covers every vscode-backed token prefab.css declares', () => {
    // The reverse direction: a token that gains a --vscode-* source in
    // prefab.css but is missing here would be left un-bridged.
    const backed = Object.entries(LIGHT)
      .filter(([, value]) => value.includes('--vscode-'))
      .map(([token]) => token)
    expect(backed.filter(token => !(token in VSCODE_BRIDGE))).toEqual([])
  })
})

describe('themeBridgeCss()', () => {
  const out = themeBridgeCss('vscode')

  it('drops the MCP Apps layer that shadowed the VS Code variables', () => {
    // The whole reason the bridge exists: prefab.css tries --color-* first.
    expect(css).toContain('--color-background-primary')
    expect(out).not.toContain('--color-')
    expect(out).toContain('--background: var(--vscode-editor-background, #ffffff);')
  })

  it('mirrors prefab.css’s host-driven selectors so it wins in both schemes', () => {
    expect(out).toContain(':root,')
    expect(out).toContain(':root[data-theme="light"]')
    expect(out).toContain('@media (prefers-color-scheme: dark)')
    expect(out).toContain(':root:not([data-theme="light"])')
  })

  it('leaves the standalone dark toggle alone', () => {
    // prefab.css's [data-theme="dark"] palette is static by design: host theming
    // cascades, the manual toggle does not. Bridging it would make an app that
    // pins data-theme="dark" follow the editor instead of its own choice.
    expect(out).not.toContain(':root[data-theme="dark"]')
    const toggleValues = Object.values(TOGGLE_DARK).join(' ')
    expect(toggleValues).not.toContain('--vscode-')
  })

  it('uses dark fallbacks in the dark blocks only', () => {
    const dark = out.slice(out.indexOf('@media'))
    expect(dark).toContain('--background: var(--vscode-editor-background, #09090b);')
    expect(dark).not.toContain('#ffffff')
  })

  it('omits scheme-independent tokens from the dark blocks', () => {
    const dark = out.slice(out.indexOf('@media'))
    expect(dark).not.toContain('--font-sans')
    expect(out).toContain('--font-sans: var(--vscode-font-family,')
  })

  it('rejects an unknown bridge', () => {
    expect(() => themeBridgeCss('emacs' as ThemeBridge)).toThrow(RangeError)
  })
})

describe('rendererHtml({ themeBridge })', () => {
  it('is absent unless requested', () => {
    expect(rendererHtml()).not.toContain('<style>')
  })

  it('injects the bridge in a style element', () => {
    const html = rendererHtml({ themeBridge: 'vscode' })
    expect(html).toContain('<style>')
    expect(html).toContain('--background: var(--vscode-editor-background')
  })

  it('orders prefab.css, then the bridge, then caller stylesheets', () => {
    const html = rendererHtml({
      themeBridge: 'vscode',
      stylesheets: ['https://cdn.example.com/override.css'],
    })
    // Later in <head> wins at equal specificity, so this order is the contract:
    // the bridge overrides the base theme, the caller overrides the bridge.
    expect(html.indexOf('prefab.css')).toBeLessThan(html.indexOf('<style>'))
    expect(html.indexOf('<style>')).toBeLessThan(html.indexOf('override.css'))
  })

  it('keeps the document well formed', () => {
    const html = rendererHtml({ themeBridge: 'vscode' })
    expect(html.indexOf('<style>')).toBeLessThan(html.indexOf('</head>'))
    expect((html.match(/<style>/g) ?? []).length).toBe(1)
    expect((html.match(/<\/style>/g) ?? []).length).toBe(1)
  })
})
