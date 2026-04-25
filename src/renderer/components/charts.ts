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
const AXIS_COLOR = 'var(--muted-foreground, #6b7280)'
const GRID_COLOR = 'var(--border, #e5e7eb)'
const AXIS_FONT = '10'

interface SeriesEntry {
  dataKey: string
  label?: string
  color?: string
  yAxisId?: 'left' | 'right'
}

// ── Shared axis / grid helpers ───────────────────────────────────────────────

interface ChartLayout {
  /** Usable plot area after axis padding */
  plotLeft: number
  plotRight: number
  plotTop: number
  plotBottom: number
  plotWidth: number
  plotHeight: number
}

/** Compute chart layout accounting for optional Y-axis label space. */
function chartLayout(
  svgWidth: number,
  svgHeight: number,
  hasYAxis: boolean,
  hasYAxisRight = false,
): ChartLayout {
  const plotLeft = hasYAxis ? 44 : 0
  const plotRight = svgWidth - (hasYAxisRight ? 44 : 0)
  const plotTop = 10
  const plotBottom = svgHeight - 24
  return {
    plotLeft,
    plotRight,
    plotTop,
    plotBottom,
    plotWidth: plotRight - plotLeft,
    plotHeight: plotBottom - plotTop,
  }
}

/** Nice round tick values for a 0..max range, returning ~tickCount values. */
function niceYTicks(max: number, tickCount = 5): number[] {
  if (max <= 0) return [0]
  const rawStep = max / tickCount
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)))
  const residual = rawStep / magnitude
  const niceStep =
    residual <= 1.5 ? magnitude
      : residual <= 3 ? 2 * magnitude
        : residual <= 7 ? 5 * magnitude
          : 10 * magnitude
  const ticks: number[] = []
  for (let v = 0; v <= max + niceStep * 0.01; v += niceStep) {
    ticks.push(Math.round(v * 1000) / 1000)
  }
  return ticks
}

/** Draw Y-axis labels + optional horizontal grid lines into SVG. */
function drawYAxis(
  svg: SVGSVGElement,
  layout: ChartLayout,
  max: number,
  showGrid: boolean,
  format?: string,
): void {
  const ticks = niceYTicks(max)
  for (const tick of ticks) {
    const y = layout.plotBottom - (max > 0 ? (tick / max) * layout.plotHeight : 0)

    // Y label
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    label.setAttribute('x', String(layout.plotLeft - 6))
    label.setAttribute('y', String(y + 3))
    label.setAttribute('text-anchor', 'end')
    label.setAttribute('font-size', AXIS_FONT)
    label.setAttribute('fill', AXIS_COLOR)
    label.textContent = formatYValue(tick, format)
    svg.appendChild(label)

    // Grid line
    if (showGrid && tick > 0) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      line.setAttribute('x1', String(layout.plotLeft))
      line.setAttribute('y1', String(y))
      line.setAttribute('x2', String(layout.plotRight))
      line.setAttribute('y2', String(y))
      line.setAttribute('stroke', GRID_COLOR)
      line.setAttribute('stroke-width', '1')
      line.setAttribute('stroke-dasharray', '4 3')
      svg.appendChild(line)
    }
  }
}

/** Draw secondary Y-axis labels on the right side of the plot. */
function drawYAxisRight(
  svg: SVGSVGElement,
  layout: ChartLayout,
  max: number,
  format?: string,
): void {
  const ticks = niceYTicks(max)
  for (const tick of ticks) {
    const y = layout.plotBottom - (max > 0 ? (tick / max) * layout.plotHeight : 0)
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    label.setAttribute('x', String(layout.plotRight + 6))
    label.setAttribute('y', String(y + 3))
    label.setAttribute('text-anchor', 'start')
    label.setAttribute('font-size', AXIS_FONT)
    label.setAttribute('fill', AXIS_COLOR)
    label.textContent = formatYValue(tick, format)
    svg.appendChild(label)
  }
}

/** Draw X-axis labels under the plot area. */
function drawXAxisLabels(
  svg: SVGSVGElement,
  data: Record<string, unknown>[],
  xAxisKey: string,
  getX: (index: number) => number,
  yBase: number,
): void {
  for (let i = 0; i < data.length; i++) {
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    label.setAttribute('x', String(getX(i)))
    label.setAttribute('y', String(yBase + 14))
    label.setAttribute('text-anchor', 'middle')
    label.setAttribute('font-size', AXIS_FONT)
    label.setAttribute('fill', AXIS_COLOR)
    const val = data[i][xAxisKey]
    label.textContent = val == null ? '' : String(val as string | number)
    svg.appendChild(label)
  }
}

/** Draw a baseline (X-axis line) at the bottom of the plot. */
function drawBaseline(
  svg: SVGSVGElement,
  layout: ChartLayout,
): void {
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
  line.setAttribute('x1', String(layout.plotLeft))
  line.setAttribute('y1', String(layout.plotBottom))
  line.setAttribute('x2', String(layout.plotRight))
  line.setAttribute('y2', String(layout.plotBottom))
  line.setAttribute('stroke', AXIS_COLOR)
  line.setAttribute('stroke-width', '1')
  svg.appendChild(line)
}

function formatYValue(value: number, format?: string): string {
  if (format === 'currency') return `$${value.toLocaleString()}`
  if (format === 'percent') return `${value}%`
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return String(value)
}

function renderBarChart(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const wrapper = el('div', 'pf-chart pf-bar-chart')
  const data = (resolveValue(node.data, ctx) as Record<string, unknown>[] | undefined) ?? []
  const series = (node.series as SeriesEntry[] | undefined) ?? []
  const height = (node.height as number | undefined) ?? 300

  if (data.length === 0 || series.length === 0) {
    wrapper.textContent = 'No chart data'
    return wrapper
  }

  const showYAxis = (node.showYAxis as boolean | undefined) !== false
  const showGrid = (node.showGrid as boolean | undefined) === true
  const showYAxisRight = (node.showYAxisRight as boolean | undefined) === true
  const xAxisKey = node.xAxis as string | undefined

  const leftSeries = series.filter(s => s.yAxisId !== 'right')
  const rightSeries = series.filter(s => s.yAxisId === 'right')
  const hasRight = showYAxisRight && rightSeries.length > 0

  const leftMax = leftSeries.length > 0
    ? Math.max(...data.flatMap(d => leftSeries.map(s => Number(d[s.dataKey] ?? 0))), 1)
    : 1
  const rightMax = hasRight
    ? Math.max(...data.flatMap(d => rightSeries.map(s => Number(d[s.dataKey] ?? 0))), 1)
    : 1

  const w = 400
  const layout = chartLayout(w, height, showYAxis, hasRight)
  const svg = createSvg(w, height)

  // Axes + grid (behind bars)
  if (showYAxis) drawYAxis(svg, layout, leftMax, showGrid, node.yAxisFormat as string | undefined)
  if (hasRight) drawYAxisRight(svg, layout, rightMax, node.yAxisRightFormat as string | undefined)
  drawBaseline(svg, layout)

  // Bars — use percentage-based X within the plot area
  const barGroupWidth = layout.plotWidth / data.length
  const barWidth = barGroupWidth / (series.length + 1)

  for (let di = 0; di < data.length; di++) {
    for (let si = 0; si < series.length; si++) {
      const s = series[si]
      const isRight = s.yAxisId === 'right'
      const max = isRight ? rightMax : leftMax
      const val = Number(data[di][s.dataKey] ?? 0)
      const h = Math.max(0, (val / max) * layout.plotHeight)
      const x = layout.plotLeft + di * barGroupWidth + si * barWidth + barWidth / 2
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
      rect.setAttribute('x', String(x))
      rect.setAttribute('y', String(layout.plotBottom - h))
      rect.setAttribute('width', String(barWidth * 0.8))
      rect.setAttribute('height', String(h))
      rect.setAttribute('fill', s.color ?? COLORS[si % COLORS.length])
      rect.setAttribute('rx', '2')
      svg.appendChild(rect)
    }
  }

  // X-axis labels
  if (xAxisKey) {
    drawXAxisLabels(svg, data, xAxisKey, (i) => {
      return layout.plotLeft + i * barGroupWidth + barGroupWidth / 2
    }, layout.plotBottom)
  }

  addLegend(wrapper, series, node.showLegend as boolean | undefined)
  wrapper.appendChild(svg)
  return wrapper
}

function renderLineChart(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const wrapper = el('div', `pf-chart pf-${node.type.toLowerCase()}-chart`)
  const data = (resolveValue(node.data, ctx) as Record<string, unknown>[] | undefined) ?? []
  const allSeries = (node.series as SeriesEntry[] | undefined) ?? []
  const height = (node.height as number | undefined) ?? 300

  if (data.length === 0 || allSeries.length === 0) {
    wrapper.textContent = 'No chart data'
    return wrapper
  }

  const showYAxis = (node.showYAxis as boolean | undefined) !== false
  const showGrid = (node.showGrid as boolean | undefined) === true
  const showYAxisRight = (node.showYAxisRight as boolean | undefined) === true
  const xAxisKey = node.xAxis as string | undefined

  // Split series by axis
  const leftSeries = allSeries.filter(s => s.yAxisId !== 'right')
  const rightSeries = allSeries.filter(s => s.yAxisId === 'right')
  const hasRight = showYAxisRight && rightSeries.length > 0

  // Compute max for each axis independently
  const leftMax = leftSeries.length > 0
    ? Math.max(...data.flatMap(d => leftSeries.map(s => Number(d[s.dataKey] ?? 0))), 1)
    : 1
  const rightMax = hasRight
    ? Math.max(...data.flatMap(d => rightSeries.map(s => Number(d[s.dataKey] ?? 0))), 1)
    : 1

  const w = 400
  const layout = chartLayout(w, height, showYAxis, hasRight)
  const svg = createSvg(w, height)
  const isArea = node.type === 'AreaChart'

  // Draw grid + axes (behind data)
  if (showYAxis) drawYAxis(svg, layout, leftMax, showGrid, node.yAxisFormat as string | undefined)
  if (hasRight) drawYAxisRight(svg, layout, rightMax, node.yAxisRightFormat as string | undefined)
  drawBaseline(svg, layout)

  // Draw series
  for (let si = 0; si < allSeries.length; si++) {
    const s = allSeries[si]
    const isRight = s.yAxisId === 'right'
    const max = isRight ? rightMax : leftMax

    const points = data.map((d, i) => {
      const x = data.length === 1
        ? (layout.plotLeft + layout.plotRight) / 2
        : layout.plotLeft + (i / (data.length - 1)) * layout.plotWidth
      const y = layout.plotBottom - (Number(d[s.dataKey] ?? 0) / max) * layout.plotHeight
      return { x, y }
    })

    const color = s.color ?? COLORS[si % COLORS.length]

    if (isArea && points.length > 0) {
      const areaPath = `M ${points[0].x},${layout.plotBottom} ` +
        points.map(p => `L ${p.x},${p.y}`).join(' ') +
        ` L ${points[points.length - 1].x},${layout.plotBottom} Z`
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
    if (isRight) line.setAttribute('stroke-dasharray', '6 3')
    svg.appendChild(line)
  }

  // X-axis labels
  if (xAxisKey) {
    drawXAxisLabels(svg, data, xAxisKey, (i) => {
      return data.length === 1
        ? (layout.plotLeft + layout.plotRight) / 2
        : layout.plotLeft + (i / (data.length - 1)) * layout.plotWidth
    }, layout.plotBottom)
  }

  addLegend(wrapper, allSeries, node.showLegend as boolean | undefined)
  wrapper.appendChild(svg)
  return wrapper
}

function renderPieChart(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const wrapper = el('div', 'pf-chart pf-pie-chart')
  const data = (resolveValue(node.data, ctx) as Record<string, unknown>[] | undefined) ?? []
  const series = (node.series as SeriesEntry[] | undefined) ?? []
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

  if (total === 0) {
    wrapper.textContent = 'No chart data'
    wrapper.appendChild(svg)
    return wrapper
  }

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
  series: SeriesEntry[],
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
