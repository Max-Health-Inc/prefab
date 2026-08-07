---
url: /prefab/reference/api/mcp/functions/display_error.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / display\_error

# Function: display\_error()

```ts
function display_error(
   title, 
   message, 
options?): McpToolResult<PrefabWireFormat>;
```

Defined in: [mcp/display.ts:247](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/mcp/display.ts#L247)

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
