---
url: /prefab/reference/api/actions/classes/Unsubscribe.md
---
[@maxhealth.tech/prefab](../../index.md) / [actions](../index.md) / Unsubscribe

# Class: Unsubscribe

Defined in: [actions/subscribe.ts:75](https://github.com/Max-Health-Inc/prefab/blob/7a2e43417fa83301b42abd7447c199249e6c40f6/src/actions/subscribe.ts#L75)

Unsubscribe from a previously subscribed resource URI.

Typically used in cleanup or when navigating away from a view.
The renderer also automatically unsubscribes on destroy.

## Implements

* [`Action`](../interfaces/Action.md)

## Constructors

### Constructor

```ts
new Unsubscribe(uri): Unsubscribe;
```

Defined in: [actions/subscribe.ts:76](https://github.com/Max-Health-Inc/prefab/blob/7a2e43417fa83301b42abd7447c199249e6c40f6/src/actions/subscribe.ts#L76)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `uri` | `string` |

#### Returns

`Unsubscribe`

## Properties

### uri

```ts
readonly uri: string;
```

Defined in: [actions/subscribe.ts:76](https://github.com/Max-Health-Inc/prefab/blob/7a2e43417fa83301b42abd7447c199249e6c40f6/src/actions/subscribe.ts#L76)

## Methods

### toJSON()

```ts
toJSON(): ActionJSON;
```

Defined in: [actions/subscribe.ts:78](https://github.com/Max-Health-Inc/prefab/blob/7a2e43417fa83301b42abd7447c199249e6c40f6/src/actions/subscribe.ts#L78)

#### Returns

[`ActionJSON`](../interfaces/ActionJSON.md)

#### Implementation of

[`Action`](../interfaces/Action.md).[`toJSON`](../interfaces/Action.md#tojson)
