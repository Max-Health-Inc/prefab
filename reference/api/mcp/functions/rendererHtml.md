---
url: /prefab/reference/api/mcp/functions/rendererHtml.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / rendererHtml

# Function: rendererHtml()

```ts
function rendererHtml(options?): string;
```

Defined in: [mcp/resource.ts:167](https://github.com/Max-Health-Inc/prefab/blob/4e102b3517c5a62f380fd91b75fb8c49a1f96cec/src/mcp/resource.ts#L167)

The viewer HTML: `prefab.css` and `renderer.auto.min.js` from the CDN, plus your scripts and stylesheets.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | [`RendererHtmlOptions`](../interfaces/RendererHtmlOptions.md) |

## Returns

`string`

## Example

```ts
import { rendererHtml } from '@maxhealth.tech/prefab/mcp'
const html = rendererHtml()
// or with extra scripts:
const html = rendererHtml({ scripts: ['https://cdn.example.com/plugin.js'] })
// inside VS Code, to follow the user's editor theme:
const html = rendererHtml({ themeBridge: 'vscode' })
```
