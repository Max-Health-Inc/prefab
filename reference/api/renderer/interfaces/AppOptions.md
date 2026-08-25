---
url: /prefab/reference/api/renderer/interfaces/AppOptions.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / AppOptions

# Interface: AppOptions

Defined in: [renderer/app.ts:40](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/renderer/app.ts#L40)

## Properties

### mode?

```ts
optional mode?: "auto" | "bridge" | "standalone";
```

Defined in: [renderer/app.ts:42](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/renderer/app.ts#L42)

Override environment detection: force bridge or standalone mode.

***

### hostOrigin?

```ts
optional hostOrigin?: string;
```

Defined in: [renderer/app.ts:44](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/renderer/app.ts#L44)

Allowed host origin for postMessage (default: '\*'). Set explicitly in production.

***

### transport?

```ts
optional transport?: McpTransportOptions;
```

Defined in: [renderer/app.ts:46](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/renderer/app.ts#L46)

HTTP transport options (for standalone mode).

***

### capabilities?

```ts
optional capabilities?: AppCapabilities;
```

Defined in: [renderer/app.ts:48](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/renderer/app.ts#L48)

App capabilities to advertise to host.
