---
url: /prefab/reference/api/mcp/type-aliases/McpResourceReadResult.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / McpResourceReadResult

# Type Alias: McpResourceReadResult\<C>

```ts
type McpResourceReadResult<C> = object;
```

Defined in: [mcp/types.ts:143](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/mcp/types.ts#L143)

A `resources/read` result carrying the required cache fields.

Generic over the contents kind so a handler that only ever returns text (the
prefab viewer, for one) does not force callers to narrow the union.

A type alias rather than an interface, so it satisfies the SDK's passthrough
`ReadResourceResult` (`{ [x: string]: unknown }`) without a cast. See
[McpTextResourceContents](McpTextResourceContents.md) for why the distinction matters — returning
this straight from an SDK read handler is the whole point of the type, and as
an interface it did not typecheck there.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `C` *extends* | [`McpTextResourceContents`](McpTextResourceContents.md) | [`McpBlobResourceContents`](McpBlobResourceContents.md) | | [`McpTextResourceContents`](McpTextResourceContents.md) | [`McpBlobResourceContents`](McpBlobResourceContents.md) |

## Properties

### contents

```ts
contents: C[];
```

Defined in: [mcp/types.ts:146](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/mcp/types.ts#L146)

***

### ttlMs

```ts
ttlMs: number;
```

Defined in: [mcp/types.ts:148](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/mcp/types.ts#L148)

Cache lifetime in milliseconds.

***

### cacheScope

```ts
cacheScope: McpCacheScope;
```

Defined in: [mcp/types.ts:150](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/mcp/types.ts#L150)

Whether shared caches may store the result.
