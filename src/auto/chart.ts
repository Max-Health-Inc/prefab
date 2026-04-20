/**
 * autoChart — Wraps chart data in a Card with title and multi-series support.
 *
 * Ported from mcp-generator-3.x display_tools.py → show_chart.
 */

import { Component, ContainerComponent } from '../core/component.js'
import { Column } from '../components/layout/index.js'
import { Heading, Muted } from '../components/typography/index.js'
import { Card, CardContent } from '../components/card/index.js'
import { BarChart, LineChart, AreaChart, PieChart } from '../components/charts/index.js'
import type { ChartSeries, BaseChartProps } from '../components/charts/index.js'

export type ChartType = 'bar' | 'line' | 'area' | 'pie'

export interface AutoChartOptions {
  /** Chart heading. */
  title?: string
  /** Optional subtitle. */
  subtitle?: string
  /** Chart type. Default 'bar'. */
  chartType?: ChartType
  /** Key in data to use as X axis (e.g. 'month'). */
  xAxis?: string
  /** Chart height in pixels. */
  height?: number
  /** Show legend. Default true. */
  showLegend?: boolean
}

/**
 * Auto-generate a chart Card from data and series definitions.
 *
 * @example
 * ```ts
 * autoChart(
 *   [{ month: 'Jan', revenue: 42000, cost: 31000 }],
 *   [{ dataKey: 'revenue', label: 'Revenue' }, { dataKey: 'cost', label: 'Cost' }],
 *   { title: 'Monthly Revenue', xAxis: 'month', chartType: 'bar' },
 * )
 * ```
 */
export function autoChart(
  data: Record<string, unknown>[],
  series: ChartSeries[],
  options?: AutoChartOptions,
): ContainerComponent {
  const chartType = options?.chartType ?? 'bar'
  const showLegend = options?.showLegend ?? true

  const ChartFactory = CHART_MAP[chartType] ?? BarChart

  const chartProps: BaseChartProps = {
    data,
    series,
    ...(options?.xAxis && { xAxis: options.xAxis }),
    ...(options?.height !== undefined && { height: options.height }),
    showLegend,
  }

  const children: Component[] = []
  if (options?.title) children.push(Heading(options.title))
  if (options?.subtitle) children.push(Muted(options.subtitle))

  children.push(Card({ children: [
    CardContent({ cssClass: 'pt-4', children: [ChartFactory(chartProps)] }),
  ] }))

  return Column({ gap: 5, cssClass: 'p-6 max-w-4xl', children })
}

const CHART_MAP: Record<ChartType, (props: BaseChartProps) => Component> = {
  bar: BarChart,
  line: LineChart,
  area: AreaChart,
  pie: PieChart,
}
