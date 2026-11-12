---
url: /prefab/reference/api/mcp/functions/resolveCache.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / resolveCache

# Function: resolveCache()

```ts
function resolveCache(hint?, defaults?): Required<McpCacheHint>;
```

Defined in: [mcp/resource.ts:245](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/mcp/resource.ts#L245)

Fill in and validate `CacheableResult` fields, throwing on values the SDK would silently replace with `ttlMs: 0`.

## Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `hint?` | [`McpCacheHint`](../type-aliases/McpCacheHint.md) | `undefined` |
| `defaults?` | `Required`<[`McpCacheHint`](../type-aliases/McpCacheHint.md)> | `DEFAULT_VIEWER_CACHE` |

## Returns

`Required`<[`McpCacheHint`](../type-aliases/McpCacheHint.md)>
