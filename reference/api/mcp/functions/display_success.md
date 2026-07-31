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

Defined in: [mcp/display.ts:288](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/display.ts#L288)

Return a standardized success view as an MCP tool result.

Renders a success Alert with title + message, optional detail text.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `title` | `string` |
| `message` | `string` |
| `options?` | [`DisplaySuccessOptions`](../interfaces/DisplaySuccessOptions.md) |

## Returns

[`McpToolResult`](../interfaces/McpToolResult.md)<`PrefabWireFormat`>

MCP tool result with success UI.
