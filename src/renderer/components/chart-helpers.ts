/**
 * Shared chart rendering helpers — colors, axes, SVG primitives, legend,
 * value formatting. Used by the per-chart renderers in [charts.ts] and the
 * tooltip zones in [chart-tooltip.ts].
 */

import { resolveValue, el } from '../engine.js'
import type { ComponentNode, RenderContext } from '../engine.js'
import { stringifyValue } from '../../core/stringify.js'

export const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
export const AXIS_COLOR = 'var(--muted-foreground, #6b7280)'
export const GRID_COLOR = 'var(--border, #e5e7eb)'
export const AXIS_FONT = '10'

export interface SeriesEntry {
  dataKey: string
  label?: string
  color?: string
  yAxisId?: 'left' | 'right'
  tooltipFormat?: string
}

// ── Layout ───────────────────────────────────────────────────────────────────

export interface ChartLayout {
  /** Usable plot area after axis padding */
  plotLeft: number
  plotRight: number
  plotTop: number
  plotBottom: number
  plotWidth: number
  plotHeight: number
}

/** Compute chart layout accounting for optional Y-axis label space. */
export function chartLayout(
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

// ── Axes ─────────────────────────────────────────────────────────────────────

/** Draw Y-axis labels + optional horizontal grid lines into SVG. */
export function drawYAxis(
  svg: SVGSVGElement,
  layout: ChartLayout,
  max: number,
  showGrid: boolean,
  format?: string,
): void {
  const ticks = niceYTicks(max)
  for (const tick of ticks) {
    const y = layout.plotBottom - (max > 0 ? (tick / max) * layout.plotHeight : 0)

    const label = svgEl('text', {
      x: layout.plotLeft - 6, y: y + 3, 'text-anchor': 'end', 'font-size': AXIS_FONT, fill: AXIS_COLOR,
    })
    label.textContent = formatYValue(tick, format)
    svg.appendChild(label)

    if (showGrid && tick > 0) {
      svg.appendChild(svgEl('line', {
        x1: layout.plotLeft, y1: y, x2: layout.plotRight, y2: y,
        stroke: GRID_COLOR, 'stroke-width': 1, 'stroke-dasharray': '4 3',
      }))
    }
  }
}

/** Draw secondary Y-axis labels on the right side of the plot. */
export function drawYAxisRight(
  svg: SVGSVGElement,
  layout: ChartLayout,
  max: number,
  format?: string,
): void {
  const ticks = niceYTicks(max)
  for (const tick of ticks) {
    const y = layout.plotBottom - (max > 0 ? (tick / max) * layout.plotHeight : 0)
    const label = svgEl('text', {
      x: layout.plotRight + 6, y: y + 3, 'text-anchor': 'start', 'font-size': AXIS_FONT, fill: AXIS_COLOR,
    })
    label.textContent = formatYValue(tick, format)
    svg.appendChild(label)
  }
}

/** Draw X-axis labels under the plot area. */
export function drawXAxisLabels(
  svg: SVGSVGElement,
  data: Record<string, unknown>[],
  xAxisKey: string,
  getX: (index: number) => number,
  yBase: number,
  format?: (raw: unknown) => string,
): void {
  for (let i = 0; i < data.length; i++) {
    const val = data[i][xAxisKey]
    const label = svgEl('text', {
      x: getX(i), y: yBase + 14, 'text-anchor': 'middle', 'font-size': AXIS_FONT, fill: AXIS_COLOR,
    })
    label.textContent = val == null ? '' : (format ? format(val) : stringifyValue(val))
    svg.appendChild(label)
  }
}

/** Draw a baseline (X-axis line) at the bottom of the plot. */
export function drawBaseline(svg: SVGSVGElement, layout: ChartLayout): void {
  svg.appendChild(svgEl('line', {
    x1: layout.plotLeft, y1: layout.plotBottom, x2: layout.plotRight, y2: layout.plotBottom,
    stroke: AXIS_COLOR, 'stroke-width': 1,
  }))
}

// ── Value formatting ─────────────────────────────────────────────────────────

/** Apply a pipe expression to a value using the Rx engine. */
export function applyPipeFormat(value: unknown, pipe: string, ctx: RenderContext): string {
  if (value == null) return ''
  const result = resolveValue(`{{ __v | ${pipe} }}`, { ...ctx, scope: { ...ctx.scope, __v: value } })
  return stringifyValue(result ?? value)
}

export function formatYValue(value: number, format?: string): string {
  if (format === 'currency') return `$${value.toLocaleString()}`
  if (format === 'percent') return `${value}%`
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return String(value)
}

/**
 * Effective value-axis / tooltip format for a chart node.
 *
 * `valueFormat` (protocol 0.3 / upstream PR #454) is the canonical field;
 * `yAxisFormat` remains a TS-only override for the left axis of dual-axis
 * charts. `"auto"` (upstream's default) means "no explicit format".
 */
export function resolveValueFormat(node: ComponentNode): string | undefined {
  const fmt = (node.yAxisFormat as string | undefined) ?? (node.valueFormat as string | undefined)
  return fmt && fmt !== 'auto' ? fmt : undefined
}

/** Create a format callback for tooltip entries that handles per-axis formats + null. */
export function makeTooltipFormatter(
  ctx: RenderContext,
  yAxisFormat?: string,
  yAxisRightFormat?: string,
): (raw: unknown, s: SeriesEntry) => string {
  return (raw, s) => {
    if (raw === null || raw === undefined) return '—'
    // Per-series tooltipFormat overrides axis format
    if (s.tooltipFormat) return applyPipeFormat(raw, s.tooltipFormat, ctx)
    const fmt = s.yAxisId === 'right' ? yAxisRightFormat : yAxisFormat
    return formatYValue(Number(raw), fmt)
  }
}

// ── SVG primitives ───────────────────────────────────────────────────────────

export function createSvg(width: number, height: number, chartType?: string): SVGSVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', '100%')
  svg.setAttribute('height', String(height))
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
  svg.setAttribute('role', 'img')
  if (chartType) {
    svg.setAttribute('aria-label', `${chartType} chart`)
  }
  svg.style.overflow = 'visible'
  return svg
}

/** Create an SVG element with string-coerced attributes. */
export function svgEl<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number>,
): SVGElementTagNameMap[K] {
  const node = document.createElementNS('http://www.w3.org/2000/svg', tag)
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v))
  return node
}

/** Create an SVG <text> element with content. */
export function svgText(attrs: Record<string, string | number>, text: string): SVGTextElement {
  const t = svgEl('text', attrs)
  t.textContent = text
  return t
}

/** Polar → SVG coords (degrees, math convention with screen y flipped). */
export function polar(cx: number, cy: number, r: number, angleDeg: number): { x: number; y: number } {
  const a = (angleDeg * Math.PI) / 180
  return { x: cx + r * Math.cos(a), y: cy - r * Math.sin(a) }
}

/** Sampled arc stroke path between two angles — avoids large-arc/sweep flag math. */
export function arcPath(cx: number, cy: number, r: number, a1: number, a2: number): string {
  const steps = Math.max(2, Math.ceil(Math.abs(a2 - a1) / 4))
  const parts: string[] = []
  for (let i = 0; i <= steps; i++) {
    const p = polar(cx, cy, r, a1 + ((a2 - a1) * i) / steps)
    parts.push(`${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
  }
  return parts.join(' ')
}

// ── Legend ───────────────────────────────────────────────────────────────────

export function addLegend(wrapper: HTMLElement, series: SeriesEntry[], show?: boolean): void {
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
