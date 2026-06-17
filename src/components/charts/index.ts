/**
 * Chart components — BarChart, LineChart, AreaChart, PieChart, Sparkline, etc.
 */

import { Component } from '../../core/component.js'
import type { ComponentProps } from '../../core/component.js'

// ── ChartSeries ──────────────────────────────────────────────────────────────

export interface ChartSeries {
  dataKey: string
  label?: string
  color?: string
  /** Which Y-axis this series binds to: 'left' (default) or 'right'. */
  yAxisId?: 'left' | 'right'
  /** Pipe expression for this series' value in the tooltip (e.g. "currency:'EUR'"). Overrides yAxisFormat. */
  tooltipFormat?: string
}

// ── Common chart props ───────────────────────────────────────────────────────

export interface BaseChartProps extends ComponentProps {
  data: unknown[]
  series: ChartSeries[]
  xAxis?: string
  /** Data key used for the tooltip category label instead of xAxis. */
  tooltipXKey?: string
  /** Pipe expression applied to x-axis tick labels (e.g. "date", "truncate:10"). */
  xAxisFormat?: string
  /** Pipe expression applied to the category label in tooltips (e.g. "datetime"). Defaults to raw value. */
  tooltipXFormat?: string
  height?: number
  showLegend?: boolean
  showTooltip?: boolean
  showGrid?: boolean
  showYAxis?: boolean
  /**
   * Canonical pipe format for value-axis ticks and tooltip values
   * (e.g. "compact", "currency", "percent:1"). Matches upstream prefab's
   * `valueFormat` (PR #454). `"auto"` (the default) means no explicit format.
   */
  valueFormat?: string
  /** Left-axis format override for dual-axis charts (TS extension). Overrides `valueFormat`. */
  yAxisFormat?: string
  /** Show a secondary Y-axis on the right for series with yAxisId:'right'. */
  showYAxisRight?: boolean
  /** Right-axis format for dual-axis charts (TS extension). */
  yAxisRightFormat?: string
  animate?: boolean
}

function chartGetProps(props: BaseChartProps, extra?: Record<string, unknown>): Record<string, unknown> {
  return {
    data: props.data,
    series: props.series,
    ...(props.xAxis && { xAxis: props.xAxis }),
    ...(props.tooltipXKey && { tooltipXKey: props.tooltipXKey }),
    ...(props.xAxisFormat && { xAxisFormat: props.xAxisFormat }),
    ...(props.tooltipXFormat && { tooltipXFormat: props.tooltipXFormat }),
    ...(props.height !== undefined && { height: props.height }),
    ...(props.showLegend !== undefined && { showLegend: props.showLegend }),
    ...(props.showTooltip !== undefined && { showTooltip: props.showTooltip }),
    ...(props.showGrid !== undefined && { showGrid: props.showGrid }),
    ...(props.showYAxis !== undefined && { showYAxis: props.showYAxis }),
    ...(props.valueFormat && { valueFormat: props.valueFormat }),
    ...(props.yAxisFormat && { yAxisFormat: props.yAxisFormat }),
    ...(props.showYAxisRight !== undefined && { showYAxisRight: props.showYAxisRight }),
    ...(props.yAxisRightFormat && { yAxisRightFormat: props.yAxisRightFormat }),
    ...(props.animate !== undefined && { animate: props.animate }),
    ...extra,
  }
}

// ── Categorical charts (Pie, Radial) ───────────────────────────────────────────

/**
 * Props for categorical charts that plot one numeric value per data row
 * (Pie, Radial). Matches upstream prefab's `dataKey` (value) + `nameKey`
 * (label) model. The legacy `series`/`xAxis` inputs are still accepted and
 * mapped onto `dataKey`/`nameKey`, so existing series-based code keeps working.
 */
export interface CategoricalChartProps extends ComponentProps {
  data: unknown[]
  /** Numeric value field (upstream canonical). */
  dataKey?: string
  /** Slice/segment label field (upstream canonical). */
  nameKey?: string
  /** Legacy series-based input — `series[0].dataKey` becomes the value field. Prefer `dataKey`. */
  series?: ChartSeries[]
  /** Legacy label field. Prefer `nameKey`. */
  xAxis?: string
  /** Legacy label key. Prefer `nameKey`. */
  tooltipXKey?: string
  height?: number
  showLegend?: boolean
  showTooltip?: boolean
  animate?: boolean
  /** Value format pipe for tooltip values (e.g. "currency", "percent:1"). */
  valueFormat?: string
}

function categoricalGetProps(
  props: CategoricalChartProps,
  extra?: Record<string, unknown>,
): Record<string, unknown> {
  // Resolve the upstream canonical fields from either the new or legacy inputs.
  const dataKey = props.dataKey ?? props.series?.[0]?.dataKey
  const nameKey = props.nameKey ?? props.tooltipXKey ?? props.xAxis
  return {
    data: props.data,
    ...(dataKey && { dataKey }),
    ...(nameKey && { nameKey }),
    ...(props.height !== undefined && { height: props.height }),
    ...(props.showLegend !== undefined && { showLegend: props.showLegend }),
    ...(props.showTooltip !== undefined && { showTooltip: props.showTooltip }),
    ...(props.animate !== undefined && { animate: props.animate }),
    ...(props.valueFormat && { valueFormat: props.valueFormat }),
    ...extra,
  }
}

// ── BarChart ─────────────────────────────────────────────────────────────────

export interface BarChartProps extends BaseChartProps {
  stacked?: boolean
  horizontal?: boolean
  barRadius?: number
}

export function BarChart(props: BarChartProps): Component {
  const c = new Component('BarChart', props)
  c.getProps = () => chartGetProps(props, {
    ...(props.stacked && { stacked: true }),
    ...(props.horizontal && { horizontal: true }),
    ...(props.barRadius !== undefined && { barRadius: props.barRadius }),
  })
  return c
}

// ── LineChart ────────────────────────────────────────────────────────────────

export function LineChart(props: BaseChartProps): Component {
  const c = new Component('LineChart', props)
  c.getProps = () => chartGetProps(props)
  return c
}

// ── AreaChart ────────────────────────────────────────────────────────────────

export function AreaChart(props: BaseChartProps): Component {
  const c = new Component('AreaChart', props)
  c.getProps = () => chartGetProps(props)
  return c
}

// ── PieChart ─────────────────────────────────────────────────────────────────

export interface PieChartProps extends CategoricalChartProps {
  innerRadius?: number
  showLabel?: boolean
  paddingAngle?: number
}

export function PieChart(props: PieChartProps): Component {
  const c = new Component('PieChart', props)
  c.getProps = () => categoricalGetProps(props, {
    ...(props.innerRadius !== undefined && { innerRadius: props.innerRadius }),
    ...(props.showLabel !== undefined && { showLabel: props.showLabel }),
    ...(props.paddingAngle !== undefined && { paddingAngle: props.paddingAngle }),
  })
  return c
}

// ── RadarChart ───────────────────────────────────────────────────────────────

export interface RadarChartProps extends BaseChartProps {
  /** Data key for angular axis (spoke) labels — upstream `axisKey`; falls back to `xAxis`. */
  axisKey?: string
  /** Fill the radar polygons (default true; set false for outline only). */
  filled?: boolean
  /** Show dots at polygon vertices. */
  showDots?: boolean
}

export function RadarChart(props: RadarChartProps): Component {
  const c = new Component('RadarChart', props)
  const axisKey = props.axisKey ?? props.xAxis
  c.getProps = () => chartGetProps(props, {
    ...(axisKey && { axisKey }),
    ...(props.filled !== undefined && { filled: props.filled }),
    ...(props.showDots !== undefined && { showDots: props.showDots }),
  })
  return c
}

// ── ScatterChart ─────────────────────────────────────────────────────────────

export interface ScatterChartProps extends BaseChartProps {
  /** Data key for y-axis values (upstream). */
  yAxis?: string
  /** Data key for bubble size (upstream, optional). */
  zAxis?: string
}

export function ScatterChart(props: ScatterChartProps): Component {
  const c = new Component('ScatterChart', props)
  c.getProps = () => chartGetProps(props, {
    ...(props.yAxis && { yAxis: props.yAxis }),
    ...(props.zAxis && { zAxis: props.zAxis }),
  })
  return c
}

// ── Sparkline ────────────────────────────────────────────────────────────────

export interface SparklineProps extends ComponentProps {
  data: number[]
  variant?: string
  fill?: boolean
  curve?: 'linear' | 'smooth' | 'step'
  mode?: 'line' | 'bar'
}

export function Sparkline(props: SparklineProps): Component {
  const c = new Component('Sparkline', props)
  c.getProps = () => ({
    data: props.data,
    ...(props.variant && { variant: props.variant }),
    ...(props.fill !== undefined && { fill: props.fill }),
    ...(props.curve && { curve: props.curve }),
    ...(props.mode && { mode: props.mode }),
  })
  return c
}

// ── RadialChart ──────────────────────────────────────────────────────────────

export interface RadialChartProps extends CategoricalChartProps {
  innerRadius?: number
  startAngle?: number
  endAngle?: number
}

export function RadialChart(props: RadialChartProps): Component {
  const c = new Component('RadialChart', props)
  c.getProps = () => categoricalGetProps(props, {
    ...(props.innerRadius !== undefined && { innerRadius: props.innerRadius }),
    ...(props.startAngle !== undefined && { startAngle: props.startAngle }),
    ...(props.endAngle !== undefined && { endAngle: props.endAngle }),
  })
  return c
}

// ── Histogram ────────────────────────────────────────────────────────────────

export interface HistogramProps extends ComponentProps {
  data: number[]
  bins?: number
  color?: string
  height?: number
  showXAxis?: boolean
  showYAxis?: boolean
}

export function Histogram(props: HistogramProps): Component {
  const c = new Component('Histogram', props)
  c.getProps = () => ({
    data: props.data,
    ...(props.bins !== undefined && { bins: props.bins }),
    ...(props.color && { color: props.color }),
    ...(props.height !== undefined && { height: props.height }),
    ...(props.showXAxis !== undefined && { showXAxis: props.showXAxis }),
    ...(props.showYAxis !== undefined && { showYAxis: props.showYAxis }),
  })
  return c
}
