---
url: /prefab/reference/api/actions/classes/OpenFilePicker.md
---
[@maxhealth.tech/prefab](../../index.md) / [actions](../index.md) / OpenFilePicker

# Class: OpenFilePicker

Defined in: [actions/client.ts:179](https://github.com/Max-Health-Inc/prefab/blob/c0556f0632cf75f3e410fd7efc1a25abaf224e54/src/actions/client.ts#L179)

Base interface all actions implement

## Implements

* [`Action`](../interfaces/Action.md)

## Constructors

### Constructor

```ts
new OpenFilePicker(opts?): OpenFilePicker;
```

Defined in: [actions/client.ts:180](https://github.com/Max-Health-Inc/prefab/blob/c0556f0632cf75f3e410fd7efc1a25abaf224e54/src/actions/client.ts#L180)

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

Defined in: [actions/client.ts:182](https://github.com/Max-Health-Inc/prefab/blob/c0556f0632cf75f3e410fd7efc1a25abaf224e54/src/actions/client.ts#L182)

#### Returns

[`ActionJSON`](../interfaces/ActionJSON.md)

#### Implementation of

[`Action`](../interfaces/Action.md).[`toJSON`](../interfaces/Action.md#tojson)
