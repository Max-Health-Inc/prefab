---
url: /prefab/reference/api/actions/classes/ShowToast.md
---
[@maxhealth.tech/prefab](../../index.md) / [actions](../index.md) / ShowToast

# Class: ShowToast

Defined in: [actions/client.ts:88](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/actions/client.ts#L88)

Base interface all actions implement

## Implements

* [`Action`](../interfaces/Action.md)

## Constructors

### Constructor

```ts
new ShowToast(message, opts?): ShowToast;
```

Defined in: [actions/client.ts:89](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/actions/client.ts#L89)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `opts?` | [`ShowToastOpts`](../interfaces/ShowToastOpts.md) |

#### Returns

`ShowToast`

## Properties

### message

```ts
readonly message: string;
```

Defined in: [actions/client.ts:90](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/actions/client.ts#L90)

## Methods

### toJSON()

```ts
toJSON(): ActionJSON;
```

Defined in: [actions/client.ts:94](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/actions/client.ts#L94)

#### Returns

[`ActionJSON`](../interfaces/ActionJSON.md)

#### Implementation of

[`Action`](../interfaces/Action.md).[`toJSON`](../interfaces/Action.md#tojson)
