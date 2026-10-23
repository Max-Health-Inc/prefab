import { resolveValue } from '../../engine.js'
import type { ComponentNode, RenderContext } from '../../engine.js'
import { isRecord, optionalNumber, optionalString, recordList } from '../../../core/guards.js'
import type { SeriesEntry } from './helpers.js'

export type ChartRow = Record<string, unknown>

export function chartRows(node: ComponentNode, ctx: RenderContext): ChartRow[] {
  return recordList(resolveValue(node.data, ctx))
}

export function chartValues(node: ComponentNode, ctx: RenderContext): number[] | undefined {
  const raw = resolveValue(node.data, ctx)
  if (!Array.isArray(raw) || raw.length === 0) return undefined
  return raw.filter((v): v is number => typeof v === 'number' && Number.isFinite(v))
}

function parseYAxisId(value: unknown): SeriesEntry['yAxisId'] {
  return value === 'left' || value === 'right' ? value : undefined
}

function parseSeriesEntry(value: unknown): SeriesEntry | undefined {
  if (!isRecord(value) || typeof value.dataKey !== 'string') return undefined
  const label = optionalString(value.label)
  const color = optionalString(value.color)
  const yAxisId = parseYAxisId(value.yAxisId)
  const tooltipFormat = optionalString(value.tooltipFormat)
  return {
    dataKey: value.dataKey,
    ...(label !== undefined && { label }),
    ...(color !== undefined && { color }),
    ...(yAxisId !== undefined && { yAxisId }),
    ...(tooltipFormat !== undefined && { tooltipFormat }),
  }
}

export function chartSeries(node: ComponentNode): SeriesEntry[] {
  if (!Array.isArray(node.series)) return []
  return node.series.flatMap((entry: unknown) => {
    const parsed = parseSeriesEntry(entry)
    return parsed ? [parsed] : []
  })
}

export function chartHeight(node: ComponentNode, fallback: number): number {
  return optionalNumber(node.height) ?? fallback
}

export function seriesMax(rows: ChartRow[], series: SeriesEntry[]): number {
  return Math.max(...rows.flatMap(d => series.map(s => Number(d[s.dataKey] ?? 0))), 1)
}

export interface CategoricalKeys {
  valueKey: string | undefined
  nameKey: string | undefined
}

export function categoricalKeys(node: ComponentNode, series: SeriesEntry[]): CategoricalKeys {
  return {
    valueKey: optionalString(node.dataKey) ?? series[0]?.dataKey,
    nameKey: optionalString(node.nameKey) ?? optionalString(node.tooltipXKey) ?? optionalString(node.xAxis),
  }
}

export interface CartesianProps {
  rows: ChartRow[]
  series: SeriesEntry[]
  height: number
  showYAxis: boolean
  showGrid: boolean
  showYAxisRight: boolean
  showTooltip: boolean
  showLegend: boolean
  xAxisKey: string | undefined
  tooltipXKey: string | undefined
  xAxisFormat: string | undefined
  tooltipXFormat: string | undefined
  yAxisRightFormat: string | undefined
}

export function cartesianProps(node: ComponentNode, ctx: RenderContext): CartesianProps {
  return {
    rows: chartRows(node, ctx),
    series: chartSeries(node),
    height: chartHeight(node, 300),
    showYAxis: node.showYAxis !== false,
    showGrid: node.showGrid === true,
    showYAxisRight: node.showYAxisRight === true,
    showTooltip: node.showTooltip !== false,
    showLegend: node.showLegend !== false,
    xAxisKey: optionalString(node.xAxis),
    tooltipXKey: optionalString(node.tooltipXKey),
    xAxisFormat: optionalString(node.xAxisFormat),
    tooltipXFormat: optionalString(node.tooltipXFormat),
    yAxisRightFormat: optionalString(node.yAxisRightFormat),
  }
}
