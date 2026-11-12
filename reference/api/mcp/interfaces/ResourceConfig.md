---
url: /prefab/reference/api/mcp/interfaces/ResourceConfig.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / ResourceConfig

# Interface: ResourceConfig

Defined in: [mcp/resource.ts:217](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/mcp/resource.ts#L217)

Registration config accepted by both SDK generations.

## Properties

### title?

```ts
optional title?: string;
```

Defined in: [mcp/resource.ts:218](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/mcp/resource.ts#L218)

***

### mimeType

```ts
mimeType: string;
```

Defined in: [mcp/resource.ts:219](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/mcp/resource.ts#L219)

***

### description?

```ts
optional description?: string;
```

Defined in: [mcp/resource.ts:220](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/mcp/resource.ts#L220)

***

### \_meta?

```ts
optional _meta?: Record<string, unknown>;
```

Defined in: [mcp/resource.ts:221](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/mcp/resource.ts#L221)

***

### cacheHint?

```ts
optional cacheHint?: McpCacheHint;
```

Defined in: [mcp/resource.ts:223](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/mcp/resource.ts#L223)

Per-resource cache hint (SDK v2; ignored by servers that do not read it).
