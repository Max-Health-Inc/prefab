---
url: /prefab/reference/api/mcp/functions/registerViewerResource.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / registerViewerResource

# Function: registerViewerResource()

```ts
function registerViewerResource(server, options?): void;
```

Defined in: [mcp/resource.ts:365](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/mcp/resource.ts#L365)

Register the prefab viewer as a `ui://` resource on an MCP server.

Handles the MIME type, CSP on both listing and content item, HTML generation,
the `CacheableResult` fields and the Apps extension capability in one call.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `server` | [`McpServerLike`](../interfaces/McpServerLike.md) |
| `options?` | [`ViewerResourceOptions`](../interfaces/ViewerResourceOptions.md) |

## Returns

`void`

## Example

```ts
import { registerViewerResource, PREFAB_RESOURCE_URI, display } from '@maxhealth.tech/prefab/mcp'

registerViewerResource(server)

// The UI resource is attached to the tool DEFINITION via _meta.ui:
server.registerTool('browse', {
  title: 'Browse patients',
  inputSchema: { query: z.string() },
  _meta: { ui: { resourceUri: PREFAB_RESOURCE_URI } },
}, async (args) => display(autoTable(await search(args.query))))
```
