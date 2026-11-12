---
url: /prefab/reference/api/mcp/type-aliases/McpDisplayResult.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / McpDisplayResult

# Type Alias: McpDisplayResult\<S>

```ts
type McpDisplayResult<S> = McpToolResult<S> & object;
```

Defined in: [mcp/types.ts:61](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/mcp/types.ts#L61)

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
