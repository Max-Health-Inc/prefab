/**
 * MCP protocol types used by display helpers.
 *
 * These are structurally compatible with the SDK's `CallToolResult` and
 * `ReadResourceResult` — prefab helpers can be returned directly from SDK
 * handlers without casting.
 *
 * **Every shape here is a `type` alias, not an `interface`, and that is a
 * correctness requirement rather than a style choice.** The SDK's result types
 * are passthrough (`{ [x: string]: unknown }`), and TypeScript grants an
 * *implicit index signature* only to aliases of object types — never to
 * interfaces, whose key set is not final because declaration merging can reopen
 * them. An interface here therefore fails the one thing these types exist for:
 *
 *     Type 'McpResourceReadResult<…>' is not assignable to type '{ [x: string]: unknown; … }'.
 *       Index signature for type 'string' is missing in type 'McpResourceReadResult<…>'.
 *
 * `eslint.config.ts` flips `consistent-type-definitions` to `'type'` for this
 * file so the linter enforces that instead of fighting it, and
 * `test/mcp-types.test.ts` guards the assignability itself.
 *
 * @see https://github.com/microsoft/TypeScript/issues/15300
 * @see https://spec.modelcontextprotocol.io/specification/server/tools/
 */

/** MCP text content block (compatible with SDK's TextContent) */
export type McpTextContent = {
  type: 'text'
  text: string
  annotations?: Record<string, unknown>
  _meta?: Record<string, unknown>
}

/** MCP image content block (compatible with SDK's ImageContent) */
export type McpImageContent = {
  type: 'image'
  data: string
  mimeType: string
  annotations?: Record<string, unknown>
  _meta?: Record<string, unknown>
}

/**
 * Text resource contents (has `text`, never `blob`).
 *
 * Declared as a type alias, not an interface, and the difference is load-bearing.
 * The SDK's resource types are passthrough (`{ [x: string]: unknown }`), and
 * TypeScript grants an *implicit index signature* only to type aliases of object
 * types — never to interfaces, since an interface can be reopened by declaration
 * merging and so its key set is not final. Declaring this as an interface makes
 * it fail to satisfy the SDK's shape with "Index signature for type 'string' is
 * missing", which a consumer can only work around by casting.
 */
export type McpTextResourceContents = {
  uri: string
  mimeType?: string
  text: string
  _meta?: Record<string, unknown>
}

/** Blob resource contents (has `blob`, never `text`). See {@link McpTextResourceContents} on the alias. */
export type McpBlobResourceContents = {
  uri: string
  mimeType?: string
  blob: string
  _meta?: Record<string, unknown>
}

/** MCP embedded resource content block (compatible with SDK's EmbeddedResource) */
export type McpResourceContent = {
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
export type McpToolResult<S = unknown> = {
  content: McpContent[]
  /** Structured payload forwarded to MCP Apps iframes via ui/notifications/tool-result. */
  structuredContent?: S
  isError?: boolean
  _meta?: Record<string, unknown>
  [key: string]: unknown
}

/**
 * A tool result whose `structuredContent` is guaranteed present.
 *
 * `McpToolResult.structuredContent` is optional because a hand-written result
 * may legitimately omit it. Every prefab display helper populates it, and
 * saying so in the return type spares callers a null check on a field that is
 * never absent — reading `result.structuredContent.view` should not need one.
 *
 * Assignable to `McpToolResult<S>` in every position, so widening a helper's
 * return type to this breaks nothing.
 */
export type McpDisplayResult<S> = McpToolResult<S> & { structuredContent: S }

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
export type McpCacheHint = {
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
 *
 * A type alias rather than an interface, so it satisfies the SDK's passthrough
 * `ReadResourceResult` (`{ [x: string]: unknown }`) without a cast. See
 * {@link McpTextResourceContents} for why the distinction matters — returning
 * this straight from an SDK read handler is the whole point of the type, and as
 * an interface it did not typecheck there.
 */
export type McpResourceReadResult<
  C extends McpTextResourceContents | McpBlobResourceContents = McpTextResourceContents | McpBlobResourceContents,
> = {
  contents: C[]
  /** Cache lifetime in milliseconds. */
  ttlMs: number
  /** Whether shared caches may store the result. */
  cacheScope: McpCacheScope
}

// ── Multi Round-Trip (protocol revision 2026-07-28) ──────────────────────────

/**
 * The restricted JSON Schema an elicitation may request.
 *
 * Protocol revision 2026-07-28 replaced server-initiated `elicitation/create`
 * pushes with Multi Round-Trip Requests: a handler *returns* an
 * {@link McpInputRequiredResult}, the client answers the embedded requests and
 * retries the original call. The schema is deliberately flat — top-level
 * primitive properties only, no nesting — because it has to render as a form in
 * hosts that have no UI surface of their own.
 */
export type McpStringSchema = {
  type: 'string'
  title?: string
  description?: string
  minLength?: number
  maxLength?: number
  format?: 'email' | 'uri' | 'date' | 'date-time'
  default?: string
}

export type McpNumberSchema = {
  type: 'number' | 'integer'
  title?: string
  description?: string
  minimum?: number
  maximum?: number
  default?: number
}

export type McpBooleanSchema = {
  type: 'boolean'
  title?: string
  description?: string
  default?: boolean
}

/** Single selection: a string constrained to a fixed set of values. */
export type McpEnumSchema = {
  type: 'string'
  title?: string
  description?: string
  enum: string[]
  default?: string
}

/** Multiple selection: an array of values drawn from a fixed set. */
export type McpMultiEnumSchema = {
  type: 'array'
  title?: string
  description?: string
  minItems?: number
  maxItems?: number
  items: { type: 'string'; enum: string[] }
  default?: string[]
}

export type McpPrimitiveSchema =
  | McpStringSchema
  | McpNumberSchema
  | McpBooleanSchema
  | McpEnumSchema
  | McpMultiEnumSchema

/** The flat object schema an `elicitation/create` request asks the client to fill. */
export type McpRestrictedSchema = {
  type: 'object'
  properties: Record<string, McpPrimitiveSchema>
  required?: string[]
}

/** Form-mode elicitation: the client renders the schema and returns the values. */
export type McpElicitFormRequest = {
  method: 'elicitation/create'
  params: {
    mode?: 'form'
    message: string
    requestedSchema: McpRestrictedSchema
  }
}

/** URL-mode elicitation: the client sends the user out of band and reports back. */
export type McpElicitUrlRequest = {
  method: 'elicitation/create'
  params: {
    mode: 'url'
    message: string
    url: string
  }
}

export type McpElicitRequest = McpElicitFormRequest | McpElicitUrlRequest

/** Server-issued requests the client must fulfil before retrying the call. */
export type McpInputRequests = Record<string, McpElicitRequest>

/** What the client sends back for one request, keyed the same way. */
export type McpElicitResult = {
  action: 'accept' | 'decline' | 'cancel'
  content?: Record<string, string | number | boolean | string[]>
}

export type McpInputResponses = Record<string, McpElicitResult>

/**
 * A result asking the client for input before the call can complete.
 *
 * At least one of `inputRequests` or `requestState` must be present, and
 * `resultType` must be `'input_required'`: a server on this revision always
 * stamps the discriminator, and a client that does not see it treats the result
 * as `'complete'` and never retries.
 */
export type McpInputRequiredResult = {
  resultType: 'input_required'
  inputRequests?: McpInputRequests
  /** Opaque state echoed back byte-for-byte on the retry. */
  requestState?: string
  _meta?: Record<string, unknown>
}
