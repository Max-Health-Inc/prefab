---
url: /prefab/reference/api/actions/classes/Fetch.md
---
[@maxhealth.tech/prefab](../../index.md) / [actions](../index.md) / Fetch

# Class: Fetch

Defined in: [actions/client.ts:152](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/actions/client.ts#L152)

Base interface all actions implement

## Implements

* [`Action`](../interfaces/Action.md)

## Constructors

### Constructor

```ts
new Fetch(url, opts?): Fetch;
```

Defined in: [actions/client.ts:153](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/actions/client.ts#L153)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `url` | `string` |
| `opts?` | [`FetchOpts`](../interfaces/FetchOpts.md) |

#### Returns

`Fetch`

## Properties

### url

```ts
readonly url: string;
```

Defined in: [actions/client.ts:154](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/actions/client.ts#L154)

## Methods

### toJSON()

```ts
toJSON(): ActionJSON;
```

Defined in: [actions/client.ts:158](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/actions/client.ts#L158)

#### Returns

[`ActionJSON`](../interfaces/ActionJSON.md)

#### Implementation of

[`Action`](../interfaces/Action.md).[`toJSON`](../interfaces/Action.md#tojson)
