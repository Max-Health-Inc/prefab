---
url: /prefab/reference/api/mcp/interfaces/McpToolResult.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / McpToolResult

# Interface: McpToolResult\<S>

Defined in: [mcp/types.ts:71](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/types.ts#L71)

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

Defined in: [mcp/types.ts:72](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/types.ts#L72)

***

### structuredContent?

```ts
optional structuredContent?: S;
```

Defined in: [mcp/types.ts:74](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/types.ts#L74)

Structured payload forwarded to MCP Apps iframes via ui/notifications/tool-result.

***

### isError?

```ts
optional isError?: boolean;
```

Defined in: [mcp/types.ts:75](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/types.ts#L75)

***

### \_meta?

```ts
optional _meta?: Record<string, unknown>;
```

Defined in: [mcp/types.ts:76](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/types.ts#L76)
