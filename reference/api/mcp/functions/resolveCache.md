---
url: /prefab/reference/api/mcp/functions/resolveCache.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / resolveCache

# Function: resolveCache()

```ts
function resolveCache(hint?, defaults?): Required<McpCacheHint>;
```

Defined in: [mcp/resource.ts:250](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/resource.ts#L250)

Fill in and validate `CacheableResult` fields, throwing on values the SDK would silently replace with `ttlMs: 0`.

## Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `hint?` | [`McpCacheHint`](../type-aliases/McpCacheHint.md) | `undefined` |
| `defaults?` | `Required`<[`McpCacheHint`](../type-aliases/McpCacheHint.md)> | `DEFAULT_VIEWER_CACHE` |

## Returns

`Required`<[`McpCacheHint`](../type-aliases/McpCacheHint.md)>
