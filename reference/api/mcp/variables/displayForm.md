---
url: /prefab/reference/api/mcp/variables/displayForm.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / displayForm

# Variable: displayForm

```ts
const displayForm: (fields, submitTool, options?) => McpToolResult<PrefabWireFormat> = display_form;
```

Defined in: [mcp/display.ts:329](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/mcp/display.ts#L329)

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

[`McpToolResult`](../type-aliases/McpToolResult.md)<`PrefabWireFormat`>

MCP tool result with form prefab UI.
