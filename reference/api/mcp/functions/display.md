---
url: /prefab/reference/api/mcp/functions/display.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / display

# Function: display()

```ts
function display(viewOrApp, options?): McpToolResult;
```

Defined in: [mcp/display.ts:70](https://github.com/Max-Health-Inc/prefab/blob/c512f3bb2fb808f4335797b98c7b93774e2b1b30/src/mcp/display.ts#L70)

Wrap a Component (or PrefabApp) as an MCP tool result.

If given a Component, it's wrapped in a PrefabApp automatically.
If given a PrefabApp, it's serialized as-is.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `viewOrApp` | `Component` | `PrefabApp` |
| `options?` | [`DisplayOptions`](../interfaces/DisplayOptions.md) |

## Returns

[`McpToolResult`](../interfaces/McpToolResult.md)

MCP tool result with the prefab wire format JSON as text content.
