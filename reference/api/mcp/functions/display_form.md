---
url: /prefab/reference/api/mcp/functions/display_form.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / display\_form

# Function: display\_form()

```ts
function display_form(
   fields, 
   submitTool, 
   options?): McpToolResult;
```

Defined in: [mcp/display.ts:147](https://github.com/Max-Health-Inc/prefab/blob/de93a446678c2f2b8a07006b7acfdb8a5f593717/src/mcp/display.ts#L147)

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
