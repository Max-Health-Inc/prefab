---
url: /prefab/reference/api/mcp/interfaces/ViewerResourceOptions.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / ViewerResourceOptions

# Interface: ViewerResourceOptions

Defined in: [mcp/display.ts:501](https://github.com/Max-Health-Inc/prefab/blob/88d9aa00d6a50ef0286767079c6345c808f6a0a9/src/mcp/display.ts#L501)

## Properties

### uri?

```ts
optional uri?: string;
```

Defined in: [mcp/display.ts:503](https://github.com/Max-Health-Inc/prefab/blob/88d9aa00d6a50ef0286767079c6345c808f6a0a9/src/mcp/display.ts#L503)

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

Defined in: [mcp/display.ts:505](https://github.com/Max-Health-Inc/prefab/blob/88d9aa00d6a50ef0286767079c6345c808f6a0a9/src/mcp/display.ts#L505)

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

Defined in: [mcp/display.ts:507](https://github.com/Max-Health-Inc/prefab/blob/88d9aa00d6a50ef0286767079c6345c808f6a0a9/src/mcp/display.ts#L507)

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

Defined in: [mcp/display.ts:509](https://github.com/Max-Health-Inc/prefab/blob/88d9aa00d6a50ef0286767079c6345c808f6a0a9/src/mcp/display.ts#L509)

Permission Policy requests.

***

### scripts?

```ts
optional scripts?: string[];
```

Defined in: [mcp/display.ts:511](https://github.com/Max-Health-Inc/prefab/blob/88d9aa00d6a50ef0286767079c6345c808f6a0a9/src/mcp/display.ts#L511)

Additional `<script>` URLs to load after the renderer.

***

### stylesheets?

```ts
optional stylesheets?: string[];
```

Defined in: [mcp/display.ts:513](https://github.com/Max-Health-Inc/prefab/blob/88d9aa00d6a50ef0286767079c6345c808f6a0a9/src/mcp/display.ts#L513)

Additional `<link rel="stylesheet">` URLs.

***

### cdnBase?

```ts
optional cdnBase?: string;
```

Defined in: [mcp/display.ts:515](https://github.com/Max-Health-Inc/prefab/blob/88d9aa00d6a50ef0286767079c6345c808f6a0a9/src/mcp/display.ts#L515)

Override CDN base URL (no trailing slash).
