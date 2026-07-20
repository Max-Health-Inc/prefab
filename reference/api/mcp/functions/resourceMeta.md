---
url: /prefab/reference/api/mcp/functions/resourceMeta.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / resourceMeta

# Function: resourceMeta()

```ts
function resourceMeta(options?): object;
```

Defined in: [mcp/display.ts:408](https://github.com/Max-Health-Inc/prefab/blob/88d9aa00d6a50ef0286767079c6345c808f6a0a9/src/mcp/display.ts#L408)

MCP display helpers — return prefab UIs as MCP tool results.

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
