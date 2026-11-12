---
url: /prefab/reference/api/mcp/type-aliases/McpResourceReadResult.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / McpResourceReadResult

# Type Alias: McpResourceReadResult\<C>

```ts
type McpResourceReadResult<C> = object;
```

Defined in: [mcp/types.ts:77](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/mcp/types.ts#L77)

A `resources/read` result with its required cache fields, generic over the contents kind.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `C` *extends* | [`McpTextResourceContents`](McpTextResourceContents.md) | [`McpBlobResourceContents`](McpBlobResourceContents.md) | | [`McpTextResourceContents`](McpTextResourceContents.md) | [`McpBlobResourceContents`](McpBlobResourceContents.md) |

## Properties

### contents

```ts
contents: C[];
```

Defined in: [mcp/types.ts:80](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/mcp/types.ts#L80)

***

### ttlMs

```ts
ttlMs: number;
```

Defined in: [mcp/types.ts:82](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/mcp/types.ts#L82)

Cache lifetime in milliseconds.

***

### cacheScope

```ts
cacheScope: McpCacheScope;
```

Defined in: [mcp/types.ts:84](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/mcp/types.ts#L84)

Whether shared caches may store the result.
