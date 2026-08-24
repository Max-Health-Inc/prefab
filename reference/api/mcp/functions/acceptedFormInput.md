---
url: /prefab/reference/api/mcp/functions/acceptedFormInput.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / acceptedFormInput

# Function: acceptedFormInput()

```ts
function acceptedFormInput(
   responses, 
   key, 
   fields): 
  | Record<string, FormValue>
  | undefined;
```

Defined in: [mcp/input-required.ts:223](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/mcp/input-required.ts#L223)

Read and check an accepted form answer.

`inputResponses` comes from the client and is untrusted, so the content is
checked against the same field list that produced the schema: unknown keys
are dropped, wrong types are rejected, and a missing required field fails the
whole answer. A declined or cancelled elicitation returns `undefined` exactly
like a first entry — re-requesting is only the right move for all three when
the request is idempotent, so read [inputResponse](inputResponse.md) directly when a
refusal has to be told apart from a first pass.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `responses` | [`McpInputResponses`](../type-aliases/McpInputResponses.md) | `undefined` |
| `key` | `string` |
| `fields` | [`AutoFormField`](../../auto/interfaces/AutoFormField.md)\[] |

## Returns

| `Record`<`string`, [`FormValue`](../type-aliases/FormValue.md)>
| `undefined`
