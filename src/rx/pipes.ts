/**
 * Custom pipe registry — extension point for companion packages.
 *
 * Companion packages (e.g. @maxhealth.tech/prefab-fhir) call
 * `registerPipe()` at import time to add domain-specific formatters.
 * Built-in pipes in applyFilter always take precedence over custom pipes.
 */

/** A pipe function receives the current value and optional arguments. */
export type PipeFn = (value: unknown, ...args: unknown[]) => unknown

const pipes = new Map<string, PipeFn>()

/**
 * Register a custom pipe filter.
 * Re-registration warns and overwrites (HMR-friendly).
 * Built-in pipes in applyFilter always shadow custom pipes.
 */
export function registerPipe(name: string, fn: PipeFn): void {
  if (pipes.has(name) && pipes.get(name) !== fn) {
    console.warn(`[prefab] pipe "${name}" re-registered`)
  }
  pipes.set(name, fn)
}

/** Remove a custom pipe (useful in tests). Returns true if it existed. */
export function unregisterPipe(name: string): boolean {
  return pipes.delete(name)
}

/** List all registered custom pipe names (useful for debugging). */
export function listPipes(): string[] {
  return [...pipes.keys()]
}

/** @internal — used by applyFilter to resolve custom pipes. */
export function getCustomPipe(name: string): PipeFn | undefined {
  return pipes.get(name)
}
