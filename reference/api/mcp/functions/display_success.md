---
url: /prefab/reference/api/mcp/functions/display_success.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / display\_success

# Function: display\_success()

```ts
function display_success(
   title, 
   message, 
options?): McpToolResult<PrefabWireFormat>;
```

Defined in: [mcp/display.ts:298](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/mcp/display.ts#L298)

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
