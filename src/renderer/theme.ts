/**
 * Theme application — CSS custom properties from theme field,
 * plus a built-in theme toggle button with two-way sync.
 */

import { compileThemeCss, sanitizeCssIdent, sanitizeCssValue } from '../core/theme-css.js'

export interface ThemeConfig {
  light?: Record<string, string>
  dark?: Record<string, string>
}

export interface ThemeToggleOptions {
  /** Position of the toggle inside the prefab root. Default: 'top-right'. */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  /** localStorage key for persistence. Default: 'prefab-theme'. */
  storageKey?: string
  /** Whether to sync with document.documentElement[data-theme]. Default: true. */
  syncDocument?: boolean
}

/**
 * Set a color scheme on an element using both conventions at once:
 * the `data-theme` attribute (this port) and the `dark`/`light` class
 * (upstream PrefectHQ/prefab). Keeping both in sync lets a single
 * compiled-theme stylesheet match regardless of which renderer emitted it.
 */
export function setThemeAttrs(el: HTMLElement, theme: 'light' | 'dark'): void {
  el.setAttribute('data-theme', theme)
  el.classList.toggle('dark', theme === 'dark')
  el.classList.toggle('light', theme === 'light')
}

/**
 * Apply a legacy `{ light, dark }` theme object to the live DOM.
 *
 * Protocol 0.3 ships the theme pre-compiled in the wire `css` array
 * (see [theme-css.ts] `compileThemeCss`). This helper remains for the
 * legacy `theme` object input the renderer still accepts for back-compat;
 * its dark block reuses the same compiler so both paths stay in lockstep.
 */
export function applyTheme(root: HTMLElement, theme?: ThemeConfig): void {
  if (!theme) return

  // Light vars are scoped inline onto the mount root (legacy 0.2 behavior —
  // avoids a global :root collision when multiple apps share a page).
  if (theme.light) {
    for (const [key, value] of Object.entries(theme.light)) {
      root.style.setProperty(`--${sanitizeCssIdent(key)}`, sanitizeCssValue(value))
    }
  }

  // Dark vars need a media query, so they go in a <style>. Reuse the single
  // shared compiler so the legacy and protocol-0.3 (wire `css`) paths emit
  // byte-identical dark CSS.
  if (theme.dark) {
    const styleId = 'prefab-dark-theme'
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null
    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.id = styleId
      document.head.appendChild(styleEl)
    }
    styleEl.textContent = compileThemeCss({ dark: theme.dark })
  }
}

/**
 * Apply keyboard shortcuts.
 */
export function applyKeyBindings(
  bindings: Record<string, unknown> | undefined,
  dispatch: (actions: unknown) => Promise<void>,
): (() => void) | undefined {
  if (!bindings || typeof document === 'undefined') return undefined

  const handler = (e: KeyboardEvent): void => {
    for (const [combo, actions] of Object.entries(bindings)) {
      if (matchCombo(combo, e)) {
        e.preventDefault()
        void dispatch(actions)
      }
    }
  }

  document.addEventListener('keydown', handler)
  return () => document.removeEventListener('keydown', handler)
}

function matchCombo(combo: string, e: KeyboardEvent): boolean {
  const parts = combo.toLowerCase().split('+').map(s => s.trim())
  const key = parts[parts.length - 1]
  const mods = new Set(parts.slice(0, -1))

  if (mods.has('ctrl') !== (e.ctrlKey || e.metaKey)) return false
  if (mods.has('shift') !== e.shiftKey) return false
  if (mods.has('alt') !== e.altKey) return false

  return e.key.toLowerCase() === key
}

// ── Theme Toggle ─────────────────────────────────────────────────────────────

const SUN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"/></svg>`
const MOON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"/></svg>`

const POSITION_MAP: Record<string, string> = {
  'top-right': 'top: 8px; right: 8px;',
  'top-left': 'top: 8px; left: 8px;',
  'bottom-right': 'bottom: 8px; right: 8px;',
  'bottom-left': 'bottom: 8px; left: 8px;',
}

/** Detect the current effective theme from an element's data-theme attribute or OS preference. */
function detectTheme(el: HTMLElement, storageKey: string): 'light' | 'dark' {
  try {
    const stored = localStorage.getItem(storageKey)
    if (stored === 'light' || stored === 'dark') return stored
  } catch { /* storage unavailable */ }

  const attr = el.getAttribute('data-theme') ?? document.documentElement.getAttribute('data-theme')
  if (attr === 'light' || attr === 'dark') return attr

  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light'
  }
  return 'dark'
}

/**
 * Create a theme toggle button inside a prefab root element.
 *
 * - Persists to localStorage
 * - Syncs two-way with `document.documentElement[data-theme]` via MutationObserver
 * - Uses sun/moon SVG icons (no external deps)
 *
 * @returns A cleanup function that removes the button and observer.
 */
export function createThemeToggle(
  root: HTMLElement,
  options?: ThemeToggleOptions,
): () => void {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  if (typeof document === 'undefined') return () => {}

  const position = options?.position ?? 'top-right'
  const storageKey = options?.storageKey ?? 'prefab-theme'
  const syncDocument = options?.syncDocument ?? true

  // Ensure root has relative/absolute/fixed positioning for the toggle
  const rootPos = getComputedStyle(root).position
  if (rootPos === 'static' || rootPos === '') {
    root.style.position = 'relative'
  }

  const btn = document.createElement('button')
  btn.className = 'pf-theme-toggle'
  btn.setAttribute('aria-label', 'Toggle theme')
  btn.setAttribute('title', 'Toggle light/dark')
  Object.assign(btn.style, {
    position: 'absolute',
    zIndex: '100',
    width: '28px',
    height: '28px',
    border: '1px solid var(--border, #e5e7eb)',
    borderRadius: '6px',
    background: 'var(--card, rgba(255,255,255,0.8))',
    color: 'var(--foreground, #333)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0',
    opacity: '0.7',
    transition: 'opacity 0.15s, border-color 0.15s',
  })
  // Apply position
  const posCSS = POSITION_MAP[position] ?? POSITION_MAP['top-right']
  for (const rule of posCSS.split(';')) {
    const [prop, val] = rule.split(':').map(s => s.trim())
    if (prop && val) btn.style.setProperty(prop, val)
  }

  btn.addEventListener('mouseenter', () => { btn.style.opacity = '1' })
  btn.addEventListener('mouseleave', () => { btn.style.opacity = '0.7' })

  function applyThemeState(theme: 'light' | 'dark'): void {
    setThemeAttrs(root, theme)
    if (syncDocument) setThemeAttrs(document.documentElement, theme)
    btn.innerHTML = theme === 'dark' ? MOON_SVG : SUN_SVG
    try { localStorage.setItem(storageKey, theme) } catch { /* noop */ }
  }

  // Initial state
  const initial = detectTheme(root, storageKey)
  applyThemeState(initial)

  // Click handler
  btn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') ?? 'dark'
    applyThemeState(current === 'dark' ? 'light' : 'dark')
  })

  root.appendChild(btn)

  // Two-way sync: watch document.documentElement for external theme changes
  let observer: MutationObserver | undefined
  if (syncDocument) {
    observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'attributes' && m.attributeName === 'data-theme') {
          const docTheme = document.documentElement.getAttribute('data-theme')
          if ((docTheme === 'light' || docTheme === 'dark') && docTheme !== root.getAttribute('data-theme')) {
            setThemeAttrs(root, docTheme)
            btn.innerHTML = docTheme === 'dark' ? MOON_SVG : SUN_SVG
            try { localStorage.setItem(storageKey, docTheme) } catch { /* noop */ }
          }
        }
      }
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  }

  return () => {
    observer?.disconnect()
    btn.remove()
  }
}
