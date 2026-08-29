---
url: /prefab/reference/api/mcp/type-aliases/McpInputRequiredResult.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / McpInputRequiredResult

# Type Alias: McpInputRequiredResult

```ts
type McpInputRequiredResult = object;
```

Defined in: [mcp/types.ts:279](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/types.ts#L279)

A result asking the client for input before the call can complete.

At least one of `inputRequests` or `requestState` must be present, and
`resultType` must be `'input_required'`: a server on this revision always
stamps the discriminator, and a client that does not see it treats the result
as `'complete'` and never retries.

## Properties

### resultType

```ts
resultType: "input_required";
```

Defined in: [mcp/types.ts:280](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/types.ts#L280)

***

### inputRequests?

```ts
optional inputRequests?: McpInputRequests;
```

Defined in: [mcp/types.ts:281](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/types.ts#L281)

***

### requestState?

```ts
optional requestState?: string;
```

Defined in: [mcp/types.ts:283](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/types.ts#L283)

Opaque state echoed back byte-for-byte on the retry.

***

### \_meta?

```ts
optional _meta?: Record<string, unknown>;
```

Defined in: [mcp/types.ts:284](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/types.ts#L284)
