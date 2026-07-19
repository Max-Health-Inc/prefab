---
url: /prefab/reference/api/mcp/interfaces/McpResourceContent.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / McpResourceContent

# Interface: McpResourceContent

Defined in: [mcp/types.ts:45](https://github.com/Max-Health-Inc/prefab/blob/c512f3bb2fb808f4335797b98c7b93774e2b1b30/src/mcp/types.ts#L45)

MCP embedded resource content block (compatible with SDK's EmbeddedResource)

## Properties

### type

```ts
type: "resource";
```

Defined in: [mcp/types.ts:46](https://github.com/Max-Health-Inc/prefab/blob/c512f3bb2fb808f4335797b98c7b93774e2b1b30/src/mcp/types.ts#L46)

***

### resource

```ts
resource: 
  | McpTextResourceContents
  | McpBlobResourceContents;
```

Defined in: [mcp/types.ts:47](https://github.com/Max-Health-Inc/prefab/blob/c512f3bb2fb808f4335797b98c7b93774e2b1b30/src/mcp/types.ts#L47)

***

### annotations?

```ts
optional annotations?: Record<string, unknown>;
```

Defined in: [mcp/types.ts:48](https://github.com/Max-Health-Inc/prefab/blob/c512f3bb2fb808f4335797b98c7b93774e2b1b30/src/mcp/types.ts#L48)

***

### \_meta?

```ts
optional _meta?: Record<string, unknown>;
```

Defined in: [mcp/types.ts:49](https://github.com/Max-Health-Inc/prefab/blob/c512f3bb2fb808f4335797b98c7b93774e2b1b30/src/mcp/types.ts#L49)
