---
url: /prefab/reference/api/mcp/functions/inputResponse.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / inputResponse

# Function: inputResponse()

```ts
function inputResponse(responses, key): McpElicitResult | undefined;
```

Defined in: [mcp/input-required.ts:202](https://github.com/Max-Health-Inc/prefab/blob/dc9055d700a7e96734dfd959d1cb775e88a3b293/src/mcp/input-required.ts#L202)

A client's answer for one key, or `undefined` when it has not arrived yet.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `responses` | [`McpInputResponses`](../type-aliases/McpInputResponses.md) | `undefined` |
| `key` | `string` |

## Returns

[`McpElicitResult`](../type-aliases/McpElicitResult.md) | `undefined`
