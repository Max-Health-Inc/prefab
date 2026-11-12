---
url: /prefab/reference/api/mcp/interfaces/ViewerResourceOptions.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / ViewerResourceOptions

# Interface: ViewerResourceOptions

Defined in: [mcp/resource.ts:198](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/resource.ts#L198)

## Properties

### uri?

```ts
optional uri?: string;
```

Defined in: [mcp/resource.ts:200](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/resource.ts#L200)

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

Defined in: [mcp/resource.ts:202](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/resource.ts#L202)

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

Defined in: [mcp/resource.ts:204](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/resource.ts#L204)

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

Defined in: [mcp/resource.ts:206](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/resource.ts#L206)

Permission Policy requests.

***

### scripts?

```ts
optional scripts?: string[];
```

Defined in: [mcp/resource.ts:208](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/resource.ts#L208)

Additional `<script>` URLs to load after the renderer.

***

### stylesheets?

```ts
optional stylesheets?: string[];
```

Defined in: [mcp/resource.ts:210](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/resource.ts#L210)

Additional `<link rel="stylesheet">` URLs.

***

### cdnBase?

```ts
optional cdnBase?: string;
```

Defined in: [mcp/resource.ts:212](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/resource.ts#L212)

Override CDN base URL (no trailing slash).

***

### themeBridge?

```ts
optional themeBridge?: "vscode";
```

Defined in: [mcp/resource.ts:214](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/resource.ts#L214)

See [RendererHtmlOptions.themeBridge](RendererHtmlOptions.md#themebridge).

***

### cache?

```ts
optional cache?: McpCacheHint;
```

Defined in: [mcp/resource.ts:216](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/resource.ts#L216)

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

Defined in: [mcp/resource.ts:218](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/resource.ts#L218)

Declare the `io.modelcontextprotocol/ui` capability (SEP-2133); only works before the server connects.

#### Default

```ts
true
```
