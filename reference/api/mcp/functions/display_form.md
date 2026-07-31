---
url: /prefab/reference/api/mcp/functions/display_form.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / display\_form

# Function: display\_form()

```ts
function display_form(
   fields, 
   submitTool, 
options?): McpToolResult<PrefabWireFormat>;
```

Defined in: [mcp/display.ts:144](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/display.ts#L144)

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
