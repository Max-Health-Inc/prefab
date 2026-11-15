---
url: /prefab/reference/api/renderer/functions/createThemeToggle.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / createThemeToggle

# Function: createThemeToggle()

```ts
function createThemeToggle(root, options?): () => void;
```

Defined in: [renderer/theme.ts:134](https://github.com/Max-Health-Inc/prefab/blob/4e102b3517c5a62f380fd91b75fb8c49a1f96cec/src/renderer/theme.ts#L134)

Create a theme toggle button inside a prefab root element.

* Persists to localStorage
* Syncs two-way with `document.documentElement[data-theme]` via MutationObserver
* Uses sun/moon SVG icons (no external deps)

## Parameters

| Parameter | Type |
| ------ | ------ |
| `root` | `HTMLElement` |
| `options?` | [`ThemeToggleOptions`](../interfaces/ThemeToggleOptions.md) |

## Returns

A cleanup function that removes the button and observer.

() => `void`
