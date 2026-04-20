/**
 * autoProgress — Multi-step progress tracker with status indicators.
 *
 * Ported from mcp-generator-3.x display_tools.py → show_progress.
 */

import { type Component, type ContainerComponent } from '../core/component.js'
import { Column, Row } from '../components/layout/index.js'
import { Heading, Muted } from '../components/typography/index.js'
import { Card, CardContent } from '../components/card/index.js'
import { Badge, Dot, Progress, Separator } from '../components/data/index.js'
import type { BadgeVariant } from '../components/data/index.js'

const STEP_CONFIG: Record<string, { color: string; badgeVariant: BadgeVariant; label: string }> = {
  completed: { color: 'green', badgeVariant: 'success', label: 'Done' },
  active: { color: 'blue', badgeVariant: 'info', label: 'In Progress' },
  pending: { color: 'gray', badgeVariant: 'outline', label: 'Pending' },
}

export interface AutoProgressStep {
  /** Step label. */
  label: string
  /** Step status: 'completed', 'active', or 'pending'. */
  status: 'completed' | 'active' | 'pending'
  /** Optional description. */
  description?: string
}

export interface AutoProgressOptions {
  /** Progress tracker heading. */
  title?: string
  /** Optional subtitle. */
  subtitle?: string
}

/**
 * Auto-generate a multi-step progress tracker.
 *
 * Calculates overall completion percentage and renders a Progress bar
 * followed by step cards with status indicators.
 *
 * @example
 * ```ts
 * autoProgress([
 *   { label: 'Order Placed', status: 'completed' },
 *   { label: 'Processing', status: 'active', description: 'Preparing shipment' },
 *   { label: 'Shipped', status: 'pending' },
 *   { label: 'Delivered', status: 'pending' },
 * ], { title: 'Order Status' })
 * ```
 */
export function autoProgress(
  steps: AutoProgressStep[],
  options?: AutoProgressOptions,
): ContainerComponent {
  const total = steps.length
  const completedCount = steps.filter(s => s.status === 'completed').length
  const activeCount = steps.filter(s => s.status === 'active').length
  const progressPct = total > 0
    ? Math.round(((completedCount + activeCount * 0.5) / total) * 100)
    : 0

  const children: Component[] = []
  if (options?.title) children.push(Heading(options.title))
  if (options?.subtitle) children.push(Muted(options.subtitle))

  children.push(Progress({ value: progressPct, cssClass: 'h-2' }))
  children.push(Row({ gap: 2, align: 'center', children: [
    Badge(`${completedCount}/${total} steps`, { variant: 'outline' }),
    Muted(`${progressPct}% complete`),
  ] }))

  const stepRows: Component[] = []
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i]
    const config = STEP_CONFIG[step.status] ?? STEP_CONFIG.pending

    const stepContent: Component[] = [
      Dot(config.color, { cssClass: 'shrink-0' }),
    ]

    const labelCol: Component[] = [
      Heading(step.label, { cssClass: 'font-medium' }),
    ]
    if (step.description) {
      labelCol.push(Muted(step.description))
    }

    stepContent.push(Column({ gap: 0, cssClass: 'flex-1', children: labelCol }))
    stepContent.push(Badge(config.label, { variant: config.badgeVariant }))

    stepRows.push(Row({ gap: 4, align: 'center', cssClass: 'py-3', children: stepContent }))

    if (i < steps.length - 1) {
      stepRows.push(Separator())
    }
  }

  children.push(Card({ children: [CardContent({ cssClass: 'py-4', children: stepRows })] }))

  return Column({ gap: 5, cssClass: 'p-6 max-w-3xl', children })
}
