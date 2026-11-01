/**
 * MCP result types assignable to the SDK's without a cast. All are `type` aliases on purpose: only aliases get the implicit
 * index signature the SDK's passthrough types require (TypeScript#15300); `test/mcp-types.test.ts` guards it.
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

/** Text resource contents (has `text`, never `blob`). */
export type McpTextResourceContents = {
  uri: string
  mimeType?: string
  text: string
  _meta?: Record<string, unknown>
}

/** Blob resource contents (has `blob`, never `text`). */
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

/** A tool result assignable to the SDK's `CallToolResult`; `structuredContent` keeps its payload type (any JSON since SEP-2106). */
export type McpToolResult<S = unknown> = {
  content: McpContent[]
  /** Structured payload forwarded to MCP Apps iframes via ui/notifications/tool-result. */
  structuredContent?: S
  isError?: boolean
  _meta?: Record<string, unknown>
  [key: string]: unknown
}

/** A tool result whose `structuredContent` is always present, as every prefab display helper returns. */
export type McpDisplayResult<S> = McpToolResult<S> & { structuredContent: S }

// ── Cacheable results (SEP-2549, protocol revision 2026-07-28) ───────────────

/** `public`: shared caches may store the result; `private`: only the requesting client may. */
export type McpCacheScope = 'public' | 'private'

/** Cache fields of cacheable results (SEP-2549). The result's own values beat a server hint; with neither, nothing is cached. */
export type McpCacheHint = {
  /** Cache lifetime in milliseconds. Must be a non-negative safe integer. */
  ttlMs?: number
  /** Whether shared caches may store the result. */
  cacheScope?: McpCacheScope
}

/** A `resources/read` result with its required cache fields, generic over the contents kind. */
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

/** A flat elicitation property schema, for {@link McpInputRequiredResult} (Multi Round-Trip, revision 2026-07-28). */
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

/** A result asking for input before the call completes; carries `inputRequests`, `requestState` or both. */
export type McpInputRequiredResult = {
  resultType: 'input_required'
  inputRequests?: McpInputRequests
  /** Opaque state echoed back byte-for-byte on the retry. */
  requestState?: string
  _meta?: Record<string, unknown>
}
