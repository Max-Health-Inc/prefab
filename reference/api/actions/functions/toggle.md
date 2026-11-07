---
url: /prefab/reference/api/actions/functions/toggle.md
---
[@maxhealth.tech/prefab](../../index.md) / [actions](../index.md) / toggle

# Function: toggle()

```ts
function toggle(target): ToggleState;
```

Defined in: [actions/sugar.ts:38](https://github.com/Max-Health-Inc/prefab/blob/1890bd36e825570eeb35b14d1f5a0235caa2c0fb/src/actions/sugar.ts#L38)

Toggle a boolean state value. `toggle(signal)` → `new ToggleState(signal.key)`

## Parameters

| Parameter | Type |
| ------ | ------ |
| `target` | [`StateTarget`](../type-aliases/StateTarget.md) |

## Returns

[`ToggleState`](../classes/ToggleState.md)
