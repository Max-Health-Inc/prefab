---
url: /prefab/reference/api/mcp/functions/registerViewerResource.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / registerViewerResource

# Function: registerViewerResource()

```ts
function registerViewerResource(server, options?): void;
```

Defined in: [mcp/resource.ts:294](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/resource.ts#L294)

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
import { registerViewerResource, uiToolMeta, display } from '@maxhealth.tech/prefab/mcp'

registerViewerResource(server)

// The UI resource is attached to the tool DEFINITION via _meta.ui:
server.registerTool('browse', {
  title: 'Browse patients',
  inputSchema: { query: z.string() },
  _meta: uiToolMeta(),
}, async (args) => display(autoTable(await search(args.query))))
```
