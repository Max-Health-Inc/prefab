/**
 * autoComparison — Side-by-side comparison of items in a Grid of Cards.
 *
 * Ported from mcp-generator-3.x display_tools.py → show_comparison.
 */

import { type Component, type ContainerComponent } from '../core/component.js'
import { Column, Row, Grid } from '../components/layout/index.js'
import { Heading, Text, Muted } from '../components/typography/index.js'
import { Card, CardHeader, CardContent } from '../components/card/index.js'
import { Badge } from '../components/data/index.js'

export interface AutoComparisonOptions {
  /** Heading above the comparison. */
  title?: string
  /** Optional subtitle. */
  subtitle?: string
  /** Key whose value gets a colored Badge for emphasis. */
  highlightKey?: string
  /** Number of grid columns. Defaults to number of items (max 4). */
  columns?: number
}

/**
 * Auto-generate a side-by-side comparison of items.
 *
 * Uses the first key of each item as the card heading.
 * Remaining keys are shown as labeled rows.
 *
 * @example
 * ```ts
 * autoComparison([
 *   { name: 'Plan A', price: '$10/mo', storage: '5GB' },
 *   { name: 'Plan B', price: '$20/mo', storage: '50GB' },
 * ], { title: 'Plan Comparison', highlightKey: 'price' })
 * ```
 */
export function autoComparison(
  items: Record<string, unknown>[],
  options?: AutoComparisonOptions,
): ContainerComponent {
  const children: Component[] = []

  if (options?.title) children.push(Heading(options.title))
  if (options?.subtitle) children.push(Muted(options.subtitle))

  if (items.length === 0) {
    children.push(Muted('No items to compare.'))
    return Column({ gap: 5, cssClass: 'p-6', children })
  }

  const keys = Object.keys(items[0])
  const nameKey = keys[0]
  const detailKeys = keys.slice(1)
  const gridColumns = options?.columns ?? Math.min(items.length, 4)

  const cards: Component[] = items.map(item => {
    const fieldRows: Component[] = detailKeys.map(key => {
      const rawVal = item[key]
      const val = rawVal == null ? '' : String(rawVal as string | number | boolean)
      const valueComponent = key === options?.highlightKey
        ? Badge(val, { variant: 'success' })
        : Text(val, { cssClass: 'font-medium' })

      return Row({ gap: 3, align: 'center', cssClass: 'py-1', children: [
        Muted(humanizeKey(key), { cssClass: 'w-28 shrink-0 text-xs' }),
        valueComponent,
      ] })
    })

    return Card({ children: [
      CardHeader({ children: [Heading(item[nameKey] == null ? '' : String(item[nameKey] as string | number | boolean), { level: 3 })] }),
      CardContent({ children: fieldRows }),
    ] })
  })

  children.push(Grid({ columns: gridColumns, gap: 4, children: cards }))

  return Column({ gap: 5, cssClass: 'p-6', children })
}

function humanizeKey(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]/g, ' ')
    .trim()
    .replace(/^\w/, c => c.toUpperCase())
}
