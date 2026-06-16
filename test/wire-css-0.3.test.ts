/**
 * Protocol 0.3 wire tests — css / stylesheets / mode (upstream PR #431).
 *
 * Covers the serialize side (PrefabApp.toJSON / toHTML), the theme→CSS
 * compiler, and the consume side (PrefabRenderer.mount injection + mode).
 *
 * @happy-dom
 */

import { describe, it, expect, afterEach } from 'bun:test'
import { PrefabApp, PROTOCOL_VERSION, compileThemeCss } from '../src/index'
import { Heading } from '../src/components/typography'
import { PrefabRenderer } from '../src/renderer/index'
import type { PrefabWireData } from '../src/renderer/index'
import { applyTheme } from '../src/renderer/theme'

/** Bridge the serialize-side wire (PrefabWireFormat) to the consume-side type. */
function asWireData(wire: unknown): PrefabWireData {
  return wire as PrefabWireData
}

// ── Helpers ────────────────────────────────────────────────────────────────

function injectedStyleEls(): HTMLStyleElement[] {
  return Array.from(document.head.querySelectorAll('style[data-prefab="injected"]'))
}
function injectedLinkEls(): HTMLLinkElement[] {
  return Array.from(document.head.querySelectorAll('link[data-prefab="injected"]'))
}

afterEach(() => {
  for (const el of [...injectedStyleEls(), ...injectedLinkEls()]) el.remove()
  document.getElementById('prefab-dark-theme')?.remove()
  document.documentElement.removeAttribute('data-theme')
  document.documentElement.classList.remove('dark', 'light')
})

// ── compileThemeCss ──────────────────────────────────────────────────────────

describe('compileThemeCss', () => {
  it('returns empty string for undefined / empty theme', () => {
    expect(compileThemeCss(undefined)).toBe('')
    expect(compileThemeCss({})).toBe('')
    expect(compileThemeCss({ light: {}, dark: {} })).toBe('')
  })

  it('targets :root for light vars', () => {
    const css = compileThemeCss({ light: { primary: '#000', radius: '4px' } })
    expect(css).toContain(':root {')
    expect(css).toContain('--primary: #000;')
    expect(css).toContain('--radius: 4px;')
  })

  it('targets both .dark and [data-theme="dark"] for dark vars', () => {
    const css = compileThemeCss({ dark: { primary: '#fff' } })
    expect(css).toContain('.dark, [data-theme="dark"] {')
    expect(css).toContain('@media (prefers-color-scheme: dark)')
    expect(css).toContain('--primary: #fff;')
  })

  it('sanitizes idents and values to prevent CSS injection', () => {
    const css = compileThemeCss({ light: { 'evil}body{display:none': 'red; } body { x: 1' } })
    expect(css).not.toContain('}body{')
    expect(css).not.toContain('body {')
  })
})

// ── Serialize side ───────────────────────────────────────────────────────────

describe('PrefabApp.toJSON — protocol 0.3', () => {
  it('emits PROTOCOL_VERSION 0.3', () => {
    expect(PROTOCOL_VERSION).toBe('0.3')
    expect(new PrefabApp({ view: Heading('x') }).toJSON().$prefab).toEqual({ version: '0.3' })
  })

  it('folds theme into css and never emits a theme key', () => {
    const wire = new PrefabApp({
      view: Heading('x'),
      theme: { light: { primary: '#000' } },
    }).toJSON()
    expect('theme' in wire).toBe(false)
    expect(wire.css![0]).toContain('--primary: #000;')
  })

  it('passes stylesheets through and emits mode', () => {
    const wire = new PrefabApp({
      view: Heading('x'),
      stylesheets: ['https://cdn.example.com/a.css'],
      mode: 'dark',
    }).toJSON()
    expect(wire.stylesheets).toEqual(['https://cdn.example.com/a.css'])
    expect(wire.mode).toBe('dark')
  })
})

describe('PrefabApp.toHTML — protocol 0.3', () => {
  it('injects css as <style>, stylesheets as <link>, mode on <html>, and strips them from embedded JSON', () => {
    const html = new PrefabApp({
      view: Heading('x'),
      theme: { light: { primary: '#abc' } },
      stylesheets: ['https://cdn.example.com/a.css'],
      mode: 'dark',
    }).toHTML()

    expect(html).toContain('<html lang="en" data-theme="dark" class="dark">')
    expect(html).toContain('<style>')
    expect(html).toContain('--primary: #abc;')
    expect(html).toContain('<link rel="stylesheet" href="https://cdn.example.com/a.css">')

    // Embedded wire data must NOT duplicate css / stylesheets / mode.
    const json = html.split('window.__PREFAB_DATA__ = ')[1].split(';\n')[0]
    const embedded = JSON.parse(json) as Record<string, unknown>
    expect(embedded.css).toBeUndefined()
    expect(embedded.stylesheets).toBeUndefined()
    expect(embedded.mode).toBeUndefined()
    expect(embedded.view).toBeDefined()
  })
})

// ── Consume side ─────────────────────────────────────────────────────────────

describe('PrefabRenderer.mount — protocol 0.3', () => {
  it('injects css blocks as <style> elements', () => {
    const root = document.createElement('div')
    const handle = PrefabRenderer.mount(root, {
      $prefab: { version: '0.3' },
      view: { type: 'Heading', content: 'x' },
      css: [':root { --primary: #123; }'],
    }, { themeToggle: false })

    const styles = injectedStyleEls()
    expect(styles.some(s => s.textContent?.includes('--primary: #123;'))).toBe(true)
    handle.destroy()
    expect(injectedStyleEls().length).toBe(0)
  })

  it('loads URL stylesheets as <link> but keeps inline CSS (legacy 0.2) as <style>', () => {
    const root = document.createElement('div')
    const handle = PrefabRenderer.mount(root, {
      $prefab: { version: '0.3' },
      view: { type: 'Heading', content: 'x' },
      stylesheets: ['https://cdn.example.com/a.css', '.legacy { color: red; }'],
    }, { themeToggle: false })

    const links = injectedLinkEls()
    expect(links.length).toBe(1)
    expect(links[0].getAttribute('href')).toBe('https://cdn.example.com/a.css')
    // Legacy inline CSS still injected as a <style>.
    expect(injectedStyleEls().some(s => s.textContent?.includes('.legacy'))).toBe(true)
    handle.destroy()
  })

  it('applies mode via data-theme attr and .dark class on the root', () => {
    const root = document.createElement('div')
    const handle = PrefabRenderer.mount(root, {
      $prefab: { version: '0.3' },
      view: { type: 'Heading', content: 'x' },
      mode: 'dark',
    }, { themeToggle: false })

    expect(root.getAttribute('data-theme')).toBe('dark')
    expect(root.classList.contains('dark')).toBe(true)
    handle.destroy()
  })
})

// ── Themes still work (both paths) + DRY consistency ─────────────────────────

describe('themes still work end-to-end', () => {
  const theme = { light: { primary: '#4f46e5' }, dark: { primary: '#a5b4fc' } }

  it('NEW path (0.3): theme compiles into css and the var is declared on :root', () => {
    const root = document.createElement('div')
    const wire = new PrefabApp({ view: Heading('x'), theme }).toJSON()
    const handle = PrefabRenderer.mount(root, asWireData(wire), { themeToggle: false })

    const injected = injectedStyleEls().map(s => s.textContent ?? '').join('\n')
    // Light var globally available so component `var(--primary)` resolves.
    expect(injected).toContain(':root {')
    expect(injected).toContain('--primary: #4f46e5;')
    // Dark var present under the dual selector.
    expect(injected).toContain('.dark, [data-theme="dark"]')
    expect(injected).toContain('--primary: #a5b4fc;')
    handle.destroy()
    expect(injectedStyleEls().length).toBe(0)
  })

  it('LEGACY path (0.2): theme object still themes — light inline on root, dark in <style>', () => {
    const root = document.createElement('div')
    // A 0.2 payload carries a structured `theme` (no css array).
    const handle = PrefabRenderer.mount(root, {
      $prefab: { version: '0.2' },
      view: { type: 'Heading', content: 'x' },
      theme,
    }, { themeToggle: false })

    // Light vars scoped inline on the mount root.
    expect(root.style.getPropertyValue('--primary')).toBe('#4f46e5')
    // Dark vars in the dedicated style element.
    const darkEl = document.getElementById('prefab-dark-theme')
    expect(darkEl?.textContent).toContain('--primary: #a5b4fc;')
    handle.destroy()
  })

  it('DRY: legacy applyTheme dark block === wire-path compiled dark css', () => {
    const root = document.createElement('div')
    applyTheme(root, theme)
    const legacyDark = document.getElementById('prefab-dark-theme')?.textContent
    // Both paths route the dark vars through the single compiler.
    expect(legacyDark).toBe(compileThemeCss({ dark: theme.dark }))
  })

  it('mode forces the scheme so dark vars apply without a toggle', () => {
    const root = document.createElement('div')
    const wire = new PrefabApp({ view: Heading('x'), theme, mode: 'dark' }).toJSON()
    expect(wire.mode).toBe('dark')
    const handle = PrefabRenderer.mount(root, asWireData(wire), { themeToggle: false })
    // Root carries .dark + [data-theme=dark], matching the compiled dark selector.
    expect(root.classList.contains('dark')).toBe(true)
    expect(root.getAttribute('data-theme')).toBe('dark')
    handle.destroy()
  })
})
