---
url: /prefab/reference/api/rx/interfaces/SignalOptions.md
---
[@maxhealth.tech/prefab](../../index.md) / [rx](../index.md) / SignalOptions

# Interface: SignalOptions

Defined in: [rx/signal.ts:22](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/rx/signal.ts#L22)

## Properties

### urlSync?

```ts
optional urlSync?: string;
```

Defined in: [rx/signal.ts:27](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/rx/signal.ts#L27)

URL query parameter name. When set, the runtime syncs the signal
value with `?param=value` in the address bar. Opt-in.
