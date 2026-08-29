---
url: /prefab/reference/api/actions/classes/ToggleState.md
---
[@maxhealth.tech/prefab](../../index.md) / [actions](../index.md) / ToggleState

# Class: ToggleState

Defined in: [actions/client.ts:37](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/actions/client.ts#L37)

Base interface all actions implement

## Implements

* [`Action`](../interfaces/Action.md)

## Constructors

### Constructor

```ts
new ToggleState(key): ToggleState;
```

Defined in: [actions/client.ts:38](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/actions/client.ts#L38)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

#### Returns

`ToggleState`

## Properties

### key

```ts
readonly key: string;
```

Defined in: [actions/client.ts:38](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/actions/client.ts#L38)

## Methods

### toJSON()

```ts
toJSON(): ActionJSON;
```

Defined in: [actions/client.ts:40](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/actions/client.ts#L40)

#### Returns

[`ActionJSON`](../interfaces/ActionJSON.md)

#### Implementation of

[`Action`](../interfaces/Action.md).[`toJSON`](../interfaces/Action.md#tojson)
