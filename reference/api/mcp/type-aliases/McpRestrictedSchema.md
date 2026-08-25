---
url: /prefab/reference/api/mcp/type-aliases/McpRestrictedSchema.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / McpRestrictedSchema

# Type Alias: McpRestrictedSchema

```ts
type McpRestrictedSchema = object;
```

Defined in: [mcp/types.ts:232](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/types.ts#L232)

The flat object schema an `elicitation/create` request asks the client to fill.

## Properties

### type

```ts
type: "object";
```

Defined in: [mcp/types.ts:233](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/types.ts#L233)

***

### properties

```ts
properties: Record<string, McpPrimitiveSchema>;
```

Defined in: [mcp/types.ts:234](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/types.ts#L234)

***

### required?

```ts
optional required?: string[];
```

Defined in: [mcp/types.ts:235](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/types.ts#L235)
