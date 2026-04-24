/**
 * Layout component renderers — Column, Row, Grid, Container, Div, Span, etc.
 */

import { registerComponent, renderChildren, renderNode, resolveValue, el } from '../engine.js'
import type { ComponentNode, RenderContext } from '../engine.js'

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
  if (node.align != null) e.style.alignItems = mapAlign(node.align as string)
  if (node.justify != null) e.style.justifyContent = mapJustify(node.justify as string)
  renderChildren(node, e, ctx)
  return e
}

function renderRow(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const e = el('div', 'pf-row')
  e.style.display = 'flex'
  e.style.flexDirection = 'row'
  const gap = extractGap(node)
  if (gap != null) e.style.gap = `${gap * 4}px`
  if (node.align != null) e.style.alignItems = mapAlign(node.align as string)
  if (node.justify != null) e.style.justifyContent = mapJustify(node.justify as string)
  if (node.wrap === true) e.style.flexWrap = 'wrap'
  renderChildren(node, e, ctx)
  return e
}

function renderGrid(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const e = el('div', 'pf-grid')
  e.style.display = 'grid'
  const cols = (node.columns as number | undefined) ?? 3
  e.style.gridTemplateColumns = `repeat(${cols}, 1fr)`
  const gap = extractGap(node)
  if (gap != null) e.style.gap = `${gap * 4}px`
  renderChildren(node, e, ctx)
  return e
}

function renderGridItem(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const e = el('div', 'pf-grid-item')
  if (node.colSpan != null) e.style.gridColumn = `span ${node.colSpan as number}`
  if (node.rowSpan != null) e.style.gridRow = `span ${node.rowSpan as number}`
  renderChildren(node, e, ctx)
  return e
}

function renderContainer(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const e = el('div', 'pf-container')
  e.style.maxWidth = (node.maxWidth as string | undefined) ?? '1200px'
  e.style.margin = '0 auto'
  if (node.padding != null) e.style.padding = `${(node.padding as number) * 4}px`
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

function renderPages(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const e = el('div', 'pf-pages')
  renderChildren(node, e, ctx)
  return e
}

function renderDetail(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const e = el('div', 'pf-detail')
  const resolved = node.of != null ? resolveValue(node.of, ctx) : undefined

  if (resolved != null && resolved !== '' && resolved !== false && resolved !== 0) {
    renderChildren(node, e, ctx)
  } else if (node.empty != null) {
    // Render the empty placeholder component
    const emptyNode = node.empty as ComponentNode
    e.appendChild(renderNode(emptyNode, ctx))
  }

  return e
}

function renderMasterDetail(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const e = el('div', 'pf-master-detail')
  e.style.display = 'flex'
  e.style.flexDirection = 'row'
  const gap = extractGap(node)
  if (gap != null) e.style.gap = `${gap * 4}px`

  const masterWidth = (node.masterWidth as string | undefined) ?? '33%'
  const children = node.children ?? []

  if (children.length > 0) {
    const masterPane = el('div', 'pf-master-detail-master')
    masterPane.style.width = masterWidth
    masterPane.style.flexShrink = '0'
    masterPane.style.overflow = 'auto'
    masterPane.appendChild(renderNode(children[0], ctx))
    e.appendChild(masterPane)
  }

  if (children.length > 1) {
    const detailPane = el('div', 'pf-master-detail-detail')
    detailPane.style.flex = '1'
    detailPane.style.overflow = 'auto'
    detailPane.appendChild(renderNode(children[1], ctx))
    e.appendChild(detailPane)
  }

  return e
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const GAP_CLASS_RE = /\bgap-(\d+)\b/

/** Extract gap value from node.gap prop or cssClass "gap-N" pattern */
function extractGap(node: ComponentNode): number | null {
  if (node.gap != null) return node.gap as number
  if (typeof node.cssClass === 'string') {
    const match = GAP_CLASS_RE.exec(node.cssClass)
    if (match) return Number(match[1])
  }
  return null
}

function mapAlign(value: string): string {
  const m: Record<string, string> = { start: 'flex-start', end: 'flex-end', center: 'center', stretch: 'stretch', baseline: 'baseline' }
  return m[value] ?? value
}

function mapJustify(value: string): string {
  const m: Record<string, string> = { start: 'flex-start', end: 'flex-end', center: 'center', between: 'space-between', around: 'space-around', evenly: 'space-evenly' }
  return m[value] ?? value
}
