---
url: /prefab/reference/api/actions/functions/serializeCallbacks.md
---
[@maxhealth.tech/prefab](../../index.md) / [actions](../index.md) / serializeCallbacks

# Function: serializeCallbacks()

```ts
function serializeCallbacks(actions): 
  | ActionJSON
  | ActionJSON[];
```

Defined in: [actions/types.ts:20](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/actions/types.ts#L20)

Serialize one or more actions to their JSON form.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `actions` | | [`Action`](../interfaces/Action.md) | [`Action`](../interfaces/Action.md)\[] |

## Returns

| [`ActionJSON`](../interfaces/ActionJSON.md)
| [`ActionJSON`](../interfaces/ActionJSON.md)\[]
