---
url: /prefab/reference/api/mcp/type-aliases/McpRestrictedSchema.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / McpRestrictedSchema

# Type Alias: McpRestrictedSchema

```ts
type McpRestrictedSchema = object;
```

Defined in: [mcp/types.ts:144](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/mcp/types.ts#L144)

The flat object schema an `elicitation/create` request asks the client to fill.

## Properties

### type

```ts
type: "object";
```

Defined in: [mcp/types.ts:145](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/mcp/types.ts#L145)

***

### properties

```ts
properties: Record<string, McpPrimitiveSchema>;
```

Defined in: [mcp/types.ts:146](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/mcp/types.ts#L146)

***

### required?

```ts
optional required?: string[];
```

Defined in: [mcp/types.ts:147](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/mcp/types.ts#L147)
