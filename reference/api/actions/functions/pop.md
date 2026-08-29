---
url: /prefab/reference/api/actions/functions/pop.md
---
[@maxhealth.tech/prefab](../../index.md) / [actions](../index.md) / pop

# Function: pop()

```ts
function pop(target, indexOrValue?): PopState;
```

Defined in: [actions/sugar.ts:48](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/actions/sugar.ts#L48)

Remove an element from an array by index or value. Defaults to last element (-1).

## Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `target` | [`StateTarget`](../type-aliases/StateTarget.md) | `undefined` |
| `indexOrValue` | `string` | `number` | `-1` |

## Returns

[`PopState`](../classes/PopState.md)
