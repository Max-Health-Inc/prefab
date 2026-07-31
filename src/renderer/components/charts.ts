/**
 * Chart component renderers — BarChart, LineChart, AreaChart, PieChart,
 * ScatterChart, RadialChart, Histogram.
 *
 * Charts render as SVG using simple built-in drawing. Shared axis/SVG/format
 * helpers live in [chart-helpers.ts]; tooltip hit-zones in [chart-tooltip.ts].
 */

import { registerComponent, resolveValue, el } from '../engine.js'
import type { ComponentNode, RenderContext } from '../engine.js'
import { createTooltip, addBarTooltipZones, addLineTooltipZones, showTooltipAt } from './chart-tooltip.js'
import {
  COLORS, AXIS_COLOR, GRID_COLOR, AXIS_FONT,
  chartLayout, createSvg, svgEl, svgText, polar, arcPath,
  drawYAxis, drawYAxisRight, drawXAxisLabels, drawBaseline,
  applyPipeFormat, resolveValueFormat, makeTooltipFormatter, addLegend,
} from './chart-helpers.js'
import type { SeriesEntry } from './chart-helpers.js'
import { stringifyValue } from '../../core/stringify.js'

export function registerChartComponents(): void {
  registerComponent('BarChart', renderBarChart)
  registerComponent('LineChart', renderLineChart)
  registerComponent('AreaChart', renderLineChart) // Same renderer, different fill
  registerComponent('PieChart', renderPieChart)
  registerComponent('RadarChart', renderRadarChart)
  registerComponent('ScatterChart', renderScatterChart)
  registerComponent('RadialChart', renderRadialChart)
  registerComponent('Histogram', renderHistogram)
}

// ── BarChart ─────────────────────────────────────────────────────────────────

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
  const showTooltipProp = (node.showTooltip as boolean | undefined) !== false
  const xAxisKey = node.xAxis as string | undefined
  const tooltipXKey = node.tooltipXKey as string | undefined
  const xAxisFormat = node.xAxisFormat as string | undefined
  const tooltipXFormat = node.tooltipXFormat as string | undefined

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
  const svg = createSvg(w, height, 'Bar')

  // Axes + grid (behind bars)
  if (showYAxis) drawYAxis(svg, layout, leftMax, showGrid, resolveValueFormat(node))
  if (hasRight) drawYAxisRight(svg, layout, rightMax, node.yAxisRightFormat as string | undefined)
  drawBaseline(svg, layout)

  // Bars — use percentage-based X within the plot area
  const barGroupWidth = layout.plotWidth / data.length
  const barWidth = barGroupWidth / (series.length + 1)

  for (let di = 0; di < data.length; di++) {
    for (let si = 0; si < series.length; si++) {
      const s = series[si]
      const raw = data[di][s.dataKey]
      if (raw === null || raw === undefined) continue // skip null bars
      const isRight = s.yAxisId === 'right'
      const max = isRight ? rightMax : leftMax
      const val = Number(raw)
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
    const axisLabelFmt = xAxisFormat ? (v: unknown) => applyPipeFormat(v, xAxisFormat, ctx) : undefined
    drawXAxisLabels(svg, data, xAxisKey, (i) => {
      return layout.plotLeft + i * barGroupWidth + barGroupWidth / 2
    }, layout.plotBottom, axisLabelFmt)
  }

  // Tooltip hit-zones (on top of bars)
  if (showTooltipProp) {
    const ttCtx = createTooltip(wrapper, svg)
    const fmt = makeTooltipFormatter(
      ctx,
      resolveValueFormat(node),
      node.yAxisRightFormat as string | undefined,
    )
    const ttLabelFmt = tooltipXFormat ? (v: unknown) => applyPipeFormat(v, tooltipXFormat, ctx) : undefined
    addBarTooltipZones(ttCtx, svg, data, series, layout, tooltipXKey ?? xAxisKey, fmt, ttLabelFmt)
  }

  addLegend(wrapper, series, node.showLegend as boolean | undefined)
  wrapper.appendChild(svg)
  return wrapper
}

// ── LineChart / AreaChart ────────────────────────────────────────────────────

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
  const showTooltipProp = (node.showTooltip as boolean | undefined) !== false
  const xAxisKey = node.xAxis as string | undefined
  const tooltipXKey = node.tooltipXKey as string | undefined
  const xAxisFormat = node.xAxisFormat as string | undefined
  const tooltipXFormat = node.tooltipXFormat as string | undefined

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
  const svg = createSvg(w, height, node.type === 'AreaChart' ? 'Area' : 'Line')
  const isArea = node.type === 'AreaChart'

  // Draw grid + axes (behind data)
  if (showYAxis) drawYAxis(svg, layout, leftMax, showGrid, resolveValueFormat(node))
  if (hasRight) drawYAxisRight(svg, layout, rightMax, node.yAxisRightFormat as string | undefined)
  drawBaseline(svg, layout)

  // Draw series (with null-gap handling)
  const dotGroups: SVGCircleElement[][] = [] // one array of dots per series
  for (let si = 0; si < allSeries.length; si++) {
    const s = allSeries[si]
    const isRight = s.yAxisId === 'right'
    const max = isRight ? rightMax : leftMax
    const color = s.color ?? COLORS[si % COLORS.length]

    interface Pt { x: number; y: number; isNull: boolean }
    const points: Pt[] = data.map((d, i) => {
      const raw = d[s.dataKey]
      const isNull = raw === null || raw === undefined
      const x = data.length === 1
        ? (layout.plotLeft + layout.plotRight) / 2
        : layout.plotLeft + (i / (data.length - 1)) * layout.plotWidth
      const y = isNull ? layout.plotBottom : layout.plotBottom - (Number(raw) / max) * layout.plotHeight
      return { x, y, isNull }
    })

    // Area fill (skip null segments)
    if (isArea) {
      let seg: Pt[] = []
      const flushArea = (): void => {
        if (seg.length < 2) { seg = []; return }
        const d = `M ${seg[0].x},${layout.plotBottom} ` +
          seg.map(p => `L ${p.x},${p.y}`).join(' ') +
          ` L ${seg[seg.length - 1].x},${layout.plotBottom} Z`
        const area = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        area.setAttribute('d', d)
        area.setAttribute('fill', color)
        area.setAttribute('opacity', '0.15')
        svg.appendChild(area)
        seg = []
      }
      for (const p of points) {
        if (p.isNull) { flushArea(); continue }
        seg.push(p)
      }
      flushArea()
    }

    // Line path with gap handling: break into segments on null
    let linePath = ''
    for (const p of points) {
      if (p.isNull) { /* gap — next valid point starts a new M */ continue }
      // Check if previous point was null → start new segment
      const idx = points.indexOf(p)
      const prevNull = idx === 0 || points[idx - 1].isNull
      linePath += `${prevNull ? 'M' : 'L'} ${p.x},${p.y} `
    }
    if (linePath) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      line.setAttribute('d', linePath.trim())
      line.setAttribute('fill', 'none')
      line.setAttribute('stroke', color)
      line.setAttribute('stroke-width', '2')
      if (isRight) line.setAttribute('stroke-dasharray', '6 3')
      svg.appendChild(line)
    }

    // Data-point dots (hidden by default, shown on hover)
    const seriesDots: SVGCircleElement[] = []
    for (const p of points) {
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      dot.setAttribute('cx', String(p.x))
      dot.setAttribute('cy', String(p.y))
      dot.setAttribute('r', '4')
      dot.setAttribute('fill', color)
      dot.setAttribute('class', 'pf-data-dot')
      dot.setAttribute('data-visible', 'false')
      dot.style.pointerEvents = 'none'
      if (p.isNull) dot.style.display = 'none'
      svg.appendChild(dot)
      seriesDots.push(dot)
    }
    dotGroups.push(seriesDots)
  }

  // Crosshair line (hidden by default)
  const crosshair = document.createElementNS('http://www.w3.org/2000/svg', 'line')
  crosshair.setAttribute('class', 'pf-crosshair')
  crosshair.setAttribute('x1', String(layout.plotLeft))
  crosshair.setAttribute('x2', String(layout.plotLeft))
  crosshair.setAttribute('y1', String(layout.plotTop))
  crosshair.setAttribute('y2', String(layout.plotBottom))
  crosshair.setAttribute('stroke', AXIS_COLOR)
  crosshair.setAttribute('stroke-width', '1')
  crosshair.setAttribute('stroke-dasharray', '3 3')
  crosshair.setAttribute('opacity', '0')
  svg.appendChild(crosshair)

  // X-axis labels
  if (xAxisKey) {
    const axisLabelFmt = xAxisFormat ? (v: unknown) => applyPipeFormat(v, xAxisFormat, ctx) : undefined
    drawXAxisLabels(svg, data, xAxisKey, (i) => {
      return data.length === 1
        ? (layout.plotLeft + layout.plotRight) / 2
        : layout.plotLeft + (i / (data.length - 1)) * layout.plotWidth
    }, layout.plotBottom, axisLabelFmt)
  }

  // Tooltip hit-zones (on top of lines)
  if (showTooltipProp) {
    const ttCtx = createTooltip(wrapper, svg)
    const fmt = makeTooltipFormatter(
      ctx,
      resolveValueFormat(node),
      node.yAxisRightFormat as string | undefined,
    )
    const ttLabelFmt = tooltipXFormat ? (v: unknown) => applyPipeFormat(v, tooltipXFormat, ctx) : undefined
    addLineTooltipZones(ttCtx, svg, data, allSeries, layout, tooltipXKey ?? xAxisKey, fmt, crosshair, dotGroups, ttLabelFmt)
  }

  addLegend(wrapper, allSeries, node.showLegend as boolean | undefined)
  wrapper.appendChild(svg)
  return wrapper
}

// ── PieChart ─────────────────────────────────────────────────────────────────

function renderPieChart(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const wrapper = el('div', 'pf-chart pf-pie-chart')
  const data = (resolveValue(node.data, ctx) as Record<string, unknown>[] | undefined) ?? []
  const seriesIn = (node.series as SeriesEntry[] | undefined) ?? []
  const height = (node.height as number | undefined) ?? 300
  const size = Math.min(height, 300)
  const showTooltipProp = (node.showTooltip as boolean | undefined) !== false

  // Value field: upstream `dataKey`, falling back to series[0] (legacy series-based input).
  const key = (node.dataKey as string | undefined) ?? seriesIn[0]?.dataKey
  // Slice-label field: upstream `nameKey`, falling back to tooltipXKey / xAxis (legacy).
  const nameKey = (node.nameKey as string | undefined)
    ?? (node.tooltipXKey as string | undefined)
    ?? (node.xAxis as string | undefined)
  // Synthesize a single series for the legend/tooltip when only dataKey/nameKey is given.
  const series: SeriesEntry[] = seriesIn.length > 0
    ? seriesIn
    : (key ? [{ dataKey: key, label: key }] : [])

  if (data.length === 0 || !key) {
    wrapper.textContent = 'No chart data'
    return wrapper
  }

  const svg = createSvg(size, size, 'Pie')
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 10

  const tooltipXFormat = node.tooltipXFormat as string | undefined
  const valueFmt = resolveValueFormat(node)
  const fmtValue = (v: number): string => valueFmt ? applyPipeFormat(v, valueFmt, ctx) : String(v)
  const values = data.map(d => Number(d[key] ?? 0))
  const total = values.reduce((a, b) => a + b, 0)

  if (total === 0) {
    wrapper.textContent = 'No chart data'
    wrapper.appendChild(svg)
    return wrapper
  }

  const ttCtx = showTooltipProp ? createTooltip(wrapper, svg) : undefined

  let startAngle = -Math.PI / 2
  for (let i = 0; i < values.length; i++) {
    const angle = (values[i] / total) * 2 * Math.PI
    const endAngle = startAngle + angle
    const largeArc = angle > Math.PI ? 1 : 0

    const x1 = cx + r * Math.cos(startAngle)
    const y1 = cy + r * Math.sin(startAngle)
    const x2 = cx + r * Math.cos(endAngle)
    const y2 = cy + r * Math.sin(endAngle)

    const color = COLORS[i % COLORS.length]
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('d', `M ${cx},${cy} L ${x1},${y1} A ${r},${r} 0 ${largeArc} 1 ${x2},${y2} Z`)
    path.setAttribute('fill', color)
    path.style.cursor = 'default'

    if (ttCtx) {
      const rawSlice = nameKey ? data[i][nameKey] : undefined
      const sliceLabel = rawSlice != null
        ? (tooltipXFormat ? applyPipeFormat(rawSlice, tooltipXFormat, ctx) : stringifyValue(rawSlice))
        : `Slice ${i + 1}`
      const pct = `${((values[i] / total) * 100).toFixed(1)}%`
      const midAngle = startAngle + angle / 2
      const tipX = cx + (r * 0.6) * Math.cos(midAngle)
      path.addEventListener('mouseenter', () => {
        showTooltipAt(ttCtx, tipX, cy, sliceLabel, [
          { label: series[0].label ?? key, value: `${fmtValue(values[i])} (${pct})`, color },
        ])
      })
      path.addEventListener('mouseleave', () => {
        ttCtx.tooltip.classList.remove('pf-visible')
      })
      path.addEventListener('touchstart', () => {
        showTooltipAt(ttCtx, tipX, cy, sliceLabel, [
          { label: series[0].label ?? key, value: `${fmtValue(values[i])} (${pct})`, color },
        ])
      }, { passive: true })
      path.addEventListener('touchend', () => {
        ttCtx.tooltip.classList.remove('pf-visible')
      }, { passive: true })
    }

    svg.appendChild(path)
    startAngle = endAngle
  }

  addLegend(wrapper, series, node.showLegend as boolean | undefined)
  wrapper.appendChild(svg)
  return wrapper
}

// ── ScatterChart ─────────────────────────────────────────────────────────────

function renderScatterChart(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const wrapper = el('div', 'pf-chart pf-scatter-chart')
  const data = (resolveValue(node.data, ctx) as Record<string, unknown>[] | undefined) ?? []
  const xKey = node.xAxis as string | undefined
  const yKey = node.yAxis as string | undefined
  const zKey = node.zAxis as string | undefined
  const series = (node.series as SeriesEntry[] | undefined) ?? []
  const height = (node.height as number | undefined) ?? 300

  if (data.length === 0 || !xKey || !yKey) {
    wrapper.textContent = 'No chart data'
    return wrapper
  }

  const showGrid = (node.showGrid as boolean | undefined) !== false
  const showTooltipProp = (node.showTooltip as boolean | undefined) !== false
  const color = series[0]?.color ?? COLORS[0]
  const valueFmt = resolveValueFormat(node)
  const fmt = (v: number): string => valueFmt ? applyPipeFormat(v, valueFmt, ctx) : String(Math.round(v * 100) / 100)

  const xs = data.map(d => Number(d[xKey] ?? 0))
  const ys = data.map(d => Number(d[yKey] ?? 0))
  const xMin = Math.min(...xs), xMax = Math.max(...xs)
  const yMin = Math.min(...ys), yMax = Math.max(...ys)
  const xRange = (xMax - xMin) || 1
  const yRange = (yMax - yMin) || 1
  const zs = zKey ? data.map(d => Number(d[zKey] ?? 0)) : []
  const zMax = zKey ? Math.max(...zs, 1) : 1

  const W = 400
  const layout = chartLayout(W, height, true)
  const svg = createSvg(W, height, 'Scatter')

  const sx = (v: number): number => layout.plotLeft + ((v - xMin) / xRange) * layout.plotWidth
  const sy = (v: number): number => layout.plotBottom - ((v - yMin) / yRange) * layout.plotHeight

  // Y axis ticks across the actual [min, max] range (+ optional grid).
  const Y_TICKS = 4
  for (let t = 0; t <= Y_TICKS; t++) {
    const val = yMin + (yRange * t) / Y_TICKS
    const y = sy(val)
    svg.appendChild(svgText(
      { x: layout.plotLeft - 6, y: y + 3, 'text-anchor': 'end', 'font-size': AXIS_FONT, fill: AXIS_COLOR },
      fmt(val),
    ))
    if (showGrid && t > 0) {
      svg.appendChild(svgEl('line', {
        x1: layout.plotLeft, y1: y, x2: layout.plotRight, y2: y,
        stroke: GRID_COLOR, 'stroke-width': 1, 'stroke-dasharray': '4 3',
      }))
    }
  }
  drawBaseline(svg, layout)

  // X axis: min / mid / max labels.
  for (const xv of [xMin, (xMin + xMax) / 2, xMax]) {
    svg.appendChild(svgText(
      { x: sx(xv), y: layout.plotBottom + 14, 'text-anchor': 'middle', 'font-size': AXIS_FONT, fill: AXIS_COLOR },
      String(Math.round(xv * 100) / 100),
    ))
  }

  const ttCtx = showTooltipProp ? createTooltip(wrapper, svg) : undefined

  for (let i = 0; i < data.length; i++) {
    const px = sx(xs[i])
    const py = sy(ys[i])
    // Bubble radius from z (sqrt → area-proportional); fixed dot otherwise.
    const rad = zKey ? 4 + Math.sqrt(zs[i] / zMax) * 14 : 4
    const dot = svgEl('circle', { cx: px, cy: py, r: rad, fill: color, 'fill-opacity': zKey ? 0.6 : 0.85 })
    if (ttCtx) {
      const entries = [
        { label: xKey, value: fmt(xs[i]), color },
        { label: yKey, value: fmt(ys[i]), color },
        ...(zKey ? [{ label: zKey, value: fmt(zs[i]), color }] : []),
      ]
      const title = series[0]?.label ?? 'Point'
      dot.addEventListener('mouseenter', () => showTooltipAt(ttCtx, px, py, title, entries))
      dot.addEventListener('mouseleave', () => ttCtx.tooltip.classList.remove('pf-visible'))
      dot.addEventListener('touchstart', () => showTooltipAt(ttCtx, px, py, title, entries), { passive: true })
      dot.addEventListener('touchend', () => ttCtx.tooltip.classList.remove('pf-visible'), { passive: true })
    }
    svg.appendChild(dot)
  }

  addLegend(wrapper, series, node.showLegend as boolean | undefined)
  wrapper.appendChild(svg)
  return wrapper
}

// ── RadialChart ──────────────────────────────────────────────────────────────

function renderRadialChart(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const wrapper = el('div', 'pf-chart pf-radial-chart')
  const data = (resolveValue(node.data, ctx) as Record<string, unknown>[] | undefined) ?? []
  const seriesIn = (node.series as SeriesEntry[] | undefined) ?? []
  const dataKey = (node.dataKey as string | undefined) ?? seriesIn[0]?.dataKey
  const nameKey = (node.nameKey as string | undefined)
    ?? (node.tooltipXKey as string | undefined)
    ?? (node.xAxis as string | undefined)
  const height = (node.height as number | undefined) ?? 300

  if (data.length === 0 || !dataKey) {
    wrapper.textContent = 'No chart data'
    return wrapper
  }

  const size = Math.min(height, 300)
  const cx = size / 2
  const cy = size / 2
  const outer = size / 2 - 10
  const inner = Math.max(0, Math.min((node.innerRadius as number | undefined) ?? 30, outer - 10))
  const startAngle = (node.startAngle as number | undefined) ?? 180
  const endAngle = (node.endAngle as number | undefined) ?? 0
  const showTooltipProp = (node.showTooltip as boolean | undefined) !== false

  const values = data.map(d => Number(d[dataKey] ?? 0))
  const max = Math.max(...values, 1)

  const svg = createSvg(size, size, 'Radial')
  const band = (outer - inner) / data.length
  const thickness = Math.max(2, band * 0.7)
  const valueFmt = resolveValueFormat(node)
  const fmt = (v: number): string => valueFmt ? applyPipeFormat(v, valueFmt, ctx) : String(v)
  const ttCtx = showTooltipProp ? createTooltip(wrapper, svg) : undefined
  const legendSeries: SeriesEntry[] = []

  for (let i = 0; i < data.length; i++) {
    // First row is the outermost ring.
    const rMid = outer - band * i - band / 2
    const color = seriesIn[i]?.color ?? COLORS[i % COLORS.length]
    const frac = values[i] / max
    const valueEnd = startAngle + frac * (endAngle - startAngle)
    const rawName = nameKey ? data[i][nameKey] : null
    const name = rawName != null ? stringifyValue(rawName) : (seriesIn[i]?.label ?? dataKey)
    legendSeries.push({ dataKey: name || dataKey, label: name || dataKey, color })

    // Muted full-range track.
    svg.appendChild(svgEl('path', {
      d: arcPath(cx, cy, rMid, startAngle, endAngle),
      fill: 'none', stroke: GRID_COLOR, 'stroke-width': thickness, 'stroke-linecap': 'round',
    }))

    // Coloured value arc.
    const arc = svgEl('path', {
      d: arcPath(cx, cy, rMid, startAngle, valueEnd),
      fill: 'none', stroke: color, 'stroke-width': thickness, 'stroke-linecap': 'round',
    })
    if (ttCtx) {
      const mid = polar(cx, cy, rMid, (startAngle + valueEnd) / 2)
      const entries = [{ label: dataKey, value: fmt(values[i]), color }]
      const title = name || dataKey
      arc.addEventListener('mouseenter', () => showTooltipAt(ttCtx, mid.x, mid.y, title, entries))
      arc.addEventListener('mouseleave', () => ttCtx.tooltip.classList.remove('pf-visible'))
      arc.addEventListener('touchstart', () => showTooltipAt(ttCtx, mid.x, mid.y, title, entries), { passive: true })
      arc.addEventListener('touchend', () => ttCtx.tooltip.classList.remove('pf-visible'), { passive: true })
    }
    svg.appendChild(arc)
  }

  addLegend(wrapper, legendSeries, node.showLegend as boolean | undefined)
  wrapper.appendChild(svg)
  return wrapper
}

// ── RadarChart ───────────────────────────────────────────────────────────────

function renderRadarChart(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const wrapper = el('div', 'pf-chart pf-radar-chart')
  const data = (resolveValue(node.data, ctx) as Record<string, unknown>[] | undefined) ?? []
  const series = (node.series as SeriesEntry[] | undefined) ?? []
  const axisKey = (node.axisKey as string | undefined) ?? (node.xAxis as string | undefined)
  const height = (node.height as number | undefined) ?? 300

  if (data.length === 0 || series.length === 0) {
    wrapper.textContent = 'No chart data'
    return wrapper
  }

  const filled = (node.filled as boolean | undefined) !== false
  const showDots = (node.showDots as boolean | undefined) === true
  const showGrid = (node.showGrid as boolean | undefined) !== false
  const showTooltipProp = (node.showTooltip as boolean | undefined) !== false

  const size = Math.min(height, 320)
  const cx = size / 2
  const cy = size / 2
  const R = size / 2 - 24 // leave room for spoke labels
  const N = data.length
  const max = Math.max(...data.flatMap(d => series.map(s => Number(d[s.dataKey] ?? 0))), 1)

  // Spokes start at the top and go clockwise.
  const angleAt = (i: number): number => 90 - (360 * i) / N
  const ptStr = (pts: { x: number; y: number }[]): string =>
    pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')

  const svg = createSvg(size, size, 'Radar')

  // Polar grid: concentric rings + spokes.
  if (showGrid) {
    const rings = 4
    for (let r = 1; r <= rings; r++) {
      const rr = (R * r) / rings
      const ring = Array.from({ length: N }, (_unused, i) => polar(cx, cy, rr, angleAt(i)))
      svg.appendChild(svgEl('polygon', { points: ptStr(ring), fill: 'none', stroke: GRID_COLOR, 'stroke-width': 1 }))
    }
    for (let i = 0; i < N; i++) {
      const p = polar(cx, cy, R, angleAt(i))
      svg.appendChild(svgEl('line', { x1: cx, y1: cy, x2: p.x, y2: p.y, stroke: GRID_COLOR, 'stroke-width': 1 }))
    }
  }

  // Spoke labels.
  for (let i = 0; i < N; i++) {
    const p = polar(cx, cy, R + 12, angleAt(i))
    const raw = axisKey ? data[i][axisKey] : null
    svg.appendChild(svgText(
      { x: p.x, y: p.y + 3, 'text-anchor': 'middle', 'font-size': AXIS_FONT, fill: AXIS_COLOR },
      raw != null ? String(raw as string | number) : '',
    ))
  }

  const ttCtx = showTooltipProp ? createTooltip(wrapper, svg) : undefined
  const valueFmt = resolveValueFormat(node)
  const fmt = (v: number): string => valueFmt ? applyPipeFormat(v, valueFmt, ctx) : String(v)

  // One polygon per series.
  for (let si = 0; si < series.length; si++) {
    const s = series[si]
    const color = s.color ?? COLORS[si % COLORS.length]
    const pts = data.map((d, i) => polar(cx, cy, (Number(d[s.dataKey] ?? 0) / max) * R, angleAt(i)))
    svg.appendChild(svgEl('polygon', {
      points: ptStr(pts),
      fill: filled ? color : 'none', 'fill-opacity': filled ? 0.2 : 0,
      stroke: color, 'stroke-width': 2,
    }))

    if (showDots || ttCtx) {
      for (let i = 0; i < pts.length; i++) {
        const dot = svgEl('circle', {
          cx: pts[i].x, cy: pts[i].y, r: showDots ? 3 : 6,
          fill: showDots ? color : 'transparent', 'fill-opacity': showDots ? 1 : 0,
        })
        if (ttCtx) {
          const raw = axisKey ? data[i][axisKey] : null
          const title = raw != null ? stringifyValue(raw) : (s.label ?? s.dataKey)
          const entries = [{ label: s.label ?? s.dataKey, value: fmt(Number(data[i][s.dataKey] ?? 0)), color }]
          dot.addEventListener('mouseenter', () => showTooltipAt(ttCtx, pts[i].x, pts[i].y, title, entries))
          dot.addEventListener('mouseleave', () => ttCtx.tooltip.classList.remove('pf-visible'))
          dot.addEventListener('touchstart', () => showTooltipAt(ttCtx, pts[i].x, pts[i].y, title, entries), { passive: true })
          dot.addEventListener('touchend', () => ttCtx.tooltip.classList.remove('pf-visible'), { passive: true })
        }
        svg.appendChild(dot)
      }
    }
  }

  addLegend(wrapper, series, node.showLegend as boolean | undefined)
  wrapper.appendChild(svg)
  return wrapper
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

  const svg = createSvg(W, H, 'Histogram')

  for (let i = 0; i < binCount; i++) {
    const barH = maxBin > 0 ? (bins[i] / maxBin) * H : 0
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
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
