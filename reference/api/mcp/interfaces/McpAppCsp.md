---
url: /prefab/reference/api/mcp/interfaces/McpAppCsp.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / McpAppCsp

# Interface: McpAppCsp

Defined in: [mcp/resource.ts:14](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/mcp/resource.ts#L14)

CSP configuration for MCP Apps resources.

## Properties

### resourceDomains?

```ts
optional resourceDomains?: string[];
```

Defined in: [mcp/resource.ts:16](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/mcp/resource.ts#L16)

Origins allowed for scripts, styles, images, fonts, media.

***

### connectDomains?

```ts
optional connectDomains?: string[];
```

Defined in: [mcp/resource.ts:18](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/mcp/resource.ts#L18)

Origins allowed for fetch/XHR/WebSocket.

***

### frameDomains?

```ts
optional frameDomains?: string[];
```

Defined in: [mcp/resource.ts:20](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/mcp/resource.ts#L20)

Origins allowed for nested iframes.

***

### baseUriDomains?

```ts
optional baseUriDomains?: string[];
```

Defined in: [mcp/resource.ts:22](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/mcp/resource.ts#L22)

Additional allowed base URIs.
