/**
 * Layout component renderers — Column, Row, Grid, Container, Div, Span, etc.
 */

import { registerComponent, renderChildren, renderNode, resolveValue, el } from '../engine.js'
import type { ComponentNode, RenderContext } from '../engine.js'
import { isComponentNode } from '../node-guard.js'
import { isRecord, optionalNumber, optionalString } from '../../core/guards.js'

export function registerLayoutComponents(): void {
  registerComponent('Column', renderColumn)
  registerComponent('Row', renderRow)
  registerComponent('Grid', renderGrid)
  registerComponent('GridItem', renderGridItem)
  registerComponent('Container', renderContainer)
  registerComponent('Div', renderDiv)
  registerComponent('Span', renderSpan)
  registerComponent('Dashboard', renderGrid)
  registerComponent('DashboardItem', renderGridItem)
  registerComponent('Pages', renderPages)
  registerComponent('Page', renderDiv)
  registerComponent('Detail', renderDetail)
  registerComponent('MasterDetail', renderMasterDetail)
}

function renderColumn(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const e = el('div', 'pf-column')
  e.style.display = 'flex'
  e.style.flexDirection = 'column'
  const gap = extractGap(node)
  if (gap != null) e.style.gap = `${gap * 4}px`
  applyFlexAlignment(e, node)
  renderChildren(node, e, ctx)
  return e
}

function renderRow(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const e = el('div', 'pf-row')
  e.style.display = 'flex'
  e.style.flexDirection = 'row'
  const gap = extractGap(node)
  if (gap != null) e.style.gap = `${gap * 4}px`
  applyFlexAlignment(e, node)
  if (node.wrap === true) e.style.flexWrap = 'wrap'
  renderChildren(node, e, ctx)
  return e
}

function renderGrid(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const e = el('div', 'pf-grid')
  e.style.display = 'grid'
  e.style.gridTemplateColumns = `repeat(${gridColumns(node.columns)}, minmax(0, 1fr))`
  const gap = extractGap(node)
  if (gap != null) e.style.gap = `${gap * 4}px`
  const rowHeight = optionalNumber(node.rowHeight)
  if (rowHeight != null) e.style.gridAutoRows = `minmax(${rowHeight}px, auto)`
  renderChildren(node, e, ctx)
  return e
}

function gridLine(start: number | undefined, span: number | undefined): string | undefined {
  if (start != null) return span != null ? `${start} / span ${span}` : String(start)
  return span != null ? `span ${span}` : undefined
}

function renderGridItem(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const e = el('div', 'pf-grid-item')
  const column = gridLine(optionalNumber(node.col), optionalNumber(node.colSpan))
  const row = gridLine(optionalNumber(node.row), optionalNumber(node.rowSpan))
  if (column != null) e.style.gridColumn = column
  if (row != null) e.style.gridRow = row
  renderChildren(node, e, ctx)
  return e
}

function renderContainer(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const e = el('div', 'pf-container')
  e.style.maxWidth = optionalString(node.maxWidth) ?? '1200px'
  e.style.margin = '0 auto'
  const padding = optionalNumber(node.padding)
  if (padding != null) e.style.padding = `${padding * 4}px`
  renderChildren(node, e, ctx)
  return e
}

function renderDiv(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const e = el('div', 'pf-div')
  renderChildren(node, e, ctx)
  return e
}

function renderSpan(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const e = el('span', 'pf-span')
  renderChildren(node, e, ctx)
  return e
}

/** A Page's identifier: prefab's `name`, or upstream's `value` falling back to `title`. */
function pageId(page: ComponentNode): string | undefined {
  return optionalString(page.name) ?? optionalString(page.value) ?? optionalString(page.title)
}

/** Only the active Page renders: the one the `name` state key holds, else `value`, else the first. */
function renderPages(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const e = el('div', 'pf-pages')
  const pages = node.children ?? []
  const key = optionalString(node.name)
  const stored = key != null ? ctx.store.get(key) : undefined
  const wanted = typeof stored === 'string' ? stored : optionalString(node.value)
  const active = pages.find(p => wanted != null && pageId(p) === wanted) ?? pages.at(0)
  if (active != null) {
    e.setAttribute('data-page', pageId(active) ?? '')
    e.appendChild(renderNode(active, ctx))
  }
  return e
}

function renderDetail(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const e = el('div', 'pf-detail')
  const resolved = node.of != null ? resolveValue(node.of, ctx) : undefined

  if (resolved != null && resolved !== '' && resolved !== false && resolved !== 0) {
    renderChildren(node, e, ctx)
  } else if (isComponentNode(node.empty)) {
    e.appendChild(renderNode(node.empty, ctx))
  }

  return e
}

function renderMasterDetail(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const e = el('div', 'pf-master-detail')
  const gap = extractGap(node)
  if (gap != null) e.style.gap = `${gap * 4}px`

  const masterWidth = optionalString(node.masterWidth) ?? '33%'
  const children = node.children ?? []

  if (children.length > 0) {
    const masterPane = el('div', 'pf-master-detail-master')
    masterPane.style.width = masterWidth
    masterPane.appendChild(renderNode(children[0], ctx))
    e.appendChild(masterPane)
  }

  if (children.length > 1) {
    const detailPane = el('div', 'pf-master-detail-detail')
    detailPane.appendChild(renderNode(children[1], ctx))
    e.appendChild(detailPane)
  }

  return e
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const GAP_CLASS_RE = /\bgap-(\d+)\b/

/** Extract gap value from node.gap prop or cssClass "gap-N" pattern */
function extractGap(node: ComponentNode): number | null {
  const gap = optionalNumber(node.gap)
  if (gap != null) return gap
  if (typeof node.cssClass === 'string') {
    const match = GAP_CLASS_RE.exec(node.cssClass)
    if (match) return Number(match[1])
  }
  return null
}

const BREAKPOINT_ORDER = ['default', 'base', 'xs', 'sm', 'md', 'lg', 'xl', '2xl']
const DEFAULT_GRID_COLUMNS = 3

function gridColumns(value: unknown): number {
  if (typeof value === 'number') return value
  if (!isRecord(value)) return DEFAULT_GRID_COLUMNS
  const counts = BREAKPOINT_ORDER.map(bp => value[bp]).filter((n): n is number => typeof n === 'number')
  return counts.length > 0 ? counts[counts.length - 1] : DEFAULT_GRID_COLUMNS
}

function applyFlexAlignment(e: HTMLElement, node: ComponentNode): void {
  const align = optionalString(node.align)
  const justify = optionalString(node.justify)
  if (align != null) e.style.alignItems = mapAlign(align)
  if (justify != null) e.style.justifyContent = mapJustify(justify)
}

function mapAlign(value: string): string {
  const m: Record<string, string> = { start: 'flex-start', end: 'flex-end', center: 'center', stretch: 'stretch', baseline: 'baseline' }
  return m[value] ?? value
}

function mapJustify(value: string): string {
  const m: Record<string, string> = { start: 'flex-start', end: 'flex-end', center: 'center', between: 'space-between', around: 'space-around', evenly: 'space-evenly' }
  return m[value] ?? value
}
