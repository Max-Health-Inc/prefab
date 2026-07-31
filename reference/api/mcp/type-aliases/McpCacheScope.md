---
url: /prefab/reference/api/mcp/type-aliases/McpCacheScope.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / McpCacheScope

# Type Alias: McpCacheScope

```ts
type McpCacheScope = "public" | "private";
```

Defined in: [mcp/types.ts:88](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/types.ts#L88)

Cache scopes defined for cacheable results.

`public` — the result may be stored by shared caches.
`private` — only the requesting client may cache it.
