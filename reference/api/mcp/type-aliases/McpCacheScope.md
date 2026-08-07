---
url: /prefab/reference/api/mcp/type-aliases/McpCacheScope.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / McpCacheScope

# Type Alias: McpCacheScope

```ts
type McpCacheScope = "public" | "private";
```

Defined in: [mcp/types.ts:113](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/mcp/types.ts#L113)

Cache scopes defined for cacheable results.

`public` — the result may be stored by shared caches.
`private` — only the requesting client may cache it.
