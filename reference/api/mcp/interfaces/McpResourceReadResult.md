---
url: /prefab/reference/api/mcp/interfaces/McpResourceReadResult.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / McpResourceReadResult

# Interface: McpResourceReadResult\<C>

Defined in: [mcp/types.ts:112](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/types.ts#L112)

A `resources/read` result carrying the required cache fields.

Generic over the contents kind so a handler that only ever returns text (the
prefab viewer, for one) does not force callers to narrow the union.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `C` *extends* | [`McpTextResourceContents`](McpTextResourceContents.md) | [`McpBlobResourceContents`](McpBlobResourceContents.md) | | [`McpTextResourceContents`](McpTextResourceContents.md) | [`McpBlobResourceContents`](McpBlobResourceContents.md) |

## Properties

### contents

```ts
contents: C[];
```

Defined in: [mcp/types.ts:115](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/types.ts#L115)

***

### ttlMs

```ts
ttlMs: number;
```

Defined in: [mcp/types.ts:117](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/types.ts#L117)

Cache lifetime in milliseconds.

***

### cacheScope

```ts
cacheScope: McpCacheScope;
```

Defined in: [mcp/types.ts:119](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/types.ts#L119)

Whether shared caches may store the result.
