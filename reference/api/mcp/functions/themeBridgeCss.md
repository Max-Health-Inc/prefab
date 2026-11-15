---
url: /prefab/reference/api/mcp/functions/themeBridgeCss.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / themeBridgeCss

# Function: themeBridgeCss()

```ts
function themeBridgeCss(bridge): string;
```

Defined in: [mcp/theme-bridge.ts:71](https://github.com/Max-Health-Inc/prefab/blob/4e102b3517c5a62f380fd91b75fb8c49a1f96cec/src/mcp/theme-bridge.ts#L71)

The theme-bridge CSS, matching `prefab.css`'s host-driven selectors in both schemes. `[data-theme="dark"]` is
left alone, so an app that pins it keeps its own palette.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `bridge` | `"vscode"` |

## Returns

`string`

## Example

```ts
const html = rendererHtml({ themeBridge: 'vscode' })
```
