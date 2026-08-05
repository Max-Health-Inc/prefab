---
url: /prefab/reference/api/mcp/type-aliases/McpCacheScope.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / McpCacheScope

# Type Alias: McpCacheScope

```ts
type McpCacheScope = "public" | "private";
```

Defined in: [mcp/types.ts:113](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/mcp/types.ts#L113)

Cache scopes defined for cacheable results.

`public` — the result may be stored by shared caches.
`private` — only the requesting client may cache it.
