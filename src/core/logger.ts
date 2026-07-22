/**
 * Centralized logger — the single sink for all prefab console output.
 *
 * Zero-dependency by design (prefab's renderer bundle ships no runtime deps),
 * but API-compatible with the org-wide `@maxhealth.tech/utils` `createLogger`
 * so call sites read the same everywhere and could later swap to the shared
 * package without churn.
 *
 * Adds a runtime level (the utils logger gates on NODE_ENV, which is unreliable
 * in a browser bundle) so an embedding host can raise or mute prefab's output:
 *
 * ```ts
 * import { setLogLevel } from '@maxhealth.tech/prefab'
 * setLogLevel('silent') // quiet inside a production MCP Apps host
 * ```
 */

export type LogLevel = 'silent' | 'error' | 'warn' | 'info' | 'debug'

/** Severity ranking. A method fires when its rank <= the active level's rank. */
const RANK: Record<LogLevel, number> = { silent: 0, error: 1, warn: 2, info: 3, debug: 4 }

/** Default: warn+error visible (surfaces wire-validation problems), info/debug quiet. */
let currentLevel: LogLevel = 'warn'

export function setLogLevel(level: LogLevel): void {
  currentLevel = level
}

export function getLogLevel(): LogLevel {
  return currentLevel
}

type Method = 'error' | 'warn' | 'info' | 'debug'

export interface Logger {
  error(message: string, ...args: unknown[]): void
  warn(message: string, ...args: unknown[]): void
  info(message: string, ...args: unknown[]): void
  debug(message: string, ...args: unknown[]): void
}

/**
 * Create a scoped logger. Output is prefixed `[prefab]` (no scope) or
 * `[prefab:<scope>]`, matching prefab's existing console convention.
 */
export function createLogger(scope?: string): Logger {
  const prefix = scope ? `[prefab:${scope}]` : '[prefab]'
  const emit = (method: Method, message: string, args: unknown[]): void => {
    if (RANK[method] > RANK[currentLevel]) return
    // eslint-disable-next-line no-console -- this module IS the sanctioned console sink
    console[method](`${prefix} ${message}`, ...args)
  }
  return {
    error: (message, ...args) => emit('error', message, args),
    warn: (message, ...args) => emit('warn', message, args),
    info: (message, ...args) => emit('info', message, args),
    debug: (message, ...args) => emit('debug', message, args),
  }
}

/** Default unscoped logger — `[prefab] …`. */
export const log: Logger = createLogger()
