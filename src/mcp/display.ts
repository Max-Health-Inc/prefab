/**
 * MCP Display Helpers — return prefab UIs as MCP tool results.
 *
 * These functions wrap PrefabApp / Component trees into MCP-compatible
 * tool result content arrays, ready to return from tool handlers.
 *
 * @example
 * ```ts
 * import { display, display_error } from '@maxhealth.tech/prefab/mcp'
 * import { autoTable } from '@maxhealth.tech/prefab'
 *
 * // In a FastMCP tool handler:
 * async function listPatients(args, context) {
 *   const patients = await fetchPatients()
 *   return display(autoTable(patients), { title: 'Patient List' })
 * }
 * ```
 */

import { type Component } from '../core/component.js'
import { PrefabApp } from '../app.js'
import type { Theme, LayoutHints } from '../app.js'
import type { Action } from '../actions/types.js'
import type { McpToolResult } from './types.js'

// ── display() ────────────────────────────────────────────────────────────────

export interface DisplayOptions {
  /** Page / app title. */
  title?: string
  /** Initial reactive state. */
  state?: Record<string, unknown>
  /** Light/dark theme overrides. */
  theme?: Theme
  /** Reusable component definitions. */
  defs?: Record<string, Component>
  /** Action(s) to run when the UI mounts. */
  onMount?: Action | Action[]
  /** Keyboard shortcuts. */
  keyBindings?: Record<string, Action | Action[]>
  /** Extra CSS class on root element. */
  cssClass?: string
  /** Size hints for the host container (iframe, panel, etc.). */
  layout?: LayoutHints
}

/**
 * Wrap a Component (or PrefabApp) as an MCP tool result.
 *
 * If given a Component, it's wrapped in a PrefabApp automatically.
 * If given a PrefabApp, it's serialized as-is.
 *
 * @returns MCP tool result with the prefab wire format JSON as text content.
 */
export function display(
  viewOrApp: Component | PrefabApp,
  options?: DisplayOptions,
): McpToolResult {
  const app = viewOrApp instanceof PrefabApp
    ? viewOrApp
    : new PrefabApp({
        title: options?.title ?? 'Prefab',
        view: viewOrApp,
        state: options?.state,
        theme: options?.theme,
        defs: options?.defs,
        onMount: options?.onMount,
        keyBindings: options?.keyBindings,
        cssClass: options?.cssClass,
        layout: options?.layout,
      })

  const wire = app.toJSON()
  return {
    content: [{ type: 'text', text: JSON.stringify(wire) }],
    structuredContent: wire as unknown as Record<string, unknown>,
  }
}

// ── display_form() ───────────────────────────────────────────────────────────

import { autoForm } from '../auto/form.js'
import type { AutoFormField, AutoFormOptions } from '../auto/form.js'

export interface DisplayFormOptions extends AutoFormOptions {
  /** Initial state values for form fields. */
  state?: Record<string, unknown>
  /** Theme overrides. */
  theme?: Theme
}

/**
 * Return a form UI as an MCP tool result.
 *
 * The form submits back to the specified MCP tool via CallTool.
 * Field definitions map to Input components; the submit action
 * invokes `submitTool` with all field values.
 *
 * @returns MCP tool result with form prefab UI.
 */
export function display_form(
  fields: AutoFormField[],
  submitTool: string,
  options?: DisplayFormOptions,
): McpToolResult {
  const view = autoForm(fields, submitTool, options)
  const app = new PrefabApp({
    title: options?.title ?? 'Form',
    view,
    state: options?.state,
    theme: options?.theme,
  })

  const wire = app.toJSON()
  return {
    content: [{ type: 'text', text: JSON.stringify(wire) }],
    structuredContent: wire as unknown as Record<string, unknown>,
  }
}

// ── display_update() ─────────────────────────────────────────────────────────

export interface StateUpdate {
  /** State key-value pairs to merge into the existing UI state. */
  state: Record<string, unknown>
}

export interface PrefabUpdateWire {
  $prefab: { version: string }
  update: StateUpdate
}

/**
 * Return a partial state update for an existing prefab UI.
 *
 * Instead of re-rendering the entire UI, this sends a state delta
 * that the renderer merges into its reactive store.
 *
 * @returns MCP tool result with a $prefab update payload.
 */
export function display_update(
  state: Record<string, unknown>,
): McpToolResult {
  const payload: PrefabUpdateWire = {
    $prefab: { version: '0.2' },
    update: { state },
  }

  return {
    content: [{ type: 'text', text: JSON.stringify(payload) }],
    structuredContent: payload as unknown as Record<string, unknown>,
  }
}

// ── display_error() ──────────────────────────────────────────────────────────

import { Column } from '../components/layout/index.js'
import { Muted, Code } from '../components/typography/index.js'
import { Alert, AlertTitle, AlertDescription } from '../components/alert/index.js'
import { Card, CardContent } from '../components/card/index.js'

export interface DisplayErrorOptions {
  /** Error detail / stack trace to show in a code block. */
  detail?: string
  /** Hint for the user on how to fix the issue. */
  hint?: string
  /** Theme overrides. */
  theme?: Theme
}

/**
 * Return a standardized error view as an MCP tool result.
 *
 * Renders a destructive Alert with title + message, optional detail
 * code block, and optional hint. Sets `isError: true` on the MCP result.
 *
 * @returns MCP tool result with error UI and isError flag.
 */
export function display_error(
  title: string,
  message: string,
  options?: DisplayErrorOptions,
): McpToolResult {
  const alertChildren: Component[] = [
    AlertTitle(title),
    AlertDescription(message),
  ]

  const bodyChildren: Component[] = [
    Alert({ variant: 'destructive', icon: 'AlertCircle', children: alertChildren }),
  ]

  if (options?.detail) {
    bodyChildren.push(
      Card({ children: [CardContent({ children: [Code(options.detail)] })] }),
    )
  }

  if (options?.hint) {
    bodyChildren.push(Muted(options.hint))
  }

  const view = Column({ gap: 4, cssClass: 'p-6 max-w-2xl', children: bodyChildren })

  const app = new PrefabApp({
    title: 'Error',
    view,
    theme: options?.theme,
  })

  const wire = app.toJSON()
  return {
    content: [{ type: 'text', text: JSON.stringify(wire) }],
    structuredContent: wire as unknown as Record<string, unknown>,
    isError: true,
  }
}

// ── display_success() ────────────────────────────────────────────────────────

export interface DisplaySuccessOptions {
  /** Additional detail text below the message. */
  detail?: string
  /** Theme overrides. */
  theme?: Theme
}

/**
 * Return a standardized success view as an MCP tool result.
 *
 * Renders a success Alert with title + message, optional detail text.
 *
 * @returns MCP tool result with success UI.
 */
export function display_success(
  title: string,
  message: string,
  options?: DisplaySuccessOptions,
): McpToolResult {
  const alertChildren: Component[] = [
    AlertTitle(title),
    AlertDescription(message),
  ]

  const bodyChildren: Component[] = [
    Alert({ variant: 'success', icon: 'CheckCircle', children: alertChildren }),
  ]

  if (options?.detail) {
    bodyChildren.push(Muted(options.detail))
  }

  const view = Column({ gap: 4, cssClass: 'p-6 max-w-2xl', children: bodyChildren })

  const app = new PrefabApp({
    title: 'Success',
    view,
    theme: options?.theme,
  })

  const wire = app.toJSON()
  return {
    content: [{ type: 'text', text: JSON.stringify(wire) }],
    structuredContent: wire as unknown as Record<string, unknown>,
  }
}

// ── camelCase aliases (TS convention) ────────────────────────────────────────

export const displayForm = display_form
export const displayUpdate = display_update
export const displayError = display_error
export const displaySuccess = display_success

// ── resourceMeta() — generate _meta for ui:// resource registration ─────────

/** CSP configuration for MCP Apps resources. */
export interface McpAppCsp {
  /** Origins allowed for scripts, styles, images, fonts, media. */
  resourceDomains?: string[]
  /** Origins allowed for fetch/XHR/WebSocket. */
  connectDomains?: string[]
  /** Origins allowed for nested iframes. */
  frameDomains?: string[]
  /** Additional allowed base URIs. */
  baseUriDomains?: string[]
}

/** Permission Policy requests for MCP Apps resources. */
export interface McpAppPermissions {
  /** Request camera access (video capture, QR scanning). */
  camera?: boolean
  /** Request microphone access (audio recording, voice input). */
  microphone?: boolean
  /** Request geolocation access (location-aware apps, maps). */
  geolocation?: boolean
  /** Request clipboard write access (copy-to-clipboard). */
  clipboardWrite?: boolean
}

export interface ResourceMetaOptions {
  /** CSP domains configuration. */
  csp?: McpAppCsp
  /** Permission Policy requests (camera, mic, etc.). */
  permissions?: McpAppPermissions
}

/**
 * Generate the `_meta` object for MCP Apps `ui://` resource registration.
 *
 * Includes CSP and Permission Policy configuration per the MCP Apps spec.
 * Use on both the resource listing AND the content item (VS Code reads
 * only the content item; other hosts may read either).
 *
 * @example
 * ```ts
 * const meta = resourceMeta({
 *   csp: { resourceDomains: ['https://cdn.jsdelivr.net'] },
 *   permissions: { camera: true },
 * })
 *
 * mcp.resource('viewer', 'ui://my/viewer', {
 *   mimeType: 'text/html;profile=mcp-app',
 *   _meta: meta,
 * }, async (uri) => ({
 *   contents: [{ uri: uri.toString(), mimeType: 'text/html;profile=mcp-app', text: html, _meta: meta }],
 * }))
 * ```
 */
/** Spec-compliant permissions shape: each granted permission is `{}`. */
interface McpAppPermissionsWire {
  camera?: Record<string, never>
  microphone?: Record<string, never>
  geolocation?: Record<string, never>
  clipboardWrite?: Record<string, never>
}

export function resourceMeta(options?: ResourceMetaOptions): { ui: { csp?: McpAppCsp; permissions?: McpAppPermissionsWire } } {
  const ui: { csp?: McpAppCsp; permissions?: McpAppPermissionsWire } = {}

  if (options?.csp) {
    ui.csp = {
      resourceDomains: options.csp.resourceDomains ?? [],
      connectDomains: options.csp.connectDomains ?? [],
      frameDomains: options.csp.frameDomains ?? [],
      baseUriDomains: options.csp.baseUriDomains ?? [],
    }
  }

  if (options?.permissions) {
    ui.permissions = {}
    if (options.permissions.camera) ui.permissions.camera = {}
    if (options.permissions.microphone) ui.permissions.microphone = {}
    if (options.permissions.geolocation) ui.permissions.geolocation = {}
    if (options.permissions.clipboardWrite) ui.permissions.clipboardWrite = {}
  }

  return { ui }
}

/** Default CSP meta for prefab apps using jsDelivr CDN. */
export const PREFAB_CDN_META = resourceMeta({
  csp: { resourceDomains: ['https://cdn.jsdelivr.net'] },
})

// ── rendererHtml() — generate the viewer HTML page ──────────────────────────

/** Default URI for the prefab viewer resource. */
export const PREFAB_RESOURCE_URI = 'ui://prefab/viewer'

/** MIME type required by MCP Apps hosts. */
const MCP_APP_MIME = 'text/html;profile=mcp-app'

/** CDN base for the @maxhealth.tech/prefab package (major.minor pinned). */
const CDN_BASE = 'https://cdn.jsdelivr.net/npm/@maxhealth.tech/prefab@0.2/dist'

export interface RendererHtmlOptions {
  /** Page title. @default 'Prefab' */
  title?: string
  /** Additional `<script>` URLs to load after the renderer. */
  scripts?: string[]
  /** Additional `<link rel="stylesheet">` URLs. */
  stylesheets?: string[]
  /** Override CDN base URL (no trailing slash). @default jsdelivr CDN */
  cdnBase?: string
}

/**
 * Generate the HTML page for a prefab MCP Apps viewer resource.
 *
 * Returns the minimal HTML that loads `prefab.css` and `renderer.auto.min.js`
 * from the CDN, plus any additional scripts/stylesheets you specify.
 *
 * @example
 * ```ts
 * import { rendererHtml } from '@maxhealth.tech/prefab/mcp'
 * const html = rendererHtml()
 * // or with extra scripts:
 * const html = rendererHtml({ scripts: ['https://cdn.example.com/plugin.js'] })
 * ```
 */
export function rendererHtml(options?: RendererHtmlOptions): string {
  const title = options?.title ?? 'Prefab'
  const base = options?.cdnBase ?? CDN_BASE
  const extraStyles = (options?.stylesheets ?? [])
    .map(url => `  <link rel="stylesheet" crossorigin href="${escapeAttr(url)}">`)
    .join('\n')
  const extraScripts = (options?.scripts ?? [])
    .map(url => `  <script crossorigin src="${escapeAttr(url)}"></script>`)
    .join('\n')

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <link rel="stylesheet" crossorigin href="${base}/prefab.css">
${extraStyles}</head>
<body>
  <div id="root"></div>
  <script crossorigin src="${base}/renderer.auto.min.js"></script>
${extraScripts}</body>
</html>`
}

// ── registerViewerResource() — one-liner resource registration ──────────────

export interface ViewerResourceOptions {
  /** Resource URI. @default PREFAB_RESOURCE_URI */
  uri?: string
  /** Resource title. @default 'Prefab Viewer' */
  title?: string
  /** CSP configuration. @default { resourceDomains: ['https://cdn.jsdelivr.net'] } */
  csp?: McpAppCsp
  /** Permission Policy requests. */
  permissions?: McpAppPermissions
  /** Additional `<script>` URLs to load after the renderer. */
  scripts?: string[]
  /** Additional `<link rel="stylesheet">` URLs. */
  stylesheets?: string[]
  /** Override CDN base URL (no trailing slash). */
  cdnBase?: string
}

/**
 * MCP server interface expected by registerViewerResource.
 * Compatible with @modelcontextprotocol/sdk McpServer and fastmcp Server.
 */
interface McpServerLike {
  resource(
    name: string,
    uri: string,
    options: { title?: string; mimeType: string; description?: string; _meta?: Record<string, unknown> },
    handler: (uri: URL) => Promise<{ contents: { uri: string; mimeType: string; text: string; _meta?: Record<string, unknown> }[] }>,
  ): void
}

/**
 * Register the prefab viewer as a `ui://` resource on an MCP server.
 *
 * Handles MIME type, CSP on both listing and content item, and HTML generation.
 * Eliminates the three most common registration mistakes in one call.
 *
 * @example
 * ```ts
 * import { registerViewerResource, PREFAB_RESOURCE_URI } from '@maxhealth.tech/prefab/mcp'
 *
 * registerViewerResource(server)
 *
 * server.tool('browse', schema, async (args) => ({
 *   content: [{ type: 'text', text: JSON.stringify(data) }],
 *   structuredContent: data,
 *   _meta: { ui: { resourceUri: PREFAB_RESOURCE_URI } },
 * }))
 * ```
 */
export function registerViewerResource(server: McpServerLike, options?: ViewerResourceOptions): void {
  const uri = options?.uri ?? PREFAB_RESOURCE_URI
  const title = options?.title ?? 'Prefab Viewer'

  // Merge CSP: always include jsdelivr for the default renderer
  const csp: McpAppCsp = options?.csp
    ? {
        resourceDomains: [...new Set([...(options.csp.resourceDomains ?? []), 'https://cdn.jsdelivr.net'])],
        connectDomains: options.csp.connectDomains ?? [],
        frameDomains: options.csp.frameDomains ?? [],
        baseUriDomains: options.csp.baseUriDomains ?? [],
      }
    : { resourceDomains: ['https://cdn.jsdelivr.net'] }

  // Add script origins to CSP resourceDomains
  if (options?.scripts && options.scripts.length > 0) {
    const scriptOrigins = options.scripts
      .map(url => { try { return new URL(url).origin } catch { return null } })
      .filter((o): o is string => o !== null)
    csp.resourceDomains = [...new Set([...(csp.resourceDomains ?? []), ...scriptOrigins])]
  }

  const meta = resourceMeta({ csp, permissions: options?.permissions })
  const html = rendererHtml({
    title,
    scripts: options?.scripts,
    stylesheets: options?.stylesheets,
    cdnBase: options?.cdnBase,
  })

  // Extract name from URI: 'ui://prefab/viewer' -> 'prefab-viewer'
  const name = uri.replace(/^ui:\/\//, '').replace(/\//g, '-')

  server.resource(
    name,
    uri,
    { title, mimeType: MCP_APP_MIME, _meta: meta },
    (resourceUri) => Promise.resolve({
      contents: [{
        uri: resourceUri.toString(),
        mimeType: MCP_APP_MIME,
        text: html,
        _meta: meta,
      }],
    }),
  )
}

// ── HTML escaping helpers ────────────────────────────────────────────────────

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
}
