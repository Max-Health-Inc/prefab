/**
 * PrefabRenderer — Main entry point for the browser renderer.
 *
 * Usage (CDN — new API):
 * ```html
 * <script src="https://cdn.jsdelivr.net/npm/@maxhealth.tech/prefab/dist/renderer.min.js"></script>
 * <script>
 *   const ui = await prefab.app();
 *   ui.onToolInput((args) => {
 *     ui.render('#root', chart({ data: args.data }));
 *   });
 * </script>
 * ```
 *
 * Usage (CDN — legacy):
 * ```html
 * <script src="https://cdn.jsdelivr.net/npm/@maxhealth.tech/prefab/dist/renderer.min.js"></script>
 * <script>
 *   PrefabRenderer.mount(document.getElementById('root'), data);
 * </script>
 * ```
 *
 * Or as ESM:
 * ```ts
 * import { PrefabRenderer, app } from '@maxhealth.tech/prefab/renderer'
 * const ui = await app()
 * ```
 */

import { Store } from './state.js'
import { renderNode } from './engine.js'
import type { ComponentNode, RenderContext } from './engine.js'
import { DestroyRegistry } from './engine.js'
import { registerAllComponents } from './components/index.js'
import { applyTheme, applyKeyBindings, createThemeToggle, setThemeAttrs } from './theme.js'
import type { ThemeToggleOptions } from './theme.js'
import { dispatchActions, fireAndForget, clearAllIntervals, clearAllSubscriptions } from './actions.js'
import type { McpTransport, ToastEvent, ActionJSON } from './actions.js'
import { createHttpTransport, createNoopTransport } from './transport.js'
import type { McpTransportOptions } from './transport.js'
import { app } from './app.js'
import { Bridge, isIframe } from './bridge.js'
import { registerPipe, unregisterPipe, listPipes, getCustomPipe } from '../rx/pipes.js'
import type { PipeFn } from '../rx/pipes.js'
import { registerComponent } from './engine.js'
import { validateWireFormat } from '../core/validate.js'
import { log, setLogLevel } from '../core/logger.js'

// Re-export new APIs
export { validateWireFormat, isValidWireFormat } from '../core/validate.js'
export { createLogger, log, setLogLevel, getLogLevel } from '../core/logger.js'
export type { LogLevel, Logger } from '../core/logger.js'
export { app } from './app.js'
export type { AppOptions, PrefabApp, MountHandle } from './app.js'
export { Bridge, isIframe, applyHostTheme } from './bridge.js'
export { registerPipe, unregisterPipe, listPipes } from '../rx/pipes.js'
export type { PipeFn } from '../rx/pipes.js'
export { registerComponent } from './engine.js'
export type { RenderFn, RenderResult, RenderFnReturn, ComponentNode, RenderContext } from './engine.js'
export { DestroyRegistry } from './engine.js'
export type {
  AppCapabilities,
  HostCapabilities,
  HostContext,
  HostTheme,
  DisplayMode,
  BridgeMessage,
} from './bridge.js'
export { createThemeToggle } from './theme.js'
export type { ThemeToggleOptions } from './theme.js'

// ── Types ────────────────────────────────────────────────────────────────────

export interface PrefabWireData {
  $prefab: { version: string }
  view: ComponentNode
  state?: Record<string, unknown>
  /** Legacy structured theme (protocol 0.2). Protocol 0.3 ships the theme in `css`. */
  theme?: { light?: Record<string, string>; dark?: Record<string, string> }
  defs?: Record<string, ComponentNode>
  keyBindings?: Record<string, ActionJSON | ActionJSON[]>
  /** Inline CSS blocks injected as `<style>` (protocol 0.3). */
  css?: string[]
  /** External CSS URLs loaded as `<link rel="stylesheet">` (protocol 0.3). */
  stylesheets?: string[]
  /** Forced color scheme, independent of OS preference (protocol 0.3). */
  mode?: 'light' | 'dark'
  /** Custom pipe source code strings — hydrated by the renderer on mount. */
  pipes?: Record<string, string>
  /** Size hints for the host container. */
  layout?: { preferredHeight?: number; minHeight?: number; maxHeight?: number }
}

export interface PrefabUpdateData {
  $prefab: { version: string }
  update: { state: Record<string, unknown>; actions?: ActionJSON | ActionJSON[] }
}

export interface MountOptions {
  /** MCP transport configuration. */
  transport?: McpTransport | McpTransportOptions
  /** Toast notification handler. */
  onToast?: (toast: ToastEvent) => void
  /** Show a built-in theme toggle. Default: true. Set false to suppress. */
  themeToggle?: boolean | ThemeToggleOptions
  /** Warn (console) on wire-format problems before rendering. Default: true. Non-fatal. */
  validate?: boolean
}

export interface MountedApp {
  /** Re-render the entire UI from current state. */
  rerender: () => void
  /** Apply a state update (from display_update). */
  update: (data: PrefabUpdateData) => void
  /** Get the reactive store. */
  store: Store
  /** Unmount and clean up. */
  destroy: () => void
}

// ── PrefabRenderer ───────────────────────────────────────────────────────────

export const PrefabRenderer = {
  /**
   * Mount a prefab UI into a DOM element.
   *
   * @param root - The DOM element to render into.
   * @param data - The $prefab wire format JSON.
   * @param options - Optional transport and toast handler.
   * @returns A MountedApp handle for updates and cleanup.
   */
  mount(root: HTMLElement, initialData: PrefabWireData, options?: MountOptions): MountedApp {
    // Register all built-in components (idempotent)
    registerAllComponents()

    // Surface wire-format problems as non-fatal console warnings. Catches the
    // silent-failure class (children under a wrong key, showToast without a
    // message) that otherwise renders as "nothing happens". Opt out with
    // { validate: false }.
    if (options?.validate !== false) {
      for (const e of validateWireFormat(initialData).errors) {
        log.warn(`wire validation ${e.path}: ${e.message}`)
      }
    }

    // Mutable reference — remount() replaces this with new wire data
    let data = initialData

    // Hydrate custom pipes from wire format (before any rendering)
    const pipeHydration: PipeHydration = { tracked: [], evalBlocked: false }
    if (data.pipes) {
      for (const [name, source] of Object.entries(data.pipes)) {
        hydratePipe(name, source, pipeHydration)
      }
    }

    // Initialize state store
    const store = new Store(data.state)

    // Set up transport
    let transport: McpTransport
    if (options?.transport && 'callTool' in options.transport) {
      transport = options.transport
    } else if (options?.transport) {
      transport = createHttpTransport(options.transport as McpTransportOptions)
    } else {
      transport = createNoopTransport()
    }

    // Toast handler with fallback
    const onToast = options?.onToast ?? defaultToastHandler

    // Destroy registry — tracks component cleanup callbacks
    const destroyRegistry = new DestroyRegistry()

    // Remount function — replaces current view with a new wire payload
    function remount(wireData: Record<string, unknown>): void {
      const newData = wireData as unknown as PrefabWireData
      // Update the mutable reference so render() uses the new view
      data = newData
      // Merge new state into existing store (preserves transport-set keys)
      if (newData.state) store.merge(newData.state)
      // Update defs if provided
      if (newData.defs) ctx.defs = newData.defs
      // Re-apply theme / mode if changed
      if (newData.theme) applyTheme(root, newData.theme)
      if (newData.mode) applyMode(root, newData.mode)

      // Hydrate new pipes (if any)
      if (newData.pipes) {
        for (const [name, source] of Object.entries(newData.pipes)) {
          hydratePipe(name, source, pipeHydration)
        }
      }

      // Swap injected styles: remove old, inject new (css blocks + stylesheet links)
      for (const s of styleEls) s.remove()
      styleEls.length = 0
      styleEls.push(...injectStyles(newData.css, newData.stylesheets))

      // Update layout hints
      applyLayout(root, newData.layout)

      // Update key bindings
      cleanupKeys?.()
      cleanupKeys = undefined
      if (newData.keyBindings) {
        cleanupKeys = applyKeyBindings(newData.keyBindings, (actions) => {
          fireAndForget(dispatchActions(actions as ActionJSON | ActionJSON[], {
            store, transport, scope: {}, rerender: () => render(), remount, onToast,
          }), 'keyBinding')
        })
      }

      render()
    }

    // Build render context
    const ctx: RenderContext = {
      store,
      scope: {},
      transport,
      rerender: () => render(),
      remount,
      onToast,
      defs: data.defs,
      destroyRegistry,
    }

    // Apply legacy structured theme (protocol 0.2 back-compat; 0.3 ships theme in `css`)
    applyTheme(root, data.theme)

    // Force color scheme if specified (protocol 0.3)
    if (data.mode) applyMode(root, data.mode)

    // Apply layout hints
    applyLayout(root, data.layout)

    // Inject CSS blocks (<style>) and external stylesheets (<link>)
    const styleEls: Element[] = injectStyles(data.css, data.stylesheets)

    // Keyboard bindings
    let cleanupKeys: (() => void) | undefined
    if (data.keyBindings) {
      cleanupKeys = applyKeyBindings(data.keyBindings, (actions) => {
        fireAndForget(dispatchActions(actions as ActionJSON | ActionJSON[], {
          store,
          transport,
          scope: {},
          rerender: () => render(),
          remount,
          onToast,
        }), 'keyBinding')
      })
    }

    // Theme toggle
    let cleanupToggle: (() => void) | undefined
    const toggleOpt = options?.themeToggle ?? true
    if (toggleOpt !== false) {
      const toggleCfg = typeof toggleOpt === 'object' ? toggleOpt : undefined
      cleanupToggle = createThemeToggle(root, toggleCfg)
    }

    // Render function
    function render(): void {
      // Flush destroy callbacks from previous render cycle
      destroyRegistry.flush()
      // Preserve the toggle button across re-renders
      const toggleBtn = root.querySelector('.pf-theme-toggle')
      root.innerHTML = ''
      const dom = renderNode(data.view, ctx)
      root.appendChild(dom)
      if (toggleBtn) root.appendChild(toggleBtn)
    }

    // Initial render
    render()

    // Run onMount from the view root (if present)
    // Already handled by renderNode via queueMicrotask

    return {
      rerender: () => render(),
      update(updateData: PrefabUpdateData) {
        store.merge(updateData.update.state)
        render()
        // Fire actions after state is applied (if any)
        if (updateData.update.actions != null) {
          fireAndForget(dispatchActions(updateData.update.actions, ctx), 'update action')
        }
      },
      store,
      destroy() {
        destroyRegistry.flush()
        cleanupToggle?.()
        cleanupKeys?.()
        clearAllIntervals()
        clearAllSubscriptions()
        for (const s of styleEls) s.remove()
        // Unregister wire-hydrated pipes (scoped to this mount)
        for (const name of pipeHydration.tracked) unregisterPipe(name)
        root.innerHTML = ''
      },
    }
  },

  /**
   * Check if data is a prefab wire format.
   */
  isPrefabData(data: unknown): data is PrefabWireData {
    return data != null && typeof data === 'object' && '$prefab' in data
  },

  /**
   * Check if data is a prefab state update.
   */
  isPrefabUpdate(data: unknown): data is PrefabUpdateData {
    return (
      data != null &&
      typeof data === 'object' &&
      '$prefab' in data &&
      'update' in data
    )
  },
}

// ── Pipe hydration ───────────────────────────────────────────────────────────

/** Built-in pipe names that wire pipes must never shadow. */
const BUILTIN_PIPES = new Set([
  'find', 'dot', 'length', 'upper', 'lower', 'truncate', 'join',
  'first', 'last', 'abs', 'round', 'number', 'currency', 'percent',
  'compact', 'date', 'time', 'datetime', 'pluralize', 'default',
  'selectattr', 'rejectattr',
])

/**
 * Per-mount pipe hydration state.
 *
 * `tracked` names the pipes this mount registered, so destroy() unregisters
 * exactly those and leaves host-registered ones alone. `evalBlocked` records
 * that this host's CSP forbids eval, so the (identical) failure is reported
 * once per mount rather than once per pipe.
 */
interface PipeHydration {
  tracked: string[]
  evalBlocked: boolean
}

/** Whether a hydration failure was the host's CSP refusing eval, not bad source. */
function isEvalBlocked(e: unknown): boolean {
  if (e instanceof EvalError) return true
  return e instanceof Error && /unsafe-eval|Content Security Policy|call to Function/i.test(e.message)
}

/**
 * Safely hydrate a pipe from its source string.
 * Registers it via registerPipe if valid; skips with a warning otherwise.
 *
 * Pipes already present locally win over the wire source: built-ins can never be
 * shadowed (security), and a pipe a companion script pre-registered via
 * `prefab.registerPipe()` is kept rather than re-evaluated. That is what makes
 * custom pipes work in CSP-restricted hosts (VS Code webviews, sandboxed iframes
 * without 'unsafe-eval'), where `new Function()` throws — pre-register there and
 * the wire source is never evaluated at all.
 */
function hydratePipe(name: string, source: string, state: PipeHydration): void {
  if (BUILTIN_PIPES.has(name)) {
    log.warn(`wire pipe "${name}" ignored — shadows built-in`)
    return
  }
  if (getCustomPipe(name) != null) {
    // Pre-registered by a companion script — no eval needed, and overwriting it
    // would discard the host's own (possibly richer) implementation.
    log.debug(`wire pipe "${name}" — already registered, keeping local implementation`)
    return
  }
  if (state.evalBlocked) return
  try {
    // Evaluate the source string as a function expression.
    // new Function is intentional — it's the only way to hydrate serialized pipe source from wire format.
    // eslint-disable-next-line @typescript-eslint/no-implied-eval, @typescript-eslint/no-unsafe-call
    const fn = new Function('return (' + source + ')')() as PipeFn
    if (typeof fn !== 'function') {
      log.warn(`wire pipe "${name}" — source did not evaluate to a function`)
      return
    }
    registerPipe(name, fn)
    state.tracked.push(name)
  } catch (e) {
    if (isEvalBlocked(e)) {
      state.evalBlocked = true
      log.warn(
        'wire pipes cannot be hydrated — this host\'s CSP forbids eval. Pre-register them with ' +
        'prefab.registerPipe() from a companion script (rendererHtml({ scripts })) and they are used as-is.',
      )
      return
    }
    log.warn(`wire pipe "${name}" — failed to hydrate:`, e)
  }
}

// ── Default toast ────────────────────────────────────────────────────────────

function defaultToastHandler(toast: ToastEvent): void {
  if (typeof document === 'undefined') return

  const container = getOrCreateToastContainer()
  const toastEl = document.createElement('div')
  const variant = toast.variant ?? 'default'
  toastEl.className = `pf-toast${variant !== 'default' ? ` pf-toast--${variant}` : ''}`
  toastEl.setAttribute('data-variant', variant)
  toastEl.style.marginBottom = '8px'
  toastEl.style.transition = 'opacity 0.3s ease'

  const msg = document.createElement('div')
  msg.textContent = toast.message
  msg.style.fontWeight = '500'
  toastEl.appendChild(msg)

  if (toast.description) {
    const desc = document.createElement('div')
    desc.textContent = toast.description
    desc.style.fontSize = '14px'
    desc.style.color = 'var(--muted-foreground, #6b7280)'
    toastEl.appendChild(desc)
  }

  container.appendChild(toastEl)

  const duration = toast.duration ?? 4000
  setTimeout(() => {
    toastEl.style.opacity = '0'
    setTimeout(() => toastEl.remove(), 300)
  }, duration)
}

// ── Style / theme helpers ────────────────────────────────────────────────────

/** Force a color scheme on the mount root and document root (protocol 0.3 `mode`). */
function applyMode(root: HTMLElement, mode: 'light' | 'dark'): void {
  setThemeAttrs(root, mode)
  if (typeof document !== 'undefined') setThemeAttrs(document.documentElement, mode)
}

/**
 * Heuristic: does a `stylesheets` entry name an external URL (→ `<link>`)
 * rather than inline CSS (→ `<style>`)? Protocol 0.3 stylesheets are URLs,
 * but protocol 0.2 payloads put inline CSS here, so the renderer tolerates both.
 */
function isStylesheetUrl(s: string): boolean {
  const t = s.trim()
  if (t.includes('{') || t.includes('}')) return false // contains CSS rules → inline
  return /^(https?:)?\/\//i.test(t) || t.startsWith('/') || /\.css(\?|#|$)/i.test(t)
}

/**
 * Inject inline CSS blocks (`css`) as `<style>` and external stylesheet URLs
 * (`stylesheets`) as `<link>`. Returns the created elements for later cleanup.
 */
function injectStyles(css?: string[], stylesheets?: string[]): Element[] {
  const els: Element[] = []
  if (typeof document === 'undefined') return els

  for (const block of css ?? []) {
    const style = document.createElement('style')
    style.textContent = block
    style.dataset.prefab = 'injected'
    document.head.appendChild(style)
    els.push(style)
  }

  for (const entry of stylesheets ?? []) {
    if (isStylesheetUrl(entry)) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = entry
      link.dataset.prefab = 'injected'
      document.head.appendChild(link)
      els.push(link)
    } else {
      // Legacy protocol 0.2: inline CSS shipped in `stylesheets`.
      const style = document.createElement('style')
      style.textContent = entry
      style.dataset.prefab = 'injected'
      document.head.appendChild(style)
      els.push(style)
    }
  }

  return els
}

// ── Layout helpers ───────────────────────────────────────────────────────────

/** Apply layout hints as inline styles on the root element. Clears previous hints. */
function applyLayout(root: HTMLElement, layout?: PrefabWireData['layout']): void {
  // Clear previous layout styles
  root.style.height = ''
  root.style.minHeight = ''
  root.style.maxHeight = ''
  root.style.overflow = ''

  if (!layout) return
  if (layout.preferredHeight != null) root.style.height = `${layout.preferredHeight}px`
  if (layout.minHeight != null) root.style.minHeight = `${layout.minHeight}px`
  if (layout.maxHeight != null) {
    root.style.maxHeight = `${layout.maxHeight}px`
    root.style.overflow = 'auto'
  }
}

function getOrCreateToastContainer(): HTMLElement {
  const id = 'prefab-toast-container'
  let container = document.getElementById(id)
  if (!container) {
    container = document.createElement('div')
    container.id = id
    container.style.position = 'fixed'
    container.style.bottom = '16px'
    container.style.right = '16px'
    container.style.zIndex = '9999'
    container.style.maxWidth = '400px'
    document.body.appendChild(container)
  }
  return container
}

// ── Auto-mount from window.__PREFAB_DATA__ ───────────────────────────────────

if (typeof window !== 'undefined') {
  // Expose as window.PrefabRenderer (legacy) and window.prefab (new API)
  const w = window as unknown as Record<string, unknown>
  w.PrefabRenderer = PrefabRenderer
  w.prefab = {
    app,
    mount: PrefabRenderer.mount.bind(PrefabRenderer),
    isPrefabData: PrefabRenderer.isPrefabData.bind(PrefabRenderer),
    isPrefabUpdate: PrefabRenderer.isPrefabUpdate.bind(PrefabRenderer),
    Bridge,
    isIframe,
    registerPipe,
    unregisterPipe,
    listPipes,
    registerComponent,
    createThemeToggle,
    validateWireFormat,
    setLogLevel,
  }

  // Auto-mount if data is available
  const prefabData = w.__PREFAB_DATA__ as PrefabWireData | undefined
  if (prefabData != null) {
    const root = document.getElementById('prefab-root')
    if (root) {
      PrefabRenderer.mount(root, prefabData)
    }
  }
}
