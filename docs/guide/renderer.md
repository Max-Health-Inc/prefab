---
description: Mount $prefab wire JSON into the browser with the vanilla DOM renderer. Zero dependencies, works in any iframe or web page.
---

# Browser Renderer

The browser renderer is how your `$prefab` UIs come alive in a real page. It is a single, self-contained script (`dist/renderer.min.js`) with **zero framework dependencies** — no React, no Vue, no build step. Drop it in with a `<script>` tag and it turns wire JSON into living DOM.

## The mental model

Think of the renderer as a small machine with one job: **wire JSON in, live DOM out.**

```
$prefab wire JSON  ──▶  renderer  ──▶  real DOM nodes
```

Your server (or your LLM) describes *what* the UI should look like as plain JSON — a tree of typed nodes like `Column`, `H1`, `DataTable`. The renderer reads that tree and builds the matching HTML elements, wires up event handlers, and applies your theme. You never touch the DOM yourself.

The interesting part is what happens *after* the first paint. The renderer keeps a small **reactive store** alongside the DOM. When a button fires an action, or a tool call returns fresh data, the store updates and every `{{ ... }}` expression that depends on it re-evaluates automatically. The page reacts; you don't re-render by hand.

## How it fits in a page

There are two ways to get a UI on screen, and which you reach for depends on whether the JSON is ready at load time.

**Auto-mount** is the zero-code path. Stash your wire data on `window.__PREFAB_DATA__` before the script runs, and the renderer finds your `#root` (or the body) and mounts itself on `DOMContentLoaded`. Perfect for server-rendered pages that already know what to show.

```html
<script>window.__PREFAB_DATA__ = { "$prefab": { "version": "0.3" }, "view": { "type": "H1", "content": "Hello!" } };</script>
<script src="renderer.min.js"></script>
```

**Manual mount** is for when the data arrives later — from a fetch, a tool call, or user interaction. Call `PrefabRenderer.mount(element, data, options)` yourself and you get back a **render handle** you can hold onto: feed it new data with `update()`, force a redraw with `rerender()`, reach into the reactive `store`, or tear everything down with `destroy()`.

::: tip Always ship prefab.css
The renderer paints structure, but `prefab.css` carries the design tokens and base styles. Load it alongside the script or your components come out unstyled.
:::

## Going further

The renderer is extensible without forking it. You can teach it new node types with `registerComponent`, add new `{{ }}` filters with `registerPipe`, and inject scoped stylesheets straight from the wire format — all covered in the reference.

→ See the [Renderer API reference](/reference/api/renderer/) for the full API: every method, option, and the render handle.
