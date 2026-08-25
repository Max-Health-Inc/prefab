---
url: /prefab/reference/api/mcp/type-aliases/ResourceReadHandler.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / ResourceReadHandler

# Type Alias: ResourceReadHandler

```ts
type ResourceReadHandler = (uri) => Promise<McpResourceReadResult<McpTextResourceContents>>;
```

Defined in: [mcp/resource.ts:293](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/resource.ts#L293)

`resources/read` handler shape passed to the server — the viewer is always HTML text.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `uri` | `URL` |

## Returns

`Promise`<[`McpResourceReadResult`](McpResourceReadResult.md)<[`McpTextResourceContents`](McpTextResourceContents.md)>>
