---
url: /prefab/reference/api/mcp/type-aliases/McpToolResult.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / McpToolResult

# Type Alias: McpToolResult\<S>

```ts
type McpToolResult<S> = object;
```

Defined in: [mcp/types.ts:96](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/types.ts#L96)

MCP tool result — returned from tool handlers.

Structurally assignable to the SDK's `CallToolResult`. The index signature
allows the SDK's `Result` base interface to be satisfied without a cast.

`structuredContent` is generic rather than `Record<string, unknown>`: protocol
revision 2026-07-28 loosened it to any JSON value (SEP-2106), and keeping the
payload type lets callers read it back without casting.

The wire discriminator `resultType` (SEP-2322) is intentionally absent. The
SDK's protocol layer stamps it on encode and strips it before results reach
consumers, so handlers do not author it for ordinary complete results. The
index signature still admits `resultType: 'input_required'` for the one case
a handler does own — multi-round-trip interim results.

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

Defined in: [mcp/types.ts:97](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/types.ts#L97)

***

### structuredContent?

```ts
optional structuredContent?: S;
```

Defined in: [mcp/types.ts:99](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/types.ts#L99)

Structured payload forwarded to MCP Apps iframes via ui/notifications/tool-result.

***

### isError?

```ts
optional isError?: boolean;
```

Defined in: [mcp/types.ts:100](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/types.ts#L100)

***

### \_meta?

```ts
optional _meta?: Record<string, unknown>;
```

Defined in: [mcp/types.ts:101](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/types.ts#L101)
