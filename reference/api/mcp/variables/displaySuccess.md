---
url: /prefab/reference/api/mcp/variables/displaySuccess.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / displaySuccess

# Variable: displaySuccess

```ts
const displaySuccess: (title, message, options?) => McpDisplayResult<PrefabWireFormat> = display_success;
```

Defined in: [mcp/display.ts:370](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/display.ts#L370)

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

[`McpDisplayResult`](../type-aliases/McpDisplayResult.md)<`PrefabWireFormat`>

MCP tool result with success UI.
