/**
 * A2UI v1.0 wire types.
 *
 * A2UI (`a2ui.org`) is the declarative agent-to-UI protocol: the agent streams
 * JSON describing a component tree plus a data model, and the renderer maps the
 * abstract component names onto its own widgets. prefab emits it as a second
 * output target alongside the `$prefab` wire format.
 *
 * Two structural differences drive the whole emitter:
 *
 *   1. **Flat, not nested.** A2UI components live in an adjacency list — every
 *      component carries an `id`, and parents reference children by id rather
 *      than embedding them. `$prefab` nests `children` directly.
 *   2. **Bound, not interpolated.** A2UI reads dynamic values through JSON
 *      Pointer `{ path }` bindings into the data model. `$prefab` interpolates
 *      `{{ expr }}` templates, which is strictly more expressive, so only the
 *      plain-path subset survives the crossing (see `./expr.ts`).
 *
 * Mirrors `specification/v1_0/json/agent_to_renderer.json` and
 * `catalogs/basic/catalog.json` from a2ui-project/a2ui (Apache-2.0). Only the
 * agent-to-renderer direction is modelled: prefab produces UI, it does not
 * consume renderer events.
 */

// ── Constants ────────────────────────────────────────────────────────────────

/** Protocol version stamped on every emitted message. */
export const A2UI_VERSION = 'v1.0'

/** Canonical id of the A2UI Basic catalog, the component set prefab targets. */
export const A2UI_BASIC_CATALOG = 'https://a2ui.org/specification/v1_0/catalogs/basic/catalog.json'

/** MIME type identifying an A2UI payload over MCP. */
export const A2UI_MIME = 'application/a2ui+json'

/** URI scheme for A2UI resources served over MCP. */
export const A2UI_SCHEME = 'a2ui://'

/** The reserved root component id every surface starts from. */
export const A2UI_ROOT_ID = 'root'

// ── Dynamic values ───────────────────────────────────────────────────────────

/** A JSON Pointer binding into the surface data model. */
export interface A2uiDataBinding {
  path: string
}

/**
 * A call to a catalog function, used for formatting and validation.
 *
 * The function name lives under `call`, and the object IS the call — it is not
 * wrapped in a `functionCall` key. That wrapper appears only where a function
 * stands in for an {@link A2uiAction}.
 */
export interface A2uiFunctionCall {
  call: string
  catalogId?: string
  args?: Record<string, A2uiDynamicValue>
}

export type A2uiDynamicString = string | A2uiDataBinding | A2uiFunctionCall
export type A2uiDynamicNumber = number | A2uiDataBinding | A2uiFunctionCall
export type A2uiDynamicBoolean = boolean | A2uiDataBinding | A2uiFunctionCall
export type A2uiDynamicValue =
  | string
  | number
  | boolean
  | null
  | A2uiDataBinding
  | A2uiFunctionCall

// ── Actions ──────────────────────────────────────────────────────────────────

/** Dispatches a named event back to the agent. */
export interface A2uiEventAction {
  event: {
    name: string
    userMessage?: A2uiDynamicString
    context?: Record<string, A2uiDynamicValue>
  }
}

/** Runs a renderer-side catalog function without involving the agent. */
export interface A2uiFunctionAction {
  functionCall: A2uiFunctionCall
}

export type A2uiAction = A2uiEventAction | A2uiFunctionAction

// ── Components ───────────────────────────────────────────────────────────────

/** Accessibility attributes carried on any component. */
export interface A2uiAccessibility {
  label?: A2uiDynamicString
  description?: A2uiDynamicString
  live?: 'off' | 'polite' | 'assertive'
}

/**
 * One entry in a surface's adjacency list.
 *
 * The index signature carries catalog-specific props (`text`, `url`, `options`,
 * …) that vary per component, which is how the catalog stays open to component
 * sets beyond Basic without a type per component.
 */
export interface A2uiComponentProps {
  component: string
  catalogId?: string
  accessibility?: A2uiAccessibility
  metadata?: { extensions?: Record<string, unknown> }
  [prop: string]: unknown
}

/**
 * Split from {@link A2uiComponentProps} by extension rather than by
 * `Omit<A2uiComponent, 'id'>`. `Omit` resolves `keyof` to `string | number`
 * on a type carrying an index signature, which erases every named property, so
 * the omitted form would no longer be known to supply `component`.
 */
export interface A2uiComponent extends A2uiComponentProps {
  id: string
}

/** A template that instantiates one component per item in a data-model list. */
export interface A2uiChildTemplate {
  componentId: string
  path: string
}

export type A2uiChildList = string[] | A2uiChildTemplate

// ── Messages ─────────────────────────────────────────────────────────────────

export interface A2uiCreateSurface {
  surfaceId: string
  catalogId?: string
  sendDataModel?: boolean
  components?: A2uiComponent[]
  dataModel?: Record<string, unknown>
  metadata?: { extensions?: Record<string, unknown> }
}

export interface A2uiUpdateComponents {
  surfaceId: string
  components: A2uiComponent[]
}

export interface A2uiUpdateDataModel {
  surfaceId: string
  /** Where in the data model to write. Omitted or `/` means the whole model. */
  path?: string
  /** The data to write. An explicit `null` deletes whatever sits at `path`. */
  value: unknown
}

export interface A2uiDeleteSurface {
  surfaceId: string
}

/**
 * One agent-to-renderer message.
 *
 * A type alias rather than an interface so it keeps an implicit index
 * signature: these land in `structuredContent`, which the MCP SDK types as
 * `{ [x: string]: unknown }`, and TypeScript grants that signature to object
 * aliases but never to interfaces. Same reasoning as `src/mcp/types.ts`.
 */
export type A2uiMessage =
  | { version: string; createSurface: A2uiCreateSurface }
  | { version: string; updateComponents: A2uiUpdateComponents }
  | { version: string; updateDataModel: A2uiUpdateDataModel }
  | { version: string; deleteSurface: A2uiDeleteSurface }

/**
 * The list-wrapper envelope, for transports that need a top-level JSON object
 * rather than a bare array. This is what prefab writes into an MCP resource or
 * an embedded resource, per `agent_to_renderer_list_wrapper.json`.
 */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- must be a type alias to get an implicit index signature; see the note on A2uiMessage
export type A2uiMessageList = {
  messages: A2uiMessage[]
}

// ── Diagnostics ──────────────────────────────────────────────────────────────

/** Why a prefab node could not cross into A2UI unchanged. */
export type A2uiDiagnosticKind =
  /** No Basic-catalog component covers this type; it was rendered as something simpler. */
  | 'degraded'
  /** No sensible degradation exists; the node was dropped. */
  | 'unsupported'
  /** A `{{ }}` expression was richer than a JSON Pointer; the binding was dropped. */
  | 'expression'
  /** A prefab action has no agent-side event equivalent. */
  | 'action'

export interface A2uiDiagnostic {
  kind: A2uiDiagnosticKind
  /** The prefab component type or action name the diagnostic is about. */
  subject: string
  /** What the emitter did instead. */
  detail: string
}
