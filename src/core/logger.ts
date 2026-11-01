/**
 * The one sink for prefab's console output, with a runtime level a host can raise or mute:
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
