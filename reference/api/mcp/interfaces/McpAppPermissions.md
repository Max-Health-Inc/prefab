---
url: /prefab/reference/api/mcp/interfaces/McpAppPermissions.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / McpAppPermissions

# Interface: McpAppPermissions

Defined in: [mcp/resource.ts:36](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/resource.ts#L36)

Permission Policy requests for MCP Apps resources.

## Properties

### camera?

```ts
optional camera?: boolean;
```

Defined in: [mcp/resource.ts:38](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/resource.ts#L38)

Request camera access (video capture, QR scanning).

***

### microphone?

```ts
optional microphone?: boolean;
```

Defined in: [mcp/resource.ts:40](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/resource.ts#L40)

Request microphone access (audio recording, voice input).

***

### geolocation?

```ts
optional geolocation?: boolean;
```

Defined in: [mcp/resource.ts:42](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/resource.ts#L42)

Request geolocation access (location-aware apps, maps).

***

### clipboardWrite?

```ts
optional clipboardWrite?: boolean;
```

Defined in: [mcp/resource.ts:44](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/resource.ts#L44)

Request clipboard write access (copy-to-clipboard).
