---
url: /prefab/reference/api/mcp/functions/themeBridgeCss.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / themeBridgeCss

# Function: themeBridgeCss()

```ts
function themeBridgeCss(bridge): string;
```

Defined in: [mcp/theme-bridge.ts:108](https://github.com/Max-Health-Inc/prefab/blob/dc9055d700a7e96734dfd959d1cb775e88a3b293/src/mcp/theme-bridge.ts#L108)

Generate the theme-bridge CSS (the contents of a `<style>` element).

Mirrors the selectors `prefab.css` uses for *host-driven* tokens, so the
override lands in both schemes rather than only in light mode: the `:root`
default (alongside `[data-theme="light"]`, whose higher specificity would
otherwise win) and the `prefers-color-scheme: dark` media block. Each selector
matches its counterpart's specificity and is emitted after `prefab.css`, so it
wins on document order.

`:root[data-theme="dark"]` is deliberately NOT bridged. That block is
prefab's standalone dark palette with static values and no host chain at all,
the explicit separation of host theming (which cascades) from the manual theme
toggle. Overriding it would make an app that pins `data-theme="dark"` follow
the editor instead of its own choice.

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
