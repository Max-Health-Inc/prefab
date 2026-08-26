---
url: /prefab/reference/api/mcp/functions/display_update.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / display\_update

# Function: display\_update()

```ts
function display_update(state, options?): McpDisplayResult<PrefabUpdateWire>;
```

Defined in: [mcp/display.ts:245](https://github.com/Max-Health-Inc/prefab/blob/dc9055d700a7e96734dfd959d1cb775e88a3b293/src/mcp/display.ts#L245)

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

[`McpDisplayResult`](../type-aliases/McpDisplayResult.md)<[`PrefabUpdateWire`](../type-aliases/PrefabUpdateWire.md)>

MCP tool result with a $prefab update payload.
