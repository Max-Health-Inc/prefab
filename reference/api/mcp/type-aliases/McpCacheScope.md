---
url: /prefab/reference/api/mcp/type-aliases/McpCacheScope.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / McpCacheScope

# Type Alias: McpCacheScope

```ts
type McpCacheScope = "public" | "private";
```

Defined in: [mcp/types.ts:126](https://github.com/Max-Health-Inc/prefab/blob/7a2e43417fa83301b42abd7447c199249e6c40f6/src/mcp/types.ts#L126)

Cache scopes defined for cacheable results.

`public` — the result may be stored by shared caches.
`private` — only the requesting client may cache it.
