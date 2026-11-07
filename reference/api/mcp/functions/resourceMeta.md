---
url: /prefab/reference/api/mcp/functions/resourceMeta.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / resourceMeta

# Function: resourceMeta()

```ts
function resourceMeta(options?): object;
```

Defined in: [mcp/resource.ts:81](https://github.com/Max-Health-Inc/prefab/blob/1890bd36e825570eeb35b14d1f5a0235caa2c0fb/src/mcp/resource.ts#L81)

The `_meta` (CSP, permissions) for a `ui://` resource. Put it on the listing and the content item: VS Code reads only the latter.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | [`ResourceMetaOptions`](../interfaces/ResourceMetaOptions.md) |

## Returns

`object`

### ui

```ts
ui: object;
```

#### ui.csp?

```ts
optional csp?: McpAppCsp;
```

#### ui.permissions?

```ts
optional permissions?: McpAppPermissionsWire;
```

## Example

```ts
const meta = resourceMeta({
  csp: { resourceDomains: ['https://cdn.jsdelivr.net'] },
  permissions: { camera: true },
})

server.registerResource('viewer', 'ui://my/viewer', {
  mimeType: 'text/html;profile=mcp-app',
  _meta: meta,
  cacheHint: { ttlMs: 86_400_000, cacheScope: 'public' },
}, (uri) => Promise.resolve({
  contents: [{ uri: uri.toString(), mimeType: 'text/html;profile=mcp-app', text: html, _meta: meta }],
  ttlMs: 86_400_000,
  cacheScope: 'public',
}))

// The UI resource is associated with a tool on the tool DEFINITION, not
// on its result:
server.registerTool('browse', {
  title: 'Browse',
  inputSchema: schema,
  _meta: { ui: { resourceUri: 'ui://my/viewer' } },
}, (args) => display(autoTable(rows)))
```
