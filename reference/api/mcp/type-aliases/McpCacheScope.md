---
url: /prefab/reference/api/mcp/type-aliases/McpCacheScope.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / McpCacheScope

# Type Alias: McpCacheScope

```ts
type McpCacheScope = "public" | "private";
```

Defined in: [mcp/types.ts:126](https://github.com/Max-Health-Inc/prefab/blob/605eb676dc900a2603365e87c9dd47f400d7af46/src/mcp/types.ts#L126)

Cache scopes defined for cacheable results.

`public` — the result may be stored by shared caches.
`private` — only the requesting client may cache it.
