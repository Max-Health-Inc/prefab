import { el } from '../../engine.js'
import type { ComponentNode, RenderContext } from '../../engine.js'
import { bindTooltip, createTooltip } from './tooltip.js'
import {
  COLORS, AXIS_COLOR, GRID_COLOR, AXIS_FONT,
  chartLayout, createSvg, svgEl, svgText, drawBaseline,
  applyPipeFormat, resolveValueFormat, addLegend,
} from './helpers.js'
import { chartHeight, chartRows, chartSeries, chartValues } from './props.js'
import { optionalNumber, optionalString } from '../../../core/guards.js'

export function renderScatterChart(node: ComponentNode, ctx: RenderContext): HTMLElement {
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

  for (const xv of [xMin, (xMin + xMax) / 2, xMax]) {
    svg.appendChild(svgText(
      { x: sx(xv), y: layout.plotBottom + 14, 'text-anchor': 'middle', 'font-size': AXIS_FONT, fill: AXIS_COLOR },
      String(Math.round(xv * 100) / 100),
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

export function renderHistogram(node: ComponentNode, ctx: RenderContext): HTMLElement {
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

  const W = 300
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
