/**
 * TDD tests for Issue #11 — Reactive props and interactive containers.
 *
 * Tests:
 * 1. cssClass accepts RxStr (reactive expressions) in the DSL
 * 2. onClick on container components (Div, Span, Column, Row, Grid, etc.)
 * 3. Renderer evaluates reactive cssClass
 * 4. Renderer wires onClick on non-button elements with accessibility
 *
 * @happy-dom
 */

import { describe, it, expect, beforeEach } from 'bun:test'
import { Component } from '../src/core/component'
import { rx } from '../src/rx/rx'
import { Column, Row, Div, Span, Grid, Container } from '../src/components/layout/index'
import { SetState, ToggleState, ShowToast } from '../src/actions/client'
import { Store } from '../src/renderer/state'
import { renderNode } from '../src/renderer/engine'
import type { ComponentNode, RenderContext } from '../src/renderer/engine'
import { registerAllComponents } from '../src/renderer/components/index'
import { createNoopTransport } from '../src/renderer/transport'

beforeEach(() => { registerAllComponents() })

function makeCtx(state?: Record<string, unknown>): RenderContext & { rerendered: number } {
  const ctx = {
    store: new Store(state),
    scope: {},
    transport: createNoopTransport(),
    rerender: () => { ctx.rerendered++ },
    rerendered: 0,
  }
  return ctx
}

// ── DSL: cssClass accepts RxStr ──────────────────────────────────────────────

describe('cssClass accepts RxStr in DSL', () => {
  it('Component accepts rx() for cssClass', () => {
    const c = new Component('Badge', { cssClass: rx('color').then('bg-green', 'bg-red') })
    const json = c.toJSON()
    expect(json.cssClass).toBe("{{ color ? 'bg-green' : 'bg-red' }}")
  })

  it('Component still accepts plain string cssClass', () => {
    const c = new Component('Badge', { cssClass: 'my-class' })
    expect(c.toJSON().cssClass).toBe('my-class')
  })

  it('Column accepts rx() for cssClass', () => {
    const col = Column({ cssClass: rx('active').then('highlighted', ''), children: [] })
    const json = col.toJSON()
    expect(json.cssClass).toContain('{{ active')
  })

  it('Div accepts rx() for cssClass', () => {
    const d = Div({ cssClass: rx('selected').then('sq-selected', 'sq-normal') })
    const json = d.toJSON()
    expect(json.cssClass).toBe("{{ selected ? 'sq-selected' : 'sq-normal' }}")
  })

  it('Row accepts rx() for cssClass', () => {
    const r = Row({ cssClass: rx('expanded').then('row-full', 'row-compact'), children: [] })
    const json = r.toJSON()
    expect(json.cssClass).toContain('{{ expanded')
  })
})

// ── DSL: onClick on containers ───────────────────────────────────────────────

describe('onClick on container components (DSL)', () => {
  it('Div serializes onClick action', () => {
    const d = Div({ onClick: new SetState('selected', 'e4') })
    const json = d.toJSON()
    expect(json.onClick).toEqual({ action: 'setState', key: 'selected', value: 'e4' })
  })

  it('Column serializes onClick action array', () => {
    const col = Column({
      onClick: [new SetState('count', 1), new ShowToast('Clicked!')],
      children: [],
    })
    const json = col.toJSON()
    expect(json.onClick).toEqual([
      { action: 'setState', key: 'count', value: 1 },
      { action: 'showToast', message: 'Clicked!' },
    ])
  })

  it('Span serializes onClick', () => {
    const s = Span({ onClick: new ToggleState('open') })
    expect(s.toJSON().onClick).toEqual({ action: 'toggleState', key: 'open' })
  })

  it('Row serializes onClick', () => {
    const r = Row({ onClick: new SetState('row', 'clicked'), children: [] })
    expect(r.toJSON().onClick).toEqual({ action: 'setState', key: 'row', value: 'clicked' })
  })

  it('Grid serializes onClick', () => {
    const g = Grid({ onClick: new SetState('cell', 'a1'), columns: 8, children: [] })
    expect(g.toJSON().onClick).toEqual({ action: 'setState', key: 'cell', value: 'a1' })
  })

  it('Container serializes onClick', () => {
    const c = Container({ onClick: new SetState('active', true) })
    expect(c.toJSON().onClick).toEqual({ action: 'setState', key: 'active', value: true })
  })

  it('omits onClick when not set', () => {
    const d = Div({})
    expect(d.toJSON().onClick).toBeUndefined()
  })
})

// ── Renderer: reactive cssClass ──────────────────────────────────────────────

describe('Renderer: reactive cssClass evaluation', () => {
  it('evaluates reactive expression in cssClass', () => {
    const ctx = makeCtx({ theme: 'dark' })
    const node: ComponentNode = {
      type: 'Div',
      cssClass: '{{ theme }}',
    }
    const dom = renderNode(node, ctx) as HTMLElement
    expect(dom.className).toContain('dark')
  })

  it('evaluates ternary in cssClass', () => {
    const ctx = makeCtx({ active: true })
    const node: ComponentNode = {
      type: 'Div',
      cssClass: '{{ active ? "bg-green" : "bg-red" }}',
    }
    const dom = renderNode(node, ctx) as HTMLElement
    expect(dom.className).toContain('bg-green')
  })

  it('evaluates ternary as false in cssClass', () => {
    const ctx = makeCtx({ active: false })
    const node: ComponentNode = {
      type: 'Div',
      cssClass: '{{ active ? "bg-green" : "bg-red" }}',
    }
    const dom = renderNode(node, ctx) as HTMLElement
    expect(dom.className).toContain('bg-red')
  })

  it('preserves base class + reactive class', () => {
    const ctx = makeCtx({ highlight: 'yellow' })
    const node: ComponentNode = {
      type: 'Column',
      cssClass: '{{ highlight }}',
    }
    const dom = renderNode(node, ctx) as HTMLElement
    // Column has pf-column base class
    expect(dom.className).toContain('pf-column')
    expect(dom.className).toContain('yellow')
  })
})

// ── Renderer: onClick on containers ──────────────────────────────────────────

describe('Renderer: onClick on container elements', () => {
  it('Div dispatches setState on click', async () => {
    const ctx = makeCtx({ selected: '' })
    const node: ComponentNode = {
      type: 'Div',
      onClick: { action: 'setState', key: 'selected', value: 'e4' },
    }
    const dom = renderNode(node, ctx) as HTMLElement
    dom.click()
    await new Promise(r => queueMicrotask(r))
    expect(ctx.store.get('selected')).toBe('e4')
  })

  it('Column dispatches action on click', async () => {
    const ctx = makeCtx({ clicked: false })
    const node: ComponentNode = {
      type: 'Column',
      onClick: { action: 'toggleState', key: 'clicked' },
    }
    const dom = renderNode(node, ctx) as HTMLElement
    dom.click()
    await new Promise(r => queueMicrotask(r))
    expect(ctx.store.get('clicked')).toBe(true)
  })

  it('Span dispatches action on click', async () => {
    const ctx = makeCtx({ count: 0 })
    const node: ComponentNode = {
      type: 'Span',
      onClick: { action: 'setState', key: 'count', value: 42 },
    }
    const dom = renderNode(node, ctx) as HTMLElement
    dom.click()
    await new Promise(r => queueMicrotask(r))
    expect(ctx.store.get('count')).toBe(42)
  })

  it('Row dispatches action array on click', async () => {
    const ctx = makeCtx({ a: 0, b: false })
    const node: ComponentNode = {
      type: 'Row',
      onClick: [
        { action: 'setState', key: 'a', value: 1 },
        { action: 'toggleState', key: 'b' },
      ],
    }
    const dom = renderNode(node, ctx) as HTMLElement
    dom.click()
    await new Promise(r => queueMicrotask(r))
    expect(ctx.store.get('a')).toBe(1)
    expect(ctx.store.get('b')).toBe(true)
  })

  it('Button still dispatches onClick (no regression)', async () => {
    const ctx = makeCtx({ count: 0 })
    const node: ComponentNode = {
      type: 'Button',
      label: 'Click',
      onClick: { action: 'setState', key: 'count', value: 99 },
    }
    const dom = renderNode(node, ctx) as HTMLButtonElement
    dom.click()
    await new Promise(r => queueMicrotask(r))
    expect(ctx.store.get('count')).toBe(99)
  })
})

// ── Accessibility: role and keyboard on clickable containers ─────────────────

describe('Accessibility for clickable containers', () => {
  it('adds role="button" to clickable Div', () => {
    const ctx = makeCtx({})
    const node: ComponentNode = {
      type: 'Div',
      onClick: { action: 'setState', key: 'x', value: 1 },
    }
    const dom = renderNode(node, ctx) as HTMLElement
    expect(dom.getAttribute('role')).toBe('button')
    expect(dom.getAttribute('tabindex')).toBe('0')
  })

  it('does NOT add role="button" to Button', () => {
    const ctx = makeCtx({})
    const node: ComponentNode = {
      type: 'Button',
      label: 'Click',
      onClick: { action: 'setState', key: 'x', value: 1 },
    }
    const dom = renderNode(node, ctx) as HTMLElement
    // Button is natively focusable, no role override needed
    expect(dom.getAttribute('role')).toBeNull()
  })

  it('dispatches action on Enter key', async () => {
    const ctx = makeCtx({ pressed: false })
    const node: ComponentNode = {
      type: 'Div',
      onClick: { action: 'toggleState', key: 'pressed' },
    }
    const dom = renderNode(node, ctx) as HTMLElement
    const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    dom.dispatchEvent(event)
    await new Promise(r => queueMicrotask(r))
    expect(ctx.store.get('pressed')).toBe(true)
  })

  it('dispatches action on Space key', async () => {
    const ctx = makeCtx({ pressed: false })
    const node: ComponentNode = {
      type: 'Span',
      onClick: { action: 'toggleState', key: 'pressed' },
    }
    const dom = renderNode(node, ctx) as HTMLElement
    const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true })
    dom.dispatchEvent(event)
    await new Promise(r => queueMicrotask(r))
    expect(ctx.store.get('pressed')).toBe(true)
  })

  it('does NOT add role/tabindex when no onClick', () => {
    const ctx = makeCtx({})
    const node: ComponentNode = { type: 'Div' }
    const dom = renderNode(node, ctx) as HTMLElement
    expect(dom.getAttribute('role')).toBeNull()
    expect(dom.getAttribute('tabindex')).toBeNull()
  })
})
