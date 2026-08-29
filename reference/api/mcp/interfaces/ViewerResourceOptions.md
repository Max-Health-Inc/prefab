---
url: /prefab/reference/api/mcp/interfaces/ViewerResourceOptions.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / ViewerResourceOptions

# Interface: ViewerResourceOptions

Defined in: [mcp/resource.ts:248](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/resource.ts#L248)

## Properties

### uri?

```ts
optional uri?: string;
```

Defined in: [mcp/resource.ts:250](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/resource.ts#L250)

Resource URI.

#### Default

```ts
PREFAB_RESOURCE_URI
```

***

### title?

```ts
optional title?: string;
```

Defined in: [mcp/resource.ts:252](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/resource.ts#L252)

Resource title.

#### Default

```ts
'Prefab Viewer'
```

***

### csp?

```ts
optional csp?: McpAppCsp;
```

Defined in: [mcp/resource.ts:254](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/resource.ts#L254)

CSP configuration.

#### Default

```ts
{ resourceDomains: ['https://cdn.jsdelivr.net'] }
```

***

### permissions?

```ts
optional permissions?: McpAppPermissions;
```

Defined in: [mcp/resource.ts:256](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/resource.ts#L256)

Permission Policy requests.

***

### scripts?

```ts
optional scripts?: string[];
```

Defined in: [mcp/resource.ts:258](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/resource.ts#L258)

Additional `<script>` URLs to load after the renderer.

***

### stylesheets?

```ts
optional stylesheets?: string[];
```

Defined in: [mcp/resource.ts:260](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/resource.ts#L260)

Additional `<link rel="stylesheet">` URLs.

***

### cdnBase?

```ts
optional cdnBase?: string;
```

Defined in: [mcp/resource.ts:262](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/resource.ts#L262)

Override CDN base URL (no trailing slash).

***

### themeBridge?

```ts
optional themeBridge?: "vscode";
```

Defined in: [mcp/resource.ts:267](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/resource.ts#L267)

Inject a theme bridge stylesheet. `'vscode'` makes the viewer follow the
user's editor theme. See [RendererHtmlOptions.themeBridge](RendererHtmlOptions.md#themebridge).

***

### cache?

```ts
optional cache?: McpCacheHint;
```

Defined in: [mcp/resource.ts:272](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/resource.ts#L272)

Cache fields for the `resources/read` result (SEP-2549).

#### Default

```ts
{ ttlMs: 86_400_000, cacheScope: 'public' }
```

***

### declareCapability?

```ts
optional declareCapability?: boolean;
```

Defined in: [mcp/resource.ts:279](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/resource.ts#L279)

Declare the `io.modelcontextprotocol/ui` extension capability on the
server (SEP-2133). Must happen before the server connects; a server that
is already connected keeps its existing capabilities and a warning is
logged.

#### Default

```ts
true
```
