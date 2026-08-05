---
url: /prefab/reference/api/mcp/variables/displaySuccess.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / displaySuccess

# Variable: displaySuccess

```ts
const displaySuccess: (title, message, options?) => McpToolResult<PrefabWireFormat> = display_success;
```

Defined in: [mcp/display.ts:332](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/mcp/display.ts#L332)

MCP display helpers — return prefab UIs as MCP tool results.

Return a standardized success view as an MCP tool result.

Renders a success Alert with title + message, optional detail text.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `title` | `string` |
| `message` | `string` |
| `options?` | [`DisplaySuccessOptions`](../interfaces/DisplaySuccessOptions.md) |

## Returns

[`McpToolResult`](../type-aliases/McpToolResult.md)<`PrefabWireFormat`>

MCP tool result with success UI.
