---
url: /prefab/reference/api/mcp/functions/display_error.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / display\_error

# Function: display\_error()

```ts
function display_error(
   title, 
   message, 
options?): McpDisplayResult<PrefabWireFormat>;
```

Defined in: [mcp/display.ts:285](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/display.ts#L285)

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

[`McpDisplayResult`](../type-aliases/McpDisplayResult.md)<`PrefabWireFormat`>

MCP tool result with error UI and isError flag.
