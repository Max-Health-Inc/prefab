/**
 * Renderer tests — Interactive components (Tabs, Accordion, Dialog, Tooltip, etc.)
 *
 * @happy-dom
 */

import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import type { ComponentNode } from '../src/renderer/engine'
import { registerAllComponents } from '../src/renderer/components/index'
import { makeRenderCtx, renderEl, query, queryAll, keydown } from './helpers/render'

beforeEach(() => { registerAllComponents() })

// ── Tabs ─────────────────────────────────────────────────────────────────────

describe('Tabs', () => {
  function makeTabs(): ComponentNode {
    return {
      type: 'Tabs',
      children: [
        { type: 'Tab', title: 'Tab 1', children: [{ type: 'Text', content: 'Content 1' }] },
        { type: 'Tab', title: 'Tab 2', children: [{ type: 'Text', content: 'Content 2' }] },
        { type: 'Tab', title: 'Tab 3', children: [{ type: 'Text', content: 'Content 3' }] },
      ],
    }
  }

  function mountTabs(): { tablist: HTMLElement; tabs: HTMLButtonElement[]; panels: HTMLElement[] } {
    const dom = renderEl(makeTabs(), makeRenderCtx())
    document.body.appendChild(dom)
    return {
      tablist: query(dom, '[role="tablist"]'),
      tabs: queryAll(dom, '[role="tab"]', HTMLButtonElement),
      panels: queryAll(dom, '[role="tabpanel"]'),
    }
  }

  function selected(tabs: HTMLElement[]): number[] {
    return tabs.flatMap((tab, i) => tab.getAttribute('aria-selected') === 'true' ? [i] : [])
  }

  afterEach(() => { document.body.replaceChildren() })

  it('renders tab bar with role=tablist', () => {
    const { tablist, tabs } = mountTabs()
    expect(tabs.every(tab => tab.parentElement === tablist)).toBe(true)
  })

  it('renders tab buttons with role=tab', () => {
    expect(mountTabs().tabs).toHaveLength(3)
  })

  it('first tab is selected by default', () => {
    const { tabs } = mountTabs()
    expect(selected(tabs)).toEqual([0])
    expect(tabs.map(tab => tab.tabIndex)).toEqual([0, -1, -1])
  })

  it('first panel is visible, others hidden', () => {
    const { panels } = mountTabs()
    expect(panels.map(p => p.style.display)).toEqual(['block', 'none', 'none'])
  })

  it('clicking second tab activates it', () => {
    const { tabs, panels } = mountTabs()
    tabs[1].click()
    expect(selected(tabs)).toEqual([1])
    expect(panels.map(p => p.style.display)).toEqual(['none', 'block', 'none'])
  })

  it('ArrowRight on the focused tab moves selection and focus to the next tab', () => {
    const { tabs, panels } = mountTabs()
    tabs[0].focus()
    keydown(tabs[0], 'ArrowRight')
    expect(selected(tabs)).toEqual([1])
    expect(tabs.map(tab => tab.tabIndex)).toEqual([-1, 0, -1])
    expect(document.activeElement).toBe(tabs[1])
    expect(panels.map(p => p.style.display)).toEqual(['none', 'block', 'none'])
  })

  it('ArrowRight wraps from last to first tab', () => {
    const { tabs } = mountTabs()
    tabs[2].click()
    keydown(tabs[2], 'ArrowRight')
    expect(selected(tabs)).toEqual([0])
  })

  it('ArrowLeft wraps to last tab', () => {
    const { tabs } = mountTabs()
    keydown(tabs[0], 'ArrowLeft')
    expect(selected(tabs)).toEqual([2])
    expect(document.activeElement).toBe(tabs[2])
  })

  it('Home key activates first tab', () => {
    const { tabs } = mountTabs()
    tabs[2].click()
    expect(selected(tabs)).toEqual([2])
    keydown(tabs[2], 'Home')
    expect(selected(tabs)).toEqual([0])
  })

  it('End key activates last tab', () => {
    const { tabs } = mountTabs()
    keydown(tabs[0], 'End')
    expect(selected(tabs)).toEqual([2])
  })

  it('ignores arrow keys that do not come from a tab', () => {
    const { tablist, tabs } = mountTabs()
    keydown(tablist, 'ArrowRight')
    expect(selected(tabs)).toEqual([0])
  })

  it('ignores unrelated keys on a tab', () => {
    const { tabs } = mountTabs()
    keydown(tabs[0], 'Enter')
    expect(selected(tabs)).toEqual([0])
  })

  it('panels have aria-labelledby pointing to tab button', () => {
    const { tabs, panels } = mountTabs()
    expect(panels.map(p => p.getAttribute('aria-labelledby'))).toEqual(tabs.map(t => t.id))
  })

  it('tab buttons have aria-controls pointing to panel', () => {
    const { tabs, panels } = mountTabs()
    expect(tabs.map(t => t.getAttribute('aria-controls'))).toEqual(panels.map(p => p.id))
  })
})

// ── Accordion ────────────────────────────────────────────────────────────────

describe('Accordion', () => {
  function makeAccordion(): ComponentNode {
    return {
      type: 'Accordion',
      children: [
        { type: 'AccordionItem', title: 'Section 1', children: [{ type: 'Text', content: 'Body 1' }] },
        { type: 'AccordionItem', title: 'Section 2', children: [{ type: 'Text', content: 'Body 2' }] },
      ],
    }
  }

  function renderAccordion(): { triggers: HTMLElement[]; contents: HTMLElement[] } {
    const dom = renderEl(makeAccordion(), makeRenderCtx())
    return {
      triggers: queryAll(dom, '.pf-accordion-trigger'),
      contents: queryAll(dom, '.pf-accordion-content'),
    }
  }

  it('renders accordion items collapsed by default', () => {
    const { contents } = renderAccordion()
    expect(contents.map(c => c.style.display)).toEqual(['none', 'none'])
  })

  it('trigger buttons have aria-expanded=false', () => {
    const { triggers } = renderAccordion()
    expect(triggers.map(t => t.getAttribute('aria-expanded'))).toEqual(['false', 'false'])
  })

  it('clicking trigger expands content', () => {
    const { triggers, contents } = renderAccordion()
    triggers[0].click()
    expect(contents.map(c => c.style.display)).toEqual(['block', 'none'])
    expect(triggers[0].getAttribute('aria-expanded')).toBe('true')
  })

  it('clicking again collapses content', () => {
    const { triggers, contents } = renderAccordion()
    triggers[0].click()
    triggers[0].click()
    expect(contents[0].style.display).toBe('none')
    expect(triggers[0].getAttribute('aria-expanded')).toBe('false')
  })

  it('trigger has aria-controls pointing to content', () => {
    const { triggers, contents } = renderAccordion()
    const controlsId = triggers[0].getAttribute('aria-controls')
    expect(controlsId).toBeTruthy()
    expect(contents[0].id).toBe(controlsId ?? '')
  })
})

// ── Dialog ───────────────────────────────────────────────────────────────────

describe('Dialog', () => {
  it('renders dialog element with aria-modal', () => {
    const node: ComponentNode = {
      type: 'Dialog',
      title: 'Confirm',
      children: [{ type: 'Text', content: 'Are you sure?' }],
    }
    const dialog = query(renderEl(node, makeRenderCtx()), 'dialog', HTMLDialogElement)
    expect(dialog.getAttribute('aria-modal')).toBe('true')
  })

  it('has aria-labelledby pointing to title', () => {
    const node: ComponentNode = {
      type: 'Dialog',
      title: 'My Dialog',
      children: [{ type: 'Text', content: 'Content' }],
    }
    const dom = renderEl(node, makeRenderCtx())
    const labelId = query(dom, 'dialog', HTMLDialogElement).getAttribute('aria-labelledby')
    expect(labelId).toBeTruthy()
    expect(query(dom, `#${labelId ?? ''}`).textContent).toBe('My Dialog')
  })

  it('renders trigger button that opens dialog', () => {
    const node: ComponentNode = {
      type: 'Dialog',
      title: 'Test',
      trigger: { type: 'Button', label: 'Open' },
      children: [{ type: 'Text', content: 'Inside' }],
    }
    const dom = renderEl(node, makeRenderCtx())
    document.body.appendChild(dom)
    const btn = query(dom, 'button', HTMLButtonElement)
    const dialog = query(dom, 'dialog', HTMLDialogElement)
    expect(btn.textContent).toBe('Open')
    expect(dialog.open).toBe(false)
    btn.click()
    expect(dialog.open).toBe(true)
    dom.remove()
  })
})

// ── Tooltip ──────────────────────────────────────────────────────────────────

describe('Tooltip', () => {
  it('renders trigger and hidden content', () => {
    const node: ComponentNode = {
      type: 'Tooltip',
      content: 'Tooltip text',
      children: [{ type: 'Button', label: 'Hover me' }],
    }
    const dom = renderEl(node, makeRenderCtx())
    const tip = query(dom, '[role="tooltip"]')
    expect(query(dom, 'button').textContent).toBe('Hover me')
    expect(tip.textContent).toBe('Tooltip text')
    expect(tip.style.display).toBe('none')
    expect(dom.getAttribute('aria-describedby')).toBe(tip.id)
    dom.dispatchEvent(new Event('mouseenter'))
    expect(tip.style.display).toBe('block')
    dom.dispatchEvent(new Event('mouseleave'))
    expect(tip.style.display).toBe('none')
  })
})

// ── Carousel ─────────────────────────────────────────────────────────────────

describe('Carousel', () => {
  it('renders carousel with navigation buttons', () => {
    const node: ComponentNode = {
      type: 'Carousel',
      children: [
        { type: 'Text', content: 'Slide 1' },
        { type: 'Text', content: 'Slide 2' },
        { type: 'Text', content: 'Slide 3' },
      ],
    }
    const dom = renderEl(node, makeRenderCtx())
    expect(dom.className).toContain('pf-carousel')
    expect(query(dom, '[aria-label="Previous slide"]', HTMLButtonElement)).toBeTruthy()
    expect(query(dom, '[aria-label="Next slide"]', HTMLButtonElement)).toBeTruthy()
  })
})

// ── ExpandableRow ────────────────────────────────────────────────────────────

describe('ExpandableRow', () => {
  function renderRow(): { summary: HTMLElement; detail: HTMLElement } {
    const node: ComponentNode = {
      type: 'ExpandableRow',
      summary: [{ type: 'Text', content: 'Row title' }],
      children: [{ type: 'Text', content: 'Detail content' }],
    }
    const dom = renderEl(node, makeRenderCtx())
    return {
      summary: query(dom, '.pf-expandable-row-summary'),
      detail: query(dom, '.pf-expandable-row-detail'),
    }
  }

  it('renders collapsed by default', () => {
    expect(renderRow().detail.style.display).toBe('none')
  })

  it('clicking summary expands detail', () => {
    const { summary, detail } = renderRow()
    summary.click()
    expect(detail.style.display).toBe('block')
  })

  it('clicking again collapses detail', () => {
    const { summary, detail } = renderRow()
    summary.click()
    summary.click()
    expect(detail.style.display).toBe('none')
  })
})
