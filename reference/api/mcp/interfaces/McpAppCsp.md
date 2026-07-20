---
url: /prefab/reference/api/mcp/interfaces/McpAppCsp.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / McpAppCsp

# Interface: McpAppCsp

Defined in: [mcp/display.ts:348](https://github.com/Max-Health-Inc/prefab/blob/88d9aa00d6a50ef0286767079c6345c808f6a0a9/src/mcp/display.ts#L348)

CSP configuration for MCP Apps resources.

## Properties

### resourceDomains?

```ts
optional resourceDomains?: string[];
```

Defined in: [mcp/display.ts:350](https://github.com/Max-Health-Inc/prefab/blob/88d9aa00d6a50ef0286767079c6345c808f6a0a9/src/mcp/display.ts#L350)

Origins allowed for scripts, styles, images, fonts, media.

***

### connectDomains?

```ts
optional connectDomains?: string[];
```

Defined in: [mcp/display.ts:352](https://github.com/Max-Health-Inc/prefab/blob/88d9aa00d6a50ef0286767079c6345c808f6a0a9/src/mcp/display.ts#L352)

Origins allowed for fetch/XHR/WebSocket.

***

### frameDomains?

```ts
optional frameDomains?: string[];
```

Defined in: [mcp/display.ts:354](https://github.com/Max-Health-Inc/prefab/blob/88d9aa00d6a50ef0286767079c6345c808f6a0a9/src/mcp/display.ts#L354)

Origins allowed for nested iframes.

***

### baseUriDomains?

```ts
optional baseUriDomains?: string[];
```

Defined in: [mcp/display.ts:356](https://github.com/Max-Health-Inc/prefab/blob/88d9aa00d6a50ef0286767079c6345c808f6a0a9/src/mcp/display.ts#L356)

Additional allowed base URIs.
