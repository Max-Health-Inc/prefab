---
url: /prefab/reference/api/actions/interfaces/SubscribeOpts.md
---
[@maxhealth.tech/prefab](../../index.md) / [actions](../index.md) / SubscribeOpts

# Interface: SubscribeOpts

Defined in: [actions/subscribe.ts:6](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/actions/subscribe.ts#L6)

## Properties

### stateKey

```ts
stateKey: string;
```

Defined in: [actions/subscribe.ts:8](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/actions/subscribe.ts#L8)

Reactive store key where incoming data is written.

***

### push?

```ts
optional push?: boolean;
```

Defined in: [actions/subscribe.ts:10](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/actions/subscribe.ts#L10)

`false` always polls, even on a host with subscriptions: a stateless server sends no resource notifications. Defaults to `true`.

***

### fallbackInterval?

```ts
optional fallbackInterval?: number;
```

Defined in: [actions/subscribe.ts:12](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/actions/subscribe.ts#L12)

Poll interval (ms) when the host does not support push subscriptions. Defaults to 2000.

***

### fallbackTool?

```ts
optional fallbackTool?: string;
```

Defined in: [actions/subscribe.ts:14](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/actions/subscribe.ts#L14)

Tool to call when polling in fallback mode.

***

### fallbackArgs?

```ts
optional fallbackArgs?: Record<string, unknown>;
```

Defined in: [actions/subscribe.ts:16](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/actions/subscribe.ts#L16)

Arguments passed to the fallback tool call.

***

### onData?

```ts
optional onData?: Action | Action[];
```

Defined in: [actions/subscribe.ts:18](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/actions/subscribe.ts#L18)

Action(s) executed whenever new data arrives (push or poll).

***

### onError?

```ts
optional onError?: Action | Action[];
```

Defined in: [actions/subscribe.ts:20](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/actions/subscribe.ts#L20)

Action(s) executed when the host refuses the subscription or a poll fails.
