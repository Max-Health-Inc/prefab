---
url: /prefab/reference/api/mcp/functions/display_success.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / display\_success

# Function: display\_success()

```ts
function display_success(
   title, 
   message, 
   options?): McpToolResult;
```

Defined in: [mcp/display.ts:305](https://github.com/Max-Health-Inc/prefab/blob/a35624be6562c3c7b129e80c58368ed6939e09e3/src/mcp/display.ts#L305)

Return a standardized success view as an MCP tool result.

Renders a success Alert with title + message, optional detail text.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `title` | `string` |
| `message` | `string` |
| `options?` | [`DisplaySuccessOptions`](../interfaces/DisplaySuccessOptions.md) |

## Returns

[`McpToolResult`](../interfaces/McpToolResult.md)

MCP tool result with success UI.
