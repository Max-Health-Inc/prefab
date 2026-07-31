---
url: /prefab/reference/api/mcp/interfaces/McpCacheHint.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / McpCacheHint

# Interface: McpCacheHint

Defined in: [mcp/types.ts:99](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/types.ts#L99)

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

Defined in: [mcp/types.ts:101](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/types.ts#L101)

Cache lifetime in milliseconds. Must be a non-negative safe integer.

***

### cacheScope?

```ts
optional cacheScope?: McpCacheScope;
```

Defined in: [mcp/types.ts:103](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/types.ts#L103)

Whether shared caches may store the result.
