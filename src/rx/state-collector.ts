/**
 * Auto state collector — tracks Signal and Collection instances
 * for automatic state assembly in PrefabApp.
 *
 * `signal()` and `collection()` factories push entries here.
 * `PrefabApp` drains the collector at construction time, so each
 * app captures exactly the state created before it.
 */

export interface StateEntry {
  toState(): Record<string, unknown>
}

const pending: StateEntry[] = []

/** @internal Push a signal or collection for auto-collection. */
export function trackState(entry: StateEntry): void {
  pending.push(entry)
}

/**
 * @internal Drain all pending state entries and return merged state.
 * Clears the pending list. Called by PrefabApp constructor.
 */
export function drainAutoState(): Record<string, unknown> {
  const merged: Record<string, unknown> = {}
  for (const entry of pending) {
    const state = entry.toState()
    for (const key of Object.keys(state)) {
      if (key in merged) {
        console.warn(`[prefab] state key "${key}" registered multiple times — last value wins`)
      }
    }
    Object.assign(merged, state)
  }
  pending.length = 0
  return merged
}

/**
 * @internal Reset the collector (for tests).
 */
export function resetAutoState(): void {
  pending.length = 0
}
