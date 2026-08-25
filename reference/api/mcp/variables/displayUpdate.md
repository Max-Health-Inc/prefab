---
url: /prefab/reference/api/mcp/variables/displayUpdate.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / displayUpdate

# Variable: displayUpdate

```ts
const displayUpdate: (state, options?) => McpDisplayResult<PrefabUpdateWire> = display_update;
```

Defined in: [mcp/display.ts:368](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/display.ts#L368)

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

[`McpDisplayResult`](../type-aliases/McpDisplayResult.md)<[`PrefabUpdateWire`](../type-aliases/PrefabUpdateWire.md)>

MCP tool result with a $prefab update payload.
