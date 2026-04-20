/**
 * Chart component renderers — BarChart, LineChart, AreaChart, PieChart, etc.
 *
 * Charts render as SVG using simple built-in drawing.
 * For production use, these can be enhanced with a charting library.
 */

import { registerComponent, resolveValue, el } from '../engine.js'
import type { ComponentNode, RenderContext } from '../engine.js'

export function registerChartComponents(): void {
  registerComponent('BarChart', renderBarChart)
  registerComponent('LineChart', renderLineChart)
  registerComponent('AreaChart', renderLineChart) // Same renderer, different fill
  registerComponent('PieChart', renderPieChart)
  registerComponent('RadarChart', renderFallbackChart)
  registerComponent('ScatterChart', renderFallbackChart)
  registerComponent('RadialChart', renderFallbackChart)
  registerComponent('Histogram', renderHistogram)
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

function renderBarChart(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const wrapper = el('div', 'pf-chart pf-bar-chart')
  const data = (resolveValue(node.data, ctx) as Record<string, unknown>[] | undefined) ?? []
  const series = (node.series as { dataKey: string; label?: string; color?: string }[] | undefined) ?? []
  const height = (node.height as number | undefined) ?? 300

  if (data.length === 0 || series.length === 0) {
    wrapper.textContent = 'No chart data'
    return wrapper
  }

  const values = data.flatMap(d => series.map(s => Number(d[s.dataKey] ?? 0)))
  const max = Math.max(...values, 1)
  const barGroupWidth = 100 / data.length
  const barWidth = barGroupWidth / (series.length + 1)

  const svg = createSvg(400, height)

  for (let di = 0; di < data.length; di++) {
    for (let si = 0; si < series.length; si++) {
      const val = Number(data[di][series[si].dataKey] ?? 0)
      const h = (val / max) * (height - 40)
      const x = di * barGroupWidth + si * barWidth + barWidth / 2
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
      rect.setAttribute('x', `${x}%`)
      rect.setAttribute('y', String(height - h - 20))
      rect.setAttribute('width', `${barWidth * 0.8}%`)
      rect.setAttribute('height', String(h))
      rect.setAttribute('fill', series[si].color ?? COLORS[si % COLORS.length])
      rect.setAttribute('rx', '2')
      svg.appendChild(rect)
    }
  }

  // X-axis labels
  const xAxis = node.xAxis as string | undefined
  if (xAxis) {
    for (let i = 0; i < data.length; i++) {
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      label.setAttribute('x', `${i * barGroupWidth + barGroupWidth / 2}%`)
      label.setAttribute('y', String(height - 2))
      label.setAttribute('text-anchor', 'middle')
      label.setAttribute('font-size', '10')
      label.setAttribute('fill', 'var(--muted-foreground, #6b7280)')
      const labelVal = data[i][xAxis]
      label.textContent = labelVal == null ? '' : String(labelVal as string | number)
      svg.appendChild(label)
    }
  }

  addLegend(wrapper, series, node.showLegend as boolean | undefined)
  wrapper.appendChild(svg)
  return wrapper
}

function renderLineChart(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const wrapper = el('div', `pf-chart pf-${node.type.toLowerCase()}-chart`)
  const data = (resolveValue(node.data, ctx) as Record<string, unknown>[] | undefined) ?? []
  const series = (node.series as { dataKey: string; label?: string; color?: string }[] | undefined) ?? []
  const height = (node.height as number | undefined) ?? 300

  if (data.length === 0 || series.length === 0) {
    wrapper.textContent = 'No chart data'
    return wrapper
  }

  const allValues = data.flatMap(d => series.map(s => Number(d[s.dataKey] ?? 0)))
  const max = Math.max(...allValues, 1)
  const w = 400

  const svg = createSvg(w, height)
  const isArea = node.type === 'AreaChart'

  for (let si = 0; si < series.length; si++) {
    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * w
      const y = height - 20 - (Number(d[series[si].dataKey] ?? 0) / max) * (height - 40)
      return { x, y }
    })

    const color = series[si].color ?? COLORS[si % COLORS.length]

    if (isArea && points.length > 0) {
      const areaPath = `M ${points[0].x},${height - 20} ` +
        points.map(p => `L ${p.x},${p.y}`).join(' ') +
        ` L ${points[points.length - 1].x},${height - 20} Z`
      const area = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      area.setAttribute('d', areaPath)
      area.setAttribute('fill', color)
      area.setAttribute('opacity', '0.15')
      svg.appendChild(area)
    }

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ')
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    line.setAttribute('d', linePath)
    line.setAttribute('fill', 'none')
    line.setAttribute('stroke', color)
    line.setAttribute('stroke-width', '2')
    svg.appendChild(line)
  }

  addLegend(wrapper, series, node.showLegend as boolean | undefined)
  wrapper.appendChild(svg)
  return wrapper
}

function renderPieChart(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const wrapper = el('div', 'pf-chart pf-pie-chart')
  const data = (resolveValue(node.data, ctx) as Record<string, unknown>[] | undefined) ?? []
  const series = (node.series as { dataKey: string; label?: string; color?: string }[] | undefined) ?? []
  const height = (node.height as number | undefined) ?? 300
  const size = Math.min(height, 300)

  if (data.length === 0 || series.length === 0) {
    wrapper.textContent = 'No chart data'
    return wrapper
  }

  const svg = createSvg(size, size)
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 10

  // Use first series key, each data point is a slice
  const key = series[0].dataKey
  const values = data.map(d => Number(d[key] ?? 0))
  const total = values.reduce((a, b) => a + b, 0)

  let startAngle = -Math.PI / 2
  for (let i = 0; i < values.length; i++) {
    const angle = (values[i] / total) * 2 * Math.PI
    const endAngle = startAngle + angle
    const largeArc = angle > Math.PI ? 1 : 0

    const x1 = cx + r * Math.cos(startAngle)
    const y1 = cy + r * Math.sin(startAngle)
    const x2 = cx + r * Math.cos(endAngle)
    const y2 = cy + r * Math.sin(endAngle)

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('d', `M ${cx},${cy} L ${x1},${y1} A ${r},${r} 0 ${largeArc} 1 ${x2},${y2} Z`)
    path.setAttribute('fill', COLORS[i % COLORS.length])
    svg.appendChild(path)

    startAngle = endAngle
  }

  addLegend(wrapper, series, node.showLegend as boolean | undefined)
  wrapper.appendChild(svg)
  return wrapper
}

function renderFallbackChart(node: ComponentNode, _ctx: RenderContext): HTMLElement {
  const e = el('div', `pf-chart pf-${node.type.toLowerCase()}`)
  e.textContent = `${node.type} — not yet supported in renderer`
  e.style.padding = '24px'
  e.style.textAlign = 'center'
  e.style.color = 'var(--muted-foreground, #6b7280)'
  return e
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function createSvg(width: number, height: number): SVGSVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', '100%')
  svg.setAttribute('height', String(height))
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
  svg.style.overflow = 'visible'
  return svg
}

function addLegend(
  wrapper: HTMLElement,
  series: { dataKey: string; label?: string; color?: string }[],
  show?: boolean,
): void {
  if (show === false || series.length <= 1) return
  const legend = el('div', 'pf-chart-legend')
  legend.style.display = 'flex'
  legend.style.gap = '12px'
  legend.style.fontSize = '12px'
  legend.style.marginBottom = '8px'

  for (let i = 0; i < series.length; i++) {
    const item = el('div', 'pf-chart-legend-item')
    item.style.display = 'flex'
    item.style.alignItems = 'center'
    item.style.gap = '4px'

    const dot = el('span')
    dot.style.width = '8px'
    dot.style.height = '8px'
    dot.style.borderRadius = '50%'
    dot.style.backgroundColor = series[i].color ?? COLORS[i % COLORS.length]

    const label = el('span')
    label.textContent = series[i].label ?? series[i].dataKey

    item.appendChild(dot)
    item.appendChild(label)
    legend.appendChild(item)
  }
  wrapper.appendChild(legend)
}

// ── Histogram ────────────────────────────────────────────────────────────────

function renderHistogram(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const wrapper = el('div', 'pf-chart pf-histogram')
  const rawData = resolveValue(node.data, ctx) as number[] | undefined
  if (!rawData || rawData.length === 0) {
    wrapper.textContent = 'No data'
    return wrapper
  }

  const data = rawData
  const binCount = (node.bins as number | undefined) ?? 10
  const height = (node.height as number | undefined) ?? 200
  const color = (node.color as string | undefined) ?? COLORS[0]

  const min = Math.min(...data)
  const max = Math.max(...data)
  const binWidth = (max - min) / binCount || 1
  const bins = new Array(binCount).fill(0) as number[]
  for (const v of data) {
    const idx = Math.min(Math.floor((v - min) / binWidth), binCount - 1)
    bins[idx]++
  }
  const maxBin = Math.max(...bins)

  const W = 300
  const H = height
  const barW = W / binCount

  const ns = 'http://www.w3.org/2000/svg'
  const svg = document.createElementNS(ns, 'svg')
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`)
  svg.setAttribute('width', '100%')
  svg.setAttribute('height', String(H))

  for (let i = 0; i < binCount; i++) {
    const barH = maxBin > 0 ? (bins[i] / maxBin) * H : 0
    const rect = document.createElementNS(ns, 'rect')
    rect.setAttribute('x', String(i * barW))
    rect.setAttribute('y', String(H - barH))
    rect.setAttribute('width', String(barW - 1))
    rect.setAttribute('height', String(barH))
    rect.setAttribute('fill', color)
    svg.appendChild(rect)
  }

  wrapper.appendChild(svg)
  return wrapper
}
