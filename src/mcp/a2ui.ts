/**
 * A2UI over MCP (`a2ui://`): the UI description as `application/a2ui+json`, drawn by the host's own A2UI renderer,
 * where `ui://` ships prefab's renderer in an iframe. See https://a2ui.org/guides/a2ui_over_mcp/.
 */

import { PrefabApp } from '../app.js'
import type { Component } from '../core/component.js'
import { createLogger } from '../core/logger.js'
import { emitA2UI, type A2uiEmitOptions } from '../a2ui/emit.js'
import { A2UI_MIME, A2UI_SCHEME, type A2uiDiagnostic, type A2uiMessage, type A2uiMessageList } from '../a2ui/types.js'
import type {
  McpCacheHint,
  McpDisplayResult,
  McpResourceContent,
  McpResourceReadResult,
  McpTextResourceContents,
} from './types.js'
import { resolveCache, type McpServerLike, type ResourceConfig } from './resource.js'

const log = createLogger('a2ui')

/** A surface is rebuilt on every read, so it is not cached unless the caller says so. */
const DEFAULT_SURFACE_CACHE: Required<McpCacheHint> = { ttlMs: 0, cacheScope: 'private' }

/** Default URI for a server that serves a single A2UI surface. */
export const A2UI_RESOURCE_URI = `${A2UI_SCHEME}prefab/surface`

/** Wrap messages in the list envelope A2UI defines for non-streaming transports. */
export function a2uiPayload(messages: A2uiMessage[]): A2uiMessageList {
  return { messages }
}

// ── display_a2ui() ───────────────────────────────────────────────────────────

export interface DisplayA2uiOptions extends A2uiEmitOptions {
  /** URI stamped on the embedded resource. @default 'a2ui://prefab/surface' */
  uri?: string
  /** Called with anything lost in translation; without it, `degraded` and `unsupported` diagnostics are logged as warnings. */
  onDiagnostics?: (diagnostics: A2uiDiagnostic[]) => void
}

function reportDiagnostics(diagnostics: A2uiDiagnostic[], options?: DisplayA2uiOptions): void {
  if (diagnostics.length === 0) return
  if (options?.onDiagnostics != null) {
    options.onDiagnostics(diagnostics)
    return
  }
  for (const d of diagnostics) {
    if (d.kind === 'degraded' || d.kind === 'unsupported') log.warn(`${d.kind}: ${d.subject} — ${d.detail}`)
  }
}

/**
 * A view as an A2UI tool result: an `EmbeddedResource` in `content`, and the same payload as `structuredContent`.
 *
 * @example
 * ```ts
 * import { display_a2ui } from '@maxhealth.tech/prefab/mcp'
 * import { autoTable } from '@maxhealth.tech/prefab'
 *
 * server.registerTool('list-users', schema, async () =>
 *   display_a2ui(autoTable(await db.users())))
 * ```
 */
export function display_a2ui(
  viewOrApp: Component | PrefabApp,
  options?: DisplayA2uiOptions,
): McpDisplayResult<A2uiMessageList> {
  const app = viewOrApp instanceof PrefabApp ? viewOrApp : new PrefabApp({ view: viewOrApp })
  const { messages, diagnostics } = emitA2UI(app.toJSON(), options)
  reportDiagnostics(diagnostics, options)

  const payload = a2uiPayload(messages)
  const uri = options?.uri ?? A2UI_RESOURCE_URI
  const embedded: McpResourceContent = {
    type: 'resource',
    resource: { uri, mimeType: A2UI_MIME, text: JSON.stringify(payload) },
  }

  return { content: [embedded], structuredContent: payload }
}

// ── registerA2uiResource() ───────────────────────────────────────────────────

export interface A2uiResourceOptions extends A2uiEmitOptions {
  /** Resource URI. Must start with `a2ui://`. @default 'a2ui://prefab/surface' */
  uri?: string
  /** Resource title shown in listings. @default 'Prefab Surface' */
  title?: string
  /** Human-readable description for the listing. */
  description?: string
  /** Cache fields for the `resources/read` result (SEP-2549). */
  cache?: McpCacheHint
  /** See {@link DisplayA2uiOptions.onDiagnostics}. */
  onDiagnostics?: (diagnostics: A2uiDiagnostic[]) => void
}

/**
 * Register an A2UI surface that does not depend on the conversation as an `a2ui://` resource; `builder` runs on every read.
 * Per-call views belong in {@link display_a2ui}.
 *
 * @example
 * ```ts
 * import { registerA2uiResource } from '@maxhealth.tech/prefab/mcp'
 * import { Column, H1, Input } from '@maxhealth.tech/prefab'
 *
 * registerA2uiResource(server, () => Column({ children: [H1('Settings'), Input({ name: 'key', label: 'API key' })] }))
 * ```
 */
export function registerA2uiResource(
  server: McpServerLike,
  builder: () => Component | PrefabApp,
  options?: A2uiResourceOptions,
): void {
  const uri = options?.uri ?? A2UI_RESOURCE_URI
  if (!uri.startsWith(A2UI_SCHEME)) {
    throw new TypeError(`registerA2uiResource: uri must start with "${A2UI_SCHEME}", got "${uri}"`)
  }

  const title = options?.title ?? 'Prefab Surface'
  const name = uri.slice(A2UI_SCHEME.length).replace(/\//g, '-')

  const cache = resolveCache(options?.cache, DEFAULT_SURFACE_CACHE)
  const config: ResourceConfig = {
    title,
    mimeType: A2UI_MIME,
    ...(options?.description != null && { description: options.description }),
    cacheHint: cache,
  }

  const handler = (resourceUri: URL): Promise<McpResourceReadResult<McpTextResourceContents>> => {
    const built = builder()
    const app = built instanceof PrefabApp ? built : new PrefabApp({ view: built })
    const { messages, diagnostics } = emitA2UI(app.toJSON(), options)
    reportDiagnostics(diagnostics, options)

    return Promise.resolve({
      contents: [{
        uri: resourceUri.toString(),
        mimeType: A2UI_MIME,
        text: JSON.stringify(a2uiPayload(messages)),
      }],
      ttlMs: cache.ttlMs,
      cacheScope: cache.cacheScope,
    })
  }

  const register = server.registerResource?.bind(server) ?? server.resource?.bind(server)
  if (register == null) {
    throw new TypeError('registerA2uiResource: server exposes neither registerResource() nor resource()')
  }
  register(name, uri, config, handler)
}

/** camelCase alias, matching the other display helpers. */
export const displayA2ui = display_a2ui
