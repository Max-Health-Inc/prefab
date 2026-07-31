---
url: /prefab/reference/api/mcp/functions/display_update.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / display\_update

# Function: display\_update()

```ts
function display_update(state, options?): McpToolResult<PrefabUpdateWire>;
```

Defined in: [mcp/display.ts:197](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/display.ts#L197)

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

[`McpToolResult`](../interfaces/McpToolResult.md)<[`PrefabUpdateWire`](../interfaces/PrefabUpdateWire.md)>

MCP tool result with a $prefab update payload.
