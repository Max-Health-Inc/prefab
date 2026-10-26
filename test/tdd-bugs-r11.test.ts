/**
 * TDD R11 — wire values the renderer used to assert into shape.
 *
 * @happy-dom
 */

import { describe, it, expect, beforeEach, afterEach, spyOn } from 'bun:test'
import { Store } from '../src/renderer/state'
import { renderNode } from '../src/renderer/engine'
import type { ComponentNode } from '../src/renderer/engine'
import { registerAllComponents } from '../src/renderer/components/index'
import { dispatchActions, clearAllIntervals } from '../src/renderer/actions'
import type { DispatchContext, McpTransport } from '../src/renderer/actions'
import { makeRenderCtx } from './helpers/render'

beforeEach(() => { registerAllComponents() })
afterEach(() => { clearAllIntervals() })

function dispatchCtx(transport?: McpTransport): DispatchContext {
  return { store: new Store({}), scope: {}, transport, rerender: () => {} }
}

describe('Grid responsive columns', () => {
  it('renders a breakpoint map at its widest breakpoint', () => {
    const node: ComponentNode = { type: 'Grid', columns: { sm: 1, md: 2, lg: 3 } }
    const dom = renderNode(node, makeRenderCtx()) as HTMLElement
    expect(dom.style.gridTemplateColumns).toBe('repeat(3, 1fr)')
  })

  it('falls back to 3 columns for a map without numeric breakpoints', () => {
    const node: ComponentNode = { type: 'Grid', columns: { lg: 'wide' } }
    const dom = renderNode(node, makeRenderCtx()) as HTMLElement
    expect(dom.style.gridTemplateColumns).toBe('repeat(3, 1fr)')
  })
})

describe('charts with malformed data', () => {
  it('renders the empty state when data is not an array', () => {
    const node: ComponentNode = { type: 'BarChart', data: { sales: 1 }, series: [{ dataKey: 'sales' }] }
    const dom = renderNode(node, makeRenderCtx()) as HTMLElement
    expect(dom.textContent).toBe('No chart data')
  })

  it('skips null rows instead of throwing', () => {
    const node: ComponentNode = {
      type: 'LineChart',
      data: [null, { m: 'Jan', v: 1 }, { m: 'Feb', v: 2 }],
      series: [{ dataKey: 'v' }],
      xAxis: 'm',
    }
    const dom = renderNode(node, makeRenderCtx()) as HTMLElement
    expect(dom.querySelectorAll('circle.pf-data-dot')).toHaveLength(2)
  })
})

describe('setInterval without a usable interval', () => {
  it('floors a missing intervalMs at the minimum instead of spinning at 0ms', async () => {
    const spy = spyOn(globalThis, 'setInterval')
    try {
      await dispatchActions({ action: 'setInterval', onTick: { action: 'toggleState', key: 'x' } }, dispatchCtx())
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy.mock.calls[0][1]).toBe(100)
    } finally {
      spy.mockRestore()
    }
  })

  it('does not start an interval that has nothing to run', async () => {
    const spy = spyOn(globalThis, 'setInterval')
    try {
      await dispatchActions({ action: 'setInterval', intervalMs: 500 }, dispatchCtx())
      expect(spy).not.toHaveBeenCalled()
    } finally {
      spy.mockRestore()
    }
  })
})

describe('toolCall without a tool name', () => {
  it('routes to onError instead of calling the transport with undefined', async () => {
    const names: unknown[] = []
    const transport: McpTransport = {
      callTool: (name) => { names.push(name); return Promise.resolve({}) },
      sendMessage: () => Promise.resolve(),
    }
    const ctx = dispatchCtx(transport)
    await dispatchActions({ action: 'toolCall', onError: { action: 'setState', key: 'failed', value: true } }, ctx)
    expect(names).toHaveLength(0)
    expect(ctx.store.get('failed')).toBe(true)
  })
})
