---
url: /prefab/reference/api/mcp/functions/rendererHtml.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / rendererHtml

# Function: rendererHtml()

```ts
function rendererHtml(options?): string;
```

Defined in: [mcp/display.ts:474](https://github.com/Max-Health-Inc/prefab/blob/0b875c7d37ce621a7701a86ade4497710f4b2a08/src/mcp/display.ts#L474)

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
```
