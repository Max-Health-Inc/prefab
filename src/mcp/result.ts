/** The one tool-result envelope every `display_*` helper returns. `resultType` (SEP-2322) is left to the SDK, which stamps it on encode. */

import type { McpDisplayResult } from './types.js'

export interface ToolResultOptions {
  /** Flag the result as failed (hosts render it as a tool error). */
  isError?: boolean
}

/**
 * Wrap a JSON payload as an MCP tool result: serialized into `content[0].text` and passed through as `structuredContent`.
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
