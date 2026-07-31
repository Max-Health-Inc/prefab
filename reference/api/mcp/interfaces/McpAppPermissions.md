---
url: /prefab/reference/api/mcp/interfaces/McpAppPermissions.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / McpAppPermissions

# Interface: McpAppPermissions

Defined in: [mcp/resource.ts:35](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/resource.ts#L35)

Permission Policy requests for MCP Apps resources.

## Properties

### camera?

```ts
optional camera?: boolean;
```

Defined in: [mcp/resource.ts:37](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/resource.ts#L37)

Request camera access (video capture, QR scanning).

***

### microphone?

```ts
optional microphone?: boolean;
```

Defined in: [mcp/resource.ts:39](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/resource.ts#L39)

Request microphone access (audio recording, voice input).

***

### geolocation?

```ts
optional geolocation?: boolean;
```

Defined in: [mcp/resource.ts:41](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/resource.ts#L41)

Request geolocation access (location-aware apps, maps).

***

### clipboardWrite?

```ts
optional clipboardWrite?: boolean;
```

Defined in: [mcp/resource.ts:43](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/resource.ts#L43)

Request clipboard write access (copy-to-clipboard).
