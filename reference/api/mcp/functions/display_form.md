---
url: /prefab/reference/api/mcp/functions/display_form.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / display\_form

# Function: display\_form()

MCP display helpers — return prefab UIs as MCP tool results.

## Call Signature

```ts
function display_form(
   fields, 
   submitTool, 
options?): McpDisplayResult<PrefabWireFormat>;
```

Defined in: [mcp/display.ts:162](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/display.ts#L162)

Return a form UI as an MCP tool result.

Submitting the form calls the specified MCP tool (via CallTool).
Field definitions map to Input components; the submit action
invokes `submitTool` with all field values.

With `elicit`, the same fields are returned as an `input_required` result for
hosts that render no UI of their own.

### Parameters

| Parameter | Type |
| ------ | ------ |
| `fields` | [`AutoFormField`](../../auto/interfaces/AutoFormField.md)\[] |
| `submitTool` | `string` |
| `options?` | [`DisplayFormOptions`](../interfaces/DisplayFormOptions.md) & `object` |

### Returns

[`McpDisplayResult`](../type-aliases/McpDisplayResult.md)<`PrefabWireFormat`>

MCP tool result with form prefab UI.

## Call Signature

```ts
function display_form(
   fields, 
   submitTool, 
   options): McpInputRequiredResult;
```

Defined in: [mcp/display.ts:167](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/display.ts#L167)

Return a form UI as an MCP tool result.

Submitting the form calls the specified MCP tool (via CallTool).
Field definitions map to Input components; the submit action
invokes `submitTool` with all field values.

With `elicit`, the same fields are returned as an `input_required` result for
hosts that render no UI of their own.

### Parameters

| Parameter | Type |
| ------ | ------ |
| `fields` | [`AutoFormField`](../../auto/interfaces/AutoFormField.md)\[] |
| `submitTool` | `string` |
| `options` | [`DisplayFormOptions`](../interfaces/DisplayFormOptions.md) & `object` |

### Returns

[`McpInputRequiredResult`](../type-aliases/McpInputRequiredResult.md)

MCP tool result with form prefab UI.
