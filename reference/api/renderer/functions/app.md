---
url: /prefab/reference/api/renderer/functions/app.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / app

# Function: app()

```ts
function app(options?): Promise<PrefabApp>;
```

Defined in: [renderer/app.ts:120](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/renderer/app.ts#L120)

Create a prefab app. Auto-detects iframe vs standalone.

In an iframe: uses postMessage bridge, performs handshake with host.
Standalone: uses HTTP transport (or noop if no config).

## Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | [`AppOptions`](../interfaces/AppOptions.md) |

## Returns

`Promise`<[`PrefabApp`](../interfaces/PrefabApp.md)>
