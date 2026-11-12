---
url: /prefab/reference/api/mcp/functions/uiToolMeta.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / uiToolMeta

# Function: uiToolMeta()

```ts
function uiToolMeta(resourceUri?): object;
```

Defined in: [mcp/resource.ts:115](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/resource.ts#L115)

The tool-definition `_meta` that points an MCP Apps host at a `ui://` renderer, the prefab viewer by default.

## Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `resourceUri` | `string` | `PREFAB_RESOURCE_URI` |

## Returns

`object`

### ui

```ts
ui: object;
```

#### ui.resourceUri

```ts
resourceUri: string;
```
