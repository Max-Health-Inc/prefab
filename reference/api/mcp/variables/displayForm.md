---
url: /prefab/reference/api/mcp/variables/displayForm.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / displayForm

# Variable: displayForm

```ts
const displayForm: (fields, submitTool, options?) => McpToolResult = display_form;
```

Defined in: [mcp/display.ts:340](https://github.com/Max-Health-Inc/prefab/blob/c512f3bb2fb808f4335797b98c7b93774e2b1b30/src/mcp/display.ts#L340)

MCP display helpers — return prefab UIs as MCP tool results.

Return a form UI as an MCP tool result.

The form submits back to the specified MCP tool via CallTool.
Field definitions map to Input components; the submit action
invokes `submitTool` with all field values.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `fields` | [`AutoFormField`](../../auto/interfaces/AutoFormField.md)\[] |
| `submitTool` | `string` |
| `options?` | [`DisplayFormOptions`](../interfaces/DisplayFormOptions.md) |

## Returns

[`McpToolResult`](../interfaces/McpToolResult.md)

MCP tool result with form prefab UI.
