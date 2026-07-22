---
url: /prefab/reference/api/mcp/functions/registerViewerResource.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / registerViewerResource

# Function: registerViewerResource()

```ts
function registerViewerResource(server, options?): void;
```

Defined in: [mcp/display.ts:550](https://github.com/Max-Health-Inc/prefab/blob/de93a446678c2f2b8a07006b7acfdb8a5f593717/src/mcp/display.ts#L550)

Register the prefab viewer as a `ui://` resource on an MCP server.

Handles MIME type, CSP on both listing and content item, and HTML generation.
Eliminates the three most common registration mistakes in one call.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `server` | `McpServerLike` |
| `options?` | [`ViewerResourceOptions`](../interfaces/ViewerResourceOptions.md) |

## Returns

`void`

## Example

```ts
import { registerViewerResource, PREFAB_RESOURCE_URI } from '@maxhealth.tech/prefab/mcp'

registerViewerResource(server)

server.tool('browse', schema, async (args) => ({
  content: [{ type: 'text', text: JSON.stringify(data) }],
  structuredContent: data,
  _meta: { ui: { resourceUri: PREFAB_RESOURCE_URI } },
}))
```
