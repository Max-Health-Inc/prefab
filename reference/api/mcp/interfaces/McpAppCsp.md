---
url: /prefab/reference/api/mcp/interfaces/McpAppCsp.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / McpAppCsp

# Interface: McpAppCsp

Defined in: [mcp/resource.ts:23](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/resource.ts#L23)

CSP configuration for MCP Apps resources.

## Properties

### resourceDomains?

```ts
optional resourceDomains?: string[];
```

Defined in: [mcp/resource.ts:25](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/resource.ts#L25)

Origins allowed for scripts, styles, images, fonts, media.

***

### connectDomains?

```ts
optional connectDomains?: string[];
```

Defined in: [mcp/resource.ts:27](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/resource.ts#L27)

Origins allowed for fetch/XHR/WebSocket.

***

### frameDomains?

```ts
optional frameDomains?: string[];
```

Defined in: [mcp/resource.ts:29](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/resource.ts#L29)

Origins allowed for nested iframes.

***

### baseUriDomains?

```ts
optional baseUriDomains?: string[];
```

Defined in: [mcp/resource.ts:31](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/resource.ts#L31)

Additional allowed base URIs.
