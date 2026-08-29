---
description: Auto-generate tables, charts, forms, metrics, and timelines from raw data with autoTable, autoChart, autoForm, and autoMetrics.
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

- a **single object** describes one thing → a detail view,
- a **list of records** describes many of the same thing → a table, chart, or comparison,
- a **sequence in time** describes a journey → a timeline or progress tracker,
- a **set of fields** describes an intent to capture → a form.

Once you internalise that mapping, choosing the right helper rarely needs the reference at all — you reach for the one whose input shape matches the data already in your hand.

## When to Reach for Them

Auto-renderers shine when the *structure* of your UI mirrors the *structure* of your data:

- An array of records → a searchable, sortable table.
- A handful of numbers → a row of metric cards.
- Date-stamped events → a vertical timeline.
- A list of fields → a working form wired to a tool.

They are perfect for MCP tool handlers, where you frequently turn an API response straight into something renderable with minimal ceremony.

## From a Schema, Not From a Field List

`autoForm` takes a list of fields, and writing that list is usually restating something the server already knows. An MCP tool declares an `inputSchema`. A REST route declares a request body. Both are JSON Schema, and `fieldsFromJsonSchema()` turns one into the field list:

```ts
const fields = fieldsFromJsonSchema({
  type: 'object',
  required: ['email'],
  properties: {
    email: { type: 'string', format: 'email', title: 'Email' },
    plan: { type: 'string', enum: ['pro', 'team'] },
    seats: { type: 'integer', minimum: 1, maximum: 50 },
  },
})

return display(autoForm(fields, 'create_account', { title: 'New account' }))
```

The form now asks for exactly what the tool accepts, because it is derived from the same declaration the tool validates against. Formats become the right control — `email`, `uri`, `date-time`, `password` — an enum becomes a Select, an array of enums becomes a multi-select, and `minimum` / `maxLength` carry over as bounds.

It only emits what a flat form can honestly ask for. A nested object, an array of objects, or a property marked `readOnly` is skipped rather than rendered as a control that cannot round-trip. Pass `include` to fix the order, or `exclude` to drop keys the caller already knows.

This is the inverse of `formSchema()`, which derives an elicitation schema from a field list for hosts with no UI. Together they mean one declaration serves both paths: the schema draws the form, and the form's fields describe the schema.

## When to Hand-Craft Instead

Reach for the underlying components directly when you need precise control — bespoke column renderers, custom interactions, conditional layouts, or a design that doesn't map cleanly onto your raw data shape. Auto-renderers are a fast on-ramp, not a ceiling: you can start with `autoTable`, then graduate to a hand-built `DataTable` the moment you need something the auto path can't express. The two styles compose freely in the same view.

→ See the [Auto-Renderers API reference](/reference/api/auto/) for the full API: every helper, its options, and examples.
