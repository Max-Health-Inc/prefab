import { el } from '../../engine.js'
import type { ComponentNode, RenderContext } from '../../engine.js'
import { createTooltip, addBarTooltipZones, addLineTooltipZones } from './tooltip.js'
import {
  COLORS, AXIS_COLOR,
  chartLayout, createSvg,
  drawYAxis, drawYAxisRight, drawXAxisLabels, drawBaseline,
  applyPipeFormat, resolveValueFormat, makeTooltipFormatter, addLegend,
} from './helpers.js'
import type { ChartLayout } from './helpers.js'
import { cartesianProps, seriesMax } from './props.js'
import type { CartesianProps } from './props.js'

interface AxisScale {
  layout: ChartLayout
  svg: SVGSVGElement
  leftMax: number
  rightMax: number
}

function drawAxes(node: ComponentNode, p: CartesianProps, chartType: string): AxisScale {
  const leftSeries = p.series.filter(s => s.yAxisId !== 'right')
  const rightSeries = p.series.filter(s => s.yAxisId === 'right')
  const hasRight = p.showYAxisRight && rightSeries.length > 0
  const leftMax = leftSeries.length > 0 ? seriesMax(p.rows, leftSeries) : 1
  const rightMax = hasRight ? seriesMax(p.rows, rightSeries) : 1

  const w = 400
  const layout = chartLayout(w, p.height, p.showYAxis, hasRight)
  const svg = createSvg(w, p.height, chartType)

  if (p.showYAxis) drawYAxis(svg, layout, leftMax, p.showGrid, resolveValueFormat(node))
  if (hasRight) drawYAxisRight(svg, layout, rightMax, p.yAxisRightFormat)
  drawBaseline(svg, layout)
  return { layout, svg, leftMax, rightMax }
}

function pipeFormatter(format: string | undefined, ctx: RenderContext): ((v: unknown) => string) | undefined {
  return format ? (v: unknown) => applyPipeFormat(v, format, ctx) : undefined
}

export function renderBarChart(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const wrapper = el('div', 'pf-chart pf-bar-chart')
  const p = cartesianProps(node, ctx)
  const { rows: data, series } = p

  if (data.length === 0 || series.length === 0) {
    wrapper.textContent = 'No chart data'
    return wrapper
  }

  const { layout, svg, leftMax, rightMax } = drawAxes(node, p, 'Bar')

  const barGroupWidth = layout.plotWidth / data.length
  const barWidth = barGroupWidth / (series.length + 1)

  for (let di = 0; di < data.length; di++) {
    for (let si = 0; si < series.length; si++) {
      const s = series[si]
      const raw = data[di][s.dataKey]
      if (raw === null || raw === undefined) continue
      const max = s.yAxisId === 'right' ? rightMax : leftMax
      const h = Math.max(0, (Number(raw) / max) * layout.plotHeight)
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

  if (p.xAxisKey) {
    drawXAxisLabels(svg, data, p.xAxisKey, (i) => {
      return layout.plotLeft + i * barGroupWidth + barGroupWidth / 2
    }, layout.plotBottom, pipeFormatter(p.xAxisFormat, ctx))
  }

  if (p.showTooltip) {
    const ttCtx = createTooltip(wrapper, svg)
    const fmt = makeTooltipFormatter(ctx, resolveValueFormat(node), p.yAxisRightFormat)
    addBarTooltipZones(ttCtx, svg, data, series, layout, p.tooltipXKey ?? p.xAxisKey, fmt, pipeFormatter(p.tooltipXFormat, ctx))
  }

  addLegend(wrapper, series, p.showLegend)
  wrapper.appendChild(svg)
  return wrapper
}

interface Pt { x: number; y: number; isNull: boolean }

function drawAreaFill(svg: SVGSVGElement, points: Pt[], baseline: number, color: string): void {
  let seg: Pt[] = []
  const flushArea = (): void => {
    if (seg.length < 2) { seg = []; return }
    const d = `M ${seg[0].x},${baseline} ` +
      seg.map(p => `L ${p.x},${p.y}`).join(' ') +
      ` L ${seg[seg.length - 1].x},${baseline} Z`
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

function drawLinePath(svg: SVGSVGElement, points: Pt[], color: string, dashed: boolean): void {
  let linePath = ''
  for (const p of points) {
    if (p.isNull) continue
    const idx = points.indexOf(p)
    const prevNull = idx === 0 || points[idx - 1].isNull
    linePath += `${prevNull ? 'M' : 'L'} ${p.x},${p.y} `
  }
  if (!linePath) return
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  line.setAttribute('d', linePath.trim())
  line.setAttribute('fill', 'none')
  line.setAttribute('stroke', color)
  line.setAttribute('stroke-width', '2')
  if (dashed) line.setAttribute('stroke-dasharray', '6 3')
  svg.appendChild(line)
}

function drawDots(svg: SVGSVGElement, points: Pt[], color: string): SVGCircleElement[] {
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
  return seriesDots
}

function drawCrosshair(svg: SVGSVGElement, layout: ChartLayout): SVGLineElement {
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
  return crosshair
}

export function renderLineChart(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const wrapper = el('div', `pf-chart pf-${node.type.toLowerCase()}-chart`)
  const p = cartesianProps(node, ctx)
  const { rows: data, series: allSeries } = p

  if (data.length === 0 || allSeries.length === 0) {
    wrapper.textContent = 'No chart data'
    return wrapper
  }

  const isArea = node.type === 'AreaChart'
  const { layout, svg, leftMax, rightMax } = drawAxes(node, p, isArea ? 'Area' : 'Line')
  const xAt = (i: number): number => data.length === 1
    ? (layout.plotLeft + layout.plotRight) / 2
    : layout.plotLeft + (i / (data.length - 1)) * layout.plotWidth

  const dotGroups: SVGCircleElement[][] = []
  for (let si = 0; si < allSeries.length; si++) {
    const s = allSeries[si]
    const isRight = s.yAxisId === 'right'
    const max = isRight ? rightMax : leftMax
    const color = s.color ?? COLORS[si % COLORS.length]

    const points: Pt[] = data.map((d, i) => {
      const raw = d[s.dataKey]
      const isNull = raw === null || raw === undefined
      const y = isNull ? layout.plotBottom : layout.plotBottom - (Number(raw) / max) * layout.plotHeight
      return { x: xAt(i), y, isNull }
    })

    if (isArea) drawAreaFill(svg, points, layout.plotBottom, color)
    drawLinePath(svg, points, color, isRight)
    dotGroups.push(drawDots(svg, points, color))
  }

  const crosshair = drawCrosshair(svg, layout)

  if (p.xAxisKey) {
    drawXAxisLabels(svg, data, p.xAxisKey, xAt, layout.plotBottom, pipeFormatter(p.xAxisFormat, ctx))
  }

  if (p.showTooltip) {
    const ttCtx = createTooltip(wrapper, svg)
    const fmt = makeTooltipFormatter(ctx, resolveValueFormat(node), p.yAxisRightFormat)
    addLineTooltipZones(
      ttCtx, svg, data, allSeries, layout, p.tooltipXKey ?? p.xAxisKey, fmt, crosshair, dotGroups,
      pipeFormatter(p.tooltipXFormat, ctx),
    )
  }

  addLegend(wrapper, allSeries, p.showLegend)
  wrapper.appendChild(svg)
  return wrapper
}
