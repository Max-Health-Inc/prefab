---
url: /prefab/reference/api/mcp/functions/formInputRequest.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / formInputRequest

# Function: formInputRequest()

```ts
function formInputRequest(fields, options?): McpInputRequiredResult;
```

Defined in: [mcp/input-required.ts:173](https://github.com/Max-Health-Inc/prefab/blob/605eb676dc900a2603365e87c9dd47f400d7af46/src/mcp/input-required.ts#L173)

Ask the client to collect these fields, then retry the call.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `fields` | [`AutoFormField`](../../auto/interfaces/AutoFormField.md)\[] |
| `options?` | [`FormInputRequestOptions`](../interfaces/FormInputRequestOptions.md) |

## Returns

[`McpInputRequiredResult`](../type-aliases/McpInputRequiredResult.md)

an `input_required` result, ready to return from a tool handler.
