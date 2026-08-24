/**
 * MCP Apps resource helpers — register the prefab viewer as a `ui://` resource.
 *
 * Covers the three things every MCP Apps host checks and the two the
 * 2026-07-28 protocol revision added:
 *   - the `text/html;profile=mcp-app` MIME type,
 *   - `_meta.ui` CSP / permissions on BOTH the listing and the content item,
 *   - the viewer HTML itself (CDN-pinned to this exact package version),
 *   - `ttlMs` / `cacheScope` on the read result (SEP-2549 `CacheableResult`),
 *   - the `io.modelcontextprotocol/ui` extension capability (SEP-2133).
 */

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
 *   _meta: { ui: { resourceUri: 'ui://my/viewer' } },
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

/** MIME type required by MCP Apps hosts. */
export const MCP_APP_MIME = 'text/html;profile=mcp-app'

/**
 * Capability key for the MCP Apps extension (versioned independently of core).
 *
 * The identifier is `…/ui`, and the trap here is that `…/apps` looks right and is
 * wrong. The normative source is the MCP Apps spec, which states "This extension is
 * identified as: `io.modelcontextprotocol/ui`" in both the current `2026-01-26`
 * revision and the draft, and the reference implementation agrees:
 * `ext-apps/src/server/index.ts` exports `EXTENSION_ID = "io.modelcontextprotocol/ui"`.
 *
 * `io.modelcontextprotocol/apps` appears only as illustrative "e.g." text in the Rust
 * and C# SDKs' generic `ServerCapabilities.extensions` doc comments (and their test
 * fixtures), showing the SHAPE of the extensions map rather than naming this extension.
 * Copying it from there declares the capability under a key no host looks up, which
 * fails silently: rendering still works, because hosts fall back to detecting apps via
 * `_meta.ui` plus the MIME type, so only the SEP-2133 declaration is lost.
 *
 * Duplicated as a literal rather than imported, because prefab ships zero dependencies.
 */
export const APPS_EXTENSION = 'io.modelcontextprotocol/ui'

/**
 * Default cache hint for the viewer resource.
 *
 * The HTML is a pure function of this package's `VERSION` (the CDN base pins
 * the exact version), so it cannot change for a given server build — it is
 * safely shared-cacheable. Without this the SDK falls back to the conservative
 * `{ ttlMs: 0, cacheScope: 'private' }` and the viewer is re-fetched every time.
 */
export const DEFAULT_VIEWER_CACHE: Required<McpCacheHint> = {
  ttlMs: 86_400_000, // 24h
  cacheScope: 'public',
}

/**
 * Runtime whitelist for {@link McpCacheScope}.
 *
 * Kept as a value (not just the union type) so the guard in `resolveCache` still
 * rejects a bad scope handed over from untyped JS — a `!==` chain against the
 * union narrows itself away and validates nothing.
 */
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
  /**
   * Inject a theme bridge stylesheet after `prefab.css`.
   *
   * `'vscode'` re-declares the tokens VS Code can supply with the
   * `--vscode-*` variable first, dropping the MCP Apps `--color-*` layer that
   * would otherwise shadow it, so the viewer follows the user's editor theme.
   * Emitted before `stylesheets`, which stay the outermost override.
   */
  themeBridge?: ThemeBridge
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
 * // inside VS Code, to follow the user's editor theme:
 * const html = rendererHtml({ themeBridge: 'vscode' })
 * ```
 */
export function rendererHtml(options?: RendererHtmlOptions): string {
  const title = options?.title ?? 'Prefab'
  const base = options?.cdnBase ?? cdnBase()
  // Order in <head> is load-bearing: prefab.css, then the bridge (which must win
  // over it), then the caller's stylesheets as the outermost override.
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
  /**
   * Inject a theme bridge stylesheet. `'vscode'` makes the viewer follow the
   * user's editor theme. See {@link RendererHtmlOptions.themeBridge}.
   */
  themeBridge?: ThemeBridge
  /**
   * Cache fields for the `resources/read` result (SEP-2549).
   * @default { ttlMs: 86_400_000, cacheScope: 'public' }
   */
  cache?: McpCacheHint
  /**
   * Declare the `io.modelcontextprotocol/ui` extension capability on the
   * server (SEP-2133). Must happen before the server connects; a server that
   * is already connected keeps its existing capabilities and a warning is
   * logged. @default true
   */
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

/**
 * MCP server interface expected by registerViewerResource.
 *
 * Structural rather than an SDK import, so fastmcp and hand-rolled servers stay
 * compatible. `registerResource` is preferred; `resource` is the v1 overload
 * that v2 retired and is used only as a fallback.
 */
export interface McpServerLike {
  registerResource?(name: string, uri: string, config: ResourceConfig, handler: ResourceReadHandler): unknown
  resource?(name: string, uri: string, config: ResourceConfig, handler: ResourceReadHandler): unknown
  /** Low-level server, where both SDK generations expose capability registration. */
  server?: { registerCapabilities?(capabilities: CapabilityDeclaration): void }
  /** Some wrappers expose capability registration directly. */
  registerCapabilities?(capabilities: CapabilityDeclaration): void
}

/**
 * Fill in and validate the `CacheableResult` fields, rejecting values the SDK
 * would silently discard in favour of `ttlMs: 0`.
 *
 * `defaults` differ per resource kind: the viewer HTML is a pure function of the
 * package version and is safely shared-cacheable, while an `a2ui://` surface is
 * rebuilt on every read and defaults to no caching. Exported so `./a2ui.ts`
 * resolves its hints through the same guard rather than restating it.
 */
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
  // Not named `declare` — that is a TS modifier keyword at statement position
  // and some transpilers refuse to parse a call to a binding of that name.
  const declareCaps = server.registerCapabilities?.bind(server)
    ?? server.server?.registerCapabilities?.bind(server.server)
  if (declareCaps == null) return
  try {
    declareCaps({ extensions: { [APPS_EXTENSION]: {} } })
  } catch (e) {
    // Both SDK generations throw when called after connect. The server still
    // serves the resource — it just does not advertise the extension.
    log.warn(`could not declare the ${APPS_EXTENSION} capability (register the viewer before connecting):`, e)
  }
}

/**
 * Register the prefab viewer as a `ui://` resource on an MCP server.
 *
 * Handles the MIME type, CSP on both listing and content item, HTML generation,
 * the `CacheableResult` fields and the Apps extension capability in one call.
 *
 * @example
 * ```ts
 * import { registerViewerResource, PREFAB_RESOURCE_URI, display } from '@maxhealth.tech/prefab/mcp'
 *
 * registerViewerResource(server)
 *
 * // The UI resource is attached to the tool DEFINITION via _meta.ui:
 * server.registerTool('browse', {
 *   title: 'Browse patients',
 *   inputSchema: { query: z.string() },
 *   _meta: { ui: { resourceUri: PREFAB_RESOURCE_URI } },
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
    // Handler-provided cache fields take precedence over any server hint, and
    // make the result spec-compliant on servers that fill in nothing.
    ttlMs: cache.ttlMs,
    cacheScope: cache.cacheScope,
  })

  // registerResource is the current API in both SDK generations; resource() is
  // the v1 overload that v2 dropped.
  const register = server.registerResource?.bind(server) ?? server.resource?.bind(server)
  if (register == null) {
    throw new TypeError('registerViewerResource: server exposes neither registerResource() nor resource()')
  }
  register(name, uri, config, handler)
}

