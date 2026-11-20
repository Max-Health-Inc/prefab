import type { ComponentJSON } from './component.js'
import type { ActionJSON } from '../actions/types.js'

export function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value)
}

export function optionalString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined
}

export function optionalNumber(value: unknown): number | undefined {
  return typeof value === 'number' ? value : undefined
}

const CSS_LENGTH = /^(?:(?:\d+\.?\d*|\.\d+)(?:px|r?em|%|ch|ex|r?lh|cap|ic|[sdl]?v(?:h|w|min|max|i|b)|cq(?:w|h|i|b|min|max)|cm|mm|q|in|pt|pc)|(?:min|max|clamp|calc|var|env)\([^;{}<>]*\)|auto|fit-content|min-content|max-content)$/i

/** A number, or a string holding one, as pixels; a CSS length string such as `60dvh` or `min(720px, 75vh)` as written; anything else as `fallback` pixels. */
export function cssLength(value: unknown, fallback: number): string {
  const n = typeof value === 'number' ? value : typeof value === 'string' && value.trim() !== '' ? Number(value) : NaN
  if (Number.isFinite(n)) return `${String(n)}px`
  const fallbackPx = `${String(fallback)}px`
  if (typeof value !== 'string') return fallbackPx
  const length = value.trim()
  if (!CSS_LENGTH.test(length)) return fallbackPx
  if (typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && !CSS.supports('height', length)) return fallbackPx
  return length
}

export function optionalRecord(value: unknown): Record<string, unknown> | undefined {
  return isRecord(value) ? value : undefined
}

export function recordList(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? value.filter(isRecord) : []
}

export function recordOrList(value: unknown): Record<string, unknown>[] {
  return isRecord(value) ? [value] : recordList(value)
}

function isScalar(value: unknown): value is string | number | boolean {
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
}

export function scalarStringRecord(value: unknown): Record<string, string> {
  const out: Record<string, string> = {}
  if (!isRecord(value)) return out
  for (const [key, v] of Object.entries(value)) {
    if (isScalar(v)) out[key] = String(v)
  }
  return out
}

/** The first of `keys` that holds a scalar prop, as text. */
export function textOf(node: ComponentJSON, ...keys: string[]): string | undefined {
  for (const key of keys) {
    const v = node[key]
    if (isScalar(v)) return String(v)
  }
  return undefined
}

function isActionJSON(value: unknown): value is ActionJSON {
  return isRecord(value) && typeof value.action === 'string'
}

/** A copy of `value` as a component; ill-typed `id`, `cssClass`, `onMount` and `children` are dropped. */
export function toComponentJSON(value: unknown): ComponentJSON | undefined {
  if (!isRecord(value) || typeof value.type !== 'string') return undefined
  const node: ComponentJSON = { type: value.type }
  for (const [key, prop] of Object.entries(value)) {
    if (key === 'children') {
      if (Array.isArray(prop)) node.children = componentList(prop)
    } else if (key === 'onMount') {
      if (isActionJSON(prop) || (Array.isArray(prop) && prop.every(isActionJSON))) node.onMount = prop
    } else if (key === 'id' || key === 'cssClass') {
      if (typeof prop === 'string') node[key] = prop
    } else if (key !== 'type') {
      node[key] = prop
    }
  }
  return node
}

export function componentList(value: unknown): ComponentJSON[] {
  if (!Array.isArray(value)) return []
  const nodes: ComponentJSON[] = []
  for (const item of value) {
    const node = toComponentJSON(item)
    if (node) nodes.push(node)
  }
  return nodes
}
