---
url: /prefab/reference/api/mcp/functions/display.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / display

# Function: display()

```ts
function display(viewOrApp, options?): McpToolResult<PrefabWireFormat>;
```

Defined in: [mcp/display.ts:71](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/mcp/display.ts#L71)

Wrap a Component (or PrefabApp) as an MCP tool result.

If given a Component, it's wrapped in a PrefabApp automatically.
If given a PrefabApp, it's serialized as-is.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `viewOrApp` | `Component` | `PrefabApp` |
| `options?` | [`DisplayOptions`](../interfaces/DisplayOptions.md) |

## Returns

[`McpToolResult`](../type-aliases/McpToolResult.md)<`PrefabWireFormat`>

MCP tool result with the prefab wire format JSON as text content.
