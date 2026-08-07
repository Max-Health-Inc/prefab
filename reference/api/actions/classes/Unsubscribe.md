---
url: /prefab/reference/api/actions/classes/Unsubscribe.md
---
[@maxhealth.tech/prefab](../../index.md) / [actions](../index.md) / Unsubscribe

# Class: Unsubscribe

Defined in: [actions/subscribe.ts:72](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/actions/subscribe.ts#L72)

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

Defined in: [actions/subscribe.ts:73](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/actions/subscribe.ts#L73)

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

Defined in: [actions/subscribe.ts:73](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/actions/subscribe.ts#L73)

## Methods

### toJSON()

```ts
toJSON(): ActionJSON;
```

Defined in: [actions/subscribe.ts:75](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/actions/subscribe.ts#L75)

#### Returns

[`ActionJSON`](../interfaces/ActionJSON.md)

#### Implementation of

[`Action`](../interfaces/Action.md).[`toJSON`](../interfaces/Action.md#tojson)
