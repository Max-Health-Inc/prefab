---
url: /prefab/reference/api/mcp/type-aliases/ResourceReadHandler.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / ResourceReadHandler

# Type Alias: ResourceReadHandler

```ts
type ResourceReadHandler = (uri) => Promise<McpResourceReadResult<McpTextResourceContents>>;
```

Defined in: [mcp/resource.ts:292](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/resource.ts#L292)

`resources/read` handler shape passed to the server — the viewer is always HTML text.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `uri` | `URL` |

## Returns

`Promise`<[`McpResourceReadResult`](../interfaces/McpResourceReadResult.md)<[`McpTextResourceContents`](../interfaces/McpTextResourceContents.md)>>
