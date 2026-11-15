import { el } from '../../engine.js'
import type { ComponentNode, RenderContext } from '../../engine.js'
import { bindTooltip, createTooltip } from './tooltip.js'
import {
  COLORS, AXIS_COLOR, GRID_COLOR, AXIS_FONT,
  chartLayout, createSvg, svgEl, svgText, drawBaseline,
  valueFormatter, addLegend, DEFAULT_CHART_WIDTH, niceTicks, drawYAxis,
} from './helpers.js'
import { chartHeight, chartRows, chartSeries, chartValues } from './props.js'
import { optionalNumber, optionalString } from '../../../core/guards.js'

const round2 = (v: number): string => String(Math.round(v * 100) / 100)

export function renderScatterChart(node: ComponentNode, ctx: RenderContext, width = DEFAULT_CHART_WIDTH): HTMLElement {
  const wrapper = el('div', 'pf-chart pf-scatter-chart')
  const data = chartRows(node, ctx)
  const xKey = optionalString(node.xAxis)
  const yKey = optionalString(node.yAxis)
  const zKey = optionalString(node.zAxis)
  const series = chartSeries(node)
  const height = chartHeight(node, 300)

  if (data.length === 0 || !xKey || !yKey) {
    wrapper.textContent = 'No chart data'
    return wrapper
  }

  const showGrid = node.showGrid !== false
  const color = series[0]?.color ?? COLORS[0]
  const fmt = valueFormatter(node, ctx, round2)

  const xs = data.map(d => Number(d[xKey] ?? 0))
  const ys = data.map(d => Number(d[yKey] ?? 0))
  const xTicks = niceTicks(Math.min(...xs), Math.max(...xs), 5)
  const yTicks = niceTicks(Math.min(...ys), Math.max(...ys), 4)
  const xMin = xTicks[0], xRange = (xTicks[xTicks.length - 1] - xMin) || 1
  const yMin = yTicks[0], yRange = (yTicks[yTicks.length - 1] - yMin) || 1
  const zs = zKey ? data.map(d => Number(d[zKey] ?? 0)) : []
  const zMax = zKey ? Math.max(...zs, 1) : 1
  const maxRadius = zKey ? 18 : 4

  const layout = chartLayout(width, height, true)
  const svg = createSvg(width, height, 'Scatter')

  const innerLeft = layout.plotLeft + maxRadius
  const innerWidth = Math.max(1, layout.plotWidth - maxRadius * 2)
  const sx = (v: number): number => innerLeft + ((v - xMin) / xRange) * innerWidth
  const sy = (v: number): number => layout.plotBottom - ((v - yMin) / yRange) * layout.plotHeight

  for (let t = 0; t < yTicks.length; t++) {
    const val = yTicks[t]
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

  for (const xv of xTicks) {
    svg.appendChild(svgText(
      { x: sx(xv), y: layout.plotBottom + 14, 'text-anchor': 'middle', 'font-size': AXIS_FONT, fill: AXIS_COLOR },
      round2(xv),
    ))
  }

  const ttCtx = node.showTooltip !== false ? createTooltip(wrapper, svg) : undefined

  for (let i = 0; i < data.length; i++) {
    const px = sx(xs[i])
    const py = sy(ys[i])
    const rad = zKey ? 4 + Math.sqrt(zs[i] / zMax) * 14 : 4
    const dot = svgEl('circle', { cx: px, cy: py, r: rad, fill: color, 'fill-opacity': zKey ? 0.6 : 0.85 })
    if (ttCtx) {
      const entries = [
        { label: xKey, value: fmt(xs[i]), color },
        { label: yKey, value: fmt(ys[i]), color },
        ...(zKey ? [{ label: zKey, value: fmt(zs[i]), color }] : []),
      ]
      const title = series[0]?.label ?? 'Point'
      bindTooltip(dot, ttCtx, px, py, title, entries)
    }
    svg.appendChild(dot)
  }

  addLegend(wrapper, series, node.showLegend !== false)
  wrapper.appendChild(svg)
  return wrapper
}

export function renderHistogram(node: ComponentNode, ctx: RenderContext, width = DEFAULT_CHART_WIDTH): HTMLElement {
  const wrapper = el('div', 'pf-chart pf-histogram')
  const data = chartValues(node, ctx)
  if (!data) {
    wrapper.textContent = 'No data'
    return wrapper
  }

  const binCount = optionalNumber(node.bins) ?? 10
  const H = chartHeight(node, 200)
  const color = optionalString(node.color) ?? COLORS[0]

  const min = Math.min(...data)
  const max = Math.max(...data)
  const binWidth = (max - min) / binCount || 1
  const bins = new Array<number>(binCount).fill(0)
  for (const v of data) {
    const idx = Math.min(Math.floor((v - min) / binWidth), binCount - 1)
    bins[idx]++
  }
  const maxBin = Math.max(...bins)

  const showY = node.showYAxis !== false
  const showX = node.showXAxis !== false
  const yMax = niceTicks(0, Math.max(1, maxBin)).at(-1) ?? maxBin
  const layout = chartLayout(width, H, showY)
  const svg = createSvg(width, H, 'Histogram')
  if (showY) drawYAxis(svg, layout, yMax, node.showGrid !== false)
  drawBaseline(svg, layout)

  const ttCtx = node.showTooltip !== false ? createTooltip(wrapper, svg) : undefined
  const barW = layout.plotWidth / binCount
  for (let i = 0; i < binCount; i++) {
    const barH = yMax > 0 ? (bins[i] / yMax) * layout.plotHeight : 0
    const x = layout.plotLeft + i * barW
    const bar = svgEl('rect', { x: x + 1, y: layout.plotBottom - barH, width: Math.max(1, barW - 2), height: barH, fill: color, rx: 2 })
    if (ttCtx) {
      const range = `${round2(min + i * binWidth)} – ${round2(min + (i + 1) * binWidth)}`
      bindTooltip(bar, ttCtx, x + barW / 2, layout.plotBottom - barH, range, [{ label: 'Count', value: bins[i], color }])
    }
    svg.appendChild(bar)
  }

  if (showX) {
    for (const [i, v] of [[0, min], [binCount / 2, min + (binCount / 2) * binWidth], [binCount, min + binCount * binWidth]] as const) {
      svg.appendChild(svgText(
        { x: layout.plotLeft + i * barW, y: layout.plotBottom + 14, 'text-anchor': i === 0 ? 'start' : i === binCount ? 'end' : 'middle', 'font-size': AXIS_FONT, fill: AXIS_COLOR },
        round2(v),
      ))
    }
  }

  wrapper.appendChild(svg)
  return wrapper
}
