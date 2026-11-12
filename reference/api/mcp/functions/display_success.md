---
url: /prefab/reference/api/mcp/functions/display_success.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / display\_success

# Function: display\_success()

```ts
function display_success(
   title, 
   message, 
options?): McpDisplayResult<PrefabWireFormat>;
```

Defined in: [mcp/display.ts:336](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/display.ts#L336)

Return a standardized success view as an MCP tool result.

Renders a success Alert with title + message, optional detail text.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `title` | `string` |
| `message` | `string` |
| `options?` | [`DisplaySuccessOptions`](../interfaces/DisplaySuccessOptions.md) |

## Returns

[`McpDisplayResult`](../type-aliases/McpDisplayResult.md)<`PrefabWireFormat`>

MCP tool result with success UI.
