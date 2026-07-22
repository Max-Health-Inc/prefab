/**
 * TDD R5 — Regression net for the playground bug hunt (2026-07).
 *
 * Each describe pins one real bug found by driving the live playground:
 *  1. `If` children parked under a non-`children` key (e.g. `then`) render
 *     nothing AND slip past the validator — the silent-ignore class.
 *  2. `DataTable` over an array of primitives renders blank cells because
 *     `row[col.key]` is undefined on a string/number row.
 *  3. `showToast` authored with `title` instead of `message` fires an empty
 *     toast heading, and the validator never warns.
 *
 * MAD MAX: each test states its measurable success criterion inline.
 *
 * @happy-dom
 */

import { describe, it, expect, beforeEach } from 'bun:test'
import { validateWireFormat } from '../src/core/validate'
import { Store } from '../src/renderer/state'
import { renderNode } from '../src/renderer/engine'
import type { ComponentNode, RenderContext } from '../src/renderer/engine'
import { registerAllComponents } from '../src/renderer/components/index'
import { createNoopTransport } from '../src/renderer/transport'

beforeEach(() => { registerAllComponents() })

function makeCtx(state?: Record<string, unknown>): RenderContext {
  const ctx = {
    store: new Store(state),
    scope: {},
    transport: createNoopTransport(),
    rerender: () => { /* noop */ },
  } as RenderContext
  return ctx
}

// ── Goal 1: validator catches misplaced children (the `then` bug) ────────────

describe('Goal 1 — misplaced children detection', () => {
  it('flags an If whose branch is under `then` instead of `children`', () => {
    // Measurable: validation fails with an error pointing at `then`.
    const data = {
      $prefab: { version: '0.3' },
      view: {
        type: 'If',
        condition: '{{ ok }}',
        then: [{ type: 'Alert', children: [{ type: 'AlertTitle', content: 'Hi' }] }],
      },
    }
    const result = validateWireFormat(data)
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.path.includes('then'))).toBe(true)
    // The message should nudge toward `children`.
    expect(result.errors.some(e => e.message.includes('children'))).toBe(true)
  })

  it('flags a single component object under a wrong key', () => {
    const data = {
      $prefab: { version: '0.3' },
      view: { type: 'Column', body: { type: 'Text', content: 'x' } },
    }
    expect(validateWireFormat(data).valid).toBe(false)
  })

  it('does NOT flag legitimate children', () => {
    const data = {
      $prefab: { version: '0.3' },
      view: { type: 'Column', children: [{ type: 'Text', content: 'x' }] },
    }
    expect(validateWireFormat(data).valid).toBe(true)
  })

  it('does NOT flag data arrays whose rows merely have a `type` field', () => {
    // Regression guard against false positives: a table row keyed "type" whose
    // value is NOT a known component must not look like misplaced children.
    const data = {
      $prefab: { version: '0.3' },
      view: {
        type: 'DataTable',
        columns: [{ key: 'type' }, { key: 'name' }],
        rows: [{ type: 'admin', name: 'Ada' }, { type: 'guest', name: 'Bo' }],
      },
    }
    expect(validateWireFormat(data).valid).toBe(true)
  })

  it('does NOT flag genuine component slots (trigger/empty/else/summary)', () => {
    // These keys ARE read as component nodes by the renderer; flagging them
    // would false-positive on valid Dialogs, Details, Conditions, and rows.
    const slots = [
      { type: 'Dialog', trigger: { type: 'Button', label: 'Open' }, children: [{ type: 'Text', content: 'x' }] },
      { type: 'Detail', empty: { type: 'Text', content: 'none' }, children: [{ type: 'Text', content: 'x' }] },
      { type: 'Condition', cases: [{ when: '{{ a }}', children: [{ type: 'Text', content: 'x' }] }], else: [{ type: 'Text', content: 'y' }] },
      { type: 'ExpandableRow', summary: [{ type: 'TableCell', content: 'x' }], children: [{ type: 'Text', content: 'd' }] },
    ]
    for (const view of slots) {
      const result = validateWireFormat({ $prefab: { version: '0.3' }, view })
      expect(result.valid).toBe(true)
    }
  })

  it('does NOT flag chart series/data objects', () => {
    const data = {
      $prefab: { version: '0.3' },
      view: {
        type: 'BarChart',
        data: [{ month: 'Jan', revenue: 100 }],
        series: [{ dataKey: 'revenue', label: 'Revenue' }],
      },
    }
    expect(validateWireFormat(data).valid).toBe(true)
  })
})

// ── Goal 2: DataTable renders primitive rows ─────────────────────────────────

describe('Goal 2 — DataTable primitive rows', () => {
  it('renders string rows instead of blank cells', () => {
    // Measurable: each cell shows the string value, not "".
    const node: ComponentNode = {
      type: 'DataTable',
      columns: [{ key: 'value', header: 'Task' }],
      rows: ['Review pull requests', 'Deploy v2.0'],
    }
    const dom = renderNode(node, makeCtx()) as HTMLElement
    const cells = [...dom.querySelectorAll('.pf-datatable-td')].map(td => td.textContent)
    expect(cells).toContain('Review pull requests')
    expect(cells).toContain('Deploy v2.0')
  })

  it('renders number rows', () => {
    const node: ComponentNode = {
      type: 'DataTable',
      columns: [{ key: 'value' }],
      rows: [1, 2, 3],
    }
    const dom = renderNode(node, makeCtx()) as HTMLElement
    const cells = [...dom.querySelectorAll('.pf-datatable-td')].map(td => td.textContent)
    expect(cells).toEqual(['1', '2', '3'])
  })

  it('still renders object rows by column key (regression)', () => {
    const node: ComponentNode = {
      type: 'DataTable',
      columns: [{ key: 'value', header: 'Task' }],
      rows: [{ value: 'Keep working' }],
    }
    const dom = renderNode(node, makeCtx()) as HTMLElement
    const cells = [...dom.querySelectorAll('.pf-datatable-td')].map(td => td.textContent)
    expect(cells).toContain('Keep working')
  })
})

// ── Goal 3: validator flags showToast without message ────────────────────────

describe('Goal 3 — showToast requires message', () => {
  it('flags a showToast authored with `title` instead of `message`', () => {
    const data = {
      $prefab: { version: '0.3' },
      view: {
        type: 'Button',
        label: 'Send',
        onClick: { action: 'showToast', title: 'Sent!', description: 'done' },
      },
    }
    const result = validateWireFormat(data)
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.message.includes('message'))).toBe(true)
  })

  it('accepts a showToast with message', () => {
    const data = {
      $prefab: { version: '0.3' },
      view: {
        type: 'Button',
        label: 'Send',
        onClick: { action: 'showToast', message: 'Sent!' },
      },
    }
    expect(validateWireFormat(data).valid).toBe(true)
  })
})
