import { isRecord } from '../core/guards.js'
import type { ComponentNode } from './engine.js'
import type { ActionJSON } from './actions.js'

function isOptional(value: unknown, check: (v: unknown) => boolean): boolean {
  return value === undefined || check(value)
}

export function isActionValue(value: unknown): value is ActionJSON | ActionJSON[] {
  return isRecord(value) || (Array.isArray(value) && value.every(isRecord))
}

export function isComponentNode(value: unknown): value is ComponentNode {
  return isRecord(value)
    && typeof value.type === 'string'
    && isOptional(value.id, v => typeof v === 'string')
    && isOptional(value.cssClass, v => typeof v === 'string')
    && isOptional(value.onMount, isActionValue)
    && isOptional(value.children, v => Array.isArray(v) && v.every(isComponentNode))
}

export function nodeList(value: unknown): ComponentNode[] {
  return Array.isArray(value) ? value.filter(isComponentNode) : []
}
