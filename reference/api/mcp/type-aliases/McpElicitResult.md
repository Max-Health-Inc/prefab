---
url: /prefab/reference/api/mcp/type-aliases/McpElicitResult.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / McpElicitResult

# Type Alias: McpElicitResult

```ts
type McpElicitResult = object;
```

Defined in: [mcp/types.ts:264](https://github.com/Max-Health-Inc/prefab/blob/dc9055d700a7e96734dfd959d1cb775e88a3b293/src/mcp/types.ts#L264)

What the client sends back for one request, keyed the same way.

## Properties

### action

```ts
action: "accept" | "decline" | "cancel";
```

Defined in: [mcp/types.ts:265](https://github.com/Max-Health-Inc/prefab/blob/dc9055d700a7e96734dfd959d1cb775e88a3b293/src/mcp/types.ts#L265)

***

### content?

```ts
optional content?: Record<string, string | number | boolean | string[]>;
```

Defined in: [mcp/types.ts:266](https://github.com/Max-Health-Inc/prefab/blob/dc9055d700a7e96734dfd959d1cb775e88a3b293/src/mcp/types.ts#L266)
