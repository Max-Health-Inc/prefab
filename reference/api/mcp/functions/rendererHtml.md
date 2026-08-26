---
url: /prefab/reference/api/mcp/functions/rendererHtml.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / rendererHtml

# Function: rendererHtml()

```ts
function rendererHtml(options?): string;
```

Defined in: [mcp/resource.ts:216](https://github.com/Max-Health-Inc/prefab/blob/dc9055d700a7e96734dfd959d1cb775e88a3b293/src/mcp/resource.ts#L216)

Generate the HTML page for a prefab MCP Apps viewer resource.

Returns the minimal HTML that loads `prefab.css` and `renderer.auto.min.js`
from the CDN, plus any additional scripts/stylesheets you specify.

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
