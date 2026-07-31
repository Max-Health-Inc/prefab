---
url: /prefab/reference/api/actions/classes/PopState.md
---
[@maxhealth.tech/prefab](../../index.md) / [actions](../index.md) / PopState

# Class: PopState

Defined in: [actions/client.ts:67](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/actions/client.ts#L67)

Base interface all actions implement

## Implements

* [`Action`](../interfaces/Action.md)

## Constructors

### Constructor

```ts
new PopState(key, index): PopState;
```

Defined in: [actions/client.ts:68](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/actions/client.ts#L68)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `index` | `string` | `number` |

#### Returns

`PopState`

## Properties

### key

```ts
readonly key: string;
```

Defined in: [actions/client.ts:69](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/actions/client.ts#L69)

***

### index

```ts
readonly index: string | number;
```

Defined in: [actions/client.ts:70](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/actions/client.ts#L70)

## Methods

### toJSON()

```ts
toJSON(): ActionJSON;
```

Defined in: [actions/client.ts:73](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/actions/client.ts#L73)

#### Returns

[`ActionJSON`](../interfaces/ActionJSON.md)

#### Implementation of

[`Action`](../interfaces/Action.md).[`toJSON`](../interfaces/Action.md#tojson)
