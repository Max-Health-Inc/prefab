---
url: /prefab/reference/api/mcp/variables/displayError.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / displayError

# Variable: displayError

```ts
const displayError: (title, message, options?) => McpToolResult = display_error;
```

Defined in: [mcp/display.ts:342](https://github.com/Max-Health-Inc/prefab/blob/88d9aa00d6a50ef0286767079c6345c808f6a0a9/src/mcp/display.ts#L342)

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

[`McpToolResult`](../interfaces/McpToolResult.md)

MCP tool result with error UI and isError flag.
