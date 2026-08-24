/**
 * PrefabApp — Root application wrapper.
 *
 * Wraps a component tree with state, theme, defs, and key bindings.
 * Serializes to the $prefab wire format compatible with the Python version.
 */

import { type Component } from './core/component.js'
import type { ComponentJSON } from './core/component.js'
import type { Action, ActionJSON } from './actions/types.js'
import { drainAutoState } from './rx/state-collector.js'
import type { PipeFn } from './rx/pipes.js'
import { compileThemeCss } from './core/theme-css.js'
import { escapeHtml } from './core/escape.js'
import { VERSION, PROTOCOL_VERSION } from './core/version.js'
import { emitA2UI } from './a2ui/emit.js'
import type { A2uiEmitOptions, A2uiEmitResult } from './a2ui/emit.js'

// Version constants live in ./core/version.ts (single source of truth, updated
// at release time). Re-exported so existing `from './app.js'` imports and the
// package's public API keep working.
export { VERSION, PROTOCOL_VERSION }

// ── Theme ────────────────────────────────────────────────────────────────────

export interface Theme {
  light?: Record<string, string>
  dark?: Record<string, string>
}

/** Forced color scheme for the renderer, independent of OS preference. */
export type ColorMode = 'light' | 'dark'

// ── Layout hints ─────────────────────────────────────────────────────────────

/** Declarative size hints for the host container (iframe, panel, etc.). */
export interface LayoutHints {
  /** Preferred height in pixels — host should allocate this before first paint. */
  preferredHeight?: number
  /** Minimum usable height in pixels. */
  minHeight?: number
  /** Maximum height in pixels — content scrolls beyond this. */
  maxHeight?: number
}

// ── Wire format ──────────────────────────────────────────────────────────────

/**
 * The `$prefab` wire payload, sent as `structuredContent` on an MCP tool result.
 *
 * DELIBERATELY A TYPE ALIAS, NOT AN INTERFACE. The MCP SDK types
 * `CallToolResult.structuredContent` as `{ [x: string]: unknown }`, and
 * TypeScript grants an implicit index signature to object type aliases but never
 * to interfaces. As an interface this is not assignable to that field, so every
 * consumer returning `display()` / `display_error()` from a tool handler is
 * forced into a type assertion to compile. Converting this back to an interface
 * reintroduces that, and the break surfaces in consumers rather than here.
 *
 * Same reasoning as the aliases in `src/mcp/types.ts`, where the lint rule is
 * scoped to enforce it file-wide. That is not an option here: this file is mostly
 * domain types that should stay interfaces, so the exception is per-declaration.
 * `test/mcp-types.test.ts` guards the assignability and fails `typecheck` (not at
 * runtime) if this regresses.
 */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- must be a type alias to get an implicit index signature; see above
export type PrefabWireFormat = {
  $prefab: { version: string }
  view: ComponentJSON
  state?: Record<string, unknown>
  defs?: Record<string, ComponentJSON>
  keyBindings?: Record<string, ActionJSON | ActionJSON[]>
  onMount?: ActionJSON | ActionJSON[]
  /** Inline CSS blocks injected as `<style>` (protocol 0.3). Includes the compiled theme. */
  css?: string[]
  /** External CSS URLs loaded as `<link rel="stylesheet">` (protocol 0.3). */
  stylesheets?: string[]
  /** Forced color scheme, independent of OS preference (protocol 0.3). */
  mode?: ColorMode
  /** Custom pipe source code — hydrated by the renderer on mount. */
  pipes?: Record<string, string>
  /** Size hints for the host container. */
  layout?: LayoutHints
}

// ── PrefabApp ────────────────────────────────────────────────────────────────

export interface PrefabAppOptions {
  title?: string
  view: Component
  state?: Record<string, unknown>
  theme?: Theme
  defs?: Record<string, Component>
  /** Inline CSS blocks injected as `<style>`. Merged after the compiled theme. */
  css?: string[]
  /** External CSS URLs loaded as `<link rel="stylesheet">`. */
  stylesheets?: string[]
  scripts?: string[]
  /** Forced color scheme, independent of OS preference. */
  mode?: ColorMode
  onMount?: Action | Action[]
  keyBindings?: Record<string, Action | Action[]>
  cssClass?: string
  /** Custom pipes to serialize in the wire format. Functions are converted to source strings. */
  pipes?: Record<string, PipeFn>
  /** Size hints for the host container. */
  layout?: LayoutHints
}

export class PrefabApp {
  readonly title: string
  readonly view: Component
  readonly state?: Record<string, unknown>
  readonly theme?: Theme
  readonly defs?: Record<string, Component>
  readonly css?: string[]
  readonly stylesheets?: string[]
  readonly scripts?: string[]
  readonly mode?: ColorMode
  readonly onMount?: Action | Action[]
  readonly keyBindings?: Record<string, Action | Action[]>
  readonly cssClass?: string
  readonly pipes?: Record<string, PipeFn>
  readonly layout?: LayoutHints

  constructor(opts: PrefabAppOptions) {
    this.title = opts.title ?? 'Prefab'
    this.view = opts.view
    // Merge auto-collected state (from signal/collection factories) with explicit state.
    // Explicit state wins on key conflicts.
    const autoState = drainAutoState()
    const explicit = opts.state
    const merged = Object.keys(autoState).length > 0 || explicit
      ? { ...autoState, ...explicit }
      : undefined
    this.state = merged
    this.theme = opts.theme
    this.defs = opts.defs
    this.css = opts.css
    this.stylesheets = opts.stylesheets
    this.scripts = opts.scripts
    this.mode = opts.mode
    this.onMount = opts.onMount
    this.keyBindings = opts.keyBindings
    this.cssClass = opts.cssClass
    this.pipes = opts.pipes
    this.layout = opts.layout
  }

  /**
   * Serialize to the $prefab wire format (JSON).
   * This is what gets sent over MCP or stored as a resource.
   */
  toJSON(): PrefabWireFormat {
    // Wrap view in a root Div with pf-app-root class
    const rootCssClass = this.cssClass ? `pf-app-root ${this.cssClass}` : 'pf-app-root'
    const rootView: ComponentJSON = {
      type: 'Div',
      cssClass: rootCssClass,
      children: [this.view.toJSON()],
    }

    const wire: PrefabWireFormat = {
      $prefab: { version: PROTOCOL_VERSION },
      view: rootView,
    }

    if (this.state) wire.state = this.state

    // Theme is compiled into the `css` array (protocol 0.3) — the wire no
    // longer carries a structured `theme` object. Compiled theme CSS comes
    // first so user-supplied `css` can override it.
    const cssParts = [compileThemeCss(this.theme), ...(this.css ?? [])]
      .filter(s => s.trim().length > 0)
    if (cssParts.length > 0) wire.css = cssParts

    if (this.stylesheets != null && this.stylesheets.length > 0) wire.stylesheets = this.stylesheets
    if (this.mode != null) wire.mode = this.mode

    if (this.defs) {
      wire.defs = {}
      for (const [name, comp] of Object.entries(this.defs)) {
        wire.defs[name] = comp.toJSON()
      }
    }

    if (this.keyBindings) {
      wire.keyBindings = {}
      for (const [key, actions] of Object.entries(this.keyBindings)) {
        wire.keyBindings[key] = Array.isArray(actions)
          ? actions.map(a => a.toJSON())
          : actions.toJSON()
      }
    }

    if (this.onMount) {
      wire.onMount = Array.isArray(this.onMount)
        ? this.onMount.map(a => a.toJSON())
        : this.onMount.toJSON()
    }

    if (this.pipes && Object.keys(this.pipes).length > 0) {
      wire.pipes = {}
      for (const [name, fn] of Object.entries(this.pipes)) {
        wire.pipes[name] = fn.toString()
      }
    }

    if (this.layout) wire.layout = this.layout

    return wire
  }

  /**
   * Serialize to A2UI messages — the second wire format this tree can speak.
   *
   * `toJSON()` targets prefab's own renderer; this targets the A2UI renderers,
   * which draw native widgets from a flat component list rather than running
   * prefab's renderer in an iframe. The catalogs are not the same size, so the
   * result carries `diagnostics` describing every component that had to
   * degrade, and callers that care should read it.
   *
   * @example
   * ```ts
   * const { messages, diagnostics } = app.toA2UI()
   * if (diagnostics.some(d => d.kind === 'unsupported')) rethinkTheView()
   * ```
   */
  toA2UI(options?: A2uiEmitOptions): A2uiEmitResult {
    return emitA2UI(this.toJSON(), options)
  }

  /**
   * Serialize as a ready-to-return MCP tool result.
   *
   * Includes both `content` (LLM text fallback) and `structuredContent`
   * (forwarded to MCP Apps iframes via `ui/notifications/tool-result`).
   *
   * @example
   * ```ts
   * mcp.registerTool('browse', schema, async (args) => app.toMcpResult())
   * ```
   */
  toMcpResult(): { content: { type: 'text'; text: string }[]; structuredContent: Record<string, unknown> } {
    const wire = this.toJSON()
    return {
      content: [{ type: 'text', text: JSON.stringify(wire) }],
      structuredContent: wire,
    }
  }

  /**
   * Serialize to a self-contained HTML page.
   * The page embeds the JSON wire format and a script tag
   * that loads the prefab renderer from a CDN.
   *
   * @param opts.includeStyles  Inject a `<link>` to the prefab base theme CSS
   *   from the CDN.  Defaults to `true`.  Set `false` to BYO CSS.
   */
  toHTML(opts?: { cdnVersion?: string; pretty?: boolean; includeStyles?: boolean }): string {
    const cdnVersion = opts?.cdnVersion ?? VERSION
    const includeStyles = opts?.includeStyles !== false

    // css / stylesheets / mode are emitted into <head> below, so strip them
    // from the embedded wire data to avoid the renderer injecting them twice.
    const wire = this.toJSON()
    const { css: cssBlocks, stylesheets, mode, ...embedded } = wire
    void cssBlocks; void stylesheets; void mode
    const jsonStr = opts?.pretty
      ? JSON.stringify(embedded, null, 2)
      : JSON.stringify(embedded)

    // Escape </script> in JSON to prevent breaking out of the inline script tag
    const safeJsonStr = jsonStr.replace(/<\//g, '<\\/')

    const baseStyleTag = includeStyles
      ? `\n    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@maxhealth.tech/prefab@${cdnVersion}/dist/prefab.css">`
      : ''

    // Inline CSS blocks (compiled theme + user css) as <style> tags.
    const cssTags = (wire.css ?? [])
      .map(c => `<style>${c.replace(/<\/(style)/gi, '<\\/$1')}</style>`)
      .join('\n    ')

    // External stylesheet URLs as <link> tags.
    const stylesheetTags = (this.stylesheets ?? [])
      .map(s => s.startsWith('<') ? s : `<link rel="stylesheet" href="${escapeHtml(s)}">`)
      .join('\n    ')

    const scriptTags = (this.scripts ?? [])
      .map(s => `<script src="${escapeHtml(s)}"></script>`)
      .join('\n    ')

    // Force the color scheme on the document root using both conventions.
    const modeAttr = this.mode ? ` data-theme="${this.mode}" class="${this.mode}"` : ''

    const headExtras = [baseStyleTag, cssTags && `\n    ${cssTags}`, stylesheetTags && `\n    ${stylesheetTags}`]
      .filter(Boolean)
      .join('')

    return `<!DOCTYPE html>
<html lang="en"${modeAttr}>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(this.title)}</title>${headExtras}
    <script src="https://cdn.jsdelivr.net/npm/@maxhealth.tech/prefab@${cdnVersion}/dist/renderer.min.js"></script>
    ${scriptTags}
  </head>
  <body>
    <div id="prefab-root"></div>
    <script>
      window.__PREFAB_DATA__ = ${safeJsonStr};
      if (window.PrefabRenderer) {
        window.PrefabRenderer.mount(document.getElementById('prefab-root'), window.__PREFAB_DATA__);
      }
    </script>
  </body>
</html>`
  }
}

