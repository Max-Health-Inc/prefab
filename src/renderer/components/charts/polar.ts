import { el } from '../../engine.js'
import type { ComponentNode, RenderContext } from '../../engine.js'
import { bindTooltip, createTooltip } from './tooltip.js'
import {
  COLORS, AXIS_COLOR, GRID_COLOR, AXIS_FONT,
  createSvg, svgEl, svgText, polar, arcPath,
  applyPipeFormat, resolveValueFormat, addLegend,
} from './helpers.js'
import type { SeriesEntry } from './helpers.js'
import { categoricalKeys, chartHeight, chartRows, chartSeries, seriesMax } from './props.js'
import { stringifyValue } from '../../../core/stringify.js'
import { optionalNumber, optionalString } from '../../../core/guards.js'

function valueFormatter(node: ComponentNode, ctx: RenderContext): (v: number) => string {
  const valueFmt = resolveValueFormat(node)
  return (v: number): string => valueFmt ? applyPipeFormat(v, valueFmt, ctx) : String(v)
}

export function renderPieChart(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const wrapper = el('div', 'pf-chart pf-pie-chart')
  const data = chartRows(node, ctx)
  const seriesIn = chartSeries(node)
  const size = Math.min(chartHeight(node, 300), 300)
  const showTooltipProp = node.showTooltip !== false

  const { valueKey: key, nameKey } = categoricalKeys(node, seriesIn)
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

  const tooltipXFormat = optionalString(node.tooltipXFormat)
  const fmtValue = valueFormatter(node, ctx)
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
      const tipX = cx + (r * 0.6) * Math.cos(startAngle + angle / 2)
      bindTooltip(path, ttCtx, tipX, cy, sliceLabel, [
        { label: series[0].label ?? key, value: `${fmtValue(values[i])} (${pct})`, color },
      ])
    }

    svg.appendChild(path)
    startAngle = endAngle
  }

  addLegend(wrapper, series, node.showLegend !== false)
  wrapper.appendChild(svg)
  return wrapper
}

export function renderRadialChart(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const wrapper = el('div', 'pf-chart pf-radial-chart')
  const data = chartRows(node, ctx)
  const seriesIn = chartSeries(node)
  const { valueKey: dataKey, nameKey } = categoricalKeys(node, seriesIn)

  if (data.length === 0 || !dataKey) {
    wrapper.textContent = 'No chart data'
    return wrapper
  }

  const size = Math.min(chartHeight(node, 300), 300)
  const cx = size / 2
  const cy = size / 2
  const outer = size / 2 - 10
  const inner = Math.max(0, Math.min(optionalNumber(node.innerRadius) ?? 30, outer - 10))
  const startAngle = optionalNumber(node.startAngle) ?? 180
  const endAngle = optionalNumber(node.endAngle) ?? 0

  const values = data.map(d => Number(d[dataKey] ?? 0))
  const max = Math.max(...values, 1)

  const svg = createSvg(size, size, 'Radial')
  const band = (outer - inner) / data.length
  const thickness = Math.max(2, band * 0.7)
  const fmt = valueFormatter(node, ctx)
  const ttCtx = node.showTooltip !== false ? createTooltip(wrapper, svg) : undefined
  const legendSeries: SeriesEntry[] = []

  for (let i = 0; i < data.length; i++) {
    const rMid = outer - band * i - band / 2
    const color = seriesIn[i]?.color ?? COLORS[i % COLORS.length]
    const valueEnd = startAngle + (values[i] / max) * (endAngle - startAngle)
    const rawName = nameKey ? data[i][nameKey] : null
    const name = rawName != null ? stringifyValue(rawName) : (seriesIn[i]?.label ?? dataKey)
    legendSeries.push({ dataKey: name || dataKey, label: name || dataKey, color })

    svg.appendChild(svgEl('path', {
      d: arcPath(cx, cy, rMid, startAngle, endAngle),
      fill: 'none', stroke: GRID_COLOR, 'stroke-width': thickness, 'stroke-linecap': 'round',
    }))

    const arc = svgEl('path', {
      d: arcPath(cx, cy, rMid, startAngle, valueEnd),
      fill: 'none', stroke: color, 'stroke-width': thickness, 'stroke-linecap': 'round',
    })
    if (ttCtx) {
      const mid = polar(cx, cy, rMid, (startAngle + valueEnd) / 2)
      bindTooltip(arc, ttCtx, mid.x, mid.y, name || dataKey, [{ label: dataKey, value: fmt(values[i]), color }])
    }
    svg.appendChild(arc)
  }

  addLegend(wrapper, legendSeries, node.showLegend !== false)
  wrapper.appendChild(svg)
  return wrapper
}

export function renderRadarChart(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const wrapper = el('div', 'pf-chart pf-radar-chart')
  const data = chartRows(node, ctx)
  const series = chartSeries(node)
  const axisKey = optionalString(node.axisKey) ?? optionalString(node.xAxis)

  if (data.length === 0 || series.length === 0) {
    wrapper.textContent = 'No chart data'
    return wrapper
  }

  const filled = node.filled !== false
  const showDots = node.showDots === true
  const showGrid = node.showGrid !== false

  const size = Math.min(chartHeight(node, 300), 320)
  const cx = size / 2
  const cy = size / 2
  const R = size / 2 - 24
  const N = data.length
  const max = seriesMax(data, series)

  const angleAt = (i: number): number => 90 - (360 * i) / N
  const ptStr = (pts: { x: number; y: number }[]): string =>
    pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')

  const svg = createSvg(size, size, 'Radar')

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

  for (let i = 0; i < N; i++) {
    const p = polar(cx, cy, R + 12, angleAt(i))
    const raw = axisKey ? data[i][axisKey] : null
    svg.appendChild(svgText(
      { x: p.x, y: p.y + 3, 'text-anchor': 'middle', 'font-size': AXIS_FONT, fill: AXIS_COLOR },
      stringifyValue(raw),
    ))
  }

  const ttCtx = node.showTooltip !== false ? createTooltip(wrapper, svg) : undefined
  const fmt = valueFormatter(node, ctx)

  for (let si = 0; si < series.length; si++) {
    const s = series[si]
    const color = s.color ?? COLORS[si % COLORS.length]
    const pts = data.map((d, i) => polar(cx, cy, (Number(d[s.dataKey] ?? 0) / max) * R, angleAt(i)))
    svg.appendChild(svgEl('polygon', {
      points: ptStr(pts),
      fill: filled ? color : 'none', 'fill-opacity': filled ? 0.2 : 0,
      stroke: color, 'stroke-width': 2,
    }))

    if (!showDots && !ttCtx) continue
    for (let i = 0; i < pts.length; i++) {
      const dot = svgEl('circle', {
        cx: pts[i].x, cy: pts[i].y, r: showDots ? 3 : 6,
        fill: showDots ? color : 'transparent', 'fill-opacity': showDots ? 1 : 0,
      })
      if (ttCtx) {
        const raw = axisKey ? data[i][axisKey] : null
        const title = raw != null ? stringifyValue(raw) : (s.label ?? s.dataKey)
        const entries = [{ label: s.label ?? s.dataKey, value: fmt(Number(data[i][s.dataKey] ?? 0)), color }]
        bindTooltip(dot, ttCtx, pts[i].x, pts[i].y, title, entries)
      }
      svg.appendChild(dot)
    }
  }

  addLegend(wrapper, series, node.showLegend !== false)
  wrapper.appendChild(svg)
  return wrapper
}
