/**
 * A2UI v1.0 conformance validator.
 *
 * Validates emitted payloads against the official JSON Schemas vendored in
 * `test/fixtures/a2ui/v1_0/`. This is the gate that matters for an emitter: the
 * upstream YAML conformance suites in `a2ui-project/a2ui/conformance/` exercise
 * SDK internals (streaming parser, catalog pruning, validator behaviour) that a
 * producer does not implement, whereas the schemas define exactly what a
 * producer must emit.
 *
 * Two structural rules the schemas cannot express are checked here as well,
 * because a payload can be schema-valid and still fail to render:
 *
 *   - every referenced child id must exist, and
 *   - every component must be reachable from `root`.
 *
 * Both come from `conformance/core/validator.yaml`, which asserts them against
 * the reference implementations.
 */

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import Ajv2020 from 'ajv/dist/2020.js'
import { A2UI_ROOT_ID, type A2uiComponent, type A2uiMessage } from '../../src/a2ui/types.js'

const FIXTURES = join(dirname(fileURLToPath(import.meta.url)), '..', 'fixtures', 'a2ui', 'v1_0')

const BASE = 'https://a2ui.org/specification/v1_0/'

function load(name: string): Record<string, unknown> {
  return JSON.parse(readFileSync(join(FIXTURES, name), 'utf-8')) as Record<string, unknown>
}

function buildValidator(): (payload: unknown) => string[] {
  // No format validators are registered: `strict: false` makes ajv skip unknown
  // formats, and the structural rules are what an emitter can actually get
  // wrong. Adding `ajv-formats` would pull in a second copy of ajv whose types
  // conflict with this one's. `logger: false` silences the per-format notice
  // that would otherwise print once per `format` keyword in the catalog.
  const ajv = new Ajv2020({ strict: false, allErrors: true, allowUnionTypes: true, logger: false })

  // `agent_to_renderer.json` refers to the active catalog as its sibling
  // `catalog.json`. That is a slot rather than a file: a surface names its
  // catalog through `catalogId`, and the validator binds the matching schema
  // there. prefab targets the Basic catalog, so that is what goes in.
  const catalog = load('basic-catalog.json')
  catalog.$id = `${BASE}catalog.json`

  ajv.addSchema(load('common_types.json'))
  ajv.addSchema(catalog)
  ajv.addSchema(load('agent_to_renderer.json'))
  ajv.addSchema(load('agent_to_renderer_list.json'))
  ajv.addSchema(load('agent_to_renderer_list_wrapper.json'))

  const validate = ajv.getSchema(`${BASE}json/agent_to_renderer_list_wrapper.json`)
  if (validate == null) throw new Error('a2ui: could not resolve the message-list wrapper schema')

  return (payload: unknown): string[] => {
    if (validate(payload)) return []
    return (validate.errors ?? []).map(e => `${e.instancePath || '/'} ${e.message ?? 'is invalid'}`)
  }
}

// Compiling the catalog is the expensive part, so it happens once per process.
let validateList: ((payload: unknown) => string[]) | undefined

/** Schema errors for a list of messages, empty when the payload conforms. */
export function schemaErrors(messages: A2uiMessage[]): string[] {
  validateList ??= buildValidator()
  return validateList({ messages })
}

/** Every component across every `createSurface` / `updateComponents` message. */
export function allComponents(messages: A2uiMessage[]): A2uiComponent[] {
  const out: A2uiComponent[] = []
  for (const m of messages) {
    if ('createSurface' in m && m.createSurface.components != null) out.push(...m.createSurface.components)
    if ('updateComponents' in m) out.push(...m.updateComponents.components)
  }
  return out
}

/** Child ids a component points at, whether as a list, a single id, or a template. */
function referencedIds(component: A2uiComponent): string[] {
  const ids: string[] = []
  const take = (v: unknown): void => {
    if (typeof v === 'string') ids.push(v)
  }

  take(component.child)
  take(component.trigger)
  take(component.content)

  const children = component.children
  if (Array.isArray(children)) children.forEach(take)
  else if (children != null && typeof children === 'object') {
    take((children as { componentId?: unknown }).componentId)
  }

  if (Array.isArray(component.tabs)) {
    for (const tab of component.tabs) {
      if (tab != null && typeof tab === 'object') take((tab as { child?: unknown }).child)
    }
  }

  return ids
}

/**
 * Structural errors the schemas cannot catch: dangling references, a missing
 * root, and components stranded outside the tree.
 */
export function structuralErrors(messages: A2uiMessage[]): string[] {
  const components = allComponents(messages)
  if (components.length === 0) return []

  const byId = new Map(components.map(c => [c.id, c]))
  const errors: string[] = []

  if (!byId.has(A2UI_ROOT_ID)) errors.push(`no component has id "${A2UI_ROOT_ID}"`)

  for (const c of components) {
    for (const ref of referencedIds(c)) {
      if (!byId.has(ref)) errors.push(`${c.id} (${c.component}) references missing component "${ref}"`)
    }
  }

  const reachable = new Set<string>()
  const walk = (id: string): void => {
    if (reachable.has(id)) return
    reachable.add(id)
    const c = byId.get(id)
    if (c != null) referencedIds(c).forEach(walk)
  }
  if (byId.has(A2UI_ROOT_ID)) walk(A2UI_ROOT_ID)

  for (const c of components) {
    if (!reachable.has(c.id)) errors.push(`${c.id} (${c.component}) is unreachable from "${A2UI_ROOT_ID}"`)
  }

  return errors
}

/** Schema plus structural errors, which is what a conformance run asserts on. */
export function conformanceErrors(messages: A2uiMessage[]): string[] {
  return [...schemaErrors(messages), ...structuralErrors(messages)]
}
