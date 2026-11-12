---
url: /prefab/reference/api/mcp/interfaces/ResourceConfig.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / ResourceConfig

# Interface: ResourceConfig

Defined in: [mcp/resource.ts:222](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/resource.ts#L222)

Registration config accepted by both SDK generations.

## Properties

### title?

```ts
optional title?: string;
```

Defined in: [mcp/resource.ts:223](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/resource.ts#L223)

***

### mimeType

```ts
mimeType: string;
```

Defined in: [mcp/resource.ts:224](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/resource.ts#L224)

***

### description?

```ts
optional description?: string;
```

Defined in: [mcp/resource.ts:225](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/resource.ts#L225)

***

### \_meta?

```ts
optional _meta?: Record<string, unknown>;
```

Defined in: [mcp/resource.ts:226](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/resource.ts#L226)

***

### cacheHint?

```ts
optional cacheHint?: McpCacheHint;
```

Defined in: [mcp/resource.ts:228](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/resource.ts#L228)

Per-resource cache hint (SDK v2; ignored by servers that do not read it).
