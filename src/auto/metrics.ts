/**
 * autoMetrics — KPI dashboard grid with Metric cards and optional Sparklines.
 *
 * Ported from mcp-generator-3.x display_tools.py → show_metrics.
 */

import { Component, ContainerComponent } from '../core/component.js'
import { Column, Grid } from '../components/layout/index.js'
import { Heading, Muted } from '../components/typography/index.js'
import { Card, CardContent } from '../components/card/index.js'
import { Metric } from '../components/data/index.js'
import { Sparkline } from '../components/charts/index.js'

export interface AutoMetricDef {
  /** Metric label (e.g. 'Revenue'). */
  label: string
  /** Metric value (e.g. '$42K'). */
  value: string
  /** Delta string (e.g. '+12%'). */
  delta?: string
  /** Trend direction. */
  trend?: 'up' | 'down' | 'flat'
  /** Trend sentiment (positive = green, negative = red). */
  trendSentiment?: 'positive' | 'negative' | 'neutral'
  /** Description text below the metric. */
  description?: string
  /** Sparkline data points. */
  sparkline?: number[]
}

export interface AutoMetricsOptions {
  /** Dashboard heading. */
  title?: string
  /** Optional subtitle. */
  subtitle?: string
  /** Number of grid columns. Default 4. */
  columns?: number
}

/**
 * Auto-generate a KPI dashboard grid.
 *
 * @example
 * ```ts
 * autoMetrics([
 *   { label: 'Revenue', value: '$42K', delta: '+12%', trend: 'up', trendSentiment: 'positive', sparkline: [10, 25, 18, 30, 42] },
 *   { label: 'Users', value: '1,234', delta: '+5%', trend: 'up', trendSentiment: 'positive' },
 *   { label: 'Errors', value: '3', delta: '-80%', trend: 'down', trendSentiment: 'positive' },
 * ], { title: 'Dashboard', columns: 3 })
 * ```
 */
export function autoMetrics(
  metrics: AutoMetricDef[],
  options?: AutoMetricsOptions,
): ContainerComponent {
  const gridColumns = options?.columns ?? 4

  const cards: Component[] = metrics.map(m => {
    const cardChildren: Component[] = [
      Metric({
        label: m.label,
        value: m.value,
        ...(m.delta && { delta: m.delta }),
        ...(m.trend && { trend: m.trend }),
        ...(m.trendSentiment && { trendSentiment: m.trendSentiment }),
        ...(m.description && { description: m.description }),
      }),
    ]

    if (m.sparkline && m.sparkline.length > 0) {
      cardChildren.push(Sparkline({
        data: m.sparkline,
        variant: 'line',
        fill: true,
        curve: 'smooth',
      }))
    }

    return Card({ children: [CardContent({ cssClass: 'pt-4', children: cardChildren })] })
  })

  const children: Component[] = []
  if (options?.title) children.push(Heading(options.title))
  if (options?.subtitle) children.push(Muted(options.subtitle))
  children.push(Grid({ columns: gridColumns, gap: 4, children: cards }))

  return Column({ gap: 5, cssClass: 'p-6', children })
}
