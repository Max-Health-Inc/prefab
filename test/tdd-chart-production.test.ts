/**
 * TDD: Production-quality chart features
 *
 * RED tests first — these describe the expected production behavior.
 * Each section targets a specific gap in the chart renderer.
 *
 * Gaps identified:
 *  1. Crosshair line on hover (line/area charts)
 *  2. Data-point dots highlighted on hover (line/area charts)
 *  3. Right-axis series use their own yAxisRightFormat in tooltips
 *  4. Null/missing data points — gaps in lines, skip in bars
 *  5. SVG accessibility: role="img", aria-label
 *  6. Touch support: touchstart shows tooltip, touchend hides
 *
 * @happy-dom
 */

import { describe, it, expect, beforeEach } from 'bun:test'
import { Store } from '../src/renderer/state'
import { renderNode } from '../src/renderer/engine'
import type { ComponentNode, RenderContext } from '../src/renderer/engine'
import { registerAllComponents } from '../src/renderer/components/index'
import { createNoopTransport } from '../src/renderer/transport'

beforeEach(() => { registerAllComponents() })

function makeCtx(state?: Record<string, unknown>): RenderContext {
  return {
    store: new Store(state),
    scope: {},
    transport: createNoopTransport(),
    rerender: () => {},
  }
}

/** Helper: fire mouseenter on the Nth transparent hit-zone rect. */
function hoverZone(dom: HTMLElement, index: number): Element {
  const svg = dom.querySelector('svg')!
  const zones = Array.from(svg.querySelectorAll('rect')).filter(
    r => r.getAttribute('fill') === 'transparent',
  )
  zones[index].dispatchEvent(new Event('mouseenter'))
  return zones[index]
}

/** Helper: fire mouseleave on a zone. */
function unhoverZone(zone: Element): void {
  zone.dispatchEvent(new Event('mouseleave'))
}

// ══════════════════════════════════════════════════════════════════════════════
// 1. CROSSHAIR LINE ON HOVER
// ══════════════════════════════════════════════════════════════════════════════

describe('Crosshair line on hover (line/area)', () => {
  const data = [
    { month: 'Jan', sales: 100 },
    { month: 'Feb', sales: 200 },
    { month: 'Mar', sales: 150 },
  ]

  it('LineChart has a hidden crosshair line element in SVG', () => {
    const ctx = makeCtx()
    const node: ComponentNode = {
      type: 'LineChart',
      data,
      series: [{ dataKey: 'sales' }],
      xAxis: 'month',
    }
    const dom = renderNode(node, ctx) as HTMLElement
    const crosshair = dom.querySelector('.pf-crosshair')
    expect(crosshair).not.toBeNull()
    // Initially hidden
    expect(crosshair!.getAttribute('opacity')).toBe('0')
  })

  it('crosshair becomes visible on hover', () => {
    const ctx = makeCtx()
    const node: ComponentNode = {
      type: 'LineChart',
      data,
      series: [{ dataKey: 'sales' }],
      xAxis: 'month',
    }
    const dom = renderNode(node, ctx) as HTMLElement
    hoverZone(dom, 1) // hover over Feb
    const crosshair = dom.querySelector('.pf-crosshair')!
    expect(crosshair.getAttribute('opacity')).toBe('1')
  })

  it('crosshair hides on mouseleave', () => {
    const ctx = makeCtx()
    const node: ComponentNode = {
      type: 'LineChart',
      data,
      series: [{ dataKey: 'sales' }],
      xAxis: 'month',
    }
    const dom = renderNode(node, ctx) as HTMLElement
    const zone = hoverZone(dom, 1)
    const crosshair = dom.querySelector('.pf-crosshair')!
    expect(crosshair.getAttribute('opacity')).toBe('1')
    unhoverZone(zone)
    expect(crosshair.getAttribute('opacity')).toBe('0')
  })

  it('crosshair x position matches the hovered data point', () => {
    const ctx = makeCtx()
    const node: ComponentNode = {
      type: 'LineChart',
      data,
      series: [{ dataKey: 'sales' }],
      xAxis: 'month',
    }
    const dom = renderNode(node, ctx) as HTMLElement
    // Hover first point
    hoverZone(dom, 0)
    const crosshair = dom.querySelector('.pf-crosshair')!
    const x1 = crosshair.getAttribute('x1')
    // Hover last point
    hoverZone(dom, 2)
    const x2 = crosshair.getAttribute('x1')
    // Crosshair should move — different x positions
    expect(x1).not.toBe(x2)
  })

  it('AreaChart also has crosshair (shares LineChart renderer)', () => {
    const ctx = makeCtx()
    const node: ComponentNode = {
      type: 'AreaChart',
      data,
      series: [{ dataKey: 'sales' }],
      xAxis: 'month',
    }
    const dom = renderNode(node, ctx) as HTMLElement
    expect(dom.querySelector('.pf-crosshair')).not.toBeNull()
  })

  it('BarChart does NOT have crosshair (bars are self-evident)', () => {
    const ctx = makeCtx()
    const node: ComponentNode = {
      type: 'BarChart',
      data,
      series: [{ dataKey: 'sales' }],
      xAxis: 'month',
    }
    const dom = renderNode(node, ctx) as HTMLElement
    expect(dom.querySelector('.pf-crosshair')).toBeNull()
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// 2. DATA-POINT DOTS ON HOVER
// ══════════════════════════════════════════════════════════════════════════════

describe('Data-point dots on hover (line/area)', () => {
  const data = [
    { month: 'Jan', sales: 100, cost: 40 },
    { month: 'Feb', sales: 200, cost: 80 },
    { month: 'Mar', sales: 150, cost: 60 },
  ]

  it('hover reveals dot indicators for each series at that data point', () => {
    const ctx = makeCtx()
    const node: ComponentNode = {
      type: 'LineChart',
      data,
      series: [
        { dataKey: 'sales', label: 'Sales' },
        { dataKey: 'cost', label: 'Cost' },
      ],
      xAxis: 'month',
    }
    const dom = renderNode(node, ctx) as HTMLElement
    hoverZone(dom, 1) // hover Feb
    const dots = dom.querySelectorAll('.pf-data-dot[data-visible="true"]')
    expect(dots.length).toBe(2) // one per series
  })

  it('dots are hidden when not hovering', () => {
    const ctx = makeCtx()
    const node: ComponentNode = {
      type: 'LineChart',
      data,
      series: [{ dataKey: 'sales' }],
      xAxis: 'month',
    }
    const dom = renderNode(node, ctx) as HTMLElement
    const dots = dom.querySelectorAll('.pf-data-dot[data-visible="true"]')
    expect(dots.length).toBe(0)
  })

  it('dots disappear on mouseleave', () => {
    const ctx = makeCtx()
    const node: ComponentNode = {
      type: 'LineChart',
      data,
      series: [{ dataKey: 'sales' }],
      xAxis: 'month',
    }
    const dom = renderNode(node, ctx) as HTMLElement
    const zone = hoverZone(dom, 0)
    expect(dom.querySelectorAll('.pf-data-dot[data-visible="true"]').length).toBe(1)
    unhoverZone(zone)
    expect(dom.querySelectorAll('.pf-data-dot[data-visible="true"]').length).toBe(0)
  })

  it('dot color matches its series color', () => {
    const ctx = makeCtx()
    const node: ComponentNode = {
      type: 'LineChart',
      data,
      series: [
        { dataKey: 'sales', color: '#ff0000' },
        { dataKey: 'cost', color: '#00ff00' },
      ],
      xAxis: 'month',
    }
    const dom = renderNode(node, ctx) as HTMLElement
    hoverZone(dom, 0)
    const dots = Array.from(dom.querySelectorAll('.pf-data-dot[data-visible="true"]'))
    expect(dots[0].getAttribute('fill')).toBe('#ff0000')
    expect(dots[1].getAttribute('fill')).toBe('#00ff00')
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// 3. RIGHT-AXIS SERIES USE yAxisRightFormat IN TOOLTIPS
// ══════════════════════════════════════════════════════════════════════════════

describe('Tooltip formats per axis', () => {
  it('left-axis series uses yAxisFormat, right-axis uses yAxisRightFormat', () => {
    const ctx = makeCtx()
    const node: ComponentNode = {
      type: 'LineChart',
      data: [
        { month: 'Jan', revenue: 5000, rate: 0.85 },
        { month: 'Feb', revenue: 7000, rate: 0.91 },
      ],
      series: [
        { dataKey: 'revenue', label: 'Revenue', yAxisId: 'left' },
        { dataKey: 'rate', label: 'Rate', yAxisId: 'right' },
      ],
      xAxis: 'month',
      showYAxisRight: true,
      yAxisFormat: 'currency',
      yAxisRightFormat: 'percent',
    }
    const dom = renderNode(node, ctx) as HTMLElement
    hoverZone(dom, 0) // hover Jan
    const tooltip = dom.querySelector('.pf-chart-tooltip')!
    const text = tooltip.textContent ?? ''
    // Revenue should be formatted as currency
    expect(text).toContain('$')
    // Rate should be formatted as percent
    expect(text).toContain('%')
  })

  it('BarChart also respects per-axis format in tooltip', () => {
    const ctx = makeCtx()
    const node: ComponentNode = {
      type: 'BarChart',
      data: [
        { q: 'Q1', sales: 3000, margin: 0.42 },
      ],
      series: [
        { dataKey: 'sales', label: 'Sales', yAxisId: 'left' },
        { dataKey: 'margin', label: 'Margin', yAxisId: 'right' },
      ],
      xAxis: 'q',
      showYAxisRight: true,
      yAxisFormat: 'currency',
      yAxisRightFormat: 'percent',
    }
    const dom = renderNode(node, ctx) as HTMLElement
    hoverZone(dom, 0)
    const text = dom.querySelector('.pf-chart-tooltip')!.textContent ?? ''
    expect(text).toContain('$')
    expect(text).toContain('%')
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// 4. NULL / MISSING DATA — GAPS IN LINES, SKIP IN BARS
// ══════════════════════════════════════════════════════════════════════════════

describe('Null/missing data handling', () => {
  it('LineChart treats null values as gaps (no line through null)', () => {
    const ctx = makeCtx()
    const node: ComponentNode = {
      type: 'LineChart',
      data: [
        { x: 'A', y: 10 },
        { x: 'B', y: null },
        { x: 'C', y: 30 },
      ],
      series: [{ dataKey: 'y' }],
      xAxis: 'x',
    }
    const dom = renderNode(node, ctx) as HTMLElement
    const svg = dom.querySelector('svg')!
    // With a gap, there should be 2 path segments (M...L) instead of 1 continuous path
    const paths = svg.querySelectorAll('path[stroke]')
    // At minimum: path should NOT draw through y=0 for the null point
    // The path should have a break (either multiple paths, or an M command mid-path)
    const d = paths[0]?.getAttribute('d') ?? ''
    // Should have 2 M commands (start + restart after gap)
    const mCount = (d.match(/M /g) ?? []).length
    expect(mCount).toBeGreaterThanOrEqual(2)
  })

  it('BarChart skips null values (no bar drawn)', () => {
    const ctx = makeCtx()
    const node: ComponentNode = {
      type: 'BarChart',
      data: [
        { x: 'A', y: 10 },
        { x: 'B', y: null },
        { x: 'C', y: 30 },
      ],
      series: [{ dataKey: 'y' }],
      xAxis: 'x',
    }
    const dom = renderNode(node, ctx) as HTMLElement
    const svg = dom.querySelector('svg')!
    // Only 2 visible bars (not 3), because B is null
    const bars = Array.from(svg.querySelectorAll('rect')).filter(r => {
      const fill = r.getAttribute('fill')
      const h = parseFloat(r.getAttribute('height') ?? '0')
      return fill !== 'transparent' && h > 0
    })
    expect(bars.length).toBe(2)
  })

  it('tooltip shows "—" for null values instead of "0"', () => {
    const ctx = makeCtx()
    const node: ComponentNode = {
      type: 'BarChart',
      data: [
        { x: 'A', y: null },
      ],
      series: [{ dataKey: 'y', label: 'Value' }],
      xAxis: 'x',
    }
    const dom = renderNode(node, ctx) as HTMLElement
    hoverZone(dom, 0)
    const text = dom.querySelector('.pf-chart-tooltip')!.textContent ?? ''
    expect(text).toContain('—')
    expect(text).not.toContain(' 0')
  })

  it('undefined series key treated same as null', () => {
    const ctx = makeCtx()
    const node: ComponentNode = {
      type: 'LineChart',
      data: [
        { x: 'A', y: 10 },
        { x: 'B' }, // no 'y' key at all
        { x: 'C', y: 30 },
      ],
      series: [{ dataKey: 'y' }],
      xAxis: 'x',
    }
    const dom = renderNode(node, ctx) as HTMLElement
    const svg = dom.querySelector('svg')!
    const paths = svg.querySelectorAll('path[stroke]')
    const d = paths[0]?.getAttribute('d') ?? ''
    const mCount = (d.match(/M /g) ?? []).length
    expect(mCount).toBeGreaterThanOrEqual(2)
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// 5. SVG ACCESSIBILITY
// ══════════════════════════════════════════════════════════════════════════════

describe('Chart SVG accessibility', () => {
  it('BarChart SVG has role="img"', () => {
    const ctx = makeCtx()
    const node: ComponentNode = {
      type: 'BarChart',
      data: [{ x: 1 }],
      series: [{ dataKey: 'x' }],
    }
    const dom = renderNode(node, ctx) as HTMLElement
    const svg = dom.querySelector('svg')!
    expect(svg.getAttribute('role')).toBe('img')
  })

  it('LineChart SVG has role="img"', () => {
    const ctx = makeCtx()
    const node: ComponentNode = {
      type: 'LineChart',
      data: [{ x: 1 }],
      series: [{ dataKey: 'x' }],
    }
    const dom = renderNode(node, ctx) as HTMLElement
    expect(dom.querySelector('svg')!.getAttribute('role')).toBe('img')
  })

  it('PieChart SVG has role="img"', () => {
    const ctx = makeCtx()
    const node: ComponentNode = {
      type: 'PieChart',
      data: [{ v: 10 }, { v: 20 }],
      series: [{ dataKey: 'v' }],
    }
    const dom = renderNode(node, ctx) as HTMLElement
    expect(dom.querySelector('svg')!.getAttribute('role')).toBe('img')
  })

  it('SVG has aria-label derived from chart type', () => {
    const ctx = makeCtx()
    const node: ComponentNode = {
      type: 'BarChart',
      data: [{ x: 1 }],
      series: [{ dataKey: 'x' }],
    }
    const dom = renderNode(node, ctx) as HTMLElement
    const label = dom.querySelector('svg')!.getAttribute('aria-label')
    expect(label).toContain('Bar')
    expect(label).toContain('chart')
  })

  it('Histogram SVG also has role="img"', () => {
    const ctx = makeCtx()
    const node: ComponentNode = {
      type: 'Histogram',
      data: [1, 2, 3, 4, 5],
    }
    const dom = renderNode(node, ctx) as HTMLElement
    expect(dom.querySelector('svg')!.getAttribute('role')).toBe('img')
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// 6. TOUCH SUPPORT
// ══════════════════════════════════════════════════════════════════════════════

describe('Touch support for chart tooltips', () => {
  it('touchstart on hit-zone shows tooltip', () => {
    const ctx = makeCtx()
    const node: ComponentNode = {
      type: 'BarChart',
      data: [{ x: 'A', y: 10 }, { x: 'B', y: 20 }],
      series: [{ dataKey: 'y' }],
      xAxis: 'x',
    }
    const dom = renderNode(node, ctx) as HTMLElement
    const svg = dom.querySelector('svg')!
    const zone = Array.from(svg.querySelectorAll('rect')).find(
      r => r.getAttribute('fill') === 'transparent',
    )!
    zone.dispatchEvent(new Event('touchstart'))
    const tooltip = dom.querySelector('.pf-chart-tooltip')!
    expect(tooltip.classList.contains('pf-visible')).toBe(true)
  })

  it('touchend hides tooltip', () => {
    const ctx = makeCtx()
    const node: ComponentNode = {
      type: 'BarChart',
      data: [{ x: 'A', y: 10 }],
      series: [{ dataKey: 'y' }],
      xAxis: 'x',
    }
    const dom = renderNode(node, ctx) as HTMLElement
    const svg = dom.querySelector('svg')!
    const zone = Array.from(svg.querySelectorAll('rect')).find(
      r => r.getAttribute('fill') === 'transparent',
    )!
    zone.dispatchEvent(new Event('touchstart'))
    const tooltip = dom.querySelector('.pf-chart-tooltip')!
    expect(tooltip.classList.contains('pf-visible')).toBe(true)
    zone.dispatchEvent(new Event('touchend'))
    expect(tooltip.classList.contains('pf-visible')).toBe(false)
  })

  it('LineChart touch support on hit-zones', () => {
    const ctx = makeCtx()
    const node: ComponentNode = {
      type: 'LineChart',
      data: [{ x: 'A', y: 10 }, { x: 'B', y: 20 }],
      series: [{ dataKey: 'y' }],
      xAxis: 'x',
    }
    const dom = renderNode(node, ctx) as HTMLElement
    const svg = dom.querySelector('svg')!
    const zone = Array.from(svg.querySelectorAll('rect')).find(
      r => r.getAttribute('fill') === 'transparent',
    )!
    zone.dispatchEvent(new Event('touchstart'))
    expect(dom.querySelector('.pf-chart-tooltip')!.classList.contains('pf-visible')).toBe(true)
  })

  it('PieChart touch on slice shows tooltip', () => {
    const ctx = makeCtx()
    const node: ComponentNode = {
      type: 'PieChart',
      data: [{ name: 'A', v: 60 }, { name: 'B', v: 40 }],
      series: [{ dataKey: 'v' }],
      xAxis: 'name',
    }
    const dom = renderNode(node, ctx) as HTMLElement
    const slice = dom.querySelector('svg path')!
    slice.dispatchEvent(new Event('touchstart'))
    expect(dom.querySelector('.pf-chart-tooltip')!.classList.contains('pf-visible')).toBe(true)
  })
})
