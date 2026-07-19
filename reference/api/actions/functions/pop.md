---
url: /prefab/reference/api/actions/functions/pop.md
---
[@maxhealth.tech/prefab](../../index.md) / [actions](../index.md) / pop

# Function: pop()

```ts
function pop(target, indexOrValue?): PopState;
```

Defined in: [actions/sugar.ts:48](https://github.com/Max-Health-Inc/prefab/blob/0b875c7d37ce621a7701a86ade4497710f4b2a08/src/actions/sugar.ts#L48)

Remove an element from an array by index or value. Defaults to last element (-1).

## Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `target` | [`StateTarget`](../type-aliases/StateTarget.md) | `undefined` |
| `indexOrValue` | `string` | `number` | `-1` |

## Returns

[`PopState`](../classes/PopState.md)
