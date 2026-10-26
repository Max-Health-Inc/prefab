---
url: /prefab/reference/api/actions/classes/Subscribe.md
---
[@maxhealth.tech/prefab](../../index.md) / [actions](../index.md) / Subscribe

# Class: Subscribe

Defined in: [actions/subscribe.ts:47](https://github.com/Max-Health-Inc/prefab/blob/7a2e43417fa83301b42abd7447c199249e6c40f6/src/actions/subscribe.ts#L47)

Subscribe to a resource URI for real-time updates.

When the host supports MCP resource subscriptions (`capabilities.subscriptions`),
the renderer uses push notifications via the bridge. Otherwise it falls back to
periodic polling using `SetInterval` + `CallTool`.

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

Defined in: [actions/subscribe.ts:48](https://github.com/Max-Health-Inc/prefab/blob/7a2e43417fa83301b42abd7447c199249e6c40f6/src/actions/subscribe.ts#L48)

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

Defined in: [actions/subscribe.ts:49](https://github.com/Max-Health-Inc/prefab/blob/7a2e43417fa83301b42abd7447c199249e6c40f6/src/actions/subscribe.ts#L49)

## Methods

### toJSON()

```ts
toJSON(): ActionJSON;
```

Defined in: [actions/subscribe.ts:53](https://github.com/Max-Health-Inc/prefab/blob/7a2e43417fa83301b42abd7447c199249e6c40f6/src/actions/subscribe.ts#L53)

#### Returns

[`ActionJSON`](../interfaces/ActionJSON.md)

#### Implementation of

[`Action`](../interfaces/Action.md).[`toJSON`](../interfaces/Action.md#tojson)
