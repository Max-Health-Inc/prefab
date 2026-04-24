/**
 * Data display components — DataTable, Badge, Metric, Separator, Progress, etc.
 */

import { Component } from '../../core/component.js'
import type { ComponentProps, RxStr } from '../../core/component.js'
import type { Signal } from '../../rx/signal.js'
import type { Collection } from '../../rx/collection.js'
import { SetState } from '../../actions/client.js'

// ── DataTable ────────────────────────────────────────────────────────────────

export interface DataTableColumnDef {
  key: string
  header?: string
  sortable?: boolean
  /** Pipe name applied to cell values for display (e.g. 'humanName', 'date'). */
  format?: string
  /** Pipe expression for complex access (e.g. "name | humanName"). Overrides key for display. */
  accessor?: string
}

/** Convenience factory for DataTableColumn definitions — short or descriptor form. */
export function col(keyOrDef: string | DataTableColumnDef, header?: string, opts?: { sortable?: boolean }): DataTableColumnDef {
  if (typeof keyOrDef === 'object') return keyOrDef
  return { key: keyOrDef, header: header ?? keyOrDef, sortable: opts?.sortable ?? false }
}

export interface DataTableProps extends ComponentProps {
  rows?: unknown[] | RxStr
  columns: DataTableColumnDef[]
  search?: boolean
  /** Collection to derive rows from. Mutually exclusive with `rows`. */
  from?: Collection
  /** Signal whose value matches the selected row's key. Auto-generates onRowClick → SetState. */
  selected?: Signal<string | null>
}

export function DataTable(props: DataTableProps): Component {
  const from = props.from
  const rows = from != null ? from.toRx().toString() : props.rows
  const c = new Component('DataTable', props)
  c.getProps = () => {
    const p: Record<string, unknown> = {
      rows: typeof rows === 'string'
        ? rows
        : (rows != null && typeof rows === 'object' && 'toJSON' in rows) ? String(rows) : rows,
      columns: props.columns.map(c => {
        const def: Record<string, unknown> = {
          key: c.key,
          header: c.header ?? c.key,
          sortable: c.sortable ?? false,
        }
        if (c.format) def.format = c.format
        if (c.accessor) def.accessor = c.accessor
        return def
      }),
      search: props.search ?? false,
      paginated: false,
      pageSize: 10,
    }

    // Wire selection
    if (props.selected && from != null) {
      const keyField = from.keyField
      p.rowKey = keyField
      p.selected = props.selected.toRx().toString()
      p.onRowClick = [new SetState(props.selected.key, `{{ $item.${keyField} }}`).toJSON()]
    }

    return p
  }
  return c
}

// ── Badge ────────────────────────────────────────────────────────────────────

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'info' | 'outline'

export interface BadgeProps extends ComponentProps {
  variant?: BadgeVariant
}

export function Badge(content: RxStr, props?: BadgeProps): Component {
  const c = new Component('Badge', props)
  c.getProps = () => ({
    label: String(content),
    variant: props?.variant ?? 'default',
  })
  return c
}

// ── Dot ──────────────────────────────────────────────────────────────────────

export function Dot(color: string, props?: ComponentProps): Component {
  const c = new Component('Dot', props)
  c.getProps = () => ({ color })
  return c
}

// ── Metric ───────────────────────────────────────────────────────────────────

export interface MetricProps extends ComponentProps {
  label: RxStr
  value: RxStr
  delta?: RxStr
  trend?: 'up' | 'down' | 'flat'
  trendSentiment?: 'positive' | 'negative' | 'neutral'
  description?: RxStr
}

export function Metric(props: MetricProps): Component {
  const c = new Component('Metric', props)
  c.getProps = () => ({
    label: String(props.label),
    value: String(props.value),
    ...(props.delta !== undefined && { delta: String(props.delta) }),
    ...(props.trend && { trend: props.trend }),
    ...(props.trendSentiment && { trendSentiment: props.trendSentiment }),
    ...(props.description != null && { description: String(props.description) }),
  })
  return c
}

// ── Ring ─────────────────────────────────────────────────────────────────────

export interface RingProps extends ComponentProps {
  value: number | RxStr
  label?: RxStr
  variant?: string
  size?: number
  thickness?: number
}

export function Ring(props: RingProps): Component {
  const c = new Component('Ring', props)
  c.getProps = () => ({
    value: typeof props.value === 'number' ? props.value : String(props.value),
    ...(props.label != null && { label: String(props.label) }),
    ...(props.variant && { variant: props.variant }),
    ...(props.size !== undefined && { size: props.size }),
    ...(props.thickness !== undefined && { thickness: props.thickness }),
  })
  return c
}

// ── Progress ─────────────────────────────────────────────────────────────────

export interface ProgressProps extends ComponentProps {
  value: number | RxStr
  max?: number
  variant?: string
}

export function Progress(props: ProgressProps): Component {
  const c = new Component('Progress', props)
  c.getProps = () => ({
    value: typeof props.value === 'number' ? props.value : String(props.value),
    ...(props.max !== undefined && { max: props.max }),
    ...(props.variant && { variant: props.variant }),
  })
  return c
}

// ── Separator ────────────────────────────────────────────────────────────────

export function Separator(props?: ComponentProps): Component {
  const c = new Component('Separator', props)
  c.getProps = () => ({ orientation: 'horizontal' })
  return c
}

// ── Loader ───────────────────────────────────────────────────────────────────

export function Loader(props?: ComponentProps): Component {
  return new Component('Loader', props)
}

// ── Icon ─────────────────────────────────────────────────────────────────────

export function Icon(name: string, props?: ComponentProps): Component {
  const c = new Component('Icon', props)
  c.getProps = () => ({ name })
  return c
}
