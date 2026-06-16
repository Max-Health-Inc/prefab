/**
 * Chart data-binding parity — Pie/Radial use upstream `dataKey`/`nameKey`,
 * Scatter uses `xAxis`/`yAxis`/`zAxis`. Legacy series-based input still works
 * (dual-accept), and the builder emits the upstream-canonical shape.
 *
 * @happy-dom
 */

import { describe, it, expect, beforeEach } from 'bun:test'
import { PieChart, RadialChart, ScatterChart } from '../src/components/charts'
import { Store } from '../src/renderer/state'
import { renderNode } from '../src/renderer/engine'
import type { ComponentNode, RenderContext } from '../src/renderer/engine'
import { registerAllComponents } from '../src/renderer/components/index'
import { createNoopTransport } from '../src/renderer/transport'

beforeEach(() => { registerAllComponents() })

function makeCtx(): RenderContext {
  return { store: new Store({}), scope: {}, transport: createNoopTransport(), rerender: () => {} }
}
function asNode(json: unknown): ComponentNode {
  return json as ComponentNode
}

const PIE_DATA = [
  { browser: 'Chrome', visitors: 275 },
  { browser: 'Safari', visitors: 200 },
  { browser: 'Firefox', visitors: 120 },
]

// ── Builder: canonical dataKey/nameKey (Pie/Radial) ──────────────────────────

describe('builder: Pie/Radial dataKey + nameKey', () => {
  it('PieChart emits dataKey/nameKey when given directly (no series on wire)', () => {
    const json = PieChart({ data: PIE_DATA, dataKey: 'visitors', nameKey: 'browser' }).toJSON()
    expect(json.dataKey).toBe('visitors')
    expect(json.nameKey).toBe('browser')
    expect('series' in json).toBe(false)
  })

  it('PieChart maps legacy series/xAxis → dataKey/nameKey (dual-accept)', () => {
    const json = PieChart({
      data: PIE_DATA,
      series: [{ dataKey: 'visitors', label: 'Visitors' }],
      xAxis: 'browser',
    }).toJSON()
    expect(json.dataKey).toBe('visitors')
    expect(json.nameKey).toBe('browser')
  })

  it('RadialChart emits dataKey/nameKey + radius/angles', () => {
    const json = RadialChart({
      data: PIE_DATA, dataKey: 'visitors', nameKey: 'browser', innerRadius: 30, startAngle: 180, endAngle: 0,
    }).toJSON()
    expect(json.dataKey).toBe('visitors')
    expect(json.nameKey).toBe('browser')
    expect(json.innerRadius).toBe(30)
    expect(json.startAngle).toBe(180)
  })
})

// ── Builder: Scatter x/y/z ───────────────────────────────────────────────────

describe('builder: Scatter xAxis/yAxis/zAxis', () => {
  it('emits xAxis/yAxis/zAxis (bubble)', () => {
    const json = ScatterChart({
      data: [{ h: 170, w: 65, age: 25 }],
      series: [{ dataKey: 'group' }],
      xAxis: 'h', yAxis: 'w', zAxis: 'age',
    }).toJSON()
    expect(json.xAxis).toBe('h')
    expect(json.yAxis).toBe('w')
    expect(json.zAxis).toBe('age')
  })
})

// ── Renderer: Pie renders both shapes ────────────────────────────────────────

describe('renderer: Pie renders both shapes', () => {
  function sliceCount(node: ComponentNode): number {
    return renderNode(node, makeCtx()).querySelectorAll('svg path').length
  }

  it('renders the upstream dataKey/nameKey shape (one slice per row)', () => {
    const node = asNode(PieChart({ data: PIE_DATA, dataKey: 'visitors', nameKey: 'browser' }).toJSON())
    expect(sliceCount(node)).toBe(3)
  })

  it('renders the legacy series shape', () => {
    const node = asNode(PieChart({ data: PIE_DATA, series: [{ dataKey: 'visitors' }], xAxis: 'browser' }).toJSON())
    expect(sliceCount(node)).toBe(3)
  })
})
