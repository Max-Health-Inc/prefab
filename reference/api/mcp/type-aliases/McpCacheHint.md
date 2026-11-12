---
url: /prefab/reference/api/mcp/type-aliases/McpCacheHint.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / McpCacheHint

# Type Alias: McpCacheHint

```ts
type McpCacheHint = object;
```

Defined in: [mcp/types.ts:69](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/mcp/types.ts#L69)

Cache fields of cacheable results (SEP-2549). The result's own values beat a server hint; with neither, nothing is cached.

## Properties

### ttlMs?

```ts
optional ttlMs?: number;
```

Defined in: [mcp/types.ts:71](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/mcp/types.ts#L71)

Cache lifetime in milliseconds. Must be a non-negative safe integer.

***

### cacheScope?

```ts
optional cacheScope?: McpCacheScope;
```

Defined in: [mcp/types.ts:73](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/mcp/types.ts#L73)

Whether shared caches may store the result.
