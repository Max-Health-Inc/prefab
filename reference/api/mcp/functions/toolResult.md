---
url: /prefab/reference/api/mcp/functions/toolResult.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / toolResult

# Function: toolResult()

```ts
function toolResult<T>(payload, options?): McpDisplayResult<T>;
```

Defined in: [mcp/result.ts:21](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/mcp/result.ts#L21)

Wrap a JSON payload as an MCP tool result: serialized into `content[0].text` and passed through as `structuredContent`.

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

[`McpDisplayResult`](../type-aliases/McpDisplayResult.md)<`T`>

## Example

```ts
import { toolResult } from '@maxhealth.tech/prefab/mcp'

// Returning pre-built wire JSON from your own tool handler:
return toolResult(wireJson)
```
