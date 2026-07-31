---
url: /prefab/reference/api/mcp/variables/displayForm.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / displayForm

# Variable: displayForm

```ts
const displayForm: (fields, submitTool, options?) => McpToolResult<PrefabWireFormat> = display_form;
```

Defined in: [mcp/display.ts:319](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/display.ts#L319)

MCP display helpers — return prefab UIs as MCP tool results.

Return a form UI as an MCP tool result.

Submitting the form calls the specified MCP tool (via CallTool).
Field definitions map to Input components; the submit action
invokes `submitTool` with all field values.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `fields` | [`AutoFormField`](../../auto/interfaces/AutoFormField.md)\[] |
| `submitTool` | `string` |
| `options?` | [`DisplayFormOptions`](../interfaces/DisplayFormOptions.md) |

## Returns

[`McpToolResult`](../interfaces/McpToolResult.md)<`PrefabWireFormat`>

MCP tool result with form prefab UI.
