/**
 * TDD R4 — Bug hunting for reactive cssClass and onClick on containers.
 *
 * Probes edge cases, regressions, and integration scenarios that could
 * break after the Issue #11 changes.
 *
 * @happy-dom
 */

import { describe, it, expect, beforeEach } from 'bun:test'
import { Component } from '../src/core/component'
import { rx } from '../src/rx/rx'
import { Column, Row, Div } from '../src/components/layout/index'
import { SetState, ToggleState } from '../src/actions/client'
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

// ── Edge case: Column cssClass + gap merge with Rx ──────────────────────────

describe('Column cssClass + gap merge with Rx', () => {
  it('merges gap class with reactive cssClass string', () => {
    const col = Column({ gap: 4, cssClass: rx('theme').then('dark', 'light'), children: [] })
    const json = col.toJSON()
    // cssClass should contain both the reactive expression and the gap class
    const css = json.cssClass as string
    expect(css).toContain('gap-4')
    expect(css).toContain('{{')
  })

  it('renderer evaluates merged reactive+gap cssClass', () => {
    const ctx = makeCtx({ theme: true })
    const node: ComponentNode = {
      type: 'Column',
      cssClass: "{{ theme ? 'dark' : 'light' }} gap-4",
    }
    const dom = renderNode(node, ctx) as HTMLElement
    // Should have pf-column (base) + dark (resolved) + gap-4 (literal)
    expect(dom.className).toContain('pf-column')
    expect(dom.className).toContain('dark gap-4')
  })

  it('Row merges gap class with reactive cssClass', () => {
    const r = Row({ gap: 2, cssClass: rx('mode'), children: [] })
    const json = r.toJSON()
    const css = json.cssClass as string
    expect(css).toContain('gap-2')
    expect(css).toContain('{{ mode }}')
  })
})

// ── Edge case: cssClass with empty/null values ──────────────────────────────

describe('cssClass edge cases', () => {
  it('empty string cssClass is preserved in JSON', () => {
    // Empty string is falsy — should it be omitted or preserved?
    const c = new Component('Badge', { cssClass: '' })
    const json = c.toJSON()
    // Empty string is set but cssClass != null check passes for ''
    // Actually '' is falsy but we now use != null check
    expect(json.cssClass).toBe('')
  })

  it('renderer handles cssClass resolving to empty string', () => {
    const ctx = makeCtx({ cls: '' })
    const node: ComponentNode = {
      type: 'Div',
      cssClass: '{{ cls }}',
    }
    const dom = renderNode(node, ctx) as HTMLElement
    // Should have pf-div but NOT append empty string
    expect(dom.className).toBe('pf-div')
  })

  it('renderer handles cssClass with only whitespace expression', () => {
    const ctx = makeCtx({ active: false })
    const node: ComponentNode = {
      type: 'Span',
      cssClass: "{{ active ? 'highlight' : '' }}",
    }
    const dom = renderNode(node, ctx) as HTMLElement
    // Expression resolves to '' — should not add empty class
    expect(dom.className).toBe('pf-span')
  })
})

// ── Regression: Button still works after onClick moved to common handler ────

describe('Button onClick regression', () => {
  it('Button onClick fires correctly (not doubled)', async () => {
    const ctx = makeCtx({ count: 0 })
    const node: ComponentNode = {
      type: 'Button',
      label: 'Click',
      onClick: { action: 'setState', key: 'count', value: '{{ count + 1 }}' },
    }
    const dom = renderNode(node, ctx) as HTMLButtonElement
    dom.click()
    await new Promise(r => queueMicrotask(r))
    // Should increment once, not twice (no double-dispatch)
    expect(ctx.store.get('count')).toBe(1)
  })

  it('Button does not get role="button" (already is a button)', () => {
    const ctx = makeCtx({})
    const node: ComponentNode = {
      type: 'Button',
      label: 'Test',
      onClick: { action: 'setState', key: 'x', value: 1 },
    }
    const dom = renderNode(node, ctx) as HTMLElement
    expect(dom.tagName).toBe('BUTTON')
    expect(dom.getAttribute('role')).toBeNull()
  })

  it('disabled Button has no onClick handler issue', () => {
    const ctx = makeCtx({ count: 0 })
    const node: ComponentNode = {
      type: 'Button',
      label: 'Disabled',
      disabled: true,
      onClick: { action: 'setState', key: 'count', value: 99 },
    }
    const dom = renderNode(node, ctx) as HTMLButtonElement
    expect(dom.disabled).toBe(true)
    // Browsers prevent click on disabled buttons, so count stays 0
  })

  it('submit Button works within Form', () => {
    const ctx = makeCtx({ submitted: false })
    const node: ComponentNode = {
      type: 'Form',
      onSubmit: { action: 'toggleState', key: 'submitted' },
      children: [
        {
          type: 'Button',
          label: 'Submit',
          submit: true,
        },
      ],
    }
    const form = renderNode(node, ctx) as HTMLFormElement
    expect(form.tagName).toBe('FORM')
    const btn = form.querySelector('button') as HTMLButtonElement
    expect(btn.type).toBe('submit')
  })
})

// ── ChoiceCard regression ────────────────────────────────────────────────────

describe('ChoiceCard onClick regression', () => {
  it('ChoiceCard dispatches onClick via common handler', async () => {
    const ctx = makeCtx({ choice: '' })
    const node: ComponentNode = {
      type: 'ChoiceCard',
      label: 'Option A',
      onClick: { action: 'setState', key: 'choice', value: 'A' },
    }
    const dom = renderNode(node, ctx) as HTMLElement
    dom.click()
    await new Promise(r => queueMicrotask(r))
    expect(ctx.store.get('choice')).toBe('A')
  })

  it('ChoiceCard gets role="button" and tabindex', () => {
    const ctx = makeCtx({})
    const node: ComponentNode = {
      type: 'ChoiceCard',
      label: 'Option B',
      onClick: { action: 'setState', key: 'choice', value: 'B' },
    }
    const dom = renderNode(node, ctx) as HTMLElement
    expect(dom.getAttribute('role')).toBe('button')
    expect(dom.getAttribute('tabindex')).toBe('0')
  })
})

// ── onClick + onMount coexistence ────────────────────────────────────────────

describe('onClick + onMount coexistence', () => {
  it('element with both onClick and onMount wires both correctly', async () => {
    const ctx = makeCtx({ clicked: false, mounted: false })
    const node: ComponentNode = {
      type: 'Div',
      onClick: { action: 'toggleState', key: 'clicked' },
      onMount: { action: 'toggleState', key: 'mounted' },
    }
    const dom = renderNode(node, ctx) as HTMLElement

    // onMount fires via queueMicrotask
    await new Promise(r => queueMicrotask(r))
    expect(ctx.store.get('mounted')).toBe(true)
    expect(ctx.store.get('clicked')).toBe(false) // not clicked yet

    dom.click()
    await new Promise(r => queueMicrotask(r))
    expect(ctx.store.get('clicked')).toBe(true)
  })
})

// ── onClick + cssClass combined ──────────────────────────────────────────────

describe('onClick + reactive cssClass combined', () => {
  it('clickable Div with reactive cssClass works', async () => {
    const ctx = makeCtx({ selected: false })
    const node: ComponentNode = {
      type: 'Div',
      cssClass: "{{ selected ? 'sq-selected' : 'sq-normal' }}",
      onClick: { action: 'toggleState', key: 'selected' },
    }
    const dom = renderNode(node, ctx) as HTMLElement
    expect(dom.className).toContain('sq-normal')
    expect(dom.getAttribute('role')).toBe('button')

    dom.click()
    await new Promise(r => queueMicrotask(r))
    expect(ctx.store.get('selected')).toBe(true)
    // Note: DOM won't re-render reactively in this unit test (needs rerender cycle)
  })
})

// ── DSL serialization: onClick on Component base class ──────────────────────

describe('Component.toJSON() serializes onClick', () => {
  it('single action', () => {
    const c = new Component('Badge', { onClick: new SetState('x', 1) })
    expect(c.toJSON().onClick).toEqual({ action: 'setState', key: 'x', value: 1 })
  })

  it('action array', () => {
    const c = new Component('Badge', {
      onClick: [new SetState('x', 1), new ToggleState('y')],
    })
    expect(c.toJSON().onClick).toEqual([
      { action: 'setState', key: 'x', value: 1 },
      { action: 'toggleState', key: 'y' },
    ])
  })

  it('omitted when undefined', () => {
    const c = new Component('Badge', {})
    expect(c.toJSON().onClick).toBeUndefined()
  })

  it('onClick + onMount both serialize', () => {
    const c = new Component('Badge', {
      onClick: new SetState('x', 1),
      onMount: new SetState('y', 2),
    })
    const json = c.toJSON()
    expect(json.onClick).toEqual({ action: 'setState', key: 'x', value: 1 })
    expect(json.onMount).toEqual({ action: 'setState', key: 'y', value: 2 })
  })
})

// ── Wire format round-trip ──────────────────────────────────────────────────

describe('Wire format: onClick + cssClass round-trip', () => {
  it('Div with reactive cssClass and onClick produces valid wire JSON', () => {
    const d = Div({
      cssClass: rx('selected').then('active', 'inactive'),
      onClick: new SetState('selected', true),
    })
    const json = d.toJSON()
    expect(json).toEqual({
      type: 'Div',
      cssClass: "{{ selected ? 'active' : 'inactive' }}",
      onClick: { action: 'setState', key: 'selected', value: true },
    })
  })

  it('Column with all features produces valid wire JSON', () => {
    const col = Column({
      gap: 4,
      cssClass: rx('expanded').then('full', 'compact'),
      onClick: new ToggleState('expanded'),
      children: [],
    })
    const json = col.toJSON()
    expect(json.type).toBe('Column')
    expect(json.onClick).toEqual({ action: 'toggleState', key: 'expanded' })
    expect((json.cssClass as string)).toContain('gap-4')
    expect((json.cssClass as string)).toContain('{{')
  })
})
