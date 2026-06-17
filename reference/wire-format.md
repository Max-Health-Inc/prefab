---
url: /prefab/reference/wire-format.md
description: >-
  $prefab v0.3 wire format specification — JSON structure, component nodes,
  state, actions, pipes, defs, and template slots.
---

# Wire Format Specification

The `$prefab` wire format is the JSON protocol that connects server-side component builders to client-side renderers. Both the TypeScript and Python libraries produce this format.

> **Note:** This TypeScript library is a superset of the Python `prefab-ui` (v0.20.x). Core components and the v0.3 protocol are identical. Chart formatting props (`xAxisFormat`, `tooltipXFormat`, `tooltipXKey`, per-series `tooltipFormat`, dual Y-axis) are TS-only extensions. The renderer handles both payloads seamlessly, and still accepts legacy `0.2` payloads.

## Envelope

Every prefab UI is wrapped in a top-level envelope:

```json
{
  "$prefab": { "version": "0.3" },
  "view": { ... },
  "state": { ... },
  "css": [ ... ],
  "stylesheets": [ ... ],
  "mode": "dark",
  "defs": { ... },
  "keyBindings": { ... },
  "onMount": { ... }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `$prefab` | `{ version: string }` | **Yes** | Format identifier. Current version: `"0.3"` |
| `view` | `ComponentJSON` | **Yes** | Root component tree |
| `state` | `Record<string, unknown>` | No | Initial reactive state |
| `css` | `string[]` | No | Inline CSS blocks injected as `<style>` tags. The theme is compiled into this array (`:root` for light, `.dark, [data-theme="dark"]` for dark). |
| `stylesheets` | `string[]` | No | External CSS **URLs** loaded as `<link rel="stylesheet">` |
| `mode` | `"light" \| "dark"` | No | Force a color scheme regardless of OS preference |
| `defs` | `Record<string, ComponentJSON>` | No | Reusable component templates |
| `keyBindings` | `Record<string, ActionJSON>` | No | Keyboard shortcut → action |
| `onMount` | `ActionJSON \| ActionJSON[]` | No | Action(s) to run when the UI renders |

> **Protocol 0.3 (upstream PR #431).** The theme moved off the wire: instead of a structured `theme` object, `PrefabApp.toJSON()` compiles it into the `css` array and emits `mode`. `stylesheets` now means external URLs. The renderer still accepts `0.2` payloads (a structured `theme` object, and inline CSS in `stylesheets`) for backward compatibility.

## Component JSON

Every component serializes to a flat JSON object:

```json
{
  "type": "Button",
  "content": "Click me",
  "variant": "default",
  "size": "sm",
  "onClick": { "action": "setState", "key": "count", "value": "{{ state.count + 1 }}" },
  "children": []
}
```

| Field | Type | Description |
|-------|------|-------------|
| `type` | `string` | **Required.** Component type name (PascalCase) |
| `content` | `string` | Text content (supports `{{ }}` expressions) |
| `children` | `ComponentJSON[]` | Child components |
| `cssClass` | `string` | Extra CSS class |
| `*` | `unknown` | Any other props specific to the component type |

### Type Names

Component types use PascalCase and map 1:1 to the TypeScript/Python function names:

```
Column, Row, Grid, GridItem, Container, Div, Span, MasterDetail, Detail,
H1, H2, H3, H4, Text, Heading, Muted, Code, Markdown, Link, Kbd,
Card, CardHeader, CardTitle, CardContent, CardFooter,
DataTable, Badge, Metric, Progress, Separator, Loader, Icon,
Table, TableHead, TableBody, TableRow, TableHeader, TableCell,
Form, Input, Textarea, Button, Select, SelectOption, Checkbox, Switch, Slider,
Radio, RadioGroup, Combobox, ComboboxOption, Calendar, DatePicker,
Field, FieldTitle, FieldDescription, FieldContent, FieldError, ChoiceCard,
Tabs, Tab, Accordion, AccordionItem, Dialog, Popover, Tooltip, Carousel,
BarChart, LineChart, AreaChart, PieChart, Sparkline, RadialChart, Histogram,
Image, Audio, Video, Embed, Svg, DropZone, Mermaid,
Alert, AlertTitle, AlertDescription,
ForEach, If, Elif, Else, Define, Use, Slot
```

## Action JSON

Actions are serialized as objects with an `action` field:

```json
{ "action": "setState", "key": "count", "value": 42 }
```

```json
{ "action": "toolCall", "tool": "get_data", "arguments": { "id": "{{ state.selectedId }}" } }
```

```json
{ "action": "showToast", "message": "Saved!", "variant": "success" }
```

### Action Types

| `action` | Description | Key Fields |
|----------|-------------|------------|
| `setState` | Set state value | `key`, `value` |
| `toggleState` | Toggle boolean | `key` |
| `appendState` | Append to array | `key`, `value`, `index?` |
| `popState` | Remove from array | `key`, `index` |
| `showToast` | Toast notification | `message`, `variant?`, `duration?` |
| `closeOverlay` | Close dialog/popover | — |
| `openLink` | Navigate to URL | `url`, `target?` |
| `setInterval` | Periodic timer | `intervalMs`, `onTick` |
| `fetch` | HTTP request | `url`, `method?`, `resultKey?` |
| `openFilePicker` | File picker | `accept?`, `multiple?`, `resultKey?` |
| `callHandler` | Client handler | `handler`, `arguments?` |
| `toolCall` | MCP tool call | `tool`, `arguments?`, `resultKey?` |
| `sendMessage` | Chat message | `message` |
| `updateContext` | Host context update | `context` |
| `requestDisplayMode` | Display mode | `mode` |

All actions support optional `onSuccess` and `onError` callbacks (single action or array).

## Reactive Expressions

String values containing `{{ }}` are evaluated as reactive expressions:

```json
{ "type": "Text", "content": "{{ state.count }}" }
{ "type": "Text", "content": "Hello, {{ state.name | upper }}!" }
```

### Expression Grammar

```
expression   = ternary | logical
ternary      = logical "?" value ":" value
logical      = comparison (("&&" | "||") comparison)*
comparison   = additive (("===" | "!==" | ">" | ">=" | "<" | "<=") additive)?
additive     = multiplicative (("+" | "-") multiplicative)*
multiplicative = unary (("*" | "/" | "%") unary)*
unary        = "!" primary | primary
primary      = number | string | boolean | null | dotpath | "(" expression ")"
dotpath      = identifier ("." identifier)*
piped        = expression ("|" pipeName (":" pipeArg ("," pipeArg)*)? )*
```

### Key Pipes for Collections

| Pipe | Syntax | Description |
|------|--------|-------------|
| `find` | `collection \| find:'keyField',stateKeyRef` | Find a row where `row[keyField]` matches the value of `stateKeyRef` |
| `dot` | `object \| dot:'field'` | Extract a property from an object |

Example: `{{ patients | find:'id',selectedPatientId | dot:'name' }}`

These pipes enable the Signal/Collection/Ref data pattern on the wire format level.

### Scope Variables

| Variable | Available In | Description |
|----------|-------------|-------------|
| `state.*` | Everywhere | Reactive state store |
| `item` | `ForEach` body | Current iteration item |
| `index` | `ForEach` body | Current iteration index |
| `event` | `onChange`/`onSubmit` | Event data |
| `error` | `onError` callback | Error value |
| `result` | `onSuccess` callback | Action result |

## Theme (authoring input → compiled `css`)

You author a theme as a `{ light, dark }` map of CSS custom properties:

```ts
new PrefabApp({
  view,
  theme: {
    light: { primary: '#3b82f6', background: '#ffffff', foreground: '#0a0a0a' },
    dark:  { primary: '#60a5fa', background: '#0a0a0a', foreground: '#fafafa' },
  },
})
```

In protocol **0.3** this is **compiled into the wire `css` array** (it is *not* sent as a structured `theme` object). Light variables target `:root`; dark variables target `.dark, [data-theme="dark"]` plus a `prefers-color-scheme: dark` block:

```json
{
  "$prefab": { "version": "0.3" },
  "view": { ... },
  "css": [
    ":root {\n  --primary: #3b82f6;\n  --background: #ffffff;\n}\n.dark, [data-theme=\"dark\"] {\n  --primary: #60a5fa;\n}"
  ]
}
```

The renderer injects each `css` entry as a `<style>` tag. Color scheme is selected by the host's `prefers-color-scheme`, the `data-theme` attribute, or the `dark`/`light` class. Use the top-level `mode` field to force one. (Legacy `0.2` payloads carrying a structured `theme` object still render.)

## State Updates (Partial)

For incremental updates without re-rendering the full UI, use a state update wire:

```json
{
  "$prefab": { "version": "0.3" },
  "stateUpdate": {
    "count": 42,
    "status": "complete"
  }
}
```

This merges values into the existing state store and triggers re-evaluation of affected reactive expressions.

## Validation

Use `validateWireFormat()` to check a payload:

```ts
import { validateWireFormat } from '@maxhealth.tech/prefab'

const result = validateWireFormat(jsonPayload)
if (!result.valid) {
  console.error(result.errors)
  // [{ path: '$.view', message: 'Missing required "view" field' }]
}
```
