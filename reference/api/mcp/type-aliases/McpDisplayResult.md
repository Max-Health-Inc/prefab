---
url: /prefab/reference/api/mcp/type-aliases/McpDisplayResult.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / McpDisplayResult

# Type Alias: McpDisplayResult\<S>

```ts
type McpDisplayResult<S> = McpToolResult<S> & object;
```

Defined in: [mcp/types.ts:116](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/types.ts#L116)

A tool result whose `structuredContent` is guaranteed present.

`McpToolResult.structuredContent` is optional because a hand-written result
may legitimately omit it. Every prefab display helper populates it, and
saying so in the return type spares callers a null check on a field that is
never absent — reading `result.structuredContent.view` should not need one.

Assignable to `McpToolResult<S>` in every position, so widening a helper's
return type to this breaks nothing.

## Type Declaration

### structuredContent

```ts
structuredContent: S;
```

## Type Parameters

| Type Parameter |
| ------ |
| `S` |
