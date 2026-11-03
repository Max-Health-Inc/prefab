/**
 * Custom pipe registry. Pipes sent over the wire must be closure-free (they are rebuilt with `new Function`);
 * registering one locally skips that eval, which keeps hosts without `'unsafe-eval'` working. Built-ins always win.
 */

import { log } from '../core/logger.js'

/** A pipe function receives the current value and optional arguments. */
export type PipeFn = (value: unknown, ...args: unknown[]) => unknown

export function isPipeFn(value: unknown): value is PipeFn {
  return typeof value === 'function'
}

const pipes = new Map<string, PipeFn>()

/** Register a custom pipe. Re-registering warns and overwrites; a built-in of the same name still wins. */
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
