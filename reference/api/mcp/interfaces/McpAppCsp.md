---
url: /prefab/reference/api/mcp/interfaces/McpAppCsp.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / McpAppCsp

# Interface: McpAppCsp

Defined in: [mcp/display.ts:348](https://github.com/Max-Health-Inc/prefab/blob/89a71686ef8a402c953104a66e893262cc245e62/src/mcp/display.ts#L348)

CSP configuration for MCP Apps resources.

## Properties

### resourceDomains?

```ts
optional resourceDomains?: string[];
```

Defined in: [mcp/display.ts:350](https://github.com/Max-Health-Inc/prefab/blob/89a71686ef8a402c953104a66e893262cc245e62/src/mcp/display.ts#L350)

Origins allowed for scripts, styles, images, fonts, media.

***

### connectDomains?

```ts
optional connectDomains?: string[];
```

Defined in: [mcp/display.ts:352](https://github.com/Max-Health-Inc/prefab/blob/89a71686ef8a402c953104a66e893262cc245e62/src/mcp/display.ts#L352)

Origins allowed for fetch/XHR/WebSocket.

***

### frameDomains?

```ts
optional frameDomains?: string[];
```

Defined in: [mcp/display.ts:354](https://github.com/Max-Health-Inc/prefab/blob/89a71686ef8a402c953104a66e893262cc245e62/src/mcp/display.ts#L354)

Origins allowed for nested iframes.

***

### baseUriDomains?

```ts
optional baseUriDomains?: string[];
```

Defined in: [mcp/display.ts:356](https://github.com/Max-Health-Inc/prefab/blob/89a71686ef8a402c953104a66e893262cc245e62/src/mcp/display.ts#L356)

Additional allowed base URIs.
