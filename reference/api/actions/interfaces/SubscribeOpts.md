---
url: /prefab/reference/api/actions/interfaces/SubscribeOpts.md
---
[@maxhealth.tech/prefab](../../index.md) / [actions](../index.md) / SubscribeOpts

# Interface: SubscribeOpts

Defined in: [actions/subscribe.ts:12](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/actions/subscribe.ts#L12)

## Properties

### stateKey

```ts
stateKey: string;
```

Defined in: [actions/subscribe.ts:14](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/actions/subscribe.ts#L14)

Reactive store key where incoming data is written.

***

### fallbackInterval?

```ts
optional fallbackInterval?: number;
```

Defined in: [actions/subscribe.ts:16](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/actions/subscribe.ts#L16)

Poll interval (ms) when the host does not support push subscriptions. Defaults to 2000.

***

### fallbackTool?

```ts
optional fallbackTool?: string;
```

Defined in: [actions/subscribe.ts:18](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/actions/subscribe.ts#L18)

Tool to call when polling in fallback mode.

***

### fallbackArgs?

```ts
optional fallbackArgs?: Record<string, unknown>;
```

Defined in: [actions/subscribe.ts:20](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/actions/subscribe.ts#L20)

Arguments passed to the fallback tool call.

***

### onData?

```ts
optional onData?: Action | Action[];
```

Defined in: [actions/subscribe.ts:22](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/actions/subscribe.ts#L22)

Action(s) executed whenever new data arrives (push or poll).

***

### onError?

```ts
optional onError?: Action | Action[];
```

Defined in: [actions/subscribe.ts:24](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/actions/subscribe.ts#L24)

Action(s) executed on subscription or poll error.
