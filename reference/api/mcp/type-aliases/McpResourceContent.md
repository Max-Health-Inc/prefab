---
url: /prefab/reference/api/mcp/type-aliases/McpResourceContent.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / McpResourceContent

# Type Alias: McpResourceContent

```ts
type McpResourceContent = object;
```

Defined in: [mcp/types.ts:70](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/types.ts#L70)

MCP embedded resource content block (compatible with SDK's EmbeddedResource)

## Properties

### type

```ts
type: "resource";
```

Defined in: [mcp/types.ts:71](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/types.ts#L71)

***

### resource

```ts
resource: 
  | McpTextResourceContents
  | McpBlobResourceContents;
```

Defined in: [mcp/types.ts:72](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/types.ts#L72)

***

### annotations?

```ts
optional annotations?: Record<string, unknown>;
```

Defined in: [mcp/types.ts:73](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/types.ts#L73)

***

### \_meta?

```ts
optional _meta?: Record<string, unknown>;
```

Defined in: [mcp/types.ts:74](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/types.ts#L74)
