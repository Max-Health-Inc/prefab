---
url: /prefab/reference/api/actions/classes/Subscribe.md
---
[@maxhealth.tech/prefab](../../index.md) / [actions](../index.md) / Subscribe

# Class: Subscribe

Defined in: [actions/subscribe.ts:37](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/actions/subscribe.ts#L37)

Subscribe to a resource URI: push when the host supports resource subscriptions, otherwise poll `fallbackTool`.

## Example

```ts
new Subscribe('chess://game/abc123', {
  stateKey: '$game',
  fallbackInterval: 2000,
  fallbackTool: '_action',
  fallbackArgs: { action: 'refresh' },
  onData: new ShowToast('Game updated', { variant: 'info' }),
})
```

## Implements

* [`Action`](../interfaces/Action.md)

## Constructors

### Constructor

```ts
new Subscribe(uri, opts): Subscribe;
```

Defined in: [actions/subscribe.ts:38](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/actions/subscribe.ts#L38)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `uri` | `string` |
| `opts` | [`SubscribeOpts`](../interfaces/SubscribeOpts.md) |

#### Returns

`Subscribe`

## Properties

### uri

```ts
readonly uri: string;
```

Defined in: [actions/subscribe.ts:39](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/actions/subscribe.ts#L39)

## Methods

### toJSON()

```ts
toJSON(): ActionJSON;
```

Defined in: [actions/subscribe.ts:43](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/actions/subscribe.ts#L43)

#### Returns

[`ActionJSON`](../interfaces/ActionJSON.md)

#### Implementation of

[`Action`](../interfaces/Action.md).[`toJSON`](../interfaces/Action.md#tojson)
