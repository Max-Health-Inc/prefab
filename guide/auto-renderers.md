---
url: /prefab/guide/auto-renderers.md
description: >-
  Auto-generate tables, charts, forms, metrics, and timelines from raw data with
  autoTable, autoChart, autoForm, and autoMetrics.
---

# Auto-Renderers

Most of the time you already have the data — a list of users from a query, a few KPIs, a row of monthly sales. What you *don't* want to do is hand-wire a table, pick column definitions, choose a chart type, and style badges every single time. Auto-renderers close that gap: hand them raw data, get a finished UI back in one call.

## The Mental Model

Think of an auto-renderer as a single function with a simple shape: **data in → component tree out.**

```ts
const users = await db.query('SELECT * FROM users')
return display(autoTable(users), { title: 'Users' })
```

That `autoTable(users)` call inspects your data, infers the columns from the object keys, detects which fields are statuses (and renders them as badges), and returns a normal `Component`. Because the output is just a regular component, it slots into any layout — wrap it in a `Column`, drop it next to a chart, or hand it to `display()`. There is no special runtime and no escape hatch to learn.

The family follows one consistent convention: the **first argument is your data**, and an **optional second argument is an options object** (title, layout hints, behaviour flags). `autoForm` is the small exception — it takes a submit-tool name in the middle so a generated form knows which MCP tool to call.

A useful way to picture the whole family is by the shape of input each one expects. Roughly:

* a **single object** describes one thing → a detail view,
* a **list of records** describes many of the same thing → a table, chart, or comparison,
* a **sequence in time** describes a journey → a timeline or progress tracker,
* a **set of fields** describes an intent to capture → a form.

Once you internalise that mapping, choosing the right helper rarely needs the reference at all — you reach for the one whose input shape matches the data already in your hand.

## When to Reach for Them

Auto-renderers shine when the *structure* of your UI mirrors the *structure* of your data:

* An array of records → a searchable, sortable table.
* A handful of numbers → a row of metric cards.
* Date-stamped events → a vertical timeline.
* A list of fields → a working form wired to a tool.

They are perfect for MCP tool handlers, where you frequently turn an API response straight into something renderable with minimal ceremony.

## When to Hand-Craft Instead

Reach for the underlying components directly when you need precise control — bespoke column renderers, custom interactions, conditional layouts, or a design that doesn't map cleanly onto your raw data shape. Auto-renderers are a fast on-ramp, not a ceiling: you can start with `autoTable`, then graduate to a hand-built `DataTable` the moment you need something the auto path can't express. The two styles compose freely in the same view.

→ See the [Auto-Renderers reference](/reference/auto-renderers) for the full API: every helper, its options, and examples.
