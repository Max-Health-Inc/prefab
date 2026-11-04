/**
 * Chart tooltip — hit-zone overlays, crosshair, data dots, and tooltip popup.
 */

import { COLORS, svgEl } from './helpers.js'
import type { ChartLayout, SeriesEntry } from './helpers.js'
import { stringifyValue } from '../../../core/stringify.js'
import { escapeHtml } from '../../../core/escape.js'

export interface TooltipEntry {
  label: string
  value: string | number
  color: string
}

export interface TooltipCtx {
  wrapper: HTMLElement
  tooltip: HTMLElement
  svgEl: SVGSVGElement
}

/** Create and attach a tooltip div to the chart wrapper. */
export function createTooltip(wrapper: HTMLElement, svg: SVGSVGElement): TooltipCtx {
  const tooltip = document.createElement('div')
  tooltip.className = 'pf-chart-tooltip'
  wrapper.appendChild(tooltip)

  wrapper.addEventListener('mouseleave', () => {
    tooltip.classList.remove('pf-visible')
  })

  return { wrapper, tooltip, svgEl: svg }
}

/** Show the tooltip at a position relative to the SVG. */
export function showTooltipAt(
  ctx: TooltipCtx,
  svgX: number,
  _svgY: number,
  categoryLabel: string | undefined,
  entries: TooltipEntry[],
): void {
  const { tooltip, svgEl, wrapper } = ctx
  if (entries.length === 0) return

  let html = ''
  if (categoryLabel) {
    html += `<div class="pf-chart-tooltip-label">${escapeHtml(categoryLabel)}</div>`
  }
  for (const e of entries) {
    html += `<div class="pf-chart-tooltip-row">`
    html += `<span class="pf-chart-tooltip-dot" style="background:${escapeHtml(e.color)}"></span>`
    html += `<span>${escapeHtml(e.label)}:</span> <strong>${escapeHtml(String(e.value))}</strong>`
    html += `</div>`
  }
  tooltip.innerHTML = html

  const svgRect = svgEl.getBoundingClientRect()
  const wrapRect = wrapper.getBoundingClientRect()
  const viewBox = svgEl.viewBox.baseVal
  const scaleX = svgRect.width / (viewBox.width || 1)
  const pixelX = svgRect.left - wrapRect.left + svgX * scaleX
  const tooltipW = tooltip.offsetWidth || 100

  let left = pixelX + 12
  if (left + tooltipW > wrapRect.width) {
    left = pixelX - tooltipW - 12
  }
  tooltip.style.left = `${Math.max(0, left)}px`
  tooltip.style.top = '4px'
  tooltip.classList.add('pf-visible')
}

function hideTooltip(ctx: TooltipCtx): void {
  ctx.tooltip.classList.remove('pf-visible')
}

function bindHover(target: Element, show: () => void, hide: () => void): void {
  target.addEventListener('mouseenter', show)
  target.addEventListener('mouseleave', hide)
  target.addEventListener('touchstart', show, { passive: true })
  target.addEventListener('touchend', hide, { passive: true })
}

export function bindTooltip(target: Element, ttCtx: TooltipCtx, x: number, y: number, title: string | undefined, entries: TooltipEntry[]): void {
  bindHover(target, () => { showTooltipAt(ttCtx, x, y, title, entries) }, () => { hideTooltip(ttCtx) })
}

/** What a hit-zone shows for one data row: the x label and one entry per series. */
interface ZoneContent {
  data: Record<string, unknown>[]
  series: SeriesEntry[]
  xAxisKey: string | undefined
  formatValue: (raw: unknown, s: SeriesEntry, si: number) => string
  formatLabel?: (raw: unknown) => string
}

function zoneTooltip(content: ZoneContent, di: number): { label: string | undefined; entries: TooltipEntry[] } {
  const { data, series, xAxisKey, formatValue, formatLabel } = content
  const rawLabel = xAxisKey ? data[di][xAxisKey] : undefined
  const label = rawLabel != null
    ? (formatLabel ? formatLabel(rawLabel) : stringifyValue(rawLabel))
    : undefined
  const entries = series.map((s, si) => ({
    label: s.label ?? s.dataKey,
    value: formatValue(data[di][s.dataKey], s, si),
    color: s.color ?? COLORS[si % COLORS.length],
  }))
  return { label, entries }
}

function hitZone(x: number, width: number, layout: ChartLayout): SVGRectElement {
  const zone = svgEl('rect', { x, y: layout.plotTop, width, height: layout.plotHeight, fill: 'transparent' })
  zone.style.cursor = 'default'
  return zone
}

/** Attach hover hit-zones for bar chart columns. */
export function addBarTooltipZones(
  ctx: TooltipCtx,
  svg: SVGSVGElement,
  data: Record<string, unknown>[],
  series: SeriesEntry[],
  layout: ChartLayout,
  xAxisKey: string | undefined,
  formatValue: (raw: unknown, s: SeriesEntry, si: number) => string,
  formatLabel?: (raw: unknown) => string,
): void {
  const content: ZoneContent = { data, series, xAxisKey, formatValue, formatLabel }
  const groupW = layout.plotWidth / data.length
  for (let di = 0; di < data.length; di++) {
    const x = layout.plotLeft + di * groupW
    const zone = hitZone(x, groupW, layout)
    const { label, entries } = zoneTooltip(content, di)
    bindTooltip(zone, ctx, x + groupW / 2, layout.plotTop, label, entries)
    svg.appendChild(zone)
  }
}

/** Attach hover hit-zones for line/area chart data points. */
export function addLineTooltipZones(
  ctx: TooltipCtx,
  svg: SVGSVGElement,
  data: Record<string, unknown>[],
  allSeries: SeriesEntry[],
  layout: ChartLayout,
  xAxisKey: string | undefined,
  formatValue: (raw: unknown, s: SeriesEntry, si: number) => string,
  crosshair?: SVGLineElement,
  dotGroups?: SVGCircleElement[][],
  formatLabel?: (raw: unknown) => string,
): void {
  const content: ZoneContent = { data, series: allSeries, xAxisKey, formatValue, formatLabel }
  const step = data.length === 1 ? layout.plotWidth : layout.plotWidth / (data.length - 1)
  for (let di = 0; di < data.length; di++) {
    const centerX = data.length === 1
      ? (layout.plotLeft + layout.plotRight) / 2
      : layout.plotLeft + (di / (data.length - 1)) * layout.plotWidth
    const zoneX = Math.max(layout.plotLeft, data.length === 1 ? layout.plotLeft : centerX - step / 2)
    const zone = hitZone(zoneX, Math.min(step, layout.plotRight - zoneX), layout)
    const { label, entries } = zoneTooltip(content, di)

    const showHover = (): void => {
      showTooltipAt(ctx, centerX, layout.plotTop, label, entries)
      if (crosshair) {
        crosshair.setAttribute('x1', String(centerX))
        crosshair.setAttribute('x2', String(centerX))
        crosshair.setAttribute('opacity', '1')
      }
      if (dotGroups) {
        for (const dots of dotGroups) {
          for (const dot of dots) dot.setAttribute('data-visible', 'false')
          dots[di]?.setAttribute('data-visible', 'true')
        }
      }
    }
    const hideHover = (): void => {
      hideTooltip(ctx)
      if (crosshair) crosshair.setAttribute('opacity', '0')
      if (dotGroups) {
        for (const dots of dotGroups) {
          for (const dot of dots) dot.setAttribute('data-visible', 'false')
        }
      }
    }

    bindHover(zone, showHover, hideHover)
    svg.appendChild(zone)
  }
}
