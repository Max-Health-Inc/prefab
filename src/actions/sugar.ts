/**
 * Action-builder sugar — ergonomic wrappers that accept Signal / Collection
 * instead of raw state keys, preserving encapsulation.
 *
 * @example
 * ```ts
 * const count = signal('count', 0)
 * const items = collection('items', rows, { key: 'id' })
 *
 * set(count, 42)          // → new SetState('count', 42)
 * toggle(count)           // → new ToggleState('count')
 * append(items, newRow)   // → new AppendState('items', newRow)
 * pop(items, 0)           // → new PopState('items', 0)
 * pop(items)              // → new PopState('items', -1)  (last element)
 * ```
 */

import type { Signal } from '../rx/signal.js'
import type { Collection } from '../rx/collection.js'
import { SetState, ToggleState, AppendState, PopState } from './client.js'
import type { SetStateOpts } from './client.js'

/** Anything that resolves to a state key: Signal, Collection, or raw string. */
export type StateTarget = Signal | Collection | string

function resolveKey(target: StateTarget): string {
  if (typeof target === 'string') return target
  if ('stateKey' in target) return target.stateKey // Collection
  return target.key // Signal
}

/** Set a state value. `set(signal, value)` → `new SetState(signal.key, value)` */
export function set(target: StateTarget, value: unknown, opts?: SetStateOpts): SetState {
  return new SetState(resolveKey(target), value, opts)
}

/** Toggle a boolean state value. `toggle(signal)` → `new ToggleState(signal.key)` */
export function toggle(target: StateTarget): ToggleState {
  return new ToggleState(resolveKey(target))
}

/** Append an item to an array state value. Optionally specify insertion index. */
export function append(target: StateTarget, item: unknown, index?: number): AppendState {
  return new AppendState(resolveKey(target), item, index)
}

/** Remove an element from an array by index or value. Defaults to last element (-1). */
export function pop(target: StateTarget, indexOrValue: number | string = -1): PopState {
  return new PopState(resolveKey(target), indexOrValue)
}
