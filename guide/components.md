---
url: /prefab/guide/components.md
description: >-
  Guide to prefab's 115+ declarative UI components — layout, typography, forms,
  data tables, charts, media, and interactive elements.
---

# Components

A prefab UI is just data. You describe what you want as a tree of typed nodes, and the renderer turns that tree into a live interface. There is no JSX, no virtual DOM to reason about, and no framework to learn — only a vocabulary of component functions that you nest inside one another.

## The mental model

Each component is a function that returns a `Component` instance. Calling it builds one node in the tree; passing other components as its children grows the tree downward. When you are ready to ship, the whole structure serializes to plain `$prefab` wire JSON, which any prefab-aware client can render.

Most components share a friendly shape: an optional **props** object first, then an array of **children**.

```ts
Column({
  gap: 6,
  children: [
    H1('Patients'),
    Text('Everyone under your care, at a glance.'),
  ],
})
```

Containers like `Column` and `Row` hold other nodes; leaf nodes like `Text` and `Badge` carry content. Containers take a single props object, with the child nodes under `children`. Leaf nodes take their content positionally, which is why `H1('Patients')` and `Text('…')` read the way they do.

## How components compose

Composition is the whole game. You build small, meaningful pieces and slot them into larger layouts, the same way you would nest boxes inside boxes. A card lives inside a column, a table lives inside a card, a badge lives inside a table cell. Because every node is data, you can also build trees programmatically — map over rows, conditionally include a section, or factor a repeated fragment into a helper function.

Props that drive behavior (an `onClick` action, a reactive `cssClass`, a `from` collection) make these static trees come alive without changing the composition model.

## The categories

prefab groups its 115+ components into a handful of families. Reach for the family that matches your intent:

* **Layout** — structural containers that control direction, spacing, and grids (`Column`, `Row`, `Grid`, `MasterDetail`).
* **Typography** — headings, paragraphs, labels, and inline text styles.
* **Card & Alert** — grouped content surfaces and status callouts.
* **Forms** — inputs, selects, checkboxes, date pickers, and field wrappers.
* **Data display** — tables, badges, metrics, and progress indicators.
* **Charts** — bar, line, area, pie, radar, scatter, and more, rendered natively as SVG.
* **Media** — images, audio, video, embeds, and file drop zones.
* **Interactive** — tabs, accordions, dialogs, popovers, and carousels.
* **Control flow** — `If`/`Else`, `ForEach`, and reusable `Define`/`Use` templates that shape the tree at render time.

Pick a container, fill it with the leaves and nested containers you need, and let the renderer handle the rest.

→ See the [Components reference](/reference/components) for the full catalog: every component, its props, and examples.
