---
url: /prefab/reference/api/mcp/type-aliases/ResourceReadHandler.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / ResourceReadHandler

# Type Alias: ResourceReadHandler

```ts
type ResourceReadHandler = (uri) => Promise<McpResourceReadResult<McpTextResourceContents>>;
```

Defined in: [mcp/resource.ts:232](https://github.com/Max-Health-Inc/prefab/blob/4e102b3517c5a62f380fd91b75fb8c49a1f96cec/src/mcp/resource.ts#L232)

`resources/read` handler shape passed to the server — the viewer is always HTML text.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `uri` | `URL` |

## Returns

`Promise`<[`McpResourceReadResult`](McpResourceReadResult.md)<[`McpTextResourceContents`](McpTextResourceContents.md)>>
