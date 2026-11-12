---
url: /prefab/reference/api/mcp/functions/inputResponse.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / inputResponse

# Function: inputResponse()

```ts
function inputResponse(responses, key): McpElicitResult | undefined;
```

Defined in: [mcp/input-required.ts:195](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/input-required.ts#L195)

A client's answer for one key, or `undefined` when it has not arrived yet.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `responses` | [`McpInputResponses`](../type-aliases/McpInputResponses.md) | `undefined` |
| `key` | `string` |

## Returns

[`McpElicitResult`](../type-aliases/McpElicitResult.md) | `undefined`
