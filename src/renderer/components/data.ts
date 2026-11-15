/**
 * Data display renderers — DataTable, Badge, Metric, Progress, Separator, etc.
 */

import { registerComponent, resolveStr, resolveValue, el, makeDispatchCtx } from '../engine.js'
import type { ComponentNode, RenderContext } from '../engine.js'
import { dispatchActions, fireAndForget } from '../actions.js'
import { stringifyValue } from '../../core/stringify.js'
import { isRecord, optionalNumber, optionalString, recordList } from '../../core/guards.js'
import { svgEl } from './charts/helpers.js'

export function registerDataComponents(): void {
  registerComponent('DataTable', renderDataTable)
  registerComponent('Badge', renderBadge)
  registerComponent('Dot', renderDot)
  registerComponent('Metric', renderMetric)
  registerComponent('Ring', renderRing)
  registerComponent('Progress', renderProgress)
  registerComponent('Separator', renderSeparator)
  registerComponent('Loader', renderLoader)
  registerComponent('Icon', renderIcon)
  registerComponent('Sparkline', renderSparkline)
}

function renderDataTable(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const wrapper = el('div', 'pf-datatable-wrapper')
  const table = document.createElement('table')
  table.className = 'pf-datatable'

  const cols = recordList(node.columns).map(c => ({
    key: stringifyValue(c.key),
    header: c.header != null ? stringifyValue(c.header) : undefined,
    format: optionalString(c.format),
    accessor: optionalString(c.accessor),
  }))
  const rows = resolveValue(node.rows, ctx)
  const rowKey = optionalString(node.rowKey)
  const selectedExpr = optionalString(node.selected)

  // Header
  const thead = document.createElement('thead')
  const headerRow = document.createElement('tr')
  for (const col of cols) {
    const th = document.createElement('th')
    th.className = 'pf-datatable-th'
    th.setAttribute('scope', 'col')
    th.textContent = col.header ?? col.key
    headerRow.appendChild(th)
  }
  thead.appendChild(headerRow)
  table.appendChild(thead)

  // Body
  const tbody = document.createElement('tbody')
  if (Array.isArray(rows)) {
    const selectedVal = selectedExpr != null ? resolveValue(selectedExpr, ctx) : undefined

    for (const row of rows) {
      const tr = document.createElement('tr')
      tr.className = 'pf-datatable-row'
      const item: unknown = row
      const rec = isRecord(item) ? item : {}
      // A primitive row (string/number/boolean) IS the cell value — `row[col.key]`
      // would be undefined and render blank. Common for a plain string list.
      const isPrimitiveRow = row === null || typeof row !== 'object'

      // Highlight selected row
      if (rowKey && selectedVal != null && rec[rowKey] != null && stringifyValue(rec[rowKey]) === stringifyValue(selectedVal)) {
        tr.classList.add('pf-datatable-row-selected')
      }

      // Row click actions
      if (node.onRowClick != null && rowKey) {
        tr.classList.add('pf-datatable-row-clickable')
        tr.addEventListener('click', () => {
          const rowScope = { ...ctx.scope, $item: item, $index: rows.indexOf(row) }
          const dispCtx = makeDispatchCtx({ ...ctx, scope: rowScope })
          fireAndForget(dispatchActions(node.onRowClick, dispCtx), 'onRowClick')
        })
      }

      for (const col of cols) {
        const td = document.createElement('td')
        td.className = 'pf-datatable-td'
        let cellVal: unknown
        if (col.accessor) {
          // accessor is a pipe expression like "name | humanName" — resolve it with $item scope
          // accessor already includes any formatting, so skip format when accessor is present
          cellVal = resolveValue(`{{ $item.${col.accessor} }}`, { ...ctx, scope: { ...ctx.scope, $item: item } })
        } else {
          cellVal = isPrimitiveRow ? row : rec[col.key]
          // Apply format pipe if specified (works for both built-in and custom pipes)
          if (col.format && cellVal != null) {
            cellVal = resolveValue(`{{ __fmtVal | ${col.format} }}`, { ...ctx, scope: { ...ctx.scope, __fmtVal: cellVal } })
          }
        }
        td.textContent = stringifyValue(cellVal)
        tr.appendChild(td)
      }
      tbody.appendChild(tr)
    }
  }
  if (!Array.isArray(rows) || rows.length === 0) {
    const tr = document.createElement('tr')
    const td = document.createElement('td')
    td.className = 'pf-datatable-empty'
    td.colSpan = Math.max(1, cols.length)
    td.textContent = 'No results'
    tr.appendChild(td)
    tbody.appendChild(tr)
  }
  table.appendChild(tbody)

  // Search
  if (node.search === true) {
    const input = document.createElement('input')
    input.type = 'text'
    input.placeholder = 'Search...'
    input.className = 'pf-datatable-search'
    input.setAttribute('aria-label', 'Search table')
    input.addEventListener('input', () => {
      const q = input.value.toLowerCase()
      for (const tr of tbody.querySelectorAll<HTMLTableRowElement>('tr.pf-datatable-row')) {
        tr.style.display = tr.textContent.toLowerCase().includes(q) ? '' : 'none'
      }
    })
    wrapper.appendChild(input)
  }

  const scroll = el('div', 'pf-datatable-scroll')
  scroll.appendChild(table)
  wrapper.appendChild(scroll)
  return wrapper
}

function renderBadge(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const e = el('span', 'pf-badge')
  const variant = optionalString(node.variant) ?? 'default'
  e.setAttribute('data-variant', variant)
  e.textContent = resolveStr(node.label ?? node.content, ctx)
  return e
}

function renderDot(node: ComponentNode, _ctx: RenderContext): HTMLElement {
  const e = el('span', 'pf-dot')
  const color = optionalString(node.color)
  if (color != null) e.style.backgroundColor = color
  return e
}

function renderMetric(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const e = el('div', 'pf-metric')

  const label = el('div', 'pf-metric-label')
  label.textContent = resolveStr(node.label, ctx)
  e.appendChild(label)

  const row = el('div', 'pf-metric-row')
  const value = el('div', 'pf-metric-value')
  value.textContent = resolveStr(node.value, ctx)
  row.appendChild(value)

  if (node.delta != null) {
    const delta = el('span', 'pf-metric-delta')
    const trend = optionalString(node.trend)
    const arrow = trend === 'up' ? '↑ ' : trend === 'down' ? '↓ ' : ''
    delta.textContent = arrow + resolveStr(node.delta, ctx)
    delta.setAttribute('data-sentiment', optionalString(node.trendSentiment) ?? 'neutral')
    row.appendChild(delta)
  }
  e.appendChild(row)

  if (node.description != null) {
    const desc = el('div', 'pf-metric-desc')
    desc.textContent = resolveStr(node.description, ctx)
    e.appendChild(desc)
  }

  return e
}

function renderRing(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const e = el('div', 'pf-ring')
  e.setAttribute('data-variant', optionalString(node.variant) ?? 'default')
  const size = optionalNumber(node.size) ?? 80
  const thickness = optionalNumber(node.thickness) ?? 8
  const rawValue = Number(resolveValue(node.value, ctx) ?? 0)
  const value = Math.max(0, Math.min(100, rawValue))
  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - value / 100)

  const svg = svgEl('svg', { width: size, height: size, viewBox: `0 0 ${size} ${size}` })
  const ring = { cx: size / 2, cy: size / 2, r: radius, fill: 'none', 'stroke-width': thickness }
  const bgCircle = svgEl('circle', { ...ring, class: 'pf-ring-track', stroke: 'var(--muted, #e5e7eb)' })
  const fgCircle = svgEl('circle', {
    ...ring,
    class: 'pf-ring-fill',
    stroke: 'var(--primary, #3b82f6)',
    'stroke-dasharray': circumference,
    'stroke-dashoffset': offset,
    'stroke-linecap': 'round',
  })

  svg.appendChild(bgCircle)
  svg.appendChild(fgCircle)
  e.appendChild(svg)
  e.setAttribute('role', 'img')
  e.setAttribute('aria-label', `${String(value)}%`)

  if (node.label != null) {
    const label = el('div', 'pf-ring-label')
    label.textContent = resolveStr(node.label, ctx)
    e.appendChild(label)
  }
  return e
}

function renderProgress(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const e = el('div', 'pf-progress')
  e.setAttribute('role', 'progressbar')
  e.setAttribute('data-variant', optionalString(node.variant) ?? 'default')
  const value = Number(resolveValue(node.value, ctx) ?? 0)
  const max = optionalNumber(node.max) ?? 100
  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0
  e.setAttribute('aria-valuenow', String(value))
  e.setAttribute('aria-valuemin', '0')
  e.setAttribute('aria-valuemax', String(max))

  const fill = el('div', 'pf-progress-fill')
  fill.style.width = `${pct}%`
  e.appendChild(fill)

  return e
}

function renderSeparator(node: ComponentNode, _ctx: RenderContext): HTMLElement {
  const e = document.createElement('hr')
  e.className = 'pf-separator'
  if (node.orientation === 'vertical') {
    e.setAttribute('data-orientation', 'vertical')
    e.setAttribute('aria-orientation', 'vertical')
  }
  return e
}

function renderLoader(_node: ComponentNode, _ctx: RenderContext): HTMLElement {
  const e = el('div', 'pf-loader')
  e.setAttribute('role', 'status')
  e.setAttribute('aria-label', 'Loading')
  return e
}

function renderIcon(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const e = el('span', 'pf-icon')
  e.setAttribute('data-icon', resolveStr(node.name ?? node.content, ctx))
  return e
}

function renderSparkline(node: ComponentNode, _ctx: RenderContext): HTMLElement {
  const e = el('div', 'pf-sparkline')
  const data = Array.isArray(node.data) ? node.data.filter((n): n is number => typeof n === 'number' && Number.isFinite(n)) : []
  if (data.length === 0) return e

  const w = optionalNumber(node.width) ?? 120
  const h = optionalNumber(node.height) ?? 32
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  const svg = svgEl('svg', { width: w, height: h, viewBox: `0 0 ${w} ${h}` })

  const divisor = data.length > 1 ? data.length - 1 : 1
  const points = data.map((v, i) => {
    const x = (i / divisor) * w
    const y = h - ((v - min) / range) * (h - 4) - 2
    return `${x},${y}`
  }).join(' ')

  svg.appendChild(svgEl('polyline', { points, fill: 'none', stroke: 'var(--primary, #3b82f6)', 'stroke-width': 1.5 }))
  e.appendChild(svg)

  return e
}
