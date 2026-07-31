/**
 * MCP Display Helpers — return prefab UIs as MCP tool results.
 *
 * These functions wrap PrefabApp / Component trees into MCP-compatible
 * tool result content arrays, ready to return from tool handlers.
 *
 * @example
 * ```ts
 * import { display, display_error } from '@maxhealth.tech/prefab/mcp'
 * import { autoTable } from '@maxhealth.tech/prefab'
 *
 * // In a FastMCP tool handler:
 * async function listPatients(args, context) {
 *   const patients = await fetchPatients()
 *   return display(autoTable(patients), { title: 'Patient List' })
 * }
 * ```
 */

import { type Component } from '../core/component.js'
import { PrefabApp, PROTOCOL_VERSION } from '../app.js'
import type { Theme, LayoutHints, ColorMode, PrefabWireFormat } from '../app.js'
import type { Action, ActionJSON } from '../actions/types.js'
import type { PipeFn } from '../rx/pipes.js'
import type { McpToolResult } from './types.js'
import { toolResult } from './result.js'

// ── display() ────────────────────────────────────────────────────────────────

/** Concatenate two optional arrays, returning undefined when both are empty/absent. */
function concatArrays<T>(a?: T[], b?: T[]): T[] | undefined {
  if (a == null && b == null) return undefined
  return [...(a ?? []), ...(b ?? [])]
}

export interface DisplayOptions {
  /** Page / app title. */
  title?: string
  /** Initial reactive state. */
  state?: Record<string, unknown>
  /** Light/dark theme overrides. */
  theme?: Theme
  /** Reusable component definitions. */
  defs?: Record<string, Component>
  /** Action(s) to run when the UI mounts. */
  onMount?: Action | Action[]
  /** Keyboard shortcuts. */
  keyBindings?: Record<string, Action | Action[]>
  /** Extra CSS class on root element. */
  cssClass?: string
  /** Size hints for the host container (iframe, panel, etc.). */
  layout?: LayoutHints
  /** Inline CSS blocks injected as `<style>` (merged after the compiled theme). */
  css?: string[]
  /** External CSS URLs loaded as `<link rel="stylesheet">`. */
  stylesheets?: string[]
  /** Force a color scheme regardless of OS preference. */
  mode?: ColorMode
  /** Custom pipe functions for reactive expressions. */
  pipes?: Record<string, PipeFn>
}

/**
 * Wrap a Component (or PrefabApp) as an MCP tool result.
 *
 * If given a Component, it's wrapped in a PrefabApp automatically.
 * If given a PrefabApp, it's serialized as-is.
 *
 * @returns MCP tool result with the prefab wire format JSON as text content.
 */
export function display(
  viewOrApp: Component | PrefabApp,
  options?: DisplayOptions,
): McpToolResult<PrefabWireFormat> {
  let app: PrefabApp

  if (viewOrApp instanceof PrefabApp) {
    if (options != null && Object.keys(options).length > 0) {
      // Merge options into a new PrefabApp wrapping the same view.
      // Options override the existing app's values; arrays (stylesheets) are concatenated.
      app = new PrefabApp({
        title: options.title ?? viewOrApp.title,
        view: viewOrApp.view,
        state: viewOrApp.state || options.state
          ? { ...viewOrApp.state, ...options.state }
          : undefined,
        theme: options.theme ?? viewOrApp.theme,
        defs: viewOrApp.defs || options.defs
          ? { ...viewOrApp.defs, ...options.defs }
          : undefined,
        onMount: options.onMount ?? viewOrApp.onMount,
        keyBindings: viewOrApp.keyBindings || options.keyBindings
          ? { ...viewOrApp.keyBindings, ...options.keyBindings }
          : undefined,
        cssClass: options.cssClass ?? viewOrApp.cssClass,
        layout: options.layout ?? viewOrApp.layout,
        css: concatArrays(viewOrApp.css, options.css),
        stylesheets: concatArrays(viewOrApp.stylesheets, options.stylesheets),
        mode: options.mode ?? viewOrApp.mode,
        pipes: viewOrApp.pipes || options.pipes
          ? { ...viewOrApp.pipes, ...options.pipes }
          : undefined,
      })
    } else {
      app = viewOrApp
    }
  } else {
    app = new PrefabApp({
      title: options?.title ?? 'Prefab',
      view: viewOrApp,
      state: options?.state,
      theme: options?.theme,
      defs: options?.defs,
      onMount: options?.onMount,
      keyBindings: options?.keyBindings,
      cssClass: options?.cssClass,
      layout: options?.layout,
      css: options?.css,
      stylesheets: options?.stylesheets,
      mode: options?.mode,
      pipes: options?.pipes,
    })
  }

  return toolResult(app.toJSON())
}

// ── display_form() ───────────────────────────────────────────────────────────

import { autoForm } from '../auto/form.js'
import type { AutoFormField, AutoFormOptions } from '../auto/form.js'

export interface DisplayFormOptions extends AutoFormOptions, DisplayOptions {}

/**
 * Return a form UI as an MCP tool result.
 *
 * Submitting the form calls the specified MCP tool (via CallTool).
 * Field definitions map to Input components; the submit action
 * invokes `submitTool` with all field values.
 *
 * @returns MCP tool result with form prefab UI.
 */
export function display_form(
  fields: AutoFormField[],
  submitTool: string,
  options?: DisplayFormOptions,
): McpToolResult<PrefabWireFormat> {
  const view = autoForm(fields, submitTool, options)
  const app = new PrefabApp({
    title: options?.title ?? 'Form',
    view,
    state: options?.state,
    theme: options?.theme,
    defs: options?.defs,
    onMount: options?.onMount,
    keyBindings: options?.keyBindings,
    cssClass: options?.cssClass,
    layout: options?.layout,
    css: options?.css,
    stylesheets: options?.stylesheets,
    mode: options?.mode,
    pipes: options?.pipes,
  })

  return toolResult(app.toJSON())
}

// ── display_update() ─────────────────────────────────────────────────────────

export interface StateUpdate {
  /** State key-value pairs to merge into the existing UI state. */
  state: Record<string, unknown>
  /** Actions to fire after the state delta is applied. */
  actions?: ActionJSON | ActionJSON[]
}

export interface PrefabUpdateWire {
  $prefab: { version: string }
  update: StateUpdate
}

export interface DisplayUpdateOptions {
  /** Actions to fire after the state delta is applied. */
  actions?: Action | Action[]
}

/**
 * Return a partial state update for an existing prefab UI.
 *
 * Instead of re-rendering the entire UI, this sends a state delta
 * that the renderer merges into its reactive store. Optionally fires
 * actions after the state is applied.
 *
 * @returns MCP tool result with a $prefab update payload.
 */
export function display_update(
  state: Record<string, unknown>,
  options?: DisplayUpdateOptions,
): McpToolResult<PrefabUpdateWire> {
  const update: StateUpdate = { state }
  if (options?.actions != null) {
    const acts = Array.isArray(options.actions) ? options.actions : [options.actions]
    update.actions = acts.map(a => a.toJSON())
  }

  return toolResult<PrefabUpdateWire>({
    $prefab: { version: PROTOCOL_VERSION },
    update,
  })
}

// ── display_error() ──────────────────────────────────────────────────────────

import { Column } from '../components/layout/index.js'
import { Muted, Code } from '../components/typography/index.js'
import { Alert, AlertTitle, AlertDescription } from '../components/alert/index.js'
import { Card, CardContent } from '../components/card/index.js'

export interface DisplayErrorOptions {
  /** Error detail / stack trace to show in a code block. */
  detail?: string
  /** Hint for the user on how to fix the issue. */
  hint?: string
  /** Theme overrides. */
  theme?: Theme
}

/**
 * Return a standardized error view as an MCP tool result.
 *
 * Renders a destructive Alert with title + message, optional detail
 * code block, and optional hint. Sets `isError: true` on the MCP result.
 *
 * @returns MCP tool result with error UI and isError flag.
 */
export function display_error(
  title: string,
  message: string,
  options?: DisplayErrorOptions,
): McpToolResult<PrefabWireFormat> {
  const alertChildren: Component[] = [
    AlertTitle(title),
    AlertDescription(message),
  ]

  const bodyChildren: Component[] = [
    Alert({ variant: 'destructive', icon: 'AlertCircle', children: alertChildren }),
  ]

  if (options?.detail) {
    bodyChildren.push(
      Card({ children: [CardContent({ children: [Code(options.detail)] })] }),
    )
  }

  if (options?.hint) {
    bodyChildren.push(Muted(options.hint))
  }

  const view = Column({ gap: 4, cssClass: 'p-6 max-w-2xl', children: bodyChildren })

  const app = new PrefabApp({
    title: 'Error',
    view,
    theme: options?.theme,
  })

  return toolResult(app.toJSON(), { isError: true })
}

// ── display_success() ────────────────────────────────────────────────────────

export interface DisplaySuccessOptions {
  /** Additional detail text below the message. */
  detail?: string
  /** Theme overrides. */
  theme?: Theme
}

/**
 * Return a standardized success view as an MCP tool result.
 *
 * Renders a success Alert with title + message, optional detail text.
 *
 * @returns MCP tool result with success UI.
 */
export function display_success(
  title: string,
  message: string,
  options?: DisplaySuccessOptions,
): McpToolResult<PrefabWireFormat> {
  const alertChildren: Component[] = [
    AlertTitle(title),
    AlertDescription(message),
  ]

  const bodyChildren: Component[] = [
    Alert({ variant: 'success', icon: 'CheckCircle', children: alertChildren }),
  ]

  if (options?.detail) {
    bodyChildren.push(Muted(options.detail))
  }

  const view = Column({ gap: 4, cssClass: 'p-6 max-w-2xl', children: bodyChildren })

  const app = new PrefabApp({
    title: 'Success',
    view,
    theme: options?.theme,
  })

  return toolResult(app.toJSON())
}

// ── camelCase aliases (TS convention) ────────────────────────────────────────

export const displayForm = display_form
export const displayUpdate = display_update
export const displayError = display_error
export const displaySuccess = display_success
