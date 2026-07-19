---
url: /prefab/reference/api/actions/functions/append.md
---
[@maxhealth.tech/prefab](../../index.md) / [actions](../index.md) / append

# Function: append()

```ts
function append(
   target, 
   item, 
   index?): AppendState;
```

Defined in: [actions/sugar.ts:43](https://github.com/Max-Health-Inc/prefab/blob/c512f3bb2fb808f4335797b98c7b93774e2b1b30/src/actions/sugar.ts#L43)

Append an item to an array state value. Optionally specify insertion index.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `target` | [`StateTarget`](../type-aliases/StateTarget.md) |
| `item` | `unknown` |
| `index?` | `number` |

## Returns

[`AppendState`](../classes/AppendState.md)
