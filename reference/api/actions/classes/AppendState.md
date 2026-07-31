---
url: /prefab/reference/api/actions/classes/AppendState.md
---
[@maxhealth.tech/prefab](../../index.md) / [actions](../index.md) / AppendState

# Class: AppendState

Defined in: [actions/client.ts:47](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/actions/client.ts#L47)

Base interface all actions implement

## Implements

* [`Action`](../interfaces/Action.md)

## Constructors

### Constructor

```ts
new AppendState(
   key, 
   value, 
   index?): AppendState;
```

Defined in: [actions/client.ts:48](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/actions/client.ts#L48)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `value` | `unknown` |
| `index?` | `number` |

#### Returns

`AppendState`

## Properties

### key

```ts
readonly key: string;
```

Defined in: [actions/client.ts:49](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/actions/client.ts#L49)

***

### value

```ts
readonly value: unknown;
```

Defined in: [actions/client.ts:50](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/actions/client.ts#L50)

***

### index?

```ts
readonly optional index?: number;
```

Defined in: [actions/client.ts:51](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/actions/client.ts#L51)

## Methods

### toJSON()

```ts
toJSON(): ActionJSON;
```

Defined in: [actions/client.ts:54](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/actions/client.ts#L54)

#### Returns

[`ActionJSON`](../interfaces/ActionJSON.md)

#### Implementation of

[`Action`](../interfaces/Action.md).[`toJSON`](../interfaces/Action.md#tojson)
