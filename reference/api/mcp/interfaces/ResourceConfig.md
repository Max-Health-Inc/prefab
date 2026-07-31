---
url: /prefab/reference/api/mcp/interfaces/ResourceConfig.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / ResourceConfig

# Interface: ResourceConfig

Defined in: [mcp/resource.ts:282](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/resource.ts#L282)

Registration config accepted by both SDK generations.

## Properties

### title?

```ts
optional title?: string;
```

Defined in: [mcp/resource.ts:283](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/resource.ts#L283)

***

### mimeType

```ts
mimeType: string;
```

Defined in: [mcp/resource.ts:284](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/resource.ts#L284)

***

### description?

```ts
optional description?: string;
```

Defined in: [mcp/resource.ts:285](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/resource.ts#L285)

***

### \_meta?

```ts
optional _meta?: Record<string, unknown>;
```

Defined in: [mcp/resource.ts:286](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/resource.ts#L286)

***

### cacheHint?

```ts
optional cacheHint?: McpCacheHint;
```

Defined in: [mcp/resource.ts:288](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/resource.ts#L288)

Per-resource cache hint (SDK v2; ignored by servers that do not read it).
