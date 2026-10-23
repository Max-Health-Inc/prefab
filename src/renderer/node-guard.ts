import { isRecord } from '../core/guards.js'
import type { ComponentNode } from './engine.js'

function isOptional(value: unknown, check: (v: unknown) => boolean): boolean {
  return value === undefined || check(value)
}

function isActionValue(value: unknown): boolean {
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
