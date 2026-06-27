---
url: /prefab/reference/api/mcp/functions/display_error.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / display\_error

# Function: display\_error()

```ts
function display_error(
   title, 
   message, 
   options?): McpToolResult;
```

Defined in: [mcp/display.ts:249](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/mcp/display.ts#L249)

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
