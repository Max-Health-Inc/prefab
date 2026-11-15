---
url: /prefab/reference/api/renderer/interfaces/AppOptions.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / AppOptions

# Interface: AppOptions

Defined in: [renderer/app.ts:41](https://github.com/Max-Health-Inc/prefab/blob/c0cfbec14aa21a1c1e0bc95f1b172db8df096fe0/src/renderer/app.ts#L41)

## Properties

### mode?

```ts
optional mode?: "auto" | "bridge" | "standalone";
```

Defined in: [renderer/app.ts:43](https://github.com/Max-Health-Inc/prefab/blob/c0cfbec14aa21a1c1e0bc95f1b172db8df096fe0/src/renderer/app.ts#L43)

Override environment detection: force bridge or standalone mode.

***

### hostOrigin?

```ts
optional hostOrigin?: string;
```

Defined in: [renderer/app.ts:45](https://github.com/Max-Health-Inc/prefab/blob/c0cfbec14aa21a1c1e0bc95f1b172db8df096fe0/src/renderer/app.ts#L45)

Allowed host origin for postMessage (default: '\*'). Set explicitly in production.

***

### transport?

```ts
optional transport?: McpTransportOptions;
```

Defined in: [renderer/app.ts:47](https://github.com/Max-Health-Inc/prefab/blob/c0cfbec14aa21a1c1e0bc95f1b172db8df096fe0/src/renderer/app.ts#L47)

HTTP transport options (for standalone mode).

***

### capabilities?

```ts
optional capabilities?: AppCapabilities;
```

Defined in: [renderer/app.ts:49](https://github.com/Max-Health-Inc/prefab/blob/c0cfbec14aa21a1c1e0bc95f1b172db8df096fe0/src/renderer/app.ts#L49)

App capabilities to advertise to host.
