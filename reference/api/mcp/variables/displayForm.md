---
url: /prefab/reference/api/mcp/variables/displayForm.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / displayForm

# Variable: displayForm

```ts
const displayForm: {
  (fields, submitTool, options?): McpDisplayResult<PrefabWireFormat>;
  (fields, submitTool, options): McpInputRequiredResult;
} = display_form;
```

Defined in: [mcp/display.ts:367](https://github.com/Max-Health-Inc/prefab/blob/dc9055d700a7e96734dfd959d1cb775e88a3b293/src/mcp/display.ts#L367)

MCP display helpers — return prefab UIs as MCP tool results.

## Call Signature

```ts
(
   fields, 
   submitTool, 
options?): McpDisplayResult<PrefabWireFormat>;
```

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
(
   fields, 
   submitTool, 
   options): McpInputRequiredResult;
```

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
