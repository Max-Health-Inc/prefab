/**
 * A named reactive scalar: serializes into `state` and renders as `{{ key }}` wherever it is referenced.
 *
 * @example
 * ```ts
 * const selectedId = signal('selectedPatientId', 'hans-meier')
 * // state: { selectedPatientId: 'hans-meier' }
 * // referenced as: "{{ selectedPatientId }}"
 * ```
 */

import { Rx } from './rx.js'
import { trackState } from './state-collector.js'

/** Allowed signal value types — intentionally excludes objects/arrays. */
export type SignalValue = string | number | boolean | null

export interface SignalOptions {
  /** A URL query parameter name, kept on the signal for app code. The renderer does not sync it to the address bar. */
  urlSync?: string
}

/** A state key with an initial value, usable wherever a prop takes an rx expression. */
export class Signal<T extends SignalValue = SignalValue> {
  readonly key: string
  readonly initial: T
  readonly options?: SignalOptions

  constructor(key: string, initial: T, options?: SignalOptions) {
    this.key = key
    this.initial = initial
    this.options = options
  }

  /** Rx expression referencing this signal's value: `{{ key }}` */
  toRx(): Rx {
    return new Rx(this.key)
  }

  /** Serialize to the rx template string */
  toString(): string {
    return this.toRx().toString()
  }

  toJSON(): string {
    return this.toString()
  }

  /** State entry for PrefabApp: `{ key: initial }` */
  toState(): Record<string, T> {
    return { [this.key]: this.initial }
  }
}

/**
 * Create a named reactive signal.
 *
 * @param key     Stable state path (e.g. 'selectedPatientId')
 * @param initial Initial value
 * @param options Optional configuration (urlSync, etc.)
 */
export function signal<T extends SignalValue>(
  key: string,
  initial: T,
  options?: SignalOptions,
): Signal<T> {
  const s = new Signal(key, initial, options)
  trackState(s)
  return s
}
