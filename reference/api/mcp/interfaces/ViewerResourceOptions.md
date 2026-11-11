---
url: /prefab/reference/api/mcp/interfaces/ViewerResourceOptions.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / ViewerResourceOptions

# Interface: ViewerResourceOptions

Defined in: [mcp/resource.ts:193](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/mcp/resource.ts#L193)

## Properties

### uri?

```ts
optional uri?: string;
```

Defined in: [mcp/resource.ts:195](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/mcp/resource.ts#L195)

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

Defined in: [mcp/resource.ts:197](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/mcp/resource.ts#L197)

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

Defined in: [mcp/resource.ts:199](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/mcp/resource.ts#L199)

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

Defined in: [mcp/resource.ts:201](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/mcp/resource.ts#L201)

Permission Policy requests.

***

### scripts?

```ts
optional scripts?: string[];
```

Defined in: [mcp/resource.ts:203](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/mcp/resource.ts#L203)

Additional `<script>` URLs to load after the renderer.

***

### stylesheets?

```ts
optional stylesheets?: string[];
```

Defined in: [mcp/resource.ts:205](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/mcp/resource.ts#L205)

Additional `<link rel="stylesheet">` URLs.

***

### cdnBase?

```ts
optional cdnBase?: string;
```

Defined in: [mcp/resource.ts:207](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/mcp/resource.ts#L207)

Override CDN base URL (no trailing slash).

***

### themeBridge?

```ts
optional themeBridge?: "vscode";
```

Defined in: [mcp/resource.ts:209](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/mcp/resource.ts#L209)

See [RendererHtmlOptions.themeBridge](RendererHtmlOptions.md#themebridge).

***

### cache?

```ts
optional cache?: McpCacheHint;
```

Defined in: [mcp/resource.ts:211](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/mcp/resource.ts#L211)

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

Defined in: [mcp/resource.ts:213](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/mcp/resource.ts#L213)

Declare the `io.modelcontextprotocol/ui` capability (SEP-2133); only works before the server connects.

#### Default

```ts
true
```
