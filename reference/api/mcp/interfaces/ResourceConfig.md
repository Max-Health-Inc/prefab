---
url: /prefab/reference/api/mcp/interfaces/ResourceConfig.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / ResourceConfig

# Interface: ResourceConfig

Defined in: [mcp/resource.ts:283](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/resource.ts#L283)

Registration config accepted by both SDK generations.

## Properties

### title?

```ts
optional title?: string;
```

Defined in: [mcp/resource.ts:284](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/resource.ts#L284)

***

### mimeType

```ts
mimeType: string;
```

Defined in: [mcp/resource.ts:285](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/resource.ts#L285)

***

### description?

```ts
optional description?: string;
```

Defined in: [mcp/resource.ts:286](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/resource.ts#L286)

***

### \_meta?

```ts
optional _meta?: Record<string, unknown>;
```

Defined in: [mcp/resource.ts:287](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/resource.ts#L287)

***

### cacheHint?

```ts
optional cacheHint?: McpCacheHint;
```

Defined in: [mcp/resource.ts:289](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/resource.ts#L289)

Per-resource cache hint (SDK v2; ignored by servers that do not read it).
