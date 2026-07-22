/**
 * TDD R8 — bug hunt across pipes, expressions, state ops, and the semantic table.
 *
 * Each assertion states the behavior a payload author would reasonably expect.
 * A RED here is either a real bug or a wrong expectation to reconcile.
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

const store = () => new Store({
  arr: [1, 2, 3],
  a: 2, b: 3, n: 95,
  user: { name: 'Ada' },
  items: [{ active: true }, { active: false }, { active: true }],
  amount: 1234.5,
  ratio: 0.156,
  big: 12345,
})
const ev = (tmpl: string) => evaluateTemplate(tmpl, store(), {})

function makeCtx(state?: Record<string, unknown>): RenderContext {
  return { store: new Store(state), scope: {}, transport: createNoopTransport(), rerender: () => {} } as RenderContext
}

describe('formatting pipes', () => {
  it('currency', () => { expect(String(ev('{{ amount | currency }}'))).toBe('$1,234.50') })
  it('percent (default rounds)', () => { expect(String(ev('{{ ratio | percent }}'))).toBe('16%') })
  it('percent with precision', () => { expect(String(ev('{{ ratio | percent:1 }}'))).toBe('15.6%') })
  it('compact', () => { expect(String(ev('{{ big | compact }}'))).toBe('12.3K') })
  it('round with precision', () => { expect(String(ev('{{ 3.14159 | round:2 }}'))).toBe('3.14') })
  it('abs', () => { expect(Number(ev('{{ -5 | abs }}'))).toBe(5) })
  it('join', () => { expect(String(ev('{{ arr | join:", " }}'))).toBe('1, 2, 3') })
  it('length', () => { expect(Number(ev('{{ arr | length }}'))).toBe(3) })
  it('default fills a missing value', () => { expect(String(ev('{{ missing | default:"none" }}'))).toBe('none') })
  it('chained upper | truncate', () => { expect(String(ev('{{ "hello" | upper | truncate:3 }}'))).toBe('HEL') })
  it('first / last', () => {
    expect(Number(ev('{{ arr | first }}'))).toBe(1)
    expect(Number(ev('{{ arr | last }}'))).toBe(3)
  })
  it('selectattr filters by truthy attribute', () => {
    expect(Number(ev('{{ items | selectattr:"active" | length }}'))).toBe(2)
  })
})

describe('expressions', () => {
  it('arithmetic', () => { expect(Number(ev('{{ a + b }}'))).toBe(5) })
  it('comparison in a ternary', () => { expect(String(ev('{{ n >= 90 ? "A" : "B" }}'))).toBe('A') })
  it('dot-path access', () => { expect(String(ev('{{ user.name }}'))).toBe('Ada') })
})

describe('state ops', () => {
  it('appendState creates an array when the key is missing', async () => {
    const ctx = makeCtx({})
    await dispatchActions({ action: 'appendState', key: 'todos', value: 'first' }, ctx)
    expect(ctx.store.get('todos')).toEqual(['first'])
  })
  it('appendState pushes onto an existing array', async () => {
    const ctx = makeCtx({ todos: ['a'] })
    await dispatchActions({ action: 'appendState', key: 'todos', value: 'b' }, ctx)
    expect(ctx.store.get('todos')).toEqual(['a', 'b'])
  })
})

describe('ForEach binds $item and $index', () => {
  it('renders index and item', () => {
    const node: ComponentNode = {
      type: 'ForEach', expression: '{{ items }}',
      children: [{ type: 'Text', content: '{{ $index }}:{{ $item }}' }],
    }
    const dom = renderNode(node, makeCtx({ items: ['x', 'y'] })) as unknown as DocumentFragment
    const host = document.createElement('div'); host.appendChild(dom)
    expect(host.textContent).toContain('0:x')
    expect(host.textContent).toContain('1:y')
  })
})

describe('semantic Table', () => {
  it('renders header + body cells', () => {
    const node: ComponentNode = {
      type: 'Table', children: [
        { type: 'TableHead', children: [{ type: 'TableRow', children: [
          { type: 'TableHeader', content: 'Name' }, { type: 'TableHeader', content: 'Role' },
        ]}]},
        { type: 'TableBody', children: [{ type: 'TableRow', children: [
          { type: 'TableCell', children: [{ type: 'Text', content: 'Ada' }] },
          { type: 'TableCell', children: [{ type: 'Text', content: 'Eng' }] },
        ]}]},
      ],
    }
    const dom = renderNode(node, makeCtx()) as HTMLElement
    expect(dom.querySelectorAll('th').length).toBe(2)
    expect(dom.querySelectorAll('td').length).toBe(2)
    expect(dom.textContent).toContain('Ada')
  })
})
