---
url: /prefab/reference/api/mcp/interfaces/McpAppPermissions.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / McpAppPermissions

# Interface: McpAppPermissions

Defined in: [mcp/resource.ts:36](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/mcp/resource.ts#L36)

Permission Policy requests for MCP Apps resources.

## Properties

### camera?

```ts
optional camera?: boolean;
```

Defined in: [mcp/resource.ts:38](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/mcp/resource.ts#L38)

Request camera access (video capture, QR scanning).

***

### microphone?

```ts
optional microphone?: boolean;
```

Defined in: [mcp/resource.ts:40](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/mcp/resource.ts#L40)

Request microphone access (audio recording, voice input).

***

### geolocation?

```ts
optional geolocation?: boolean;
```

Defined in: [mcp/resource.ts:42](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/mcp/resource.ts#L42)

Request geolocation access (location-aware apps, maps).

***

### clipboardWrite?

```ts
optional clipboardWrite?: boolean;
```

Defined in: [mcp/resource.ts:44](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/mcp/resource.ts#L44)

Request clipboard write access (copy-to-clipboard).
