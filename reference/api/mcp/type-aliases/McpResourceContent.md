---
url: /prefab/reference/api/mcp/type-aliases/McpResourceContent.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / McpResourceContent

# Type Alias: McpResourceContent

```ts
type McpResourceContent = object;
```

Defined in: [mcp/types.ts:40](https://github.com/Max-Health-Inc/prefab/blob/1890bd36e825570eeb35b14d1f5a0235caa2c0fb/src/mcp/types.ts#L40)

MCP embedded resource content block (compatible with SDK's EmbeddedResource)

## Properties

### type

```ts
type: "resource";
```

Defined in: [mcp/types.ts:41](https://github.com/Max-Health-Inc/prefab/blob/1890bd36e825570eeb35b14d1f5a0235caa2c0fb/src/mcp/types.ts#L41)

***

### resource

```ts
resource: 
  | McpTextResourceContents
  | McpBlobResourceContents;
```

Defined in: [mcp/types.ts:42](https://github.com/Max-Health-Inc/prefab/blob/1890bd36e825570eeb35b14d1f5a0235caa2c0fb/src/mcp/types.ts#L42)

***

### annotations?

```ts
optional annotations?: Record<string, unknown>;
```

Defined in: [mcp/types.ts:43](https://github.com/Max-Health-Inc/prefab/blob/1890bd36e825570eeb35b14d1f5a0235caa2c0fb/src/mcp/types.ts#L43)

***

### \_meta?

```ts
optional _meta?: Record<string, unknown>;
```

Defined in: [mcp/types.ts:44](https://github.com/Max-Health-Inc/prefab/blob/1890bd36e825570eeb35b14d1f5a0235caa2c0fb/src/mcp/types.ts#L44)
