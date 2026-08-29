---
url: /prefab/reference/api/mcp/variables/displayError.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / displayError

# Variable: displayError

```ts
const displayError: (title, message, options?) => McpDisplayResult<PrefabWireFormat> = display_error;
```

Defined in: [mcp/display.ts:369](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/display.ts#L369)

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

[`McpDisplayResult`](../type-aliases/McpDisplayResult.md)<`PrefabWireFormat`>

MCP tool result with error UI and isError flag.
