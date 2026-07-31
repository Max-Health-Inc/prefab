---
url: /prefab/reference/api/actions/classes/SetInterval.md
---
[@maxhealth.tech/prefab](../../index.md) / [actions](../index.md) / SetInterval

# Class: SetInterval

Defined in: [actions/client.ts:126](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/actions/client.ts#L126)

Base interface all actions implement

## Implements

* [`Action`](../interfaces/Action.md)

## Constructors

### Constructor

```ts
new SetInterval(intervalMs, onTick): SetInterval;
```

Defined in: [actions/client.ts:127](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/actions/client.ts#L127)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `intervalMs` | `number` |
| `onTick` | | [`Action`](../interfaces/Action.md) | [`Action`](../interfaces/Action.md)\[] |

#### Returns

`SetInterval`

## Properties

### intervalMs

```ts
readonly intervalMs: number;
```

Defined in: [actions/client.ts:128](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/actions/client.ts#L128)

***

### onTick

```ts
readonly onTick: 
  | Action
  | Action[];
```

Defined in: [actions/client.ts:129](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/actions/client.ts#L129)

## Methods

### toJSON()

```ts
toJSON(): ActionJSON;
```

Defined in: [actions/client.ts:132](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/actions/client.ts#L132)

#### Returns

[`ActionJSON`](../interfaces/ActionJSON.md)

#### Implementation of

[`Action`](../interfaces/Action.md).[`toJSON`](../interfaces/Action.md#tojson)
