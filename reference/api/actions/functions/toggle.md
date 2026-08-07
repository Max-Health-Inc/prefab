---
url: /prefab/reference/api/actions/functions/toggle.md
---
[@maxhealth.tech/prefab](../../index.md) / [actions](../index.md) / toggle

# Function: toggle()

```ts
function toggle(target): ToggleState;
```

Defined in: [actions/sugar.ts:38](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/actions/sugar.ts#L38)

Toggle a boolean state value. `toggle(signal)` → `new ToggleState(signal.key)`

## Parameters

| Parameter | Type |
| ------ | ------ |
| `target` | [`StateTarget`](../type-aliases/StateTarget.md) |

## Returns

[`ToggleState`](../classes/ToggleState.md)
