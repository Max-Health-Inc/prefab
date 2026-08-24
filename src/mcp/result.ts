/**
 * MCP tool-result envelope.
 *
 * Every prefab display helper returns the same shape: the wire JSON as a text
 * content block plus `structuredContent` for MCP Apps hosts to hand to the
 * iframe. Building that envelope in one place keeps the `display_*` builders
 * identical by construction.
 *
 * `structuredContent` is typed through the generic rather than widened to
 * `Record<string, unknown>`, so callers keep the wire type and no cast is
 * needed anywhere (protocol revision 2026-07-28 loosened the field to any JSON
 * value — SEP-2106).
 *
 * `resultType` (SEP-2322) is deliberately NOT set here. It is a wire-only
 * discriminator owned by the SDK's protocol layer: `@modelcontextprotocol/server`
 * stamps it at its 2026-era encode seam and strips it before results reach
 * consumers, which is why its public result types do not declare it.
 *
 * The one handler-authored case is `resultType: 'input_required'`, which a
 * completed result never carries. That case is built by `./input-required.ts`
 * and returned instead of a tool result, so it never travels through here.
 */

import type { McpDisplayResult } from './types.js'

export interface ToolResultOptions {
  /** Flag the result as failed (hosts render it as a tool error). */
  isError?: boolean
}

/**
 * Wrap a JSON payload as an MCP tool result.
 *
 * The payload is serialized into `content[0].text` (for hosts and models that
 * read text) and passed through as `structuredContent` (for MCP Apps iframes,
 * which receive it via `ui/notifications/tool-result`).
 *
 * @example
 * ```ts
 * import { toolResult } from '@maxhealth.tech/prefab/mcp'
 *
 * // Returning pre-built wire JSON from your own tool handler:
 * return toolResult(wireJson)
 * ```
 */
export function toolResult<T>(payload: T, options?: ToolResultOptions): McpDisplayResult<T> {
  const result: McpDisplayResult<T> = {
    content: [{ type: 'text', text: JSON.stringify(payload) }],
    structuredContent: payload,
  }
  if (options?.isError) result.isError = true
  return result
}
