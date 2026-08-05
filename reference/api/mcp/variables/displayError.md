---
url: /prefab/reference/api/mcp/variables/displayError.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / displayError

# Variable: displayError

```ts
const displayError: (title, message, options?) => McpToolResult<PrefabWireFormat> = display_error;
```

Defined in: [mcp/display.ts:331](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/mcp/display.ts#L331)

MCP display helpers — return prefab UIs as MCP tool results.

Return a standardized error view as an MCP tool result.

Renders a destructive Alert with title + message, optional detail
code block, and optional hint. Sets `isError: true` on the MCP result.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `title` | `string` |
| `message` | `string` |
| `options?` | [`DisplayErrorOptions`](../interfaces/DisplayErrorOptions.md) |

## Returns

[`McpToolResult`](../type-aliases/McpToolResult.md)<`PrefabWireFormat`>

MCP tool result with error UI and isError flag.
