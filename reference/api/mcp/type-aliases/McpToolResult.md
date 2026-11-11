---
url: /prefab/reference/api/mcp/type-aliases/McpToolResult.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / McpToolResult

# Type Alias: McpToolResult\<S>

```ts
type McpToolResult<S> = object;
```

Defined in: [mcp/types.ts:51](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/mcp/types.ts#L51)

A tool result assignable to the SDK's `CallToolResult`; `structuredContent` keeps its payload type (any JSON since SEP-2106).

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `S` | `unknown` |

## Indexable

```ts
[key: string]: unknown
```

## Properties

### content

```ts
content: McpContent[];
```

Defined in: [mcp/types.ts:52](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/mcp/types.ts#L52)

***

### structuredContent?

```ts
optional structuredContent?: S;
```

Defined in: [mcp/types.ts:54](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/mcp/types.ts#L54)

Structured payload forwarded to MCP Apps iframes via ui/notifications/tool-result.

***

### isError?

```ts
optional isError?: boolean;
```

Defined in: [mcp/types.ts:55](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/mcp/types.ts#L55)

***

### \_meta?

```ts
optional _meta?: Record<string, unknown>;
```

Defined in: [mcp/types.ts:56](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/mcp/types.ts#L56)
