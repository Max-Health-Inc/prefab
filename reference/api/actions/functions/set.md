---
url: /prefab/reference/api/actions/functions/set.md
---
[@maxhealth.tech/prefab](../../index.md) / [actions](../index.md) / set

# Function: set()

```ts
function set(
   target, 
   value, 
   opts?): SetState;
```

Defined in: [actions/sugar.ts:33](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/actions/sugar.ts#L33)

Set a state value. `set(signal, value)` → `new SetState(signal.key, value)`

## Parameters

| Parameter | Type |
| ------ | ------ |
| `target` | [`StateTarget`](../type-aliases/StateTarget.md) |
| `value` | `unknown` |
| `opts?` | [`SetStateOpts`](../interfaces/SetStateOpts.md) |

## Returns

[`SetState`](../classes/SetState.md)
