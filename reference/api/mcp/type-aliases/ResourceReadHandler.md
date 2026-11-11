---
url: /prefab/reference/api/mcp/type-aliases/ResourceReadHandler.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / ResourceReadHandler

# Type Alias: ResourceReadHandler

```ts
type ResourceReadHandler = (uri) => Promise<McpResourceReadResult<McpTextResourceContents>>;
```

Defined in: [mcp/resource.ts:227](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/mcp/resource.ts#L227)

`resources/read` handler shape passed to the server — the viewer is always HTML text.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `uri` | `URL` |

## Returns

`Promise`<[`McpResourceReadResult`](McpResourceReadResult.md)<[`McpTextResourceContents`](McpTextResourceContents.md)>>
