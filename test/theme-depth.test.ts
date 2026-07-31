/**
 * Scheme overrides must work at any depth, not only on the root element.
 *
 * `setThemeAttrs` is called on the prefab mount container, not just on
 * `document.documentElement`: `applyMode` sets both, and `createThemeToggle`
 * with `syncDocument: false` sets *only* the container. The compiled wire theme
 * already honours that (`compileThemeCss` emits `.dark, [data-theme="dark"]`),
 * so when prefab.css gated its own scheme blocks on `:root[...]` the two sheets
 * disagreed about depth and a container-scoped toggle half-flipped: the theme's
 * dark values landed on prefab's light background and foreground.
 *
 * These tests assert resolved values through the real prefab.css rather than
 * matching selector text, so they describe the behaviour a host actually gets.
 *
 * happy-dom does not propagate *inherited* custom properties to descendants, so
 * each assertion targets an element a rule matches directly, and an unmatched
 * token reads as `''` here where a browser would show the value inherited from
 * `:root` — which is precisely the half-flip: prefab's light surface under the
 * theme's dark accents.
 */

import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import { readFileSync } from 'node:fs'
import { compileThemeCss } from '../src/index'
import { createThemeToggle } from '../src/renderer/theme'

const PREFAB_CSS = readFileSync(new URL('../src/prefab.css', import.meta.url), 'utf8')

/** A dark value that appears only in prefab.css's explicit dark block. */
const DARK_BACKGROUND = '#09090b'
const LIGHT_BACKGROUND = '#ffffff'

let sheet: HTMLStyleElement

beforeEach(() => {
  document.documentElement.removeAttribute('data-theme')
  document.documentElement.classList.remove('dark', 'light')
  document.body.innerHTML = ''
  sheet = document.createElement('style')
  sheet.textContent = PREFAB_CSS
  document.head.appendChild(sheet)
})

afterEach(() => {
  sheet.remove()
  document.documentElement.removeAttribute('data-theme')
  document.documentElement.classList.remove('dark', 'light')
  document.body.innerHTML = ''
  try { localStorage.clear() } catch { /* storage unavailable */ }
})

function token(el: HTMLElement, name: string): string {
  return getComputedStyle(el).getPropertyValue(name).trim()
}

/** A container mounted under a root that carries no scheme of its own. */
function container(attrs: (el: HTMLElement) => void): HTMLElement {
  const el = document.createElement('div')
  attrs(el)
  document.body.appendChild(el)
  return el
}

describe('prefab.css scheme overrides apply at any depth', () => {
  it('data-theme="dark" on a container darkens prefab’s own tokens', () => {
    const panel = container(el => { el.setAttribute('data-theme', 'dark') })
    expect(token(panel, '--background')).toBe(DARK_BACKGROUND)
  })

  it('the dark class on a container darkens prefab’s own tokens', () => {
    // `setThemeAttrs` sets the attribute AND the class, and the compiled theme
    // matches both, so the base sheet has to recognise both too.
    const panel = container(el => { el.classList.add('dark') })
    expect(token(panel, '--background')).toBe(DARK_BACKGROUND)
  })

  it('data-theme="light" on a container lightens it under a dark root', () => {
    document.documentElement.setAttribute('data-theme', 'dark')
    const panel = container(el => { el.setAttribute('data-theme', 'light') })
    expect(token(document.documentElement, '--background')).toBe(DARK_BACKGROUND)
    expect(token(panel, '--background')).toBe(LIGHT_BACKGROUND)
  })

  it('two schemes coexist on one page', () => {
    const dark = container(el => { el.setAttribute('data-theme', 'dark') })
    const light = container(el => { el.setAttribute('data-theme', 'light') })
    expect(token(dark, '--background')).toBe(DARK_BACKGROUND)
    expect(token(light, '--background')).toBe(LIGHT_BACKGROUND)
  })

  it('a container without a scheme declares nothing of its own', () => {
    // It must keep inheriting rather than being pinned to a scheme, so no rule
    // may match a plain container.
    document.documentElement.setAttribute('data-theme', 'dark')
    const plain = container(() => { /* no scheme of its own */ })
    expect(token(plain, '--background')).toBe('')
  })
})

describe('prefab.css root behaviour is unchanged', () => {
  it('data-theme="dark" on the root still darkens the document', () => {
    document.documentElement.setAttribute('data-theme', 'dark')
    expect(token(document.documentElement, '--background')).toBe(DARK_BACKGROUND)
  })

  it('data-theme="light" on the root still lightens the document', () => {
    document.documentElement.setAttribute('data-theme', 'light')
    expect(token(document.documentElement, '--background')).toBe(LIGHT_BACKGROUND)
  })
})

describe('the base sheet and the compiled theme agree about depth', () => {
  it('a container-scoped toggle flips base tokens and theme tokens together', () => {
    // The end-to-end shape of the original bug: `syncDocument: false` leaves the
    // attribute on the mount root only, so a disagreement about depth shows up
    // as a panel with the theme's dark primary over prefab's light background.
    const theme = document.createElement('style')
    theme.textContent = compileThemeCss({ light: { primary: '#111111' }, dark: { primary: '#eeeeee' } })
    document.head.appendChild(theme)

    // Pin the starting scheme: `detectTheme` reads storage before the OS
    // preference, which happy-dom reports as light.
    const storageKey = 'test-theme-depth'
    localStorage.setItem(storageKey, 'dark')

    const root = container(() => { /* the prefab mount root */ })
    const cleanup = createThemeToggle(root, { syncDocument: false, storageKey })
    try {
      expect(root.getAttribute('data-theme')).toBe('dark')
      expect(document.documentElement.hasAttribute('data-theme')).toBe(false)

      expect(token(root, '--primary')).toBe('#eeeeee')
      expect(token(root, '--background')).toBe(DARK_BACKGROUND)
    } finally {
      cleanup()
      theme.remove()
    }
  })
})
