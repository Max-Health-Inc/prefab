---
description: Emit A2UI from a prefab component tree — toA2UI(), the a2ui:// resource helper, the Basic-catalog mapping table, and what degrades on the way across.
---

# A2UI

[A2UI](https://a2ui.org) is the declarative agent-to-UI protocol: an agent sends
JSON describing a component tree plus a data model, and the renderer maps the
abstract component names onto its own widgets — React, Angular, Lit, Flutter,
Swift, Jetpack Compose.

prefab speaks it as a second output target. The same server-side component tree
that produces a `$prefab` payload also produces A2UI messages, so one authoring
API reaches both:

| | `$prefab` | A2UI |
|---|---|---|
| Rendered by | prefab's own renderer | the host's A2UI renderer |
| Delivery | MCP Apps `ui://` HTML resource, or any web page | `a2ui://` resource or an embedded resource in a tool result |
| Surface | sandboxed iframe | native widgets, no iframe |
| Catalog | 115+ components | the 18-component Basic catalog |

## Emitting

```ts
const app = new PrefabApp({
  view: Column({ children: [H1('Users'), autoTable(rows)] }),
})

const { messages, diagnostics } = app.toA2UI()
```

`messages` is a list of A2UI protocol messages. By default everything is inlined
into a single `createSurface`, which is what a stored payload wants. Pass
`{ stream: true }` to split it into `createSurface` + `updateComponents` +
`updateDataModel` so a streaming transport can paint early.

`diagnostics` is the part worth reading. prefab has 115+ components and the
Basic catalog has 18, so some of the tree changes shape on the way across, and
every change is reported:

```ts
for (const d of app.toA2UI().diagnostics) {
  console.warn(`${d.kind}: ${d.subject} — ${d.detail}`)
}
```

| Kind | Meaning |
|---|---|
| `degraded` | Rendered as something simpler. An `Alert` became a `Card`, a `Metric` became a `Column` of `Text`. |
| `unsupported` | Dropped. Charts, diagrams and file uploads have no Basic-catalog reading. |
| `expression` | A `{{ }}` template was richer than a JSON Pointer, so the binding could not be made. |
| `action` | An action had no direct equivalent and was reported to the agent as an event instead. |

## Serving it over MCP

Return a surface from a tool with `display_a2ui`. The payload travels as an
embedded resource under the `application/a2ui+json` MIME type, which is how a
host knows to route it to its A2UI renderer:

```ts
server.registerTool('list-users', schema, async () =>
  display_a2ui(autoTable(await db.users())))
```

For a surface that does not depend on the conversation, register it as a
resource instead — the host reads it once and caches it:

```ts
registerA2uiResource(server, () => Column({ children: [
  H1('Settings'),
  Input({ name: 'apiKey', label: 'API key' }),
] }), { uri: 'a2ui://myserver/settings' })
```

The builder runs on every read, so a surface closing over live data refreshes
without re-registering. Caching is off by default for that reason; pass
`cache: { ttlMs, cacheScope }` when the surface really is static.

Both live alongside the MCP Apps path in [MCP Apps](/reference/mcp-apps) — a
server can offer `ui://` and `a2ui://` from the same tool and let the host pick.

## In the browser

The emitter also ships as a standalone IIFE bundle, apart from
`renderer.min.js`. Almost no page that renders `$prefab` also emits A2UI, so
folding the two together would tax every consumer for a feature they do not use:

```html
<script src="https://cdn.jsdelivr.net/npm/@maxhealth.tech/prefab/dist/a2ui.min.js"></script>
<script>
  const { messages, diagnostics } = PrefabA2UI.emit(wireJson)
  const payload = PrefabA2UI.envelope(messages)   // { messages: [...] }
</script>
```

`emit` takes parsed `$prefab` JSON rather than a component tree, so nothing in
the bundle needs the authoring API. That is what keeps it around a sixth the
size of the renderer.

The [playground](https://maxhealth.tech/prefab/playground/) runs this bundle:
switch the preview pane to **A2UI** to see any payload translated live, with the
diagnostics listed underneath.

## How the tree crosses over

Two structural differences drive everything:

**Flat, not nested.** A2UI components live in an adjacency list. Every component
carries an `id` and parents reference children by id. prefab's nested `children`
are flattened, ids are allocated deterministically in traversal order, and the
entry component is named `root` as the protocol requires. An `id` you set
yourself is honoured.

**Bound, not interpolated.** A2UI reads dynamic values through JSON Pointer
bindings. `{{ user.name }}` becomes `{ "path": "/user/name" }`, and prefab's
`state` becomes the surface data model.

Text that mixes literals with values goes through the `formatString` catalog
function, so `Score: {{ score }}` becomes
`{ call: 'formatString', args: { value: 'Score: ${/score}' } }` rather than being
lost. What has no equivalent is arithmetic, pipes and conditionals —
`{{ count + 1 }}`, `{{ price | currency:'USD' }}` — and those raise an
`expression` diagnostic. A string is interpolated only if *every* value in it
binds; one unbindable expression makes the whole string unbindable, because
interpolating half of it would change what the text says without saying so.

### Control flow

| prefab | A2UI |
|---|---|
| `ForEach` | the child template — one instance per item, `$item` resolving to a path relative to the current item and `$index` to the `@index` function |
| `Define` / `Use` / `Slot` | resolved at emit time by inlining the definition; a `Use`'s `overrides` are seeded into the data model and brought into scope by name |
| `If` / `Elif` / `Else` / `Condition` | **no equivalent** |

Conditionals are the one real capability gap between the two protocols. A2UI has
no declarative `if`: the renderer draws what the adjacency list says, and the
agent sends a fresh `updateComponents` when the shape should change. prefab runs
a reactive client that re-shapes itself without a round trip.

A one-item list template would *look* like a conditional and behave like one only
by accident, so the emitter reports the loss instead of faking it. A UI leaning
on `If` does not cross over intact, and no amount of emitter work changes that.

### Tables

`DataTable` and `autoTable` map onto A2UI's child template rather than being
flattened row by row: one `Row` template, one `Text` per column bound to the
column key, and a `Column` whose `children` is `{ path, componentId }`. The
renderer instantiates one copy per item in the data-model list, so the emitted
surface stays as small and as reactive as the prefab original.

A literal row array is seeded into the data model so the template has something
to iterate; a `{{ rows }}` expression binds straight to where the rows already
live.

### Mapping table

| prefab | A2UI Basic | Note |
|---|---|---|
| `Column`, `Row` | `Column`, `Row` | `align` and `justify` carried across |
| `Div`, `Container`, `Grid`, `Form`, `Page`, … | `Column` | containers with no A2UI meaning flatten |
| `Card`, `CardContent` | `Card` | several children get a `Column` wrapper |
| `H1`–`H6`, `Heading` | `Text` | Markdown `#` prefix |
| `Text`, `P`, `Lead`, `Large`, `Markdown` | `Text` | |
| `Muted`, `Small`, `Label`, `Badge` | `Text` | `variant: caption` |
| `Code`, `Kbd` | `Text` | backtick-wrapped |
| `BlockQuote` | `Text` | `>` prefix |
| `Input`, `Textarea` | `TextField` | `inputType` picks the variant |
| `Checkbox`, `Switch` | `CheckBox` | |
| `Select`, `RadioGroup`, `Combobox` | `ChoicePicker` | options read from the children |
| `Slider` | `Slider` | `step` converted to division count |
| `DatePicker`, `TimePicker` | `DateTimeInput` | |
| `Button` | `Button` | label becomes a child `Text` |
| `Link` | `Button` | borderless, running the `openUrl` function |
| `Image`, `Video`, `Audio`, `Icon` | `Image`, `Video`, `AudioPlayer`, `Icon` | |
| `Tabs` / `Tab` | `Tabs` | |
| `Dialog` | `Modal` | |
| `Separator` | `Divider` | |
| `Alert` | `Card` | variant styling dropped |
| `Metric` | `Column` of `Text` | trend and delta dropped |
| `Table`, `DataTable` | `Column` of `Row`s | see above |
| `CardTitle`, `CardDescription`, `Tooltip` | `Text` | |
| `ForEach` | templated `Column` | see Control flow |
| `Define`, `Use`, `Slot` | inlined | see Control flow |
| `If`, `Elif`, `Else`, `Condition` | — | `unsupported` |
| charts, `Mermaid`, `Svg`, `DropZone`, `Progress` | — | `unsupported` |

A component the table does not name still emits: one with children flattens to a
`Column`, one with text renders as `Text`, and each raises a `degraded`
diagnostic. Nothing is dropped silently.

### Actions

| prefab action | A2UI |
|---|---|
| `CallTool` (either `toolCall` or `callTool` on the wire) | `{ event: { name: tool, context: arguments } }` |
| `SendMessage` | `{ event: { name: 'sendMessage', context: { message } } }` |
| `OpenLink` | `{ functionCall: { call: 'openUrl', args: { url } } }` |
| `SetState`, `ToggleState`, everything else | an agent event named after the action |

Argument values go through the same binding conversion as component props, so
`CallTool('search', { arguments: { q: '{{ query }}' } })` sends the bound value
rather than the raw template.

A2UI carries one action per control. Where prefab binds several, the first is
used and the rest raise an `action` diagnostic.

## Conformance

Emitted payloads are validated against the official A2UI v1.0 JSON Schemas,
vendored under `test/fixtures/a2ui/v1_0/`, plus the two structural rules the
schemas cannot express: every referenced child id must exist, and every
component must be reachable from `root`. `test/a2ui.test.ts` runs one view per
mapper family through that gate.

Refresh the vendored schemas when A2UI publishes a revision:

```bash
bun scripts/sync-a2ui-schemas.ts
```
