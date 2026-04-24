/**
 * Collection — Named keyed array for the prefab wire format.
 *
 * Collections carry row data with a key field. They serialize into `state`
 * as an array and produce `Ref<T>` lazy lookup expressions via `.by(signal)`.
 *
 * @example
 * ```ts
 * const patients = collection('patients', fhirPatients, { key: 'id' })
 * const selectedId = signal('selectedPatientId', patients.firstKey())
 * const selectedPatient = patients.by(selectedId)
 * // selectedPatient.expr → "{{ patients | find:'id',selectedPatientId }}"
 * ```
 */

import { Rx } from './rx.js'
import type { Signal, SignalValue } from './signal.js'
import { trackState } from './state-collector.js'

/**
 * A lazy, serializable reference to a row in a collection.
 * The expression is evaluated at runtime by the renderer's pipe evaluator.
 */
export class Ref<T = unknown> {
  readonly expr: string
  readonly type = 'ref' as const

  /** @internal */
  readonly _phantom?: T

  constructor(expr: string) {
    this.expr = expr
  }

  /** Rx expression for use in component props */
  toRx(): Rx {
    return new Rx(this.expr)
  }

  toString(): string {
    return `{{ ${this.expr} }}`
  }

  toJSON(): string {
    return this.toString()
  }

  /**
   * Type-safe property access on the referenced row.
   * Returns `Ref<T[K]>` so downstream type checking works.
   *
   * `ref.dot('name')` → `Ref<HumanName[]>` with expr `{{ ... | dot:'name' }}`
   */
  dot<K extends keyof T & string>(field: K): Ref<T[K]>
  /** Untyped escape hatch for dynamic/computed field names. */
  dot(field: string): Ref
  dot(field: string): Ref {
    return new Ref(`${this.expr} | dot:'${field}'`)
  }

  /**
   * Shorthand for `.dot(field).pipe(pipeName, ...args)`.
   * Compiles to `{{ expr | dot:'field' | pipeName }}`.
   *
   * Use for FHIR datatype formatting:
   * `ref.formatted('name', 'humanName')` → `{{ ... | dot:'name' | humanName }}`
   */
  formatted(field: keyof T & string | string, pipeName: string, ...args: unknown[]): Rx {
    return this.dot(field).pipe(pipeName, ...args)
  }

  /**
   * Append a pipe filter to the ref expression.
   * `ref.pipe('humanName')` → `{{ expr | humanName }}`
   * `ref.pipe('date', 'long')` → `{{ expr | date:'long' }}`
   */
  pipe(name: string, ...args: unknown[]): Rx {
    return this.toRx().pipe(name, ...args)
  }
}

/**
 * A named keyed array. Serializes rows into state and provides
 * typed lookup helpers that compile to pipe expressions.
 */
export class Collection<T extends Record<string, unknown> = Record<string, unknown>> {
  readonly stateKey: string
  readonly keyField: string
  readonly rows: T[]

  constructor(stateKey: string, rows: T[], keyField: string) {
    this.stateKey = stateKey
    this.keyField = keyField
    this.rows = rows
  }

  /** Key of the first row, or null if empty. */
  firstKey(): string | null {
    if (this.rows.length === 0) return null
    const val = this.rows[0][this.keyField]
    return val == null ? null : String(val as string | number)
  }

  /** Key of the last row, or null if empty. */
  lastKey(): string | null {
    if (this.rows.length === 0) return null
    const val = this.rows[this.rows.length - 1][this.keyField]
    return val == null ? null : String(val as string | number)
  }

  /** Number of rows. */
  get length(): number {
    return this.rows.length
  }

  /**
   * Create a Ref that lazily resolves a row by signal key.
   * Compiles to: `{{ stateKey | find:'keyField',signal.key }}`
   */
  by<K extends SignalValue>(key: Signal<K>): Ref<T> {
    return new Ref<T>(`${this.stateKey} | find:'${this.keyField}',${key.key}`)
  }

  /** Rx expression referencing the full array: `{{ stateKey }}` */
  toRx(): Rx {
    return new Rx(this.stateKey)
  }

  toString(): string {
    return this.toRx().toString()
  }

  toJSON(): string {
    return this.toString()
  }

  /** State entry for PrefabApp: `{ stateKey: rows }` */
  toState(): Record<string, T[]> {
    return { [this.stateKey]: this.rows }
  }
}

/**
 * Create a named keyed collection.
 *
 * @param stateKey  Stable state path (e.g. 'patients')
 * @param rows      Source array
 * @param options   Must include `key` — the field name used for identity lookup
 */
export function collection<T extends Record<string, unknown>>(
  stateKey: string,
  rows: T[],
  options: { key: string },
): Collection<T> {
  const c = new Collection(stateKey, rows, options.key)
  trackState(c)
  return c
}
