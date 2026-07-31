---
url: /prefab/reference/api/mcp/interfaces/ViewerResourceOptions.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / ViewerResourceOptions

# Interface: ViewerResourceOptions

Defined in: [mcp/resource.ts:247](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/resource.ts#L247)

## Properties

### uri?

```ts
optional uri?: string;
```

Defined in: [mcp/resource.ts:249](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/resource.ts#L249)

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

Defined in: [mcp/resource.ts:251](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/resource.ts#L251)

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

Defined in: [mcp/resource.ts:253](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/resource.ts#L253)

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

Defined in: [mcp/resource.ts:255](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/resource.ts#L255)

Permission Policy requests.

***

### scripts?

```ts
optional scripts?: string[];
```

Defined in: [mcp/resource.ts:257](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/resource.ts#L257)

Additional `<script>` URLs to load after the renderer.

***

### stylesheets?

```ts
optional stylesheets?: string[];
```

Defined in: [mcp/resource.ts:259](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/resource.ts#L259)

Additional `<link rel="stylesheet">` URLs.

***

### cdnBase?

```ts
optional cdnBase?: string;
```

Defined in: [mcp/resource.ts:261](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/resource.ts#L261)

Override CDN base URL (no trailing slash).

***

### themeBridge?

```ts
optional themeBridge?: "vscode";
```

Defined in: [mcp/resource.ts:266](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/resource.ts#L266)

Inject a theme bridge stylesheet. `'vscode'` makes the viewer follow the
user's editor theme. See [RendererHtmlOptions.themeBridge](RendererHtmlOptions.md#themebridge).

***

### cache?

```ts
optional cache?: McpCacheHint;
```

Defined in: [mcp/resource.ts:271](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/resource.ts#L271)

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

Defined in: [mcp/resource.ts:278](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/resource.ts#L278)

Declare the `io.modelcontextprotocol/ui` extension capability on the
server (SEP-2133). Must happen before the server connects; a server that
is already connected keeps its existing capabilities and a warning is
logged.

#### Default

```ts
true
```
