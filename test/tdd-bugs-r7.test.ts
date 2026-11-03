/**
 * TDD R7 — fix overlay triggers and Slot injection.
 *
 *  1. Popover/HoverCard rendered all children into hidden content with no
 *     visible trigger, so nothing was clickable/hoverable until (somehow)
 *     shown. They now accept a `trigger` component (like Dialog).
 *  2. Use never populated ctx.slots, so a Slot inside a Define template could
 *     only ever show its fallback — injected content was dropped.
 *
 * @happy-dom
 */

import { describe, it, expect, beforeEach } from 'bun:test'
import type { ComponentNode } from '../src/renderer/engine'
import { registerAllComponents } from '../src/renderer/components/index'
import { makeRenderCtx, renderEl, query } from './helpers/render'

beforeEach(() => { registerAllComponents() })

describe('Popover trigger', () => {
  it('shows a visible trigger and toggles content on click', () => {
    const node: ComponentNode = {
      type: 'Popover',
      trigger: { type: 'Button', label: 'Open' },
      children: [{ type: 'Text', content: 'popover body' }],
    }
    const dom = renderEl(node, makeRenderCtx())
    const trigger = query(dom, '.pf-button', HTMLButtonElement)
    const content = query(dom, '.pf-popover-content')
    expect(trigger.textContent).toContain('Open')
    expect(content.style.display).toBe('none')
    expect(content.textContent).toContain('popover body')
    trigger.click()
    expect(content.style.display).toBe('block')
  })
})

describe('HoverCard trigger', () => {
  it('shows a visible trigger and reveals content on hover', () => {
    const node: ComponentNode = {
      type: 'HoverCard',
      trigger: { type: 'Button', label: 'Hover me' },
      children: [{ type: 'Text', content: 'card body' }],
    }
    const dom = renderEl(node, makeRenderCtx())
    const trigger = query(dom, '.pf-button', HTMLButtonElement)
    const content = query(dom, '.pf-hover-card-content')
    expect(trigger.textContent).toContain('Hover me')
    expect(content.style.display).toBe('none')
    dom.dispatchEvent(new Event('mouseenter'))
    expect(content.style.display).toBe('block')
    dom.dispatchEvent(new Event('mouseleave'))
    expect(content.style.display).toBe('none')
  })
})

describe('Slot injection via Use', () => {
  it('injects Use children into the default Slot of a Define template', () => {
    const view: ComponentNode = {
      type: 'Column',
      children: [
        { type: 'Define', name: 'panel', children: [
          { type: 'Card', children: [{ type: 'CardContent', children: [{ type: 'Slot' }] }] },
        ]},
        { type: 'Use', def: 'panel', children: [{ type: 'Text', content: 'injected content' }] },
      ],
    }
    const dom = renderEl(view, makeRenderCtx())
    expect(dom.textContent).toContain('injected content')
  })

  it('falls back to the Slot fallback when Use provides no content', () => {
    const view: ComponentNode = {
      type: 'Column',
      children: [
        { type: 'Define', name: 'panel', children: [
          { type: 'Slot', children: [{ type: 'Text', content: 'fallback content' }] },
        ]},
        { type: 'Use', def: 'panel' },
      ],
    }
    const dom = renderEl(view, makeRenderCtx())
    expect(dom.textContent).toContain('fallback content')
  })
})
