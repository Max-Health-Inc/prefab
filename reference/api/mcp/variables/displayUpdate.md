---
url: /prefab/reference/api/mcp/variables/displayUpdate.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / displayUpdate

# Variable: displayUpdate

```ts
const displayUpdate: (state, options?) => McpToolResult<PrefabUpdateWire> = display_update;
```

Defined in: [mcp/display.ts:320](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/display.ts#L320)

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

[`McpToolResult`](../interfaces/McpToolResult.md)<[`PrefabUpdateWire`](../interfaces/PrefabUpdateWire.md)>

MCP tool result with a $prefab update payload.
