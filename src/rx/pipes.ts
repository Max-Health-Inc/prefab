/**
 * Custom pipe registry — extension point for domain-specific formatters.
 *
 * prefab ships no domain formatters of its own. A companion module adds them by
 * calling `registerPipe()` at import time, hand-written or emitted by a code
 * generator for whatever schema the consumer works with. Write such pipes
 * closure-free so they survive the `fn.toString()` → `new Function()` wire
 * round-trip.
 *
 * Registering locally is also the CSP-safe path: `hydratePipe` skips eval for any
 * name already in this registry, so a host whose CSP omits `'unsafe-eval'` can
 * load the companion module through `rendererHtml({ scripts })` rather than
 * relying on wire hydration.
 *
 * Built-in pipes in applyFilter always take precedence over custom pipes.
 */

import { log } from '../core/logger.js'

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
    log.warn(`pipe "${name}" re-registered`)
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
