---
url: /prefab/reference/api/mcp/functions/resourceMeta.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / resourceMeta

# Function: resourceMeta()

```ts
function resourceMeta(options?): object;
```

Defined in: [mcp/resource.ts:95](https://github.com/Max-Health-Inc/prefab/blob/dc9055d700a7e96734dfd959d1cb775e88a3b293/src/mcp/resource.ts#L95)

Generate the `_meta` object for MCP Apps `ui://` resource registration.

Includes CSP and Permission Policy configuration per the MCP Apps spec.
Use on both the resource listing AND the content item (VS Code reads
only the content item; other hosts may read either).

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
