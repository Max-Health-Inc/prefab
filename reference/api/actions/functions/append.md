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

Defined in: [actions/sugar.ts:43](https://github.com/Max-Health-Inc/prefab/blob/dc9055d700a7e96734dfd959d1cb775e88a3b293/src/actions/sugar.ts#L43)

Append an item to an array state value. Optionally specify insertion index.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `target` | [`StateTarget`](../type-aliases/StateTarget.md) |
| `item` | `unknown` |
| `index?` | `number` |

## Returns

[`AppendState`](../classes/AppendState.md)
