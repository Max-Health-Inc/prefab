---
url: /prefab/reference/api/mcp/type-aliases/McpElicitResult.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / McpElicitResult

# Type Alias: McpElicitResult

```ts
type McpElicitResult = object;
```

Defined in: [mcp/types.ts:176](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/mcp/types.ts#L176)

What the client sends back for one request, keyed the same way.

## Properties

### action

```ts
action: "accept" | "decline" | "cancel";
```

Defined in: [mcp/types.ts:177](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/mcp/types.ts#L177)

***

### content?

```ts
optional content?: Record<string, string | number | boolean | string[]>;
```

Defined in: [mcp/types.ts:178](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/mcp/types.ts#L178)
