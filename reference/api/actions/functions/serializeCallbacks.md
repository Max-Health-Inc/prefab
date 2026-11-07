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

Defined in: [actions/types.ts:20](https://github.com/Max-Health-Inc/prefab/blob/1890bd36e825570eeb35b14d1f5a0235caa2c0fb/src/actions/types.ts#L20)

Serialize one or more actions to their JSON form.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `actions` | | [`Action`](../interfaces/Action.md) | [`Action`](../interfaces/Action.md)\[] |

## Returns

| [`ActionJSON`](../interfaces/ActionJSON.md)
| [`ActionJSON`](../interfaces/ActionJSON.md)\[]
