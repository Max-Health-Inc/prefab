/**
 * Control-flow mappers — `ForEach`, `Define`/`Use`/`Slot`, and the conditionals.
 *
 * These are the prefab components with no A2UI component of their own, and they
 * split three ways. `ForEach` has an A2UI *mechanism* rather than a component:
 * the child template, the same construct `./table.ts` uses for `DataTable`.
 * `Define`/`Use`/`Slot` need no A2UI concept at all, because a definition can be
 * expanded before the payload is sent.
 *
 * Conditionals are the exception, and the one genuine capability gap between the
 * two protocols. A2UI has no declarative `if`: the renderer draws what the
 * adjacency list says, and the agent sends a fresh `updateComponents` when the
 * shape should change. prefab runs a reactive client that re-shapes itself
 * without a round trip. Faking it — emitting a one-item list template as a
 * pretend conditional — would produce a UI that is wrong in a way nothing
 * reports, so it is diagnosed instead.
 */

import type { ComponentJSON } from '../core/component.js'
import { escapePointerToken } from './expr.js'
import type { Mapper } from './catalog.js'

/** Read the first present scalar prop from a node. */
function textOf(node: ComponentJSON, ...keys: string[]): string | undefined {
  for (const k of keys) {
    const v = node[k]
    if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') return String(v)
  }
  return undefined
}

/** Narrow an unknown `slots` prop to the shape the renderer expects. */
function isNodeMap(value: unknown): value is Record<string, ComponentJSON[]> {
  return value != null && typeof value === 'object' && !Array.isArray(value)
}

export const CONTROL_MAPPERS: Record<string, Mapper> = {
  ForEach: (node, ctx) => {
    const expression = textOf(node, 'expression')
    if (expression == null) {
      ctx.note('unsupported', 'ForEach', 'no expression to iterate')
      return undefined
    }

    const bound = ctx.bind(expression)
    if (bound.kind !== 'binding') {
      ctx.note('expression', 'ForEach', `"${expression}" is not a plain path, so there is no list to bind`)
      return undefined
    }

    // Inside the template, `$item` is the current row and paths are relative to
    // it, which is exactly how A2UI resolves a template's bindings.
    const template = ctx.inScope({ $item: '', $index: '' }, () => ctx.single(node.children))
    if (template == null) {
      ctx.note('unsupported', 'ForEach', 'the loop body had nothing to render')
      return undefined
    }

    return { component: 'Column', children: { path: bound.value.path, componentId: template } }
  },

  // A definition is a template, not content. The renderer draws nothing at the
  // point of definition, and neither does this.
  Define: () => undefined,

  Use: (node, ctx) => {
    const name = textOf(node, 'def', 'name')
    if (name == null) {
      ctx.note('unsupported', 'Use', 'no definition name')
      return undefined
    }

    const body = ctx.definition(name)
    if (body == null) {
      ctx.note('unsupported', 'Use', `no definition named "${name}" was declared`)
      return undefined
    }

    // Overrides are the definition's parameters. They are seeded into the data
    // model and brought into scope by name, so a `{{ title }}` inside the body
    // reads this call's value rather than whatever sits at the model root.
    const overrides = node.overrides
    const scope: Record<string, string> = {}
    if (overrides != null && typeof overrides === 'object' && !Array.isArray(overrides)) {
      const root = ctx.bindData(`use_${name}`, overrides)
      for (const key of Object.keys(overrides)) {
        scope[key] = `${root}/${escapePointerToken(key)}`
      }
    }

    const slots: Record<string, ComponentJSON[]> = {
      ...(isNodeMap(node.slots) ? node.slots : {}),
      ...(Array.isArray(node.children) && node.children.length > 0 ? { default: node.children } : {}),
    }

    const inlined = ctx.expand(name, () =>
      ctx.inScope(scope, () => ctx.withSlots(slots, () => ctx.single(body))))
    if (inlined == null) {
      ctx.note('unsupported', 'Use', `definition "${name}" rendered nothing`)
      return undefined
    }
    return { component: 'Column', children: [inlined] }
  },

  Slot: (node, ctx) => {
    const name = textOf(node, 'name') ?? 'default'
    // Slot content from the enclosing Use, or the slot's own fallback children.
    const content = ctx.slotContent(name) ?? (Array.isArray(node.children) ? node.children : undefined)
    const inlined = content != null ? ctx.single(content) : undefined
    if (inlined == null) {
      ctx.note('unsupported', 'Slot', `slot "${name}" had neither content nor a fallback`)
      return undefined
    }
    return { component: 'Column', children: [inlined] }
  },
}

for (const type of ['If', 'Elif', 'Else', 'Condition', 'Match', 'Case']) {
  CONTROL_MAPPERS[type] = (node, ctx) => {
    ctx.note(
      'unsupported',
      node.type,
      'A2UI has no declarative conditional; the agent re-sends updateComponents when the shape changes',
    )
    return undefined
  }
}
