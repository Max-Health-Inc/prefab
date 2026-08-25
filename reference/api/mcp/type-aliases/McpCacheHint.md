---
url: /prefab/reference/api/mcp/type-aliases/McpCacheHint.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / McpCacheHint

# Type Alias: McpCacheHint

```ts
type McpCacheHint = object;
```

Defined in: [mcp/types.ts:137](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/types.ts#L137)

Cache fields required on results from the cacheable operations
(`tools/list`, `prompts/list`, `resources/list`, `resources/templates/list`,
`resources/read`, `server/discover`).

Values a handler returns on the result take precedence over any hint
configured on the server; when neither is present the SDK falls back to the
conservative `{ ttlMs: 0, cacheScope: 'private' }` — i.e. no caching.

## Properties

### ttlMs?

```ts
optional ttlMs?: number;
```

Defined in: [mcp/types.ts:139](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/types.ts#L139)

Cache lifetime in milliseconds. Must be a non-negative safe integer.

***

### cacheScope?

```ts
optional cacheScope?: McpCacheScope;
```

Defined in: [mcp/types.ts:141](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/types.ts#L141)

Whether shared caches may store the result.
