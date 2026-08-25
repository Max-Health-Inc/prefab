/**
 * prefab pipe → A2UI catalog function.
 *
 * `{{ price | currency:'USD' }}` was previously reported as unbindable on the
 * grounds that A2UI has no expression language. That is true of the language and
 * false of the catalog: A2UI ships `formatCurrency`, `formatNumber`, `formatDate`
 * and `pluralize` as functions, which is exactly what these pipes are.
 *
 * Seven of prefab's twenty-two built-ins map. The rest — `truncate`, `join`,
 * `selectattr`, `percent`, `compact` and friends — transform data rather than
 * format it and have no equivalent, so they stay unbindable.
 *
 * The date pipes are the one inexact mapping. prefab renders through
 * `toLocaleDateString()`, so the output follows the reader's locale; A2UI's
 * `formatDate` requires an explicit Unicode TR35 pattern. Choosing a pattern
 * changes what the reader sees, so it is done with a diagnostic rather than
 * silently — losing the value entirely would be the worse trade.
 */

import type { A2uiDynamicValue, A2uiFunctionCall } from './types.js'

/** A pipe applied to a base expression: `path | name:arg`. */
export interface ParsedPipe {
  base: string
  name: string
  arg?: string | number
}

/** Matches `<base> | <name>` with an optional single `:arg`. */
const PIPE = /^(.+?)\s*\|\s*([A-Za-z_][\w]*)\s*(?::\s*(.+))?$/

/**
 * Split a pipe expression into its parts.
 *
 * Only a single pipe with at most one argument, which is the shape prefab's own
 * evaluator handles. A chained expression returns `undefined` and is reported
 * rather than half-translated.
 */
export function parsePipe(expr: string): ParsedPipe | undefined {
  const m = PIPE.exec(expr)
  if (m == null) return undefined

  const base = m[1].trim()
  // A second `|` means a chain, which has no single-function equivalent.
  if (base.includes('|')) return undefined

  // `at` rather than indexing: an optional capture group is typed `string` but
  // is genuinely absent when the pipe took no argument.
  const raw: string | undefined = m.at(3)?.trim()
  if (raw === undefined) return { base, name: m[2] }

  const quoted = /^'([^']*)'$|^"([^"]*)"$/.exec(raw)
  if (quoted != null) {
    // One alternative matched, so exactly one group is present. An empty capture
    // is a real empty-string argument, which `??` keeps and `||` would discard.
    const literal: string | undefined = quoted.at(1) ?? quoted.at(2)
    return { base, name: m[2], arg: literal ?? '' }
  }

  const num = Number(raw)
  if (!Number.isNaN(num)) return { base, name: m[2], arg: num }

  // An unquoted, non-numeric argument is a reference prefab would resolve at
  // render time. A2UI function args take a value, not an expression to evaluate.
  return undefined
}

/** What a mapped pipe produces, plus anything the mapping cost. */
export interface PipeMapping {
  call: A2uiFunctionCall
  /** Set when the translation is inexact, for the caller to report. */
  note?: string
}

type PipeBuilder = (value: A2uiDynamicValue, arg: string | number | undefined) => PipeMapping | undefined

/** Build a `formatDate` call, noting that an explicit pattern replaces the locale. */
function dateFormat(pattern: string, pipe: string): PipeBuilder {
  return (value) => ({
    call: { call: 'formatDate', args: { value, format: pattern } },
    note: `the "${pipe}" pipe renders in the reader's locale; A2UI needs an explicit pattern, so "${pattern}" was used`,
  })
}

const BUILDERS: Record<string, PipeBuilder | undefined> = {
  currency: (value, arg) => ({
    call: {
      call: 'formatCurrency',
      // prefab defaults to USD when the pipe is given no code.
      args: { value, currency: typeof arg === 'string' ? arg : 'USD' },
    },
  }),
  number: (value, arg) => ({
    call: {
      call: 'formatNumber',
      args: { value, ...(typeof arg === 'number' && { decimals: arg }) },
    },
  }),
  round: (value, arg) => ({
    call: {
      call: 'formatNumber',
      // prefab's `round` with no argument means whole numbers.
      args: { value, decimals: typeof arg === 'number' ? arg : 0 },
    },
  }),
  pluralize: (value, arg) => {
    if (typeof arg !== 'string') return undefined
    // prefab pluralizes by appending an s, which is the rule it can express.
    return { call: { call: 'pluralize', args: { value, one: arg, other: `${arg}s` } } }
  },
  date: dateFormat('y-MM-dd', 'date'),
  time: dateFormat('HH:mm', 'time'),
  datetime: dateFormat('y-MM-dd HH:mm', 'datetime'),
}

/** Every prefab pipe with an A2UI equivalent, for docs and tests. */
export function mappedPipes(): string[] {
  return Object.keys(BUILDERS).sort()
}

/**
 * Map a parsed pipe onto a catalog function.
 *
 * @param value the already-resolved base, as a binding or a literal.
 * @returns `undefined` when the pipe transforms rather than formats.
 */
export function pipeCall(pipe: ParsedPipe, value: A2uiDynamicValue): PipeMapping | undefined {
  return BUILDERS[pipe.name]?.(value, pipe.arg)
}
