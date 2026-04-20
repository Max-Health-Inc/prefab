/**
 * Component render engine — takes JSON component trees and produces DOM.
 *
 * The engine uses a registry of render functions keyed by component type.
 * Each render function receives the JSON node and a render context,
 * and returns an HTMLElement (or DocumentFragment).
 */

import type { Store } from './state.js'
import type { EvalScope } from './rx.js'
import type { DispatchContext, McpTransport, ToastEvent, ActionJSON } from './actions.js'
import { evaluateTemplate, isRxExpression } from './rx.js'
import { dispatchActions } from './actions.js'

// ── Types ────────────────────────────────────────────────────────────────────

export interface ComponentNode {
  type: string
  id?: string
  cssClass?: string
  onMount?: ActionJSON | ActionJSON[]
  children?: ComponentNode[]
  [key: string]: unknown
}

export interface RenderContext {
  store: Store
  scope: EvalScope
  transport?: McpTransport
  rerender: () => void
  onToast?: (toast: ToastEvent) => void
  defs?: Record<string, ComponentNode>
  templates?: Record<string, ComponentNode[]>
  slots?: Record<string, ComponentNode[]>
}

export type RenderFn = (node: ComponentNode, ctx: RenderContext) => HTMLElement | DocumentFragment

// ── Registry ─────────────────────────────────────────────────────────────────

const registry = new Map<string, RenderFn>()

/** Register a render function for a component type */
export function registerComponent(type: string, fn: RenderFn): void {
  registry.set(type, fn)
}

/** Get a render function (or fallback) */
export function getRenderer(type: string): RenderFn | undefined {
  return registry.get(type)
}

// ── Core render ──────────────────────────────────────────────────────────────

/**
 * Render a component node to DOM.
 * Looks up the renderer by type; falls back to a generic div.
 */
export function renderNode(node: ComponentNode, ctx: RenderContext): HTMLElement | DocumentFragment {
  // Resolve defs: if node.type matches a def, substitute
  if (ctx.defs?.[node.type]) {
    const defNode = { ...ctx.defs[node.type], ...node, type: ctx.defs[node.type].type }
    return renderNode(defNode, ctx)
  }

  const renderFn = registry.get(node.type)
  let el: HTMLElement | DocumentFragment

  if (renderFn) {
    el = renderFn(node, ctx)
  } else {
    // Fallback: generic div with data-type
    el = document.createElement('div')
    ;(el).setAttribute('data-prefab-type', node.type)
    if (node.children) {
      for (const child of node.children) {
        el.appendChild(renderNode(child, ctx))
      }
    }
  }

  // Apply common props
  if (el instanceof HTMLElement) {
    if (node.id) el.id = node.id
    if (node.cssClass) {
      const cls = resolveStr(node.cssClass, ctx)
      if (cls) el.className = (el.className ? el.className + ' ' : '') + cls
    }
  }

  // Run onMount actions
  if (node.onMount) {
    const onMount = node.onMount
    const dispCtx = makeDispatchCtx(ctx)
    queueMicrotask(() => void dispatchActions(onMount, dispCtx))
  }

  return el
}

/**
 * Render all children of a node into a parent element.
 */
export function renderChildren(node: ComponentNode, parent: HTMLElement, ctx: RenderContext): void {
  if (!node.children) return
  for (const child of node.children) {
    parent.appendChild(renderNode(child, ctx))
  }
}

// ── Helpers for renderers ────────────────────────────────────────────────────

/** Resolve a possibly-reactive string value */
export function resolveStr(value: unknown, ctx: RenderContext): string {
  if (isRxExpression(value)) {
    const result = evaluateTemplate(value, ctx.store, ctx.scope)
    return result == null ? '' : String(result as string | number | boolean)
  }
  return value == null ? '' : String(value as string | number | boolean)
}

/** Resolve a possibly-reactive value, keeping original type */
export function resolveValue(value: unknown, ctx: RenderContext): unknown {
  if (isRxExpression(value)) {
    return evaluateTemplate(value, ctx.store, ctx.scope)
  }
  return value
}

/** Create a DispatchContext from RenderContext */
export function makeDispatchCtx(ctx: RenderContext): DispatchContext {
  return {
    store: ctx.store,
    transport: ctx.transport,
    scope: ctx.scope,
    rerender: ctx.rerender,
    onToast: ctx.onToast,
  }
}

/** Create an element with a CSS class */
export function el(tag: string, className?: string): HTMLElement {
  const e = document.createElement(tag)
  if (className) e.className = className
  return e
}

/** Set text content on an element */
export function text(element: HTMLElement, content: string): HTMLElement {
  element.textContent = content
  return element
}
