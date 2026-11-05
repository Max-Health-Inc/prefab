/**
 * Control flow renderers — ForEach, If/Elif/Else
 */

import { registerComponent, renderNode, renderChildArray } from '../engine.js'
import type { ComponentNode, RenderContext } from '../engine.js'
import { evaluateTemplate, isRxExpression } from '../rx.js'
import { isRecord, optionalRecord, optionalString, recordList } from '../../core/guards.js'
import { nodeList } from '../node-guard.js'

function nodeSlots(value: unknown): Record<string, ComponentNode[]> {
  if (!isRecord(value)) return {}
  return Object.fromEntries(Object.entries(value).map(([slot, nodes]) => [slot, nodeList(nodes)]))
}

export function registerControlComponents(): void {
  registerComponent('ForEach', renderForEach)
  registerComponent('If', renderIf)
  registerComponent('Elif', renderElif)
  registerComponent('Else', renderElse)
  registerComponent('Condition', renderCondition)
  registerComponent('Define', renderDefine)
  registerComponent('Use', renderUse)
  registerComponent('Slot', renderSlot)
}

function renderForEach(node: ComponentNode, ctx: RenderContext): DocumentFragment {
  const frag = document.createDocumentFragment()
  const expr = optionalString(node.expression)
  if (!expr) return frag
  let items: unknown[]

  if (isRxExpression(expr)) {
    const val = evaluateTemplate(expr, ctx.store, ctx.scope)
    items = Array.isArray(val) ? val : []
  } else {
    const val = ctx.store.get(expr)
    items = Array.isArray(val) ? val : []
  }

  const letBindings = optionalRecord(node.let) ?? {}

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const childScope = {
      ...ctx.scope,
      $item: item,
      $index: i,
      ...letBindings,
    }
    const childCtx = { ...ctx, scope: childScope }

    if (node.children) {
      renderChildArray(node.children, frag, childCtx)
    }
  }

  return frag
}

/**
 * If/Elif/Else rendering.
 *
 * These components form a conditional chain. When an If is encountered,
 * it checks siblings for Elif/Else. Since the parent renders children
 * sequentially, we handle this by marking Elif/Else as already-consumed
 * when found after an If.
 *
 * For the standalone render, If evaluates its condition and renders
 * children if truthy. Elif/Else are no-ops when rendered standalone
 * (they're consumed by the parent's If chain logic).
 */
function renderIf(node: ComponentNode, ctx: RenderContext): HTMLElement | DocumentFragment {
  const condition = evaluateCondition(optionalString(node.condition) ?? '', ctx)

  if (condition) {
    const frag = document.createDocumentFragment()
    if (node.children) {
      renderChildArray(node.children, frag, ctx)
    }
    return frag
  }

  // Return empty element
  return document.createDocumentFragment()
}

function renderElif(node: ComponentNode, ctx: RenderContext): HTMLElement | DocumentFragment {
  // Elif is evaluated the same as If (parent chain handles precedence)
  return renderIf(node, ctx)
}

function renderElse(node: ComponentNode, ctx: RenderContext): DocumentFragment {
  const frag = document.createDocumentFragment()
  if (node.children) {
    renderChildArray(node.children, frag, ctx)
  }
  return frag
}

function evaluateCondition(condition: string, ctx: RenderContext): boolean {
  if (!condition) return false
  if (isRxExpression(condition)) {
    return Boolean(evaluateTemplate(condition, ctx.store, ctx.scope))
  }
  // Plain state key reference
  return Boolean(ctx.store.get(condition))
}

// ── Define / Use / Slot ──────────────────────────────────────────────────────

/**
 * Condition: Prefect-compatible conditional rendering.
 * Evaluates `cases: [{ when, children }]` in order, renders the first match.
 * Falls back to `else` children if no case matches.
 */
function renderCondition(node: ComponentNode, ctx: RenderContext): DocumentFragment {
  const frag = document.createDocumentFragment()
  const match = recordList(node.cases).find(c => evaluateCondition(optionalString(c.when) ?? '', ctx))
  renderChildArray(nodeList(match ? match.children : node.else), frag, ctx)
  return frag
}

/**
 * Define: stores named template children in the context defs map.
 * Renders nothing — content is materialized via Use.
 */
function renderDefine(node: ComponentNode, ctx: RenderContext): DocumentFragment {
  const name = optionalString(node.name)
  if (name && node.children) {
    ctx.templates = ctx.templates ?? {}
    ctx.templates[name] = node.children
  }
  return document.createDocumentFragment()
}

/**
 * Use: materializes a named definition previously stored via Define.
 * Accepts both `def` (TS builder) and `name` (legacy) props.
 */
function renderUse(node: ComponentNode, ctx: RenderContext): DocumentFragment {
  const frag = document.createDocumentFragment()
  const name = optionalString(node.def ?? node.name)
  const children = name != null ? ctx.templates?.[name] : undefined
  if (!children) return frag

  const overrides = optionalRecord(node.overrides) ?? {}
  const childScope = { ...ctx.scope, ...overrides }

  // Slot content: the Use node's own children fill the default slot, and a
  // `slots` map fills named slots. Without this, a Slot inside the template
  // could only ever render its fallback.
  const slots: Record<string, ComponentNode[]> = {
    ...(ctx.slots ?? {}),
    ...nodeSlots(node.slots),
  }
  if (Array.isArray(node.children)) slots.default = node.children

  const childCtx = { ...ctx, scope: childScope, slots }

  for (const child of children) {
    frag.appendChild(renderNode(child, childCtx))
  }
  return frag
}

/**
 * Slot: renders named slot children, or fallback children if no slot content provided.
 */
function renderSlot(node: ComponentNode, ctx: RenderContext): DocumentFragment {
  const frag = document.createDocumentFragment()
  const slotName = optionalString(node.name) ?? 'default'

  // Check if parent context provided slot content
  const slotContent = ctx.slots?.[slotName]
  const children = slotContent ?? node.children

  if (children) {
    for (const child of children) {
      frag.appendChild(renderNode(child, ctx))
    }
  }
  return frag
}
