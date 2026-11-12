---
url: /prefab/reference/api/mcp/functions/registerViewerResource.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / registerViewerResource

# Function: registerViewerResource()

```ts
function registerViewerResource(server, options?): void;
```

Defined in: [mcp/resource.ts:289](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/mcp/resource.ts#L289)

Register the prefab viewer as a `ui://` resource. The CSP admits jsDelivr and every origin the page loads from.

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
