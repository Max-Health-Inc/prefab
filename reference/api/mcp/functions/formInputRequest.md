---
url: /prefab/reference/api/mcp/functions/formInputRequest.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / formInputRequest

# Function: formInputRequest()

```ts
function formInputRequest(fields, options?): McpInputRequiredResult;
```

Defined in: [mcp/input-required.ts:166](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/mcp/input-required.ts#L166)

Ask the client to collect these fields, then retry the call.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `fields` | [`AutoFormField`](../../auto/interfaces/AutoFormField.md)\[] |
| `options?` | [`FormInputRequestOptions`](../interfaces/FormInputRequestOptions.md) |

## Returns

[`McpInputRequiredResult`](../type-aliases/McpInputRequiredResult.md)

an `input_required` result, ready to return from a tool handler.
