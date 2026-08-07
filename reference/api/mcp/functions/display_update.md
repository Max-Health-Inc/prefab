---
url: /prefab/reference/api/mcp/functions/display_update.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / display\_update

# Function: display\_update()

```ts
function display_update(state, options?): McpToolResult<PrefabUpdateWire>;
```

Defined in: [mcp/display.ts:207](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/mcp/display.ts#L207)

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

[`McpToolResult`](../type-aliases/McpToolResult.md)<[`PrefabUpdateWire`](../type-aliases/PrefabUpdateWire.md)>

MCP tool result with a $prefab update payload.
