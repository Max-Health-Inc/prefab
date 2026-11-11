---
url: /prefab/reference/api/actions/classes/Unsubscribe.md
---
[@maxhealth.tech/prefab](../../index.md) / [actions](../index.md) / Unsubscribe

# Class: Unsubscribe

Defined in: [actions/subscribe.ts:60](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/actions/subscribe.ts#L60)

Unsubscribe from a resource URI; the renderer also unsubscribes everything on destroy.

## Implements

* [`Action`](../interfaces/Action.md)

## Constructors

### Constructor

```ts
new Unsubscribe(uri): Unsubscribe;
```

Defined in: [actions/subscribe.ts:61](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/actions/subscribe.ts#L61)

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

Defined in: [actions/subscribe.ts:61](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/actions/subscribe.ts#L61)

## Methods

### toJSON()

```ts
toJSON(): ActionJSON;
```

Defined in: [actions/subscribe.ts:63](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/actions/subscribe.ts#L63)

#### Returns

[`ActionJSON`](../interfaces/ActionJSON.md)

#### Implementation of

[`Action`](../interfaces/Action.md).[`toJSON`](../interfaces/Action.md#tojson)
