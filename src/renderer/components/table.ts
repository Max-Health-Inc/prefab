/**
 * Table component renderers — Table, TableHead, TableBody, TableRow, etc.
 *
 * prefab names the `<thead>` section TableHead and the `<th>` cell TableHeader, the
 * reverse of shadcn/ui. Generated payloads use either, so each of the two renders by
 * shape: with children it is the section, with only `content` it is the cell.
 */

import { registerComponent, renderChildren, renderNode, resolveStr, el } from '../engine.js'
import type { ComponentNode, RenderContext } from '../engine.js'
import { nodeList } from '../node-guard.js'

export function registerTableComponents(): void {
  registerComponent('Table', renderTable)
  registerComponent('TableHead', (node, ctx) => isSection(node) ? renderSection('thead', node, ctx) : renderHeaderCell(node, ctx))
  registerComponent('TableHeader', (node, ctx) => isSection(node) ? renderSection('thead', node, ctx) : renderHeaderCell(node, ctx))
  registerComponent('TableBody', (node, ctx) => renderSection('tbody', node, ctx))
  registerComponent('TableFooter', (node, ctx) => renderSection('tfoot', node, ctx))
  registerComponent('TableRow', renderTableRow)
  registerComponent('TableCell', renderTableCell)
  registerComponent('TableCaption', renderTableCaption)
  registerComponent('ExpandableRow', renderExpandableRow)
}

function isSection(node: ComponentNode): boolean {
  return (node.children?.length ?? 0) > 0
}

function renderTable(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const table = document.createElement('table')
  table.className = node.striped === true ? 'pf-table pf-table-striped' : 'pf-table'
  renderChildren(node, table, ctx)
  const caption = Array.from(table.children).find(c => c.tagName === 'CAPTION')
  if (caption && caption !== table.firstChild) table.insertBefore(caption, table.firstChild)
  return table
}

function renderSection(tag: 'thead' | 'tbody' | 'tfoot', node: ComponentNode, ctx: RenderContext): HTMLElement {
  const e = document.createElement(tag)
  e.className = `pf-${tag}`
  renderChildren(node, e, ctx)
  return e
}

function renderTableRow(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const tr = document.createElement('tr')
  tr.className = 'pf-table-row'
  renderChildren(node, tr, ctx)
  return tr
}

function renderHeaderCell(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const th = document.createElement('th')
  th.className = 'pf-table-header'
  th.setAttribute('scope', 'col')
  th.textContent = resolveStr(node.content, ctx)
  return th
}

function renderTableCell(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const td = document.createElement('td')
  td.className = 'pf-table-cell'
  if (node.colSpan != null) td.colSpan = Number(node.colSpan)
  if (node.rowSpan != null) td.rowSpan = Number(node.rowSpan)
  if (node.content != null && !isSection(node)) td.textContent = resolveStr(node.content, ctx)
  else renderChildren(node, td, ctx)
  return td
}

function renderTableCaption(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const caption = document.createElement('caption')
  caption.className = 'pf-table-caption'
  caption.textContent = resolveStr(node.content, ctx)
  return caption
}

function renderExpandableRow(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const wrapper = el('div', 'pf-expandable-row')
  const summary = el('div', 'pf-expandable-row-summary')
  summary.setAttribute('role', 'button')
  summary.setAttribute('aria-expanded', 'false')
  summary.tabIndex = 0

  summary.appendChild(el('span', 'pf-expandable-arrow'))
  if (typeof node.summary === 'string') {
    const text = el('span')
    text.textContent = resolveStr(node.summary, ctx)
    summary.appendChild(text)
  } else {
    for (const sn of nodeList(node.summary)) summary.appendChild(renderNode(sn, ctx))
  }

  const detail = el('div', 'pf-expandable-row-detail')
  detail.style.display = 'none'
  renderChildren(node, detail, ctx)

  let expanded = false
  const toggle = (): void => {
    expanded = !expanded
    detail.style.display = expanded ? 'block' : 'none'
    summary.setAttribute('aria-expanded', expanded ? 'true' : 'false')
  }
  summary.addEventListener('click', toggle)
  summary.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggle()
    }
  })

  wrapper.appendChild(summary)
  wrapper.appendChild(detail)
  return wrapper
}
