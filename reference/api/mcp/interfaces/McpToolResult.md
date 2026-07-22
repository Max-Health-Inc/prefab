---
url: /prefab/reference/api/mcp/interfaces/McpToolResult.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / McpToolResult

# Interface: McpToolResult

Defined in: [mcp/types.ts:62](https://github.com/Max-Health-Inc/prefab/blob/de93a446678c2f2b8a07006b7acfdb8a5f593717/src/mcp/types.ts#L62)

MCP tool result — returned from tool handlers.

Structurally assignable to `@modelcontextprotocol/sdk`'s `CallToolResult`.
The index signature allows the SDK's `Result` base interface to be satisfied
without requiring an explicit cast.

## Indexable

```ts
[key: string]: unknown
```

## Properties

### content

```ts
content: McpContent[];
```

Defined in: [mcp/types.ts:63](https://github.com/Max-Health-Inc/prefab/blob/de93a446678c2f2b8a07006b7acfdb8a5f593717/src/mcp/types.ts#L63)

***

### structuredContent?

```ts
optional structuredContent?: Record<string, unknown>;
```

Defined in: [mcp/types.ts:65](https://github.com/Max-Health-Inc/prefab/blob/de93a446678c2f2b8a07006b7acfdb8a5f593717/src/mcp/types.ts#L65)

Structured payload forwarded to MCP Apps iframes via ui/notifications/tool-result.

***

### isError?

```ts
optional isError?: boolean;
```

Defined in: [mcp/types.ts:66](https://github.com/Max-Health-Inc/prefab/blob/de93a446678c2f2b8a07006b7acfdb8a5f593717/src/mcp/types.ts#L66)

***

### \_meta?

```ts
optional _meta?: Record<string, unknown>;
```

Defined in: [mcp/types.ts:67](https://github.com/Max-Health-Inc/prefab/blob/de93a446678c2f2b8a07006b7acfdb8a5f593717/src/mcp/types.ts#L67)
