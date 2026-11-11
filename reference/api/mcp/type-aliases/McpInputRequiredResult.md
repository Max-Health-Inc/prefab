---
url: /prefab/reference/api/mcp/type-aliases/McpInputRequiredResult.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / McpInputRequiredResult

# Type Alias: McpInputRequiredResult

```ts
type McpInputRequiredResult = object;
```

Defined in: [mcp/types.ts:184](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/mcp/types.ts#L184)

A result asking for input before the call completes; carries `inputRequests`, `requestState` or both.

## Properties

### resultType

```ts
resultType: "input_required";
```

Defined in: [mcp/types.ts:185](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/mcp/types.ts#L185)

***

### inputRequests?

```ts
optional inputRequests?: McpInputRequests;
```

Defined in: [mcp/types.ts:186](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/mcp/types.ts#L186)

***

### requestState?

```ts
optional requestState?: string;
```

Defined in: [mcp/types.ts:188](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/mcp/types.ts#L188)

Opaque state echoed back byte-for-byte on the retry.

***

### \_meta?

```ts
optional _meta?: Record<string, unknown>;
```

Defined in: [mcp/types.ts:189](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/mcp/types.ts#L189)
