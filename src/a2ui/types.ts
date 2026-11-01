/**
 * A2UI v1.0 agent-to-renderer wire types (a2ui-project/a2ui, Apache-2.0): a flat, id-linked component list whose
 * values bind through JSON Pointers, where `$prefab` nests children and interpolates `{{ }}`.
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

/** A catalog function call, unwrapped; the `functionCall` wrapper exists only inside an {@link A2uiAction}. */
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

/** One entry in a surface's component list; catalog-specific props ride the index signature. */
export interface A2uiComponentProps {
  component: string
  catalogId?: string
  accessibility?: A2uiAccessibility
  metadata?: { extensions?: Record<string, unknown> }
  [prop: string]: unknown
}

/** Extends {@link A2uiComponentProps} because `Omit` over an index signature erases the named properties. */
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

/** One agent-to-renderer message; a type alias so it fits `structuredContent` (see `src/mcp/types.ts`). */
export type A2uiMessage =
  | { version: string; createSurface: A2uiCreateSurface }
  | { version: string; updateComponents: A2uiUpdateComponents }
  | { version: string; updateDataModel: A2uiUpdateDataModel }
  | { version: string; deleteSurface: A2uiDeleteSurface }

/** The `{ messages }` envelope prefab writes into MCP resources, per `agent_to_renderer_list_wrapper.json`. */
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
