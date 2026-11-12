/** Register the prefab viewer as a `ui://` MCP Apps resource: MIME type, `_meta.ui` on listing and content, CDN-pinned HTML, cache fields, extension capability. */

import { VERSION } from '../app.js'
import { createLogger } from '../core/logger.js'
import { escapeHtml } from '../core/escape.js'
import type { McpCacheHint, McpCacheScope, McpResourceReadResult, McpTextResourceContents } from './types.js'
import { themeBridgeCss, type ThemeBridge } from './theme-bridge.js'

const log = createLogger('mcp')

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

/** Spec-compliant permissions shape: each granted permission is `{}`. */
interface McpAppPermissionsWire {
  camera?: Record<string, never>
  microphone?: Record<string, never>
  geolocation?: Record<string, never>
  clipboardWrite?: Record<string, never>
}

/**
 * The `_meta` (CSP, permissions) for a `ui://` resource. Put it on the listing and the content item: VS Code reads only the latter.
 *
 * @example
 * ```ts
 * const meta = resourceMeta({
 *   csp: { resourceDomains: ['https://cdn.jsdelivr.net'] },
 *   permissions: { camera: true },
 * })
 *
 * server.registerResource('viewer', 'ui://my/viewer', {
 *   mimeType: 'text/html;profile=mcp-app',
 *   _meta: meta,
 *   cacheHint: { ttlMs: 86_400_000, cacheScope: 'public' },
 * }, (uri) => Promise.resolve({
 *   contents: [{ uri: uri.toString(), mimeType: 'text/html;profile=mcp-app', text: html, _meta: meta }],
 *   ttlMs: 86_400_000,
 *   cacheScope: 'public',
 * }))
 *
 * // The UI resource is associated with a tool on the tool DEFINITION, not
 * // on its result:
 * server.registerTool('browse', {
 *   title: 'Browse',
 *   inputSchema: schema,
 *   _meta: uiToolMeta('ui://my/viewer'),
 * }, (args) => display(autoTable(rows)))
 * ```
 */
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

// ── Constants ────────────────────────────────────────────────────────────────

/** Default URI for the prefab viewer resource. */
export const PREFAB_RESOURCE_URI = 'ui://prefab/viewer'

/** The tool-definition `_meta` that points an MCP Apps host at a `ui://` renderer, the prefab viewer by default. */
export function uiToolMeta(resourceUri: string = PREFAB_RESOURCE_URI): { ui: { resourceUri: string } } {
  return { ui: { resourceUri } }
}

/** MIME type required by MCP Apps hosts. */
export const MCP_APP_MIME = 'text/html;profile=mcp-app'

/** The MCP Apps extension id, `…/ui` per the spec and ext-apps (`…/apps` in some SDK doc examples is only illustrative). */
export const APPS_EXTENSION = 'io.modelcontextprotocol/ui'

/** Viewer cache hint: the HTML is a pure function of `VERSION`, so it is shared-cacheable for a day. */
export const DEFAULT_VIEWER_CACHE: Required<McpCacheHint> = {
  ttlMs: 86_400_000, // 24h
  cacheScope: 'public',
}

/** Runtime list of {@link McpCacheScope}, so untyped JS callers are validated too. */
const CACHE_SCOPES: readonly McpCacheScope[] = ['public', 'private']

/** CDN base for the @maxhealth.tech/prefab package (exact version, never stale). */
function cdnBase(): string {
  return `https://cdn.jsdelivr.net/npm/@maxhealth.tech/prefab@${VERSION}/dist`
}

// ── rendererHtml() — generate the viewer HTML page ──────────────────────────

export interface RendererHtmlOptions {
  /** Page title. @default 'Prefab' */
  title?: string
  /** Additional `<script>` URLs to load after the renderer. */
  scripts?: string[]
  /** Additional `<link rel="stylesheet">` URLs. */
  stylesheets?: string[]
  /** Override CDN base URL (no trailing slash). @default jsdelivr CDN */
  cdnBase?: string
  /** Theme bridge stylesheet after `prefab.css` (before `stylesheets`); `'vscode'` follows the editor theme. */
  themeBridge?: ThemeBridge
}

/**
 * The viewer HTML: `prefab.css` and `renderer.auto.min.js` from the CDN, plus your scripts and stylesheets.
 *
 * @example
 * ```ts
 * import { rendererHtml } from '@maxhealth.tech/prefab/mcp'
 * const html = rendererHtml()
 * // or with extra scripts:
 * const html = rendererHtml({ scripts: ['https://cdn.example.com/plugin.js'] })
 * // inside VS Code, to follow the user's editor theme:
 * const html = rendererHtml({ themeBridge: 'vscode' })
 * ```
 */
export function rendererHtml(options?: RendererHtmlOptions): string {
  const title = options?.title ?? 'Prefab'
  const base = options?.cdnBase ?? cdnBase()
  // Order matters: prefab.css, then the bridge, then the caller's stylesheets.
  const bridge = options?.themeBridge
    ? `  <style>\n${themeBridgeCss(options.themeBridge)}\n  </style>\n`
    : ''
  const extraStyles = (options?.stylesheets ?? [])
    .map(url => `  <link rel="stylesheet" crossorigin href="${escapeHtml(url)}">`)
    .join('\n')
  const extraScripts = (options?.scripts ?? [])
    .map(url => `  <script crossorigin src="${escapeHtml(url)}"></script>`)
    .join('\n')

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <link rel="stylesheet" crossorigin href="${base}/prefab.css">
${bridge}${extraStyles}</head>
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
  /** See {@link RendererHtmlOptions.themeBridge}. */
  themeBridge?: ThemeBridge
  /** Cache fields for the `resources/read` result (SEP-2549). @default { ttlMs: 86_400_000, cacheScope: 'public' } */
  cache?: McpCacheHint
  /** Declare the `io.modelcontextprotocol/ui` capability (SEP-2133); only works before the server connects. @default true */
  declareCapability?: boolean
}

/** Registration config accepted by both SDK generations. */
export interface ResourceConfig {
  title?: string
  mimeType: string
  description?: string
  _meta?: Record<string, unknown>
  /** Per-resource cache hint (SDK v2; ignored by servers that do not read it). */
  cacheHint?: McpCacheHint
}

/** `resources/read` handler shape passed to the server — the viewer is always HTML text. */
export type ResourceReadHandler = (uri: URL) => Promise<McpResourceReadResult<McpTextResourceContents>>

/** Capability bag carrying extension declarations. */
interface CapabilityDeclaration {
  extensions?: Record<string, Record<string, unknown>>
}

/** The server shape registerViewerResource needs, structural so any SDK fits; `resource` is the v1 fallback. */
export interface McpServerLike {
  registerResource?(name: string, uri: string, config: ResourceConfig, handler: ResourceReadHandler): unknown
  resource?(name: string, uri: string, config: ResourceConfig, handler: ResourceReadHandler): unknown
  /** Low-level server, where both SDK generations expose capability registration. */
  server?: { registerCapabilities?(capabilities: CapabilityDeclaration): void }
  /** Some wrappers expose capability registration directly. */
  registerCapabilities?(capabilities: CapabilityDeclaration): void
}

/** Fill in and validate `CacheableResult` fields, throwing on values the SDK would silently replace with `ttlMs: 0`. */
export function resolveCache(
  hint?: McpCacheHint,
  defaults: Required<McpCacheHint> = DEFAULT_VIEWER_CACHE,
): Required<McpCacheHint> {
  const ttlMs = hint?.ttlMs ?? defaults.ttlMs
  if (!Number.isSafeInteger(ttlMs) || ttlMs < 0) {
    throw new RangeError(`cache.ttlMs must be a non-negative safe integer, got ${String(hint?.ttlMs)}`)
  }
  const cacheScope: McpCacheScope = hint?.cacheScope ?? defaults.cacheScope
  if (!CACHE_SCOPES.includes(cacheScope)) {
    throw new RangeError(`cache.cacheScope must be 'public' or 'private', got ${String(hint?.cacheScope)}`)
  }
  return { ttlMs, cacheScope }
}

/** Declare the MCP Apps extension capability, tolerating servers that cannot. */
function declareAppsExtension(server: McpServerLike): void {
  const declareCaps = server.registerCapabilities?.bind(server)
    ?? server.server?.registerCapabilities?.bind(server.server)
  if (declareCaps == null) return
  try {
    declareCaps({ extensions: { [APPS_EXTENSION]: {} } })
  } catch (e) {
    log.warn(`could not declare the ${APPS_EXTENSION} capability (register the viewer before connecting):`, e)
  }
}

/**
 * Register the prefab viewer as a `ui://` resource. The CSP admits jsDelivr and every origin the page loads from.
 *
 * @example
 * ```ts
 * import { registerViewerResource, uiToolMeta, display } from '@maxhealth.tech/prefab/mcp'
 *
 * registerViewerResource(server)
 *
 * // The UI resource is attached to the tool DEFINITION via _meta.ui:
 * server.registerTool('browse', {
 *   title: 'Browse patients',
 *   inputSchema: { query: z.string() },
 *   _meta: uiToolMeta(),
 * }, async (args) => display(autoTable(await search(args.query))))
 * ```
 */
export function registerViewerResource(server: McpServerLike, options?: ViewerResourceOptions): void {
  const uri = options?.uri ?? PREFAB_RESOURCE_URI
  const title = options?.title ?? 'Prefab Viewer'
  const cache = resolveCache(options?.cache)

  // Merge CSP: always include jsdelivr for the default renderer
  const csp: McpAppCsp = options?.csp
    ? {
        resourceDomains: [...new Set([...(options.csp.resourceDomains ?? []), 'https://cdn.jsdelivr.net'])],
        connectDomains: options.csp.connectDomains ?? [],
        frameDomains: options.csp.frameDomains ?? [],
        baseUriDomains: options.csp.baseUriDomains ?? [],
      }
    : { resourceDomains: ['https://cdn.jsdelivr.net'] }

  const loadedFrom = [...(options?.scripts ?? []), ...(options?.stylesheets ?? []), ...(options?.cdnBase != null ? [options.cdnBase] : [])]
  const loadedOrigins = loadedFrom.flatMap(url => {
    try { return [new URL(url).origin] } catch { return [] }
  })
  if (loadedOrigins.length > 0) {
    csp.resourceDomains = [...new Set([...(csp.resourceDomains ?? []), ...loadedOrigins])]
  }

  const meta = resourceMeta({ csp, permissions: options?.permissions })
  const html = rendererHtml({
    title,
    scripts: options?.scripts,
    stylesheets: options?.stylesheets,
    cdnBase: options?.cdnBase,
    themeBridge: options?.themeBridge,
  })

  if (options?.declareCapability !== false) declareAppsExtension(server)

  // Extract name from URI: 'ui://prefab/viewer' -> 'prefab-viewer'
  const name = uri.replace(/^ui:\/\//, '').replace(/\//g, '-')

  const config: ResourceConfig = { title, mimeType: MCP_APP_MIME, _meta: meta, cacheHint: cache }
  const handler: ResourceReadHandler = (resourceUri) => Promise.resolve({
    contents: [{
      uri: resourceUri.toString(),
      mimeType: MCP_APP_MIME,
      text: html,
      _meta: meta,
    }],
    ttlMs: cache.ttlMs,
    cacheScope: cache.cacheScope,
  })

  const register = server.registerResource?.bind(server) ?? server.resource?.bind(server)
  if (register == null) {
    throw new TypeError('registerViewerResource: server exposes neither registerResource() nor resource()')
  }
  register(name, uri, config, handler)
}

