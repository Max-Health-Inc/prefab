---
url: /prefab/reference/api/mcp/functions/formInputRequest.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / formInputRequest

# Function: formInputRequest()

```ts
function formInputRequest(fields, options?): McpInputRequiredResult;
```

Defined in: [mcp/input-required.ts:173](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/input-required.ts#L173)

Ask the client to collect these fields, then retry the call.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `fields` | [`AutoFormField`](../../auto/interfaces/AutoFormField.md)\[] |
| `options?` | [`FormInputRequestOptions`](../interfaces/FormInputRequestOptions.md) |

## Returns

[`McpInputRequiredResult`](../type-aliases/McpInputRequiredResult.md)

an `input_required` result, ready to return from a tool handler.
