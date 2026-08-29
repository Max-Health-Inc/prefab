---
url: /prefab/reference/api/mcp/interfaces/McpAppCsp.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / McpAppCsp

# Interface: McpAppCsp

Defined in: [mcp/resource.ts:24](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/resource.ts#L24)

CSP configuration for MCP Apps resources.

## Properties

### resourceDomains?

```ts
optional resourceDomains?: string[];
```

Defined in: [mcp/resource.ts:26](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/resource.ts#L26)

Origins allowed for scripts, styles, images, fonts, media.

***

### connectDomains?

```ts
optional connectDomains?: string[];
```

Defined in: [mcp/resource.ts:28](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/resource.ts#L28)

Origins allowed for fetch/XHR/WebSocket.

***

### frameDomains?

```ts
optional frameDomains?: string[];
```

Defined in: [mcp/resource.ts:30](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/resource.ts#L30)

Origins allowed for nested iframes.

***

### baseUriDomains?

```ts
optional baseUriDomains?: string[];
```

Defined in: [mcp/resource.ts:32](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/resource.ts#L32)

Additional allowed base URIs.
