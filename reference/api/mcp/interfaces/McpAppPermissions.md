---
url: /prefab/reference/api/mcp/interfaces/McpAppPermissions.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / McpAppPermissions

# Interface: McpAppPermissions

Defined in: [mcp/display.ts:360](https://github.com/Max-Health-Inc/prefab/blob/89a71686ef8a402c953104a66e893262cc245e62/src/mcp/display.ts#L360)

Permission Policy requests for MCP Apps resources.

## Properties

### camera?

```ts
optional camera?: boolean;
```

Defined in: [mcp/display.ts:362](https://github.com/Max-Health-Inc/prefab/blob/89a71686ef8a402c953104a66e893262cc245e62/src/mcp/display.ts#L362)

Request camera access (video capture, QR scanning).

***

### microphone?

```ts
optional microphone?: boolean;
```

Defined in: [mcp/display.ts:364](https://github.com/Max-Health-Inc/prefab/blob/89a71686ef8a402c953104a66e893262cc245e62/src/mcp/display.ts#L364)

Request microphone access (audio recording, voice input).

***

### geolocation?

```ts
optional geolocation?: boolean;
```

Defined in: [mcp/display.ts:366](https://github.com/Max-Health-Inc/prefab/blob/89a71686ef8a402c953104a66e893262cc245e62/src/mcp/display.ts#L366)

Request geolocation access (location-aware apps, maps).

***

### clipboardWrite?

```ts
optional clipboardWrite?: boolean;
```

Defined in: [mcp/display.ts:368](https://github.com/Max-Health-Inc/prefab/blob/89a71686ef8a402c953104a66e893262cc245e62/src/mcp/display.ts#L368)

Request clipboard write access (copy-to-clipboard).
