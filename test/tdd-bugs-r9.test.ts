/**
 * TDD R9 — deeper bug hunt: DataTable interactions, chart edge cases, and
 * expression/pipe corner cases that examples don't exercise.
 *
 * @happy-dom
 */

import { describe, it, expect, beforeEach } from 'bun:test'
import { evaluateTemplate } from '../src/renderer/rx'
import { Store } from '../src/renderer/state'
import { renderNode } from '../src/renderer/engine'
import type { ComponentNode, RenderContext } from '../src/renderer/engine'
import { registerAllComponents } from '../src/renderer/components/index'
import { createNoopTransport } from '../src/renderer/transport'
import { dispatchActions } from '../src/renderer/actions'

beforeEach(() => { registerAllComponents() })

function makeCtx(state?: Record<string, unknown>): RenderContext {
  return { store: new Store(state), scope: {}, transport: createNoopTransport(), rerender: () => {} } as RenderContext
}
const ev = (tmpl: string, state: Record<string, unknown> = {}) =>
  evaluateTemplate(tmpl, new Store(state), {})

describe('DataTable interactions', () => {
  it('accessor pulls a nested field', () => {
    const node: ComponentNode = {
      type: 'DataTable',
      columns: [{ key: 'name', header: 'Name', accessor: 'user.name' }],
      rows: [{ user: { name: 'Ada' } }],
    }
    const dom = renderNode(node, makeCtx()) as HTMLElement
    expect(dom.textContent).toContain('Ada')
  })

  it('onRowClick dispatches with $item in scope', async () => {
    const ctx = makeCtx({})
    const node: ComponentNode = {
      type: 'DataTable',
      rowKey: 'id',
      columns: [{ key: 'name' }],
      rows: [{ id: 1, name: 'Ada' }, { id: 2, name: 'Alan' }],
      onRowClick: [{ action: 'setState', key: 'picked', value: '{{ $item.name }}' }],
    }
    const dom = renderNode(node, ctx) as HTMLElement
    const rows = [...dom.querySelectorAll('.pf-datatable-row')] as HTMLElement[]
    rows[1].click()
    await new Promise(r => setTimeout(r, 20))
    expect(ctx.store.get('picked')).toBe('Alan')
  })

  it('search hides non-matching rows', () => {
    const node: ComponentNode = {
      type: 'DataTable',
      search: true,
      columns: [{ key: 'name' }],
      rows: [{ name: 'Ada' }, { name: 'Alan' }, { name: 'Grace' }],
    }
    const dom = renderNode(node, makeCtx()) as HTMLElement
    const input = dom.querySelector('.pf-datatable-search') as HTMLInputElement
    input.value = 'grace'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    const visible = [...dom.querySelectorAll('.pf-datatable-row')]
      .filter(r => (r as HTMLElement).style.display !== 'none')
    expect(visible.length).toBe(1)
  })
})

describe('chart edge cases (must not crash)', () => {
  it('BarChart with empty data shows a graceful empty state (no crash)', () => {
    const node: ComponentNode = { type: 'BarChart', data: [], series: [{ dataKey: 'v', label: 'V' }], xAxis: 'k', height: 120 }
    const dom = renderNode(node, makeCtx()) as HTMLElement
    expect(dom.textContent).toContain('No chart data')
  })
  it('LineChart with a single point does not produce NaN coordinates', () => {
    const node: ComponentNode = { type: 'LineChart', data: [{ k: 'A', v: 5 }], series: [{ dataKey: 'v', label: 'V' }], xAxis: 'k', height: 120 }
    const dom = renderNode(node, makeCtx()) as HTMLElement
    expect(dom.innerHTML).not.toContain('NaN')
  })
})

describe('expression / pipe corners', () => {
  it('string equality in a ternary', () => {
    expect(String(ev('{{ role == "admin" ? "yes" : "no" }}', { role: 'admin' }))).toBe('yes')
  })
  it('!= comparison', () => {
    expect(String(ev('{{ a != b ? "diff" : "same" }}', { a: 1, b: 2 }))).toBe('diff')
  })
  it('date pipe on an ISO string', () => {
    const out = String(ev('{{ d | date }}', { d: '2026-01-15' }))
    expect(out).not.toBe('')
    expect(out.toLowerCase()).not.toContain('invalid')
  })
  it('toggleState on an undefined key becomes true', async () => {
    const ctx = makeCtx({})
    await dispatchActions({ action: 'toggleState', key: 'flag' }, ctx)
    expect(ctx.store.get('flag')).toBe(true)
  })
})
