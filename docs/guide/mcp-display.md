---
description: display(), displayForm(), rendererHtml(), and registerViewerResource() — server-side helpers to return prefab UIs from MCP tools.
---

# MCP Display Helpers

When an MCP tool runs, it hands back a result. The display helpers let that
result be a living UI instead of a wall of text. You build a component tree on
the server, hand it to a helper, and the helper packages it into the exact
shape an MCP host expects to render.

## The mental model

Think of every tool handler as three small steps:

1. **Build** — compose your screen from prefab components (a `Column`, a table,
   a form, a chart).
2. **Wrap** — pass that tree to a display helper. The helper serializes it to
   the `$prefab` wire format and folds it into an MCP tool-result envelope.
3. **Return** — hand the envelope straight back from your handler. Any host that
   speaks prefab paints it.

```ts
import { display, Column, H1, autoTable } from '@maxhealth.tech/prefab'

async function listPatients() {
  const patients = await db.query('SELECT * FROM patients')
  return display(Column([H1('Patients'), autoTable(patients)]), { title: 'Patients' })
}
```

You never touch the envelope by hand. The helper knows where the JSON goes,
which fields the host reads, and how to keep older and newer hosts happy.

## Full display vs. incremental update

There are two ways to send something back, and picking the right one keeps your
UIs snappy.

Reach for a **full display** when the screen changes shape — a new list, a
detail page, a form, an error or success card. The host swaps in the whole tree
and renders it fresh.

Reach for an **incremental update** when the screen is already on the user's
screen and you only need to nudge some values inside it — a counter ticking up,
a status flipping to "done", a freshly fetched total. Instead of re-sending the
entire view, you send just the changed state, and the renderer merges it into
the live store without rebuilding anything.

That split is the whole game: send a full view when the layout changes, send a
patch when only the data does.

## Chaining tools

Because each handler returns a self-contained UI, tools compose naturally. A
list view can carry a button whose click calls a detail tool; the detail view
can carry one that opens an edit form; submitting the form calls a save tool.
Each step is just another handler returning its own `display(...)`, so rich,
multi-screen flows fall out of simple pieces.

→ See the [MCP API reference](/reference/api/mcp/) for the full API: every helper, its options, and the tool-result shape.
