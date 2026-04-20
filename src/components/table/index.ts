/**
 * Table components — raw HTML table primitives for manual table building.
 *
 * These complement DataTable (which auto-generates from rows/columns).
 * Use these when you need full control over table structure.
 */

import { Component, ContainerComponent } from '../../core/component.js'
import type { ContainerProps, ComponentProps, RxStr } from '../../core/component.js'

// ── Table ────────────────────────────────────────────────────────────────────

export function Table(props?: ContainerProps): ContainerComponent {
  return new ContainerComponent('Table', props)
}

// ── TableHead ────────────────────────────────────────────────────────────────

export function TableHead(props?: ContainerProps): ContainerComponent {
  return new ContainerComponent('TableHead', props)
}

// ── TableBody ────────────────────────────────────────────────────────────────

export function TableBody(props?: ContainerProps): ContainerComponent {
  return new ContainerComponent('TableBody', props)
}

// ── TableFooter ──────────────────────────────────────────────────────────────

export function TableFooter(props?: ContainerProps): ContainerComponent {
  return new ContainerComponent('TableFooter', props)
}

// ── TableRow ─────────────────────────────────────────────────────────────────

export function TableRow(props?: ContainerProps): ContainerComponent {
  return new ContainerComponent('TableRow', props)
}

// ── TableHeader ──────────────────────────────────────────────────────────────

export function TableHeader(content: RxStr, props?: ComponentProps): Component {
  const c = new Component('TableHeader', props)
  c.getProps = () => ({ content: String(content) })
  return c
}

// ── TableCell ────────────────────────────────────────────────────────────────

export interface TableCellProps extends ContainerProps {
  colSpan?: number
  rowSpan?: number
}

export function TableCell(props?: TableCellProps): ContainerComponent {
  const c = new ContainerComponent('TableCell', props)
  c.getProps = () => ({
    ...(props?.colSpan !== undefined && { colSpan: props.colSpan }),
    ...(props?.rowSpan !== undefined && { rowSpan: props.rowSpan }),
  })
  return c
}

// ── TableCaption ─────────────────────────────────────────────────────────────

export function TableCaption(content: RxStr, props?: ComponentProps): Component {
  const c = new Component('TableCaption', props)
  c.getProps = () => ({ content: String(content) })
  return c
}

// ── ExpandableRow ────────────────────────────────────────────────────────────

export interface ExpandableRowProps extends ContainerProps {
  /** Content shown in the summary/collapsed row */
  summary: Component[]
  /** State key to track expanded state */
  stateKey?: string
}

export function ExpandableRow(props: ExpandableRowProps): ContainerComponent {
  const c = new ContainerComponent('ExpandableRow', props)
  c.getProps = () => ({
    summary: props.summary.map(s => s.toJSON()),
    ...(props.stateKey && { stateKey: props.stateKey }),
  })
  return c
}
