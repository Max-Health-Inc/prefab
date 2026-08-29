---
url: /prefab/reference/api/mcp/functions/resolveCache.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / resolveCache

# Function: resolveCache()

```ts
function resolveCache(hint?, defaults?): Required<McpCacheHint>;
```

Defined in: [mcp/resource.ts:325](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/resource.ts#L325)

Fill in and validate the `CacheableResult` fields, rejecting values the SDK
would silently discard in favour of `ttlMs: 0`.

`defaults` differ per resource kind: the viewer HTML is a pure function of the
package version and is safely shared-cacheable, while an `a2ui://` surface is
rebuilt on every read and defaults to no caching. Exported so `./a2ui.ts`
resolves its hints through the same guard rather than restating it.

## Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `hint?` | [`McpCacheHint`](../type-aliases/McpCacheHint.md) | `undefined` |
| `defaults?` | `Required`<[`McpCacheHint`](../type-aliases/McpCacheHint.md)> | `DEFAULT_VIEWER_CACHE` |

## Returns

`Required`<[`McpCacheHint`](../type-aliases/McpCacheHint.md)>
