---
url: /prefab/reference/api/mcp/functions/toolResult.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / toolResult

# Function: toolResult()

```ts
function toolResult<T>(payload, options?): McpToolResult<T>;
```

Defined in: [mcp/result.ts:44](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/mcp/result.ts#L44)

Wrap a JSON payload as an MCP tool result.

The payload is serialized into `content[0].text` (for hosts and models that
read text) and passed through as `structuredContent` (for MCP Apps iframes,
which receive it via `ui/notifications/tool-result`).

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `payload` | `T` |
| `options?` | [`ToolResultOptions`](../interfaces/ToolResultOptions.md) |

## Returns

[`McpToolResult`](../type-aliases/McpToolResult.md)<`T`>

## Example

```ts
import { toolResult } from '@maxhealth.tech/prefab/mcp'

// Returning pre-built wire JSON from your own tool handler:
return toolResult(wireJson)
```
