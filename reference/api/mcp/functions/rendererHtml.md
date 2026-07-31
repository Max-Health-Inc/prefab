---
url: /prefab/reference/api/mcp/functions/rendererHtml.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / rendererHtml

# Function: rendererHtml()

```ts
function rendererHtml(options?): string;
```

Defined in: [mcp/resource.ts:215](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/resource.ts#L215)

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
