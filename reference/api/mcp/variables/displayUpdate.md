---
url: /prefab/reference/api/mcp/variables/displayUpdate.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / displayUpdate

# Variable: displayUpdate

```ts
const displayUpdate: (state, options?) => McpToolResult = display_update;
```

Defined in: [mcp/display.ts:341](https://github.com/Max-Health-Inc/prefab/blob/89a71686ef8a402c953104a66e893262cc245e62/src/mcp/display.ts#L341)

MCP display helpers — return prefab UIs as MCP tool results.

Return a partial state update for an existing prefab UI.

Instead of re-rendering the entire UI, this sends a state delta
that the renderer merges into its reactive store. Optionally fires
actions after the state is applied.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `state` | `Record`<`string`, `unknown`> |
| `options?` | [`DisplayUpdateOptions`](../interfaces/DisplayUpdateOptions.md) |

## Returns

[`McpToolResult`](../interfaces/McpToolResult.md)

MCP tool result with a $prefab update payload.
