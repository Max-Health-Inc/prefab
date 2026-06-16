/**
 * Chart `valueFormat` — upstream parity (PR #454).
 *
 * `valueFormat` is the canonical value-axis/tooltip format field (matches
 * upstream prefab). `yAxisFormat` remains a TS-only override for dual-axis
 * charts. The renderer reads `valueFormat` as the base and `"auto"` as none.
 *
 * @happy-dom
 */

import { describe, it, expect, beforeEach } from 'bun:test'
import { BarChart } from '../src/components/charts'
import { Store } from '../src/renderer/state'
import { renderNode } from '../src/renderer/engine'
import type { ComponentNode, RenderContext } from '../src/renderer/engine'
import { registerAllComponents } from '../src/renderer/components/index'
import { createNoopTransport } from '../src/renderer/transport'

beforeEach(() => { registerAllComponents() })

function makeCtx(): RenderContext {
  return { store: new Store({}), scope: {}, transport: createNoopTransport(), rerender: () => {} }
}

const DATA = [{ m: 'Jan', v: 1000 }, { m: 'Feb', v: 2000 }, { m: 'Mar', v: 3000 }]
const SERIES = [{ dataKey: 'v', label: 'Value' }]

/** All <text> contents inside the chart SVG (y-axis ticks + x-axis labels). */
function svgText(node: ComponentNode): string {
  const dom = renderNode(node, makeCtx())
  return Array.from(dom.querySelectorAll('svg text')).map(t => t.textContent ?? '').join(' ')
}

// ── Builder ──────────────────────────────────────────────────────────────────

describe('chart builder: valueFormat', () => {
  it('emits valueFormat when set', () => {
    const json = BarChart({ data: DATA, series: SERIES, valueFormat: 'currency' }).toJSON()
    expect(json.valueFormat).toBe('currency')
  })

  it('omits valueFormat when not set', () => {
    const json = BarChart({ data: DATA, series: SERIES }).toJSON()
    expect('valueFormat' in json).toBe(false)
  })

  it('still emits yAxisFormat (dual-axis extension)', () => {
    const json = BarChart({ data: DATA, series: SERIES, yAxisFormat: 'percent' }).toJSON()
    expect(json.yAxisFormat).toBe('percent')
  })
})

// ── Renderer ─────────────────────────────────────────────────────────────────

describe('chart renderer: valueFormat', () => {
  it('formats the value axis using valueFormat', () => {
    const json = BarChart({ data: DATA, series: SERIES, valueFormat: 'currency' }).toJSON()
    expect(svgText(json as unknown as ComponentNode)).toContain('$')
  })

  it('yAxisFormat overrides valueFormat (dual-axis left override)', () => {
    const json = BarChart({
      data: DATA, series: SERIES, valueFormat: 'currency', yAxisFormat: 'percent',
    }).toJSON()
    const text = svgText(json as unknown as ComponentNode)
    expect(text).toContain('%')
    expect(text).not.toContain('$')
  })

  it('treats valueFormat "auto" as no explicit format', () => {
    const json = BarChart({ data: DATA, series: SERIES, valueFormat: 'auto' }).toJSON()
    const text = svgText(json as unknown as ComponentNode)
    expect(text).not.toContain('$')
    expect(text).not.toContain('%')
  })
})
