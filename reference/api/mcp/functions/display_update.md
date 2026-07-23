---
url: /prefab/reference/api/mcp/functions/display_update.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / display\_update

# Function: display\_update()

```ts
function display_update(state, options?): McpToolResult;
```

Defined in: [mcp/display.ts:204](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/mcp/display.ts#L204)

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
