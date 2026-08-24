/**
 * prefab component type → A2UI Basic catalog mapper registry.
 *
 * prefab ships 115+ components; the A2UI Basic catalog defines 18. The gap is
 * closed by degradation rather than by refusing to emit: a `Badge` becomes
 * `Text`, an `Alert` becomes a `Card` wrapping its body, an `H2` becomes `Text`
 * carrying a Markdown `##` prefix (which the Basic catalog's `Text` explicitly
 * supports). Every degradation is recorded as a diagnostic, so what changed is
 * visible at emit time instead of in someone else's renderer.
 *
 * A mapper returns the A2UI properties for one node without its `id`; the
 * emitter allocates ids and owns the adjacency list. Mappers that expand one
 * prefab node into several A2UI components (`Metric`, the table family in
 * `./table.ts`) push the extras through `ctx.push` and return the root of the
 * expansion.
 */

import type { ComponentJSON } from '../core/component.js'
import type { A2uiComponentProps, A2uiAction, A2uiDiagnosticKind } from './types.js'
import { dynamicString, toBinding } from './expr.js'
import { mapTable, mapDataTable, TABLE_PART_TYPES } from './table.js'

/** A2UI properties for one component, before the emitter assigns its id. */
export type A2uiProps = A2uiComponentProps

/** Services the emitter lends to a mapper. */
export interface EmitContext {
  /** Emit one child subtree, returning its id, or `undefined` if it was dropped. */
  child(node: ComponentJSON): string | undefined
  /** Emit several child subtrees, returning the ids that survived. */
  children(nodes: unknown): string[]
  /** Emit `nodes` as a single child, wrapping them in a Column when there are several. */
  single(nodes: unknown): string | undefined
  /** Add a component the mapper synthesized, returning its id. */
  push(props: A2uiProps): string
  /** Record a translation loss. */
  note(kind: A2uiDiagnosticKind, subject: string, detail: string): void
  /** Convert a serialized prefab action into an A2UI action. */
  action(value: unknown, subject: string): A2uiAction | undefined
  /** Seed a literal value into the surface data model, returning its JSON Pointer. */
  bindData(key: string, value: unknown): string
}

export type Mapper = (node: ComponentJSON, ctx: EmitContext) => A2uiProps | undefined

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Read the first present scalar prop from a node. */
function textOf(node: ComponentJSON, ...keys: string[]): string | undefined {
  for (const k of keys) {
    const v = node[k]
    if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') return String(v)
  }
  return undefined
}

/** Build a `Text` component, prefixing Markdown syntax onto literal content. */
function text(
  node: ComponentJSON,
  ctx: EmitContext,
  opts?: { prefix?: string; suffix?: string; variant?: 'caption' | 'body'; keys?: string[] },
): A2uiProps | undefined {
  const raw = textOf(node, ...(opts?.keys ?? ['content', 'text', 'label', 'title']))
  if (raw == null) {
    ctx.note('unsupported', node.type, 'no text content to render')
    return undefined
  }

  const bound = toBinding(raw)
  if (bound.kind === 'unbindable') {
    ctx.note('expression', node.type, `"${bound.expression}" is richer than a JSON Pointer; the text was left as written`)
  }

  const prefix = opts?.prefix ?? ''
  const suffix = opts?.suffix ?? ''

  // Markdown decoration can only wrap a literal. A bound value is handed over
  // undecorated rather than emitting syntax the renderer would show as data.
  if (bound.kind === 'binding') {
    if (prefix !== '' || suffix !== '') {
      ctx.note('degraded', node.type, 'Markdown emphasis dropped: the text is a data binding')
    }
    return { component: 'Text', text: bound.value, ...(opts?.variant != null && { variant: opts.variant }) }
  }

  const literal = bound.kind === 'literal' ? bound.value : raw
  return {
    component: 'Text',
    text: `${prefix}${literal}${suffix}`,
    ...(opts?.variant != null && { variant: opts.variant }),
  }
}

/** Map prefab's justify/align vocabulary onto the Basic catalog's. */
const JUSTIFY: Record<string, string> = {
  start: 'start', end: 'end', center: 'center',
  between: 'spaceBetween', around: 'spaceAround', evenly: 'spaceEvenly',
  spaceBetween: 'spaceBetween', spaceAround: 'spaceAround', spaceEvenly: 'spaceEvenly',
}

const ALIGN: Record<string, string> = {
  start: 'start', end: 'end', center: 'center', stretch: 'stretch', baseline: 'baseline',
}

function flow(component: 'Row' | 'Column'): Mapper {
  return (node, ctx) => {
    const children = ctx.children(node.children)
    if (children.length === 0) {
      ctx.note('unsupported', node.type, `${component} requires at least one child and none survived`)
      return undefined
    }
    const justify = typeof node.justify === 'string' ? JUSTIFY[node.justify] : undefined
    const align = typeof node.align === 'string' ? ALIGN[node.align] : undefined
    return {
      component,
      children,
      ...(justify != null && { justify }),
      ...(align != null && { align }),
    }
  }
}

/** Container types carrying no meaning A2UI can express; they flatten to a Column. */
const AS_COLUMN = [
  'Div', 'Container', 'Stack', 'Grid', 'GridItem', 'Page', 'Pages', 'Dashboard',
  'DashboardItem', 'MasterDetail', 'Detail', 'Form', 'Fieldset', 'CardContent',
  'CardHeader', 'CardFooter', 'Accordion', 'Carousel', 'SelectGroup', 'ComboboxGroup',
  'Section', 'Article', 'Aside', 'Header', 'Footer', 'Nav', 'Span',
]

const AS_ROW = ['ButtonGroup', 'Toolbar', 'Inline']

// ── Text ─────────────────────────────────────────────────────────────────────

const HEADING_PREFIX: Record<string, string> = {
  H1: '# ', H2: '## ', H3: '### ', H4: '#### ', H5: '##### ', H6: '###### ',
}

const TEXT_MAPPERS: Record<string, Mapper> = {
  Heading: (node, ctx) => {
    const level = typeof node.level === 'number' ? Math.min(6, Math.max(1, node.level)) : 1
    return text(node, ctx, { prefix: `${'#'.repeat(level)} ` })
  },
  Text: (node, ctx) => text(node, ctx),
  P: (node, ctx) => text(node, ctx),
  Lead: (node, ctx) => text(node, ctx),
  Large: (node, ctx) => text(node, ctx),
  Small: (node, ctx) => text(node, ctx, { variant: 'caption' }),
  Muted: (node, ctx) => text(node, ctx, { variant: 'caption' }),
  Label: (node, ctx) => text(node, ctx, { variant: 'caption' }),
  TableCaption: (node, ctx) => text(node, ctx, { variant: 'caption' }),
  BlockQuote: (node, ctx) => text(node, ctx, { prefix: '> ' }),
  Code: (node, ctx) => text(node, ctx, { prefix: '`', suffix: '`' }),
  Kbd: (node, ctx) => text(node, ctx, { prefix: '`', suffix: '`' }),
  Markdown: (node, ctx) => text(node, ctx),
  Badge: (node, ctx) => text(node, ctx, { keys: ['label', 'content'], variant: 'caption' }),
  AlertTitle: (node, ctx) => text(node, ctx, { prefix: '**', suffix: '**' }),
  AlertDescription: (node, ctx) => text(node, ctx),
}

for (const [type, prefix] of Object.entries(HEADING_PREFIX)) {
  TEXT_MAPPERS[type] = (node, ctx) => text(node, ctx, { prefix })
}

// ── Media ────────────────────────────────────────────────────────────────────

function media(component: 'Image' | 'Video' | 'AudioPlayer'): Mapper {
  return (node, ctx) => {
    const url = dynamicString(textOf(node, 'src', 'url'))
    if (url == null) {
      ctx.note('unsupported', node.type, 'no resolvable source URL')
      return undefined
    }
    // Only Image and AudioPlayer take a description; Video carries a poster instead.
    const description = component === 'Video' ? undefined : dynamicString(textOf(node, 'alt', 'description'))
    const poster = component === 'Video' ? dynamicString(textOf(node, 'poster', 'posterUrl')) : undefined
    return {
      component,
      url,
      ...(description != null && { description }),
      ...(poster != null && { posterUrl: poster }),
    }
  }
}

// ── Form ─────────────────────────────────────────────────────────────────────

/** prefab `inputType` → the Basic catalog's four TextField variants. */
const TEXTFIELD_VARIANT: Record<string, string | undefined> = {
  text: 'shortText', email: 'shortText', url: 'shortText', tel: 'shortText', search: 'shortText',
  password: 'obscured', number: 'number',
}

/**
 * Bind a stateful control to the data model.
 *
 * prefab addresses form state by `name`, a key at the root of the state object,
 * so the pointer is that name as a single escaped token.
 */
function valueBinding(node: ComponentJSON): { path: string } | undefined {
  const name = typeof node.name === 'string' ? node.name : undefined
  if (name == null) return undefined
  const bound = toBinding(`{{ ${name} }}`)
  return bound.kind === 'binding' ? bound.value : undefined
}

function optionsOf(node: ComponentJSON, ctx: EmitContext): { label: string; value: string }[] {
  const children = Array.isArray(node.children) ? node.children : []
  const options: { label: string; value: string }[] = []
  for (const child of children) {
    const value = textOf(child, 'value')
    if (value == null) {
      ctx.note('degraded', node.type, `dropped a ${child.type} child that carries no option value`)
      continue
    }
    options.push({ label: textOf(child, 'label') ?? value, value })
  }
  return options
}

function dateTime(node: ComponentJSON, ctx: EmitContext, flags: { enableDate?: boolean; enableTime?: boolean }): A2uiProps {
  if (textOf(node, 'label', 'name') == null) {
    ctx.note('degraded', node.type, 'no label available for the DateTimeInput')
  }
  return {
    component: 'DateTimeInput',
    // The catalog asks for an empty string while the value is unset.
    value: valueBinding(node) ?? '',
    ...flags,
  }
}

function choicePicker(variant: 'mutuallyExclusive' | 'multipleSelection'): Mapper {
  return (node, ctx) => {
    const label = dynamicString(textOf(node, 'label', 'name'))
    if (label == null) {
      ctx.note('unsupported', node.type, 'ChoicePicker requires a label and none could be derived')
      return undefined
    }
    const options = optionsOf(node, ctx)
    if (options.length === 0) {
      ctx.note('unsupported', node.type, 'no options to choose from')
      return undefined
    }
    const value = valueBinding(node)
    return { component: 'ChoicePicker', label, variant, options, ...(value != null && { value }) }
  }
}

function textField(node: ComponentJSON, ctx: EmitContext, variant: string): A2uiProps | undefined {
  const label = dynamicString(textOf(node, 'label', 'name'))
  if (label == null) {
    ctx.note('unsupported', node.type, 'TextField requires a label and none could be derived')
    return undefined
  }
  const value = valueBinding(node)
  const placeholder = dynamicString(textOf(node, 'placeholder'))
  return {
    component: 'TextField',
    label,
    variant,
    ...(value != null && { value }),
    ...(placeholder != null && { placeholder }),
  }
}

const FORM_MAPPERS: Record<string, Mapper> = {
  Input: (node, ctx) => {
    const inputType = typeof node.inputType === 'string' ? node.inputType : 'text'
    const variant = TEXTFIELD_VARIANT[inputType]
    if (variant == null) {
      ctx.note('degraded', node.type, `inputType "${inputType}" has no A2UI variant; used shortText`)
    }
    return textField(node, ctx, variant ?? 'shortText')
  },
  Textarea: (node, ctx) => textField(node, ctx, 'longText'),
  Checkbox: (node, ctx) => {
    const label = dynamicString(textOf(node, 'label', 'name'))
    if (label == null) {
      ctx.note('unsupported', node.type, 'CheckBox requires a label and none could be derived')
      return undefined
    }
    // `value` is required by the catalog; an unbound checkbox starts unchecked.
    return { component: 'CheckBox', label, value: valueBinding(node) ?? false }
  },
  Slider: (node, ctx) => {
    const max = typeof node.max === 'number' ? node.max : undefined
    if (max == null) {
      ctx.note('unsupported', node.type, 'Slider requires a max and prefab left it open')
      return undefined
    }
    const label = dynamicString(textOf(node, 'label', 'name'))
    const min = typeof node.min === 'number' ? node.min : undefined
    const step = typeof node.step === 'number' ? node.step : undefined
    // A2UI counts divisions where prefab counts increment size.
    const steps = step != null && step > 0 ? Math.max(1, Math.round((max - (min ?? 0)) / step)) : undefined
    return {
      component: 'Slider',
      max,
      value: valueBinding(node) ?? min ?? 0,
      ...(label != null && { label }),
      ...(min != null && { min }),
      ...(steps != null && { steps }),
    }
  },
  Button: (node, ctx) => {
    const label = textOf(node, 'label', 'content') ?? 'Button'
    const action = ctx.action(node.onClick, 'Button')
      ?? (node.submit === true ? { event: { name: 'submit' } } : undefined)
    if (action == null) {
      ctx.note('unsupported', node.type, 'Button requires an action and none could be derived')
      return undefined
    }
    const child = ctx.push({ component: 'Text', text: dynamicString(label) ?? label })
    const variant = node.variant === 'link' || node.variant === 'ghost'
      ? 'borderless'
      : node.variant === 'default' ? 'primary' : 'default'
    return { component: 'Button', child, action, variant }
  },
  Link: (node, ctx) => {
    const href = textOf(node, 'href', 'url')
    if (href == null) {
      ctx.note('unsupported', node.type, 'no href to open')
      return undefined
    }
    const label = textOf(node, 'content', 'label') ?? href
    const child = ctx.push({ component: 'Text', text: dynamicString(label) ?? label })
    // A2UI Basic renders links as a borderless Button running the openUrl function.
    return {
      component: 'Button',
      child,
      variant: 'borderless',
      action: { functionCall: { call: 'openUrl', args: { url: href } } },
    }
  },
  DatePicker: (node, ctx) => dateTime(node, ctx, { enableDate: true }),
  TimePicker: (node, ctx) => dateTime(node, ctx, { enableTime: true }),
  DateTimePicker: (node, ctx) => dateTime(node, ctx, { enableDate: true, enableTime: true }),
  Select: choicePicker('mutuallyExclusive'),
  RadioGroup: choicePicker('mutuallyExclusive'),
  Combobox: choicePicker('mutuallyExclusive'),
}

// A Switch is a checkbox with a different affordance; A2UI Basic has one control for both.
FORM_MAPPERS.Switch = FORM_MAPPERS.Checkbox

// ── Composites ───────────────────────────────────────────────────────────────

const COMPOSITE_MAPPERS: Record<string, Mapper> = {
  Card: (node, ctx) => {
    const child = ctx.single(node.children)
    if (child == null) {
      ctx.note('unsupported', 'Card', 'Card requires a child and it had none')
      return undefined
    }
    return { component: 'Card', child }
  },
  Alert: (node, ctx) => {
    const child = ctx.single(node.children)
    if (child == null) {
      ctx.note('unsupported', 'Alert', 'no alert body to render')
      return undefined
    }
    const variant = typeof node.variant === 'string' ? node.variant : 'default'
    ctx.note('degraded', 'Alert', `variant "${variant}" rendered as a plain Card`)
    return { component: 'Card', child }
  },
  Separator: () => ({ component: 'Divider' }),
  Divider: () => ({ component: 'Divider' }),
  Icon: (node, ctx) => {
    const name = textOf(node, 'name', 'icon')
    if (name == null) {
      ctx.note('unsupported', 'Icon', 'no icon name')
      return undefined
    }
    return { component: 'Icon', name }
  },
  Metric: (node, ctx) => {
    // A Column of caption + value is the closest Basic-catalog reading of a KPI tile.
    const parts: string[] = []
    const label = textOf(node, 'label', 'title')
    if (label != null) {
      parts.push(ctx.push({ component: 'Text', text: dynamicString(label) ?? label, variant: 'caption' }))
    }
    const value = textOf(node, 'value')
    if (value != null) {
      parts.push(ctx.push({ component: 'Text', text: dynamicString(value) ?? value }))
    }
    if (parts.length === 0) {
      ctx.note('unsupported', 'Metric', 'neither a label nor a value to render')
      return undefined
    }
    ctx.note('degraded', 'Metric', 'rendered as a Column of Text; trend and delta styling dropped')
    return { component: 'Column', children: parts }
  },
  Tabs: (node, ctx) => {
    const children = Array.isArray(node.children) ? node.children : []
    const tabs: { title: string; child: string }[] = []
    for (const tab of children) {
      const child = ctx.single(tab.children)
      if (child == null) continue
      tabs.push({ title: textOf(tab, 'title') ?? 'Tab', child })
    }
    if (tabs.length === 0) {
      ctx.note('unsupported', 'Tabs', 'no tab had renderable content')
      return undefined
    }
    return { component: 'Tabs', tabs }
  },
  Dialog: (node, ctx) => {
    const content = ctx.single(node.children)
    if (content == null) {
      ctx.note('unsupported', 'Dialog', 'no dialog body to render')
      return undefined
    }
    const triggerNode = node.trigger as ComponentJSON | undefined
    const trigger = triggerNode != null
      ? ctx.child(triggerNode)
      : ctx.push({ component: 'Text', text: textOf(node, 'title') ?? 'Open' })
    if (trigger == null) {
      ctx.note('unsupported', 'Dialog', 'Modal requires a trigger and none could be emitted')
      return undefined
    }
    return { component: 'Modal', trigger, content }
  },
  AccordionItem: (node, ctx) => {
    const parts: string[] = []
    const title = textOf(node, 'title')
    if (title != null) parts.push(ctx.push({ component: 'Text', text: title, variant: 'caption' }))
    parts.push(...ctx.children(node.children))
    if (parts.length === 0) {
      ctx.note('unsupported', 'AccordionItem', 'nothing to render')
      return undefined
    }
    ctx.note('degraded', 'AccordionItem', 'rendered expanded; A2UI Basic has no disclosure component')
    return { component: 'Column', children: parts }
  },
}

// ── Registry ─────────────────────────────────────────────────────────────────

const MAPPERS: Record<string, Mapper> = {
  Column: flow('Column'),
  Row: flow('Row'),
  ...TEXT_MAPPERS,
  ...FORM_MAPPERS,
  ...COMPOSITE_MAPPERS,
  Image: media('Image'),
  Video: media('Video'),
  Audio: media('AudioPlayer'),
  Table: mapTable,
  DataTable: mapDataTable,
}

for (const type of AS_COLUMN) MAPPERS[type] ??= flow('Column')
for (const type of AS_ROW) MAPPERS[type] ??= flow('Row')

/** Types that only make sense inside their parent's mapper. */
const CONSUMED_BY_PARENT = new Set<string>([
  'Tab', 'SelectOption', 'ComboboxOption', 'Radio', 'Option', ...TABLE_PART_TYPES,
])

/**
 * Component families with no Basic-catalog reading at all. Naming them keeps the
 * diagnostic specific ("charts are outside the Basic catalog") rather than the
 * generic fallback's "no equivalent".
 */
const KNOWN_UNSUPPORTED: Record<string, string | undefined> = {
  LineChart: 'charts', BarChart: 'charts', AreaChart: 'charts', PieChart: 'charts',
  ScatterChart: 'charts', RadarChart: 'charts', RadialChart: 'charts',
  Histogram: 'charts', Sparkline: 'charts',
  Svg: 'inline vector graphics', Mermaid: 'diagrams', Embed: 'embedded frames',
  DropZone: 'file uploads', Ring: 'progress rings', Loader: 'loading indicators',
  Progress: 'progress bars',
}

export function mapperFor(type: string): Mapper | undefined {
  return MAPPERS[type]
}

export function isConsumedByParent(type: string): boolean {
  return CONSUMED_BY_PARENT.has(type)
}

/** Every prefab type with a first-class mapping, for docs and tests. */
export function mappedTypes(): string[] {
  return Object.keys(MAPPERS).sort()
}

/**
 * Last-resort mapping for a type the registry does not name.
 *
 * A node with children becomes a Column, a node with text becomes a Text, and
 * anything else is dropped. This is what keeps a tree built from unmapped
 * components emitting something coherent instead of failing outright.
 */
export function fallbackMapper(node: ComponentJSON, ctx: EmitContext): A2uiProps | undefined {
  const family = KNOWN_UNSUPPORTED[node.type]
  if (family != null) {
    ctx.note('unsupported', node.type, `${family} are outside the A2UI Basic catalog`)
    return undefined
  }

  if (Array.isArray(node.children) && node.children.length > 0) {
    const children = ctx.children(node.children)
    if (children.length > 0) {
      ctx.note('degraded', node.type, 'no Basic-catalog equivalent; flattened to a Column')
      return { component: 'Column', children }
    }
  }

  if (textOf(node, 'content', 'text', 'label', 'title') != null) {
    ctx.note('degraded', node.type, 'no Basic-catalog equivalent; rendered as Text')
    return text(node, ctx)
  }

  ctx.note('unsupported', node.type, 'no Basic-catalog equivalent and nothing to render')
  return undefined
}
