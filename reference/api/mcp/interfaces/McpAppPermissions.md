---
url: /prefab/reference/api/mcp/interfaces/McpAppPermissions.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / McpAppPermissions

# Interface: McpAppPermissions

Defined in: [mcp/resource.ts:26](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/mcp/resource.ts#L26)

Permission Policy requests for MCP Apps resources.

## Properties

### camera?

```ts
optional camera?: boolean;
```

Defined in: [mcp/resource.ts:28](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/mcp/resource.ts#L28)

Request camera access (video capture, QR scanning).

***

### microphone?

```ts
optional microphone?: boolean;
```

Defined in: [mcp/resource.ts:30](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/mcp/resource.ts#L30)

Request microphone access (audio recording, voice input).

***

### geolocation?

```ts
optional geolocation?: boolean;
```

Defined in: [mcp/resource.ts:32](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/mcp/resource.ts#L32)

Request geolocation access (location-aware apps, maps).

***

### clipboardWrite?

```ts
optional clipboardWrite?: boolean;
```

Defined in: [mcp/resource.ts:34](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/mcp/resource.ts#L34)

Request clipboard write access (copy-to-clipboard).
