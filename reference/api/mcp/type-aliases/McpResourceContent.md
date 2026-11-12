---
url: /prefab/reference/api/mcp/type-aliases/McpResourceContent.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / McpResourceContent

# Type Alias: McpResourceContent

```ts
type McpResourceContent = object;
```

Defined in: [mcp/types.ts:40](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/types.ts#L40)

MCP embedded resource content block (compatible with SDK's EmbeddedResource)

## Properties

### type

```ts
type: "resource";
```

Defined in: [mcp/types.ts:41](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/types.ts#L41)

***

### resource

```ts
resource: 
  | McpTextResourceContents
  | McpBlobResourceContents;
```

Defined in: [mcp/types.ts:42](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/types.ts#L42)

***

### annotations?

```ts
optional annotations?: Record<string, unknown>;
```

Defined in: [mcp/types.ts:43](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/types.ts#L43)

***

### \_meta?

```ts
optional _meta?: Record<string, unknown>;
```

Defined in: [mcp/types.ts:44](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/types.ts#L44)
