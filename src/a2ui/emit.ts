/**
 * `$prefab` → A2UI emitter.
 *
 * Walks the nested `$prefab` component tree and produces A2UI's flat adjacency
 * list, plus the surface data model. Three invariants drive the implementation:
 *
 *   - **The root is named `root`.** A2UI requires exactly that id on the entry
 *     component, so it is reserved before traversal begins rather than renamed
 *     afterwards.
 *   - **Ids are allocated before children are emitted.** A mapper calls back
 *     into the context to emit its children, so the parent's slot is reserved
 *     first and filled in once the mapper returns. Nodes that turn out to be
 *     unmappable release their slot, which is why the components map is keyed
 *     by id rather than being a positional array.
 *   - **Emission is deterministic.** Ids are drawn from a counter in traversal
 *     order, so the same tree always produces byte-identical output and can be
 *     asserted on in tests and cached by hosts.
 */

import type { ComponentJSON } from '../core/component.js'
import type { PrefabWireFormat } from '../app.js'
import { createLogger } from '../core/logger.js'
import { dynamicString, escapePointerToken, toBinding, type BindScope, type BindingResult } from './expr.js'
import { fallbackMapper, isConsumedByParent, mapperFor, type A2uiProps, type EmitContext } from './catalog.js'
import {
  A2UI_BASIC_CATALOG,
  A2UI_ROOT_ID,
  A2UI_VERSION,
  type A2uiAction,
  type A2uiComponent,
  type A2uiDiagnostic,
  type A2uiDiagnosticKind,
  type A2uiDynamicString,
  type A2uiDynamicValue,
  type A2uiMessage,
} from './types.js'

const log = createLogger('a2ui')

export interface A2uiEmitOptions {
  /**
   * Surface id. Must be unique for the renderer's lifetime.
   * @default 'prefab'
   */
  surfaceId?: string
  /**
   * Catalog the surface's components are drawn from.
   * @default the A2UI Basic catalog
   */
  catalogId?: string
  /**
   * Split the output into `createSurface` + `updateComponents` +
   * `updateDataModel` instead of inlining everything into `createSurface`.
   * Streaming transports want the split so the renderer can paint early; a
   * single stored payload does not. @default false
   */
  stream?: boolean
  /** Ask the renderer to echo the data model back on every event. @default false */
  sendDataModel?: boolean
  /** Log degradations and dropped nodes at warn level. @default false */
  warn?: boolean
}

/** Emitted messages plus what the translation cost. */
export interface A2uiEmitResult {
  messages: A2uiMessage[]
  diagnostics: A2uiDiagnostic[]
}

/**
 * The wrapper `toJSON()` puts around every view. It carries a CSS class and
 * nothing else, so it is unwrapped rather than emitted as a pointless Column.
 */
function unwrapAppRoot(view: ComponentJSON): ComponentJSON {
  const children = view.children
  if (
    view.type === 'Div'
    && typeof view.cssClass === 'string'
    && view.cssClass.startsWith('pf-app-root')
    && Array.isArray(children)
    && children.length === 1
  ) {
    return children[0]
  }
  return view
}

/**
 * Collect every `Define` in the tree.
 *
 * A pre-pass rather than collection during the walk, because prefab resolves a
 * definition by name at render time and imposes no ordering: a `Use` may appear
 * before the `Define` it refers to, and inside a different branch of the tree.
 */
function collectDefinitions(node: ComponentJSON, into: Map<string, ComponentJSON[]>): void {
  if (node.type === 'Define') {
    const name = typeof node.name === 'string' ? node.name : undefined
    if (name != null && Array.isArray(node.children)) into.set(name, node.children)
  }
  if (Array.isArray(node.children)) for (const child of node.children) collectDefinitions(child, into)
}

class Emitter implements EmitContext {
  /** Insertion-ordered; `undefined` marks a reserved slot that was released. */
  private readonly components = new Map<string, A2uiComponent | undefined>()
  // A Map rather than an object literal so a rolled-back subtree's seeded keys
  // can be removed without a dynamic delete.
  private readonly dataModel = new Map<string, unknown>()
  private readonly used = new Set<string>([A2UI_ROOT_ID])
  private readonly diagnostics: A2uiDiagnostic[] = []
  private readonly definitions = new Map<string, ComponentJSON[]>()
  private counter = 0

  /** Names in force for binding, extended while inlining a template or a definition. */
  private scope: BindScope = {}

  /** Slot content from the nearest enclosing `Use`. */
  private slots: Record<string, ComponentJSON[]> = {}

  /**
   * Definitions currently being expanded, so a `Use` inside its own `Define`
   * reports a cycle instead of recursing until the stack gives out.
   */
  private readonly expanding = new Set<string>()

  constructor(private readonly warn: boolean) {}

  bind(value: string): BindingResult {
    return toBinding(value, this.scope)
  }

  dyn(value: string | undefined): A2uiDynamicString | undefined {
    return dynamicString(value, this.scope)
  }

  inScope<T>(names: BindScope, fn: () => T): T {
    const previous = this.scope
    this.scope = { ...previous, ...names }
    try {
      return fn()
    } finally {
      this.scope = previous
    }
  }

  withSlots<T>(slots: Record<string, ComponentJSON[]>, fn: () => T): T {
    const previous = this.slots
    this.slots = { ...previous, ...slots }
    try {
      return fn()
    } finally {
      this.slots = previous
    }
  }

  slotContent(name: string): ComponentJSON[] | undefined {
    return this.slots[name]
  }

  definition(name: string): ComponentJSON[] | undefined {
    if (this.expanding.has(name)) {
      this.note('unsupported', 'Use', `definition "${name}" uses itself; A2UI has no recursive template`)
      return undefined
    }
    return this.definitions.get(name)
  }

  /** Track expansion depth so `definition()` can detect a cycle. */
  expand<T>(name: string, fn: () => T): T {
    this.expanding.add(name)
    try {
      return fn()
    } finally {
      this.expanding.delete(name)
    }
  }

  note(kind: A2uiDiagnosticKind, subject: string, detail: string): void {
    this.diagnostics.push({ kind, subject, detail })
    if (this.warn) log.warn(`${kind}: ${subject} — ${detail}`)
  }

  /** Allocate an id, honouring an author-supplied one when it is still free. */
  private allocate(node?: ComponentJSON): string {
    const preferred = typeof node?.id === 'string' && node.id.length > 0 ? node.id : undefined
    if (preferred != null && !this.used.has(preferred)) {
      this.used.add(preferred)
      return preferred
    }
    let id: string
    do {
      this.counter += 1
      id = `c${this.counter}`
    } while (this.used.has(id))
    this.used.add(id)
    return id
  }

  push(props: A2uiProps): string {
    const id = this.allocate()
    this.components.set(id, { id, ...props })
    return id
  }

  bindData(key: string, value: unknown): string {
    let name = key
    let n = 0
    while (this.dataModel.has(name)) {
      n += 1
      name = `${key}${n}`
    }
    this.dataModel.set(name, value)
    return `/${escapePointerToken(name)}`
  }

  child(node: ComponentJSON): string | undefined {
    return this.emit(node, false)
  }

  children(nodes: unknown): string[] {
    if (!Array.isArray(nodes)) return []
    const ids: string[] = []
    for (const node of nodes as unknown[]) {
      if (node == null || typeof node !== 'object') continue
      const id = this.emit(node as ComponentJSON, false)
      if (id != null) ids.push(id)
    }
    return ids
  }

  single(nodes: unknown): string | undefined {
    const ids = this.children(nodes)
    if (ids.length === 0) return undefined
    if (ids.length === 1) return ids[0]
    // A2UI's single-child slots take one id, so several children need a wrapper.
    return this.push({ component: 'Column', children: ids })
  }

  action(value: unknown, subject: string): A2uiAction | undefined {
    if (value == null) return undefined
    if (Array.isArray(value)) {
      if (value.length === 0) return undefined
      if (value.length > 1) {
        this.note('action', subject, `${value.length} actions were bound; A2UI carries one, so the rest were dropped`)
      }
      return this.action(value[0], subject)
    }
    if (typeof value !== 'object') return undefined

    const json = value as Record<string, unknown>
    const kind = typeof json.action === 'string' ? json.action : undefined
    if (kind == null) return undefined

    switch (kind) {
      // `callTool` is the spelling the shipped examples use and the renderer
      // accepts both, so an emitter that knew only one silently downgraded every
      // hand-written tool call into a generic agent event.
      case 'toolCall':
      case 'callTool': {
        const tool = typeof json.tool === 'string' ? json.tool : undefined
        if (tool == null) return undefined
        const context = this.eventContext(json.arguments, subject)
        return { event: { name: tool, ...(context != null && { context }) } }
      }
      case 'sendMessage': {
        const message = typeof json.message === 'string' ? json.message : ''
        return { event: { name: 'sendMessage', context: { message } } }
      }
      case 'openLink': {
        const url = typeof json.url === 'string' ? json.url : typeof json.href === 'string' ? json.href : undefined
        if (url == null) return undefined
        return { functionCall: { call: 'openUrl', args: { url } } }
      }
      default: {
        // Everything else mutates renderer state, which the Basic catalog has no
        // function for. Reporting the intent to the agent keeps the control
        // interactive instead of dropping it for want of an action.
        this.note('action', subject, `"${kind}" has no renderer-side equivalent; emitted as an agent event`)
        const { action: _kind, ...rest } = json
        const context = this.eventContext(rest, subject)
        return { event: { name: kind, ...(context != null && { context }) } }
      }
    }
  }

  /**
   * Convert a prefab action's argument bag into an A2UI event context.
   *
   * Values go through the same `{{ }}` conversion as component props, so a
   * `CallTool('search', { arguments: { q: '{{ query }}' } })` sends the bound
   * value rather than shipping the uninterpolated template to the agent.
   */
  private eventContext(value: unknown, subject: string): Record<string, A2uiDynamicValue> | undefined {
    if (value == null || typeof value !== 'object' || Array.isArray(value)) return undefined
    const context: Record<string, A2uiDynamicValue> = {}
    for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
      if (typeof raw === 'number' || typeof raw === 'boolean' || raw === null) {
        context[key] = raw
        continue
      }
      if (typeof raw !== 'string') {
        this.note('action', subject, `argument "${key}" is not a scalar and was dropped from the event context`)
        continue
      }
      const bound = toBinding(raw)
      if (bound.kind === 'unbindable') {
        this.note('action', subject, `argument "${key}" uses "${bound.expression}", which A2UI cannot bind; it was dropped`)
        continue
      }
      context[key] = bound.kind === 'binding' ? bound.value : bound.value
    }
    return Object.keys(context).length > 0 ? context : undefined
  }

  /**
   * Undo everything emitted since a watermark.
   *
   * A mapper reads its children before deciding whether it can map at all — a
   * `Dialog` emits its body, then finds it cannot build a trigger. Without this,
   * those children stay in the adjacency list with nothing pointing at them,
   * which is a payload the renderer rejects for unreachability. Dropping a node
   * has to drop its whole subtree.
   */
  private rollback(components: number, dataKeys: number): void {
    const keys = [...this.components.keys()]
    for (let i = components; i < keys.length; i++) {
      this.components.delete(keys[i])
      if (keys[i] !== A2UI_ROOT_ID) this.used.delete(keys[i])
    }
    const seeded = [...this.dataModel.keys()]
    for (let i = dataKeys; i < seeded.length; i++) this.dataModel.delete(seeded[i])
  }

  /** Emit one subtree. Returns the allocated id, or `undefined` if it was dropped. */
  emit(node: ComponentJSON, isRoot: boolean): string | undefined {
    if (typeof node.type !== 'string') return undefined

    if (isConsumedByParent(node.type)) {
      this.note('unsupported', node.type, 'only meaningful inside its parent; emitted standalone it has no meaning')
      return undefined
    }

    const componentMark = this.components.size
    const dataMark = this.dataModel.size

    const id = isRoot ? A2UI_ROOT_ID : this.allocate(node)
    // Reserve the slot before the mapper runs, so children emitted during
    // mapping cannot claim this id.
    this.components.set(id, undefined)

    const mapper = mapperFor(node.type) ?? fallbackMapper
    const props = mapper(node, this)

    if (props == null) {
      this.rollback(componentMark, dataMark)
      return undefined
    }

    this.components.set(id, { id, ...props })
    return id
  }

  finish(wire: PrefabWireFormat, options: A2uiEmitOptions): A2uiEmitResult {
    const surfaceId = options.surfaceId ?? 'prefab'

    // Envelope-level defs first, then any `Define` in the tree, which wins on a
    // name clash for the same reason it does in the renderer: it is nearer.
    for (const [name, body] of Object.entries(wire.defs ?? {})) this.definitions.set(name, [body])
    collectDefinitions(wire.view, this.definitions)

    const rootId = this.emit(unwrapAppRoot(wire.view), true)

    if (rootId == null) {
      this.note('unsupported', 'view', 'nothing in the view could be expressed in A2UI; the surface is empty')
    }

    const components: A2uiComponent[] = []
    for (const c of this.components.values()) if (c != null) components.push(c)

    // prefab state and any literals seeded during mapping share one data model.
    // State wins on a collision, since seeded keys are generated and state keys
    // are author-chosen.
    const dataModel = { ...Object.fromEntries(this.dataModel), ...(wire.state ?? {}) }
    const hasData = Object.keys(dataModel).length > 0

    const messages: A2uiMessage[] = []
    const catalogId = options.catalogId ?? A2UI_BASIC_CATALOG

    if (options.stream === true) {
      messages.push({
        version: A2UI_VERSION,
        createSurface: {
          surfaceId,
          catalogId,
          ...(options.sendDataModel === true && { sendDataModel: true }),
        },
      })
      if (components.length > 0) {
        messages.push({ version: A2UI_VERSION, updateComponents: { surfaceId, components } })
      }
      if (hasData) {
        messages.push({ version: A2UI_VERSION, updateDataModel: { surfaceId, value: dataModel } })
      }
    } else {
      messages.push({
        version: A2UI_VERSION,
        createSurface: {
          surfaceId,
          catalogId,
          ...(options.sendDataModel === true && { sendDataModel: true }),
          ...(components.length > 0 && { components }),
          ...(hasData && { dataModel }),
        },
      })
    }

    return { messages, diagnostics: this.diagnostics }
  }
}

/**
 * Translate a `$prefab` wire payload into A2UI messages.
 *
 * @example
 * ```ts
 * const { messages, diagnostics } = emitA2UI(app.toJSON())
 * if (diagnostics.length > 0) console.warn(diagnostics)
 * ```
 */
export function emitA2UI(wire: PrefabWireFormat, options?: A2uiEmitOptions): A2uiEmitResult {
  const opts = options ?? {}
  return new Emitter(opts.warn === true).finish(wire, opts)
}
