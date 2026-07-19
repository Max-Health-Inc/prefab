---
url: /prefab/reference/api/actions/classes/OpenFilePicker.md
---
[@maxhealth.tech/prefab](../../index.md) / [actions](../index.md) / OpenFilePicker

# Class: OpenFilePicker

Defined in: [actions/client.ts:179](https://github.com/Max-Health-Inc/prefab/blob/89a71686ef8a402c953104a66e893262cc245e62/src/actions/client.ts#L179)

Base interface all actions implement

## Implements

* [`Action`](../interfaces/Action.md)

## Constructors

### Constructor

```ts
new OpenFilePicker(opts?): OpenFilePicker;
```

Defined in: [actions/client.ts:180](https://github.com/Max-Health-Inc/prefab/blob/89a71686ef8a402c953104a66e893262cc245e62/src/actions/client.ts#L180)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts?` | [`OpenFilePickerOpts`](../interfaces/OpenFilePickerOpts.md) |

#### Returns

`OpenFilePicker`

## Methods

### toJSON()

```ts
toJSON(): ActionJSON;
```

Defined in: [actions/client.ts:182](https://github.com/Max-Health-Inc/prefab/blob/89a71686ef8a402c953104a66e893262cc245e62/src/actions/client.ts#L182)

#### Returns

[`ActionJSON`](../interfaces/ActionJSON.md)

#### Implementation of

[`Action`](../interfaces/Action.md).[`toJSON`](../interfaces/Action.md#tojson)
