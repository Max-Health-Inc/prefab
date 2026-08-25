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

Defined in: [actions/sugar.ts:33](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/actions/sugar.ts#L33)

Set a state value. `set(signal, value)` → `new SetState(signal.key, value)`

## Parameters

| Parameter | Type |
| ------ | ------ |
| `target` | [`StateTarget`](../type-aliases/StateTarget.md) |
| `value` | `unknown` |
| `opts?` | [`SetStateOpts`](../interfaces/SetStateOpts.md) |

## Returns

[`SetState`](../classes/SetState.md)
