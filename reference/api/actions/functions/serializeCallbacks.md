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

Defined in: [actions/types.ts:20](https://github.com/Max-Health-Inc/prefab/blob/c0cfbec14aa21a1c1e0bc95f1b172db8df096fe0/src/actions/types.ts#L20)

Serialize one or more actions to their JSON form.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `actions` | | [`Action`](../interfaces/Action.md) | [`Action`](../interfaces/Action.md)\[] |

## Returns

| [`ActionJSON`](../interfaces/ActionJSON.md)
| [`ActionJSON`](../interfaces/ActionJSON.md)\[]
