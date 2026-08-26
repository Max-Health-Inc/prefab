---
url: /prefab/reference/components.md
description: >-
  Complete API reference for all 115+ prefab components — props, signatures, and
  wire format examples for layout, forms, data, media, and charts.
---

# Components Reference

All components are functions that return a `Component` instance. They serialize to JSON via `.toJSON()` and compose as children of container components.

***

## Layout

Structural containers that control spacing, direction, and grid placement.

### `Column(props?)`

Vertical flex container. The most common layout primitive.

```ts
Column({ gap: 6, children: [H1('Title'), Text('Body')] })
Column({ children: [Text('No gap')] })                          // shorthand
```

| Prop | Type | Description |
|------|------|-------------|
| `gap` | `number \| GapToken` | Spacing between children. Accepts a number or semantic token: `'none'`, `'xs'`, `'sm'`, `'md'`, `'lg'`, `'xl'`, `'2xl'` |
| `align` | `string` | Cross-axis alignment (`start`, `center`, `end`, `stretch`) |
| `justify` | `string` | Main-axis alignment |
| `cssClass` | `RxStr` | Extra CSS class — supports reactive expressions (e.g. `rx('active').then('bg-green', 'bg-red')`) |
| `onClick` | `Action \| Action[]` | Action(s) dispatched on click. Non-button elements get `role="button"` and keyboard support automatically |

**Gap tokens** map to numbers: `none`=0, `xs`=1, `sm`=2, `md`=3, `lg`=4, `xl`=6, `2xl`=8.

```ts
Column({ gap: 'md', children: [Text('Hello')] })  // same as gap: 3
Row({ gap: 'xl', children: [Button('A'), Button('B')] })
```

### `Row(props?)`

Horizontal flex container.

```ts
Row({ gap: 4, children: [Button('Cancel'), Button('Save')] })
```

Same props as `Column`.

### `Grid(props?)`

CSS Grid container.

```ts
Grid({ columns: 3, gap: 4, children: [
  GridItem({ colSpan: 2, children: [Card({ children: [Text('Wide')] })] }),
  GridItem({ children: [Card({ children: [Text('Narrow')] })] }),
] })
```

| Prop | Type | Description |
|------|------|-------------|
| `columns` | `number` | Number of columns |
| `gap` | `number \| GapToken` | Grid gap (number or semantic token) |

### `GridItem(props?)`

Child of `Grid`.

| Prop | Type | Description |
|------|------|-------------|
| `colSpan` | `number` | Column span |
| `rowSpan` | `number` | Row span |

### `Container(props?)`

Generic wrapper with max-width and padding.

### `Div(props?)` / `Span(props?)`

Generic block/inline wrappers.

### `Dashboard(props?)` / `DashboardItem(props?)`

Dashboard grid layout with named items.

### `Pages(props?)` / `Page(props?)`

Paginated view container.

### `Detail(props)`

Conditional detail pane. Shows `children` when `of` resolves, shows `empty` otherwise.

```ts
import { collection, signal, Detail, Heading, Text } from '@maxhealth.tech/prefab'

const patients = collection('patients', data, { key: 'id' })
const selectedId = signal('selectedPatientId', patients.firstKey())
const selected = patients.by(selectedId)

Detail({ of: selected, empty: Text('Select a patient'), children: [
  Heading(selected.dot('name')),
  Text(selected.dot('dob')),
] })
```

| Prop | Type | Description |
|------|------|-------------|
| `of` | `Ref \| RxStr` | Reactive reference expression |
| `empty` | `Component` | Shown when ref is null/undefined |

### `MasterDetail(props?)`

Two-pane layout (master list + detail). Expects two children.

```ts
MasterDetail({ masterWidth: '350px', gap: 4, children: [
  table,   // master panel
  detail,  // detail panel
] })
```

| Prop | Type | Description |
|------|------|-------------|
| `masterWidth` | `string` | Master pane width (default: `'33%'`) |
| `gap` | `number` | Gap between panes |

***

## Typography

Text rendering components.

### `Heading(content, props?)`

```ts
Heading('Welcome', { level: 2 })
```

| Prop | Type | Description |
|------|------|-------------|
| `content` | `string \| Rx` | Text content (supports reactive expressions) |
| `level` | `1-4` | Heading level |

### `H1(content)` / `H2(content)` / `H3(content)` / `H4(content)`

Shorthand heading constructors.

```ts
H1('Dashboard')  // same as Heading('Dashboard', { level: 1 })
```

### `Text(content, props?)`

```ts
Text('Hello world')
Text('Welcome, {{ userName }}!')
```

### `P(content)` / `Lead(content)` / `Large(content)` / `Small(content)` / `Muted(content)`

Semantic text variants.

### `BlockQuote(content)`

Block quotation.

### `Label(content, props?)`

Form label text.

### `Link(content, props?)`

```ts
Link('Visit site', { href: 'https://example.com', target: '_blank' })
```

| Prop | Type | Description |
|------|------|-------------|
| `href` | `string` | URL |
| `target` | `string` | Link target (`_blank`, `_self`, etc.) |

### `Code(content)` / `Kbd(content)`

Inline code / keyboard shortcut styling.

### `Markdown(content)`

Rendered Markdown content.

```ts
Markdown('## Hello\n\nThis is **bold** text.')
```

***

## Card

Card containers for grouped content.

### `Card(props?)`

```ts
Card({ children: [
  CardHeader({ children: [CardTitle('User'), CardDescription('Profile info')] }),
  CardContent({ children: [Text('Name: Alice')] }),
  CardFooter({ children: [Button('Edit')] }),
] })

// With variant:
Card({ variant: 'elevated', children: [CardContent({ children: [Text('Raised card')] })] })
```

| Prop | Type | Description |
|------|------|-------------|
| `variant` | `CardVariant` | `'default'` | `'outline'` | `'ghost'` | `'elevated'` | `'destructive'` |

### `CardHeader` / `CardTitle` / `CardDescription` / `CardContent` / `CardFooter`

Card sub-components. All accept children.

***

## Data Display

### `DataTable(props)`

Rich data table with search, column definitions, and optional row selection.

```ts
DataTable({
  rows: users,
  columns: [
    col('name', 'Name'),
    col('email', 'Email'),
    col('status', 'Status'),
  ],
  search: true,
})
```

| Prop | Type | Description |
|------|------|-------------|
| `rows` | `unknown[] \| RxStr` | Array of row objects (or reactive expression) |
| `columns` | `DataTableColumnDef[]` | Column definitions (use `col()`) |
| `search` | `boolean` | Enable search |
| `from` | `Collection` | Derive rows from a Collection (mutually exclusive with `rows`) |
| `selected` | `Signal` | Signal tracking selected row key (requires `from`) |

#### Row Selection with Signal/Collection

When `from` and `selected` are provided, DataTable auto-generates row click handling:

```ts
const patients = collection('patients', data, { key: 'id' })
const selectedId = signal('selectedPatientId', patients.firstKey())

DataTable({
  columns: [col('name'), col('dob')],
  from: patients,
  selected: selectedId,
})
// Wire: rows="{{ patients }}", rowKey="id", selected="{{ selectedPatientId }}",
//       onRowClick=[{ action: "setState", key: "selectedPatientId", value: "{{ $item.id }}" }]
```

### `col(key, header?, opts?)`

Column definition helper — short form or descriptor form.

```ts
// Short form
col('name', 'Full Name')
col('email', 'Email', { sortable: true })

// Descriptor form (object)
col({ key: 'amount', header: 'Amount', format: 'currency' })
col({ key: 'name', accessor: 'name | humanName', header: 'Patient' })
```

| Field | Type | Description |
|-------|------|-------------|
| `key` | `string` | Row object field name |
| `header` | `string` | Column header (defaults to `key`) |
| `sortable` | `boolean` | Enable column sorting |
| `format` | `string` | Pipe name for cell display (e.g. `'currency'`) |
| `accessor` | `string` | Pipe expression for complex access |

### `Badge(content, props?)`

```ts
Badge('Active', { variant: 'success' })
```

| Variant | Color |
|---------|-------|
| `default` | Neutral |
| `secondary` | Muted |
| `outline` | Border only |
| `success` | Green |
| `warning` | Yellow |
| `destructive` | Red |
| `info` | Blue |

### `Metric(props)`

```ts
Metric({ label: 'Revenue', value: '$125K', delta: '+12.5%' })
```

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Metric name |
| `value` | `string \| number` | Display value |
| `change` | `number` | Percentage change (positive = green, negative = red) |
| `prefix` | `string` | Value prefix (e.g. `$`) |
| `suffix` | `string` | Value suffix (e.g. `%`) |

### Other Data Components

| Component | Description |
|-----------|-------------|
| `Dot(props)` | Colored status dot |
| `Ring(props)` | Circular progress ring |
| `Progress(props)` | Linear progress bar |
| `Separator()` | Horizontal divider |
| `Loader()` | Loading spinner |
| `Icon(name, props?)` | Named icon |

***

## Table

Low-level HTML table primitives (for custom table layouts beyond `DataTable`).

```ts
Table({ striped: true, children: [
  TableHead({ children: [
    TableRow({ children: [TableHeader('Name'), TableHeader('Age')] }),
  ] }),
  TableBody({ children: [
    TableRow({ children: [TableCell({ children: [Text('Alice')] }), TableCell({ children: [Text('30')] })] }),
  ] }),
  TableCaption('User list'),
] })
```

### Components

`Table`, `TableHead`, `TableBody`, `TableFooter`, `TableRow`, `TableHeader`, `TableCell`, `TableCaption`, `ExpandableRow`

`TableCell` supports `colSpan` and `rowSpan` props.

***

## Form

### `Form(props?)`

```ts
Form({ onSubmit: new CallTool('create_user'), children: [
  Input({ name: 'email', inputType: 'email', required: true }),
  Button('Create', { submit: true }),
] })
```

| Prop | Type | Description |
|------|------|-------------|
| `onSubmit` | `Action` | Action to run when the form is submitted |

### `Input(props)`

```ts
Input({ name: 'email', inputType: 'email', label: 'Email', placeholder: 'you@example.com', required: true })
```

| Prop | Type | Description |
|------|------|-------------|
| `name` | `string` | State key (also used as form field name) |
| `type` | `string` | `text`, `email`, `number`, `password`, `url`, `tel`, `date`, `search`, `hidden` |
| `label` | `string` | Label text |
| `placeholder` | `string` | Placeholder text |
| `required` | `boolean` | Validation |
| `defaultValue` | `string` | Initial value |
| `onChange` | `Action` | Action on value change |

### `Textarea(props)`

Multi-line text input. Same props as `Input` plus `rows`.

### `Button(content, props?)`

```ts
Button('Save', { variant: 'default', onClick: new ShowToast('Saved!') })
```

| Prop | Type | Description |
|------|------|-------------|
| `variant` | `ButtonVariant` | `default`, `secondary`, `outline`, `ghost`, `destructive`, `link` |
| `size` | `ButtonSize` | `default`, `sm`, `lg`, `icon` |
| `onClick` | `Action` | Click action |
| `type` | `string` | `button` (default), `submit` |
| `disabled` | `boolean` | Disabled state |

### `ButtonGroup(children)`

Horizontal button row.

### `Select(props?)`

```ts
Select({ name: 'role', label: 'Role', required: true, children: [
  SelectOption('admin', 'Admin'),
  SelectOption('user', 'User'),
] })
```

| Prop | Type | Description |
|------|------|-------------|
| `name` | `string` | State key the choice is stored under |
| `label` | `string` | Visible field label |
| `value` | `string \| string[]` | Pre-selected choice, or choices when `multiple` |
| `placeholder` | `string` | Shown until a choice is made |
| `required` | `boolean` | Must be filled before submit |
| `multiple` | `boolean` | Accept several choices; submits an array under `name` |
| `onChange` | `Action` | Fired with the chosen value |

Sub-components: `SelectOption`, `SelectGroup`, `SelectLabel`, `SelectSeparator`

`required` is shared by every stateful control, so `RadioGroup`, `Combobox`,
`Textarea`, `Calendar` and `DatePicker` take it the same way.

### `Checkbox(props)` / `Switch(props)` / `Slider(props)`

Boolean and range inputs.

```ts
Checkbox({ name: 'agree', label: 'I agree to the terms' })
Switch({ name: 'notifications', label: 'Enable notifications' })
Slider({ name: 'volume', min: 0, max: 100, step: 1 })
```

### `Radio(props)` / `RadioGroup(props?)`

```ts
RadioGroup({ name: 'color', label: 'Favorite Color', children: [
  Radio({ value: 'red', label: 'Red' }),
  Radio({ value: 'blue', label: 'Blue' }),
  Radio({ value: 'green', label: 'Green' }),
] })
```

### `Combobox(props?)` / `ComboboxOption(props)`

Autocomplete select with search.

```ts
Combobox({ name: 'country', placeholder: 'Search countries...', searchable: true, children: [
  ComboboxOption('us', 'United States'),
  ComboboxOption('de', 'Germany'),
] })
```

Sub-components: `ComboboxGroup`, `ComboboxLabel`, `ComboboxSeparator`

### `Calendar(props)` / `DatePicker(props)`

Date selection.

```ts
Calendar({ name: 'date', minDate: '2024-01-01', maxDate: '2024-12-31' })
DatePicker({ name: 'dob', label: 'Date of Birth', placeholder: 'Pick a date' })
```

### `Field(props?)`

Structured form field wrapper.

```ts
Field({ children: [
  FieldTitle('Email'),
  FieldDescription('Your work email address'),
  FieldContent({ children: [Input({ name: 'email', inputType: 'email' })] }),
  FieldError('Invalid email format'),
] })
```

Sub-components: `FieldTitle`, `FieldDescription`, `FieldContent`, `FieldError`

### `ChoiceCard(props)`

Selectable card for option picking.

```ts
ChoiceCard({ value: 'pro', label: 'Pro Plan', description: '$29/mo', selected: true })
```

***

## Interactive

### `Tabs(props?)`

Tabbed interface with keyboard navigation (Arrow keys, Home/End).

```ts
Tabs({ defaultTab: 'overview', children: [
  Tab({ id: 'overview', title: 'Overview', children: [Text('Overview content')] }),
  Tab({ id: 'details', title: 'Details', children: [Text('Details content')] }),
] })
```

### `Accordion(props?)`

Collapsible sections.

```ts
Accordion({ children: [
  AccordionItem({ title: 'FAQ 1', children: [Text('Answer 1')] }),
  AccordionItem({ title: 'FAQ 2', children: [Text('Answer 2')] }),
] })
```

### `Dialog(props?)`

Modal dialog (ARIA `role="dialog"`).

```ts
Dialog({ title: 'Confirm', trigger: Button('Delete'), children: [
  Text('Are you sure?'),
  Button('Delete', { variant: 'destructive', onClick: new CallTool('delete_item') }),
] })
```

### `Popover(props?)` / `Tooltip(props?)` / `HoverCard(props?)`

Overlay components.

### `Carousel(props?)`

Image/content carousel with prev/next buttons.

***

## Charts

All charts accept a `data` prop (array of objects) and a `series` array.

### `BarChart(props)` / `LineChart(props)` / `AreaChart(props)` / `PieChart(props)`

```ts
BarChart({
  data: [{ month: 'Jan', revenue: 100 }, { month: 'Feb', revenue: 150 }],
  series: [{ dataKey: 'revenue', label: 'Revenue', color: '#3b82f6' }],
  xAxis: 'month',
  valueFormat: 'currency',
  height: 300,
})
```

| Prop | Type | Description |
|------|------|-------------|
| `data` | `object[]` | Data array |
| `series` | `ChartSeries[]` | Series definitions (see below) |
| `xAxis` | `string` | Data key for X axis labels |
| `xAxisFormat` | `string` | Pipe applied to X axis tick labels (e.g. `'date'`, `'truncate:10'`) |
| `tooltipXKey` | `string` | Data key for tooltip category label (defaults to `xAxis`) |
| `tooltipXFormat` | `string` | Pipe applied to tooltip category label (e.g. `'datetime'`, `'upper'`) |
| `height` | `number` | Chart height in px |
| `showTooltip` | `boolean` | Show tooltip on hover (default `true`) |
| `showGrid` | `boolean` | Show horizontal grid lines |
| `showYAxis` | `boolean` | Show Y axis labels (default `true`) |
| `valueFormat` | `string` | **Canonical** value-axis tick + tooltip format: `'currency'`, `'percent:1'`, `'compact'`, … (`'auto'` = none). Matches upstream prefab (PR #454). |
| `yAxisFormat` | `string` | Left-axis override for dual-axis charts (overrides `valueFormat`) |
| `showYAxisRight` | `boolean` | Show secondary Y axis on the right |
| `yAxisRightFormat` | `string` | Format for the right Y axis |
| `showLegend` | `boolean` | Show legend below chart |

`PieChart` takes `dataKey` (numeric value) + `nameKey` (slice label) instead of `series`/`xAxis` (the legacy series form is still accepted), plus `innerRadius`, `showLabel`, `paddingAngle`, and `valueFormat`.

#### `ChartSeries`

| Field | Type | Description |
|-------|------|-------------|
| `dataKey` | `string` | **Required.** Key in data objects for this series |
| `label` | `string` | Display label (defaults to `dataKey`) |
| `color` | `string` | Series color (auto-assigned if omitted) |
| `yAxisId` | `'left' \| 'right'` | Which Y axis this series binds to |
| `tooltipFormat` | `string` | Pipe for this series' value in the tooltip (overrides `yAxisFormat`) |

#### Formatting Example

Same timestamp field, different presentation on axis vs tooltip:

```ts
LineChart({
  data: timeseries,
  xAxis: 'timestamp',
  xAxisFormat: 'date',          // axis: "4/25/2026"
  tooltipXFormat: 'datetime',   // tooltip: "4/25/2026, 2:30:00 PM"
  series: [
    { dataKey: 'revenue', label: 'Revenue', tooltipFormat: 'currency' },
    { dataKey: 'growth', label: 'Growth', tooltipFormat: 'percent' },
  ],
})
```

All built-in pipes work: `upper`, `lower`, `truncate`, `currency`, `percent`, `compact`, `date`, `time`, `datetime`, `number`, `round`, plus custom wire pipes.

### `RadarChart(props)`

Spider/radar chart — one polygon per series across angular axes.

```ts
RadarChart({
  data: [{ subject: 'Math', alice: 120 }, { subject: 'English', alice: 98 }],
  series: [{ dataKey: 'alice', label: 'Alice' }],
  axisKey: 'subject',   // spoke labels (falls back to xAxis)
  filled: true,         // fill polygons (default true)
  showDots: false,      // vertices
})
```

### `ScatterChart(props)`

Scatter / bubble chart.

```ts
ScatterChart({
  data: [{ h: 170, w: 65, age: 25 }, { h: 180, w: 80, age: 30 }],
  series: [{ dataKey: 'people', label: 'People' }],
  xAxis: 'h',
  yAxis: 'w',
  zAxis: 'age',   // optional — sizes each point (bubble chart)
})
```

### `Sparkline(props)`

Inline mini chart.

```ts
Sparkline({ data: [10, 20, 15, 30, 25], variant: '#22c55e', height: 32 })
```

### `RadialChart(props)` / `Histogram(props)`

Radial bar chart (concentric value arcs) and histogram distribution chart.

```ts
RadialChart({
  data: [{ browser: 'Chrome', visitors: 275 }, { browser: 'Safari', visitors: 200 }],
  dataKey: 'visitors',   // value (legacy series form still accepted)
  nameKey: 'browser',    // label
  innerRadius: 30, startAngle: 180, endAngle: 0,
})
```

> All chart types now render natively as SVG in the built-in renderer.

***

## Media

### `Image(src, opts?)` / `Image(props)`

Positional form (consistent with Audio/Video/Embed) or props form:

```ts
Image('/photo.jpg', { alt: 'Profile photo' })   // positional (recommended)
Image({ src: '/photo.jpg', alt: 'Profile photo' })  // props form (also works)
```

### `Audio(props)` / `Video(props)` / `Embed(props)`

Media embeds.

### `Svg(props)`

Inline SVG content.

### `DropZone(props)`

File upload drop area. Accepts files by drag-and-drop or by click-to-browse, and is keyboard reachable.

```ts
DropZone({
  accept: 'image/*',
  multiple: true,
  resultKey: 'uploads',
  onDrop: new CallTool('upload_file'),
})
```

| Prop | Type | Description |
|------|------|-------------|
| `label` | `RxStr` | Prompt shown inside the area. Defaults to `Drop files here` |
| `accept` | `string` | Accepted types, as the HTML `accept` attribute (`image/*`, `.pdf`, `text/csv`). Enforced for dropped files too, which the browser does not do |
| `multiple` | `boolean` | Allow more than one file. When false, only the first accepted file is taken |
| `resultKey` | `string` | State key the chosen files are written to |
| `onDrop` | `Action \| Action[]` | Fired once files are chosen, with `$result` bound to the file list |

`resultKey` and `$result` match the `OpenFilePicker` action, so both paths to files behave the same.

### `Mermaid(content)`

Mermaid diagram (rendered by the browser if `mermaid` library is available).

```ts
Mermaid('graph TD; A-->B; B-->C;')
```

***

## Alert

### `Alert(props?)`

```ts
Alert({ variant: 'warning', children: [
  AlertTitle('Warning'),
  AlertDescription('This action cannot be undone.'),
] })

Alert({ variant: 'success', icon: 'CheckCircle', children: [
  AlertTitle('Saved'),
  AlertDescription('Changes applied successfully.'),
] })
```

| Variant | Color |
|---------|-------|
| `default` | Neutral |
| `success` | Green |
| `warning` | Yellow |
| `destructive` | Red |

| Prop | Type | Description |
|------|------|-------------|
| `variant` | `AlertVariant` | `'default'` | `'destructive'` | `'success'` | `'warning'` |
| `icon` | `string` | Icon name (e.g. `'CheckCircle'`, `'AlertTriangle'`) |

***

## Control Flow

### `ForEach(props?)`

Iterate over a reactive array.

```ts
ForEach({ expression: rx('items'), children: [
  Text(ITEM.dot('name')),
] })
```

| Prop | Type | Description |
|------|------|-------------|
| `each` | `Rx \| string` | Expression for the array to iterate |
| `as` | `string` | Variable name for each item (default: `item`) |

### `If(condition, children)` / `If(props)` / `Elif` / `Else`

Conditional rendering. Supports both shorthand and props form:

```ts
// Shorthand (recommended):
If('$loading', [Loader()])
Elif('$error', [Alert({ variant: 'destructive', children: [Text('$error')] })])
Else({ children: [Text('Content loaded!')] })

// Props form (also works):
If({ condition: '$loading', children: [Loader()] })
```

### `Define(props?)` / `Use(props)` / `Slot(props?)`

Component templates for reuse.

```ts
Define({ name: 'userCard', children: [
  Card({ children: [CardContent({ children: [
    Slot({ name: 'name' }),
    Slot({ name: 'role' }),
  ] })] }),
] })

// Later:
Use({ def: 'userCard', overrides: { name: 'Alice', role: 'Admin' } })
```
