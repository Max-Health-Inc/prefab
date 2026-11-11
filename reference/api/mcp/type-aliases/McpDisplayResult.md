---
url: /prefab/reference/api/mcp/type-aliases/McpDisplayResult.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / McpDisplayResult

# Type Alias: McpDisplayResult\<S>

```ts
type McpDisplayResult<S> = McpToolResult<S> & object;
```

Defined in: [mcp/types.ts:61](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/mcp/types.ts#L61)

A tool result whose `structuredContent` is always present, as every prefab display helper returns.

## Type Declaration

### structuredContent

```ts
structuredContent: S;
```

## Type Parameters

| Type Parameter |
| ------ |
| `S` |
