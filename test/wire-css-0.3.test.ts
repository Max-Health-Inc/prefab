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

// ── Helpers ────────────────────────────────────────────────────────────────

function injectedStyleEls(): HTMLStyleElement[] {
  return Array.from(document.head.querySelectorAll('style[data-prefab="injected"]'))
}
function injectedLinkEls(): HTMLLinkElement[] {
  return Array.from(document.head.querySelectorAll('link[data-prefab="injected"]'))
}

afterEach(() => {
  for (const el of [...injectedStyleEls(), ...injectedLinkEls()]) el.remove()
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
    }).toJSON() as Record<string, unknown>
    expect(wire.theme).toBeUndefined()
    expect((wire.css as string[])[0]).toContain('--primary: #000;')
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
