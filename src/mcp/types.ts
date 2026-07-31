/**
 * MCP protocol types used by display helpers.
 *
 * These are structurally compatible with `@modelcontextprotocol/sdk`'s
 * `CallToolResult` — prefab display helpers can be returned directly from
 * SDK tool handlers without casting.
 *
 * @see https://spec.modelcontextprotocol.io/specification/server/tools/
 */

/** MCP text content block (compatible with SDK's TextContent) */
export interface McpTextContent {
  type: 'text'
  text: string
  annotations?: Record<string, unknown>
  _meta?: Record<string, unknown>
}

/** MCP image content block (compatible with SDK's ImageContent) */
export interface McpImageContent {
  type: 'image'
  data: string
  mimeType: string
  annotations?: Record<string, unknown>
  _meta?: Record<string, unknown>
}

/** Text resource contents (has `text`, never `blob`). */
export interface McpTextResourceContents {
  uri: string
  mimeType?: string
  text: string
  _meta?: Record<string, unknown>
}

/** Blob resource contents (has `blob`, never `text`). */
export interface McpBlobResourceContents {
  uri: string
  mimeType?: string
  blob: string
  _meta?: Record<string, unknown>
}

/** MCP embedded resource content block (compatible with SDK's EmbeddedResource) */
export interface McpResourceContent {
  type: 'resource'
  resource: McpTextResourceContents | McpBlobResourceContents
  annotations?: Record<string, unknown>
  _meta?: Record<string, unknown>
}

/** Any MCP content block */
export type McpContent = McpTextContent | McpImageContent | McpResourceContent

/**
 * MCP tool result — returned from tool handlers.
 *
 * Structurally assignable to the SDK's `CallToolResult`. The index signature
 * allows the SDK's `Result` base interface to be satisfied without a cast.
 *
 * `structuredContent` is generic rather than `Record<string, unknown>`: protocol
 * revision 2026-07-28 loosened it to any JSON value (SEP-2106), and keeping the
 * payload type lets callers read it back without casting.
 *
 * The wire discriminator `resultType` (SEP-2322) is intentionally absent. The
 * SDK's protocol layer stamps it on encode and strips it before results reach
 * consumers, so handlers do not author it for ordinary complete results. The
 * index signature still admits `resultType: 'input_required'` for the one case
 * a handler does own — multi-round-trip interim results.
 */
export interface McpToolResult<S = unknown> {
  content: McpContent[]
  /** Structured payload forwarded to MCP Apps iframes via ui/notifications/tool-result. */
  structuredContent?: S
  isError?: boolean
  _meta?: Record<string, unknown>
  [key: string]: unknown
}

// ── Cacheable results (SEP-2549, protocol revision 2026-07-28) ───────────────

/**
 * Cache scopes defined for cacheable results.
 *
 * `public` — the result may be stored by shared caches.
 * `private` — only the requesting client may cache it.
 */
export type McpCacheScope = 'public' | 'private'

/**
 * Cache fields required on results from the cacheable operations
 * (`tools/list`, `prompts/list`, `resources/list`, `resources/templates/list`,
 * `resources/read`, `server/discover`).
 *
 * Values a handler returns on the result take precedence over any hint
 * configured on the server; when neither is present the SDK falls back to the
 * conservative `{ ttlMs: 0, cacheScope: 'private' }` — i.e. no caching.
 */
export interface McpCacheHint {
  /** Cache lifetime in milliseconds. Must be a non-negative safe integer. */
  ttlMs?: number
  /** Whether shared caches may store the result. */
  cacheScope?: McpCacheScope
}

/**
 * A `resources/read` result carrying the required cache fields.
 *
 * Generic over the contents kind so a handler that only ever returns text (the
 * prefab viewer, for one) does not force callers to narrow the union.
 */
export interface McpResourceReadResult<
  C extends McpTextResourceContents | McpBlobResourceContents = McpTextResourceContents | McpBlobResourceContents,
> {
  contents: C[]
  /** Cache lifetime in milliseconds. */
  ttlMs: number
  /** Whether shared caches may store the result. */
  cacheScope: McpCacheScope
}
