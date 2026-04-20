/**
 * autoTimeline — Chronological event feed with status dots and badges.
 *
 * Ported from mcp-generator-3.x display_tools.py → show_timeline.
 */

import { type Component, type ContainerComponent } from '../core/component.js'
import { Column, Row } from '../components/layout/index.js'
import { Heading, Text, Muted, Small } from '../components/typography/index.js'
import { Card, CardContent } from '../components/card/index.js'
import { Badge, Dot, Separator } from '../components/data/index.js'
import type { BadgeVariant } from '../components/data/index.js'

const DOT_COLORS: Record<string, string> = {
  completed: 'green',
  success: 'green',
  active: 'blue',
  in_progress: 'blue',
  pending: 'yellow',
  warning: 'yellow',
  error: 'red',
  failed: 'red',
  cancelled: 'gray',
}

export interface AutoTimelineEvent {
  /** Event title. */
  title: string
  /** Timestamp string. */
  timestamp: string
  /** Optional description. */
  description?: string
  /** Status string — mapped to dot color. */
  status?: string
  /** Badge text. */
  badge?: string
  /** Badge variant. */
  badgeVariant?: BadgeVariant
}

export interface AutoTimelineOptions {
  /** Timeline heading. */
  title?: string
  /** Optional subtitle. */
  subtitle?: string
}

/**
 * Auto-generate a chronological timeline.
 *
 * @example
 * ```ts
 * autoTimeline([
 *   { title: 'Order placed', timestamp: '2026-04-20 10:30', status: 'completed', badge: 'Done', badgeVariant: 'success' },
 *   { title: 'Processing', timestamp: '2026-04-20 11:00', status: 'active' },
 *   { title: 'Shipped', timestamp: '', status: 'pending' },
 * ], { title: 'Order Timeline' })
 * ```
 */
export function autoTimeline(
  events: AutoTimelineEvent[],
  options?: AutoTimelineOptions,
): ContainerComponent {
  const children: Component[] = []
  if (options?.title) children.push(Heading(options.title))
  if (options?.subtitle) children.push(Muted(options.subtitle))

  const eventRows: Component[] = []
  for (let i = 0; i < events.length; i++) {
    const event = events[i]
    const status = (event.status ?? '').toLowerCase().replace(/[\s-]/g, '_')
    const color = DOT_COLORS[status] ?? 'gray'

    const rowChildren: Component[] = [
      Dot(color, { cssClass: 'mt-1.5 shrink-0' }),
    ]

    const textColumn: Component[] = []

    // Title row with optional badge
    const titleRowChildren: Component[] = [
      Text(event.title, { cssClass: 'font-medium' }),
    ]
    if (event.badge) {
      titleRowChildren.push(Badge(event.badge, { variant: event.badgeVariant ?? 'outline' }))
    }
    textColumn.push(Row({ gap: 2, align: 'center', children: titleRowChildren }))

    if (event.description) {
      textColumn.push(Muted(event.description))
    }
    if (event.timestamp) {
      textColumn.push(Small(event.timestamp, { cssClass: 'text-muted-foreground' }))
    }

    rowChildren.push(Column({ gap: 1, cssClass: 'flex-1', children: textColumn }))
    eventRows.push(Row({ gap: 4, align: 'start', cssClass: 'py-3', children: rowChildren }))

    if (i < events.length - 1) {
      eventRows.push(Separator())
    }
  }

  children.push(Card({ children: [CardContent({ cssClass: 'py-4', children: eventRows })] }))

  return Column({ gap: 5, cssClass: 'p-6 max-w-3xl', children })
}
