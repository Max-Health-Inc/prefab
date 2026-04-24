/**
 * TDD bug hunt — RED tests for bugs found in the new features.
 *
 * @happy-dom
 */

import { describe, test, expect, beforeEach, afterEach } from 'bun:test'
import { Store } from '../src/renderer/state'
import { renderNode } from '../src/renderer/engine'
import type { ComponentNode, RenderContext } from '../src/renderer/engine'
import { registerAllComponents } from '../src/renderer/components/index'
import { createNoopTransport } from '../src/renderer/transport'
import { registerPipe, unregisterPipe, listPipes } from '../src/rx/pipes'
import { signal } from '../src/rx/signal'
import { collection } from '../src/rx/collection'
import { resetAutoState, drainAutoState } from '../src/rx/state-collector'
import { PrefabApp } from '../src/app'
import { Heading } from '../src/components/typography/index'

beforeEach(() => { registerAllComponents() })

afterEach(() => {
  for (const name of listPipes()) unregisterPipe(name)
  resetAutoState()
})

function makeCtx(state?: Record<string, unknown>): RenderContext {
  return {
    store: new Store(state),
    scope: {},
    transport: createNoopTransport(),
    rerender: () => {},
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// BUG 1: col({ format: 'currency' }) — built-in pipe silently ignored
//
// Root cause: renderer uses getCustomPipe(col.format) which only checks the
// custom registry. Built-in pipes (currency, date, upper, etc.) live in
// the applyFilter switch statement and are NOT in the custom registry.
// ═════════════════════════════════════════════════════════════════════════════
describe('BUG: col format with built-in pipe', () => {
  test('format:"currency" applies built-in currency pipe to cell value', () => {
    const ctx = makeCtx()
    const node: ComponentNode = {
      type: 'DataTable',
      rows: [{ name: 'Widget', price: 1234.56 }],
      columns: [
        { key: 'name', header: 'Name' },
        { key: 'price', header: 'Price', format: 'currency' },
      ],
      search: false,
      paginated: false,
      pageSize: 10,
    }
    const dom = renderNode(node, ctx) as HTMLElement
    const cells = dom.querySelectorAll('.pf-datatable-td')
    // Cell 0 = name, Cell 1 = price
    // BUG: Without fix, cell 1 shows "1234.56" (raw), not "$1,234.56"
    expect(cells[1].textContent).toBe('$1,234.56')
  })

  test('format:"upper" applies built-in upper pipe to cell value', () => {
    const ctx = makeCtx()
    const node: ComponentNode = {
      type: 'DataTable',
      rows: [{ label: 'hello' }],
      columns: [{ key: 'label', header: 'Label', format: 'upper' }],
      search: false,
      paginated: false,
      pageSize: 10,
    }
    const dom = renderNode(node, ctx) as HTMLElement
    const cell = dom.querySelector('.pf-datatable-td')
    // BUG: Without fix, shows "hello" (raw), not "HELLO"
    expect(cell?.textContent).toBe('HELLO')
  })

  test('format with custom pipe still works', () => {
    registerPipe('exclaim', (v) => `${String(v)}!`)
    const ctx = makeCtx()
    const node: ComponentNode = {
      type: 'DataTable',
      rows: [{ msg: 'hi' }],
      columns: [{ key: 'msg', header: 'Message', format: 'exclaim' }],
      search: false,
      paginated: false,
      pageSize: 10,
    }
    const dom = renderNode(node, ctx) as HTMLElement
    const cell = dom.querySelector('.pf-datatable-td')
    expect(cell?.textContent).toBe('hi!')
  })
})

// ═════════════════════════════════════════════════════════════════════════════
// BUG 2: accessor + format both set → double application
//
// Root cause: when accessor is set, the pipe expression inside it already
// formats the value. If format is ALSO set, it applies a second time on top.
// accessor should take precedence; format should be skipped.
// ═════════════════════════════════════════════════════════════════════════════
describe('BUG: accessor + format double application', () => {
  test('accessor with pipe should skip format (no double-apply)', () => {
    registerPipe('exclaim', (v) => `${String(v)}!`)
    const ctx = makeCtx()
    const node: ComponentNode = {
      type: 'DataTable',
      rows: [{ msg: 'hi' }],
      columns: [{
        key: 'msg',
        header: 'Message',
        accessor: 'msg | exclaim',   // already applies the pipe
        format: 'exclaim',           // BUG: would apply AGAIN → "hi!!"
      }],
      search: false,
      paginated: false,
      pageSize: 10,
    }
    const dom = renderNode(node, ctx) as HTMLElement
    const cell = dom.querySelector('.pf-datatable-td')
    // Should be "hi!" (one application), NOT "hi!!" (double)
    expect(cell?.textContent).toBe('hi!')
  })
})

// ═════════════════════════════════════════════════════════════════════════════
// BUG 3: Duplicate state keys in auto-collector — silent overwrite
//
// Root cause: drainAutoState uses Object.assign which silently overwrites.
// Two collections with the same stateKey: first one's data is lost.
// Should warn (matching registerPipe behavior).
// ═════════════════════════════════════════════════════════════════════════════
describe('BUG: duplicate state keys in auto-collector', () => {
  test('duplicate stateKey warns and keeps last value', () => {
    const warnings: string[] = []
    const origWarn = console.warn
    console.warn = (...args: unknown[]) => { warnings.push(String(args[0])) }

    try {
      const _c1 = collection('items', [{ id: '1', v: 'first' }], { key: 'id' })
      const _c2 = collection('items', [{ id: '2', v: 'second' }], { key: 'id' })

      const app = new PrefabApp({ title: 'Test', view: Heading('Hi') })
      const wire = app.toJSON()

      // Last value should win (same as registerPipe behavior)
      expect(wire.state?.items).toEqual([{ id: '2', v: 'second' }])
      // BUG: no warning emitted — silent data loss
      expect(warnings.some(w => w.includes('items'))).toBe(true)
    } finally {
      console.warn = origWarn
    }
  })

  test('signal + collection with same key warns', () => {
    const warnings: string[] = []
    const origWarn = console.warn
    console.warn = (...args: unknown[]) => { warnings.push(String(args[0])) }

    try {
      const _s = signal('count', 0)
      const _c = collection('count', [{ id: '1' }], { key: 'id' })

      const merged = drainAutoState()
      // Collection overwrites signal silently — should warn
      expect(Array.isArray(merged.count)).toBe(true)
      expect(warnings.some(w => w.includes('count'))).toBe(true)
    } finally {
      console.warn = origWarn
    }
  })
})
