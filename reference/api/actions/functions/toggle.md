---
url: /prefab/reference/api/actions/functions/toggle.md
---
[@maxhealth.tech/prefab](../../index.md) / [actions](../index.md) / toggle

# Function: toggle()

```ts
function toggle(target): ToggleState;
```

Defined in: [actions/sugar.ts:38](https://github.com/Max-Health-Inc/prefab/blob/605eb676dc900a2603365e87c9dd47f400d7af46/src/actions/sugar.ts#L38)

Toggle a boolean state value. `toggle(signal)` → `new ToggleState(signal.key)`

## Parameters

| Parameter | Type |
| ------ | ------ |
| `target` | [`StateTarget`](../type-aliases/StateTarget.md) |

## Returns

[`ToggleState`](../classes/ToggleState.md)
