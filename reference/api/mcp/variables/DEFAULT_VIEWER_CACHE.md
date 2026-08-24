---
url: /prefab/reference/api/mcp/variables/DEFAULT_VIEWER_CACHE.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / DEFAULT\_VIEWER\_CACHE

# Variable: DEFAULT\_VIEWER\_CACHE

```ts
const DEFAULT_VIEWER_CACHE: Required<McpCacheHint>;
```

Defined in: [mcp/resource.ts:159](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/mcp/resource.ts#L159)

Default cache hint for the viewer resource.

The HTML is a pure function of this package's `VERSION` (the CDN base pins
the exact version), so it cannot change for a given server build — it is
safely shared-cacheable. Without this the SDK falls back to the conservative
`{ ttlMs: 0, cacheScope: 'private' }` and the viewer is re-fetched every time.
