/**
 * TDD bug-surfacing tests — edge cases and subtle bugs across the renderer.
 *
 * Each test is written to expose a suspected bug. Tests are expected to FAIL
 * initially, then the corresponding source code is fixed to make them pass.
 * @happy-dom
 */

import { describe, it, expect, beforeEach } from 'bun:test'
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

// ── Bug: Row wrap=false still enables flex-wrap ──────────────────────────────
// Row checks `if (node.wrap != null)` — true for both true and false values

describe('Row wrap prop', () => {
  it('enables flex-wrap when wrap is true', () => {
    const ctx = makeCtx()
    const dom = renderNode({ type: 'Row', wrap: true } as ComponentNode, ctx) as HTMLElement
    expect(dom.style.flexWrap).toBe('wrap')
  })

  it('does NOT enable flex-wrap when wrap is false', () => {
    const ctx = makeCtx()
    const dom = renderNode({ type: 'Row', wrap: false } as ComponentNode, ctx) as HTMLElement
    expect(dom.style.flexWrap).not.toBe('wrap')
  })

  it('does NOT enable flex-wrap when wrap is omitted', () => {
    const ctx = makeCtx()
    const dom = renderNode({ type: 'Row' } as ComponentNode, ctx) as HTMLElement
    expect(dom.style.flexWrap).not.toBe('wrap')
  })
})

// ── Bug: Progress with negative value produces negative width ────────────────

describe('Progress edge cases', () => {
  it('clamps negative value to 0%', () => {
    const ctx = makeCtx()
    const dom = renderNode({ type: 'Progress', value: -20, max: 100 } as ComponentNode, ctx) as HTMLElement
    const fill = dom.querySelector('.pf-progress-fill') as HTMLElement
    const width = parseFloat(fill.style.width)
    expect(width).toBeGreaterThanOrEqual(0)
  })

  it('caps at 100% for value exceeding max', () => {
    const ctx = makeCtx()
    const dom = renderNode({ type: 'Progress', value: 150, max: 100 } as ComponentNode, ctx) as HTMLElement
    const fill = dom.querySelector('.pf-progress-fill') as HTMLElement
    expect(fill.style.width).toBe('100%')
  })

  it('handles zero max without division by zero', () => {
    const ctx = makeCtx()
    const dom = renderNode({ type: 'Progress', value: 50, max: 0 } as ComponentNode, ctx) as HTMLElement
    const fill = dom.querySelector('.pf-progress-fill') as HTMLElement
    const width = parseFloat(fill.style.width)
    // Should not be NaN or Infinity
    expect(Number.isFinite(width)).toBe(true)
  })

  it('sets correct aria-valuenow and aria-valuemax', () => {
    const ctx = makeCtx()
    const dom = renderNode({ type: 'Progress', value: 60, max: 200 } as ComponentNode, ctx) as HTMLElement
    expect(dom.getAttribute('aria-valuenow')).toBe('60')
    expect(dom.getAttribute('aria-valuemax')).toBe('200')
  })
})

// ── Bug: Accordion open state not tracked via aria ───────────────────────────

describe('Accordion', () => {
  it('starts collapsed (aria-expanded=false)', () => {
    const ctx = makeCtx()
    const dom = renderNode({
      type: 'Accordion',
      children: [{ type: 'AccordionItem', title: 'Section 1', children: [{ type: 'Text', content: 'Body' }] }],
    } as ComponentNode, ctx) as HTMLElement
    const trigger = dom.querySelector('.pf-accordion-trigger') as HTMLButtonElement
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
  })

  it('toggles aria-expanded on click', () => {
    const ctx = makeCtx()
    const dom = renderNode({
      type: 'Accordion',
      children: [{ type: 'AccordionItem', title: 'Section 1', children: [{ type: 'Text', content: 'Body' }] }],
    } as ComponentNode, ctx) as HTMLElement
    const trigger = dom.querySelector('.pf-accordion-trigger') as HTMLButtonElement
    const content = dom.querySelector('.pf-accordion-content') as HTMLElement

    trigger.click()
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(content.style.display).toBe('block')

    trigger.click()
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(content.style.display).toBe('none')
  })
})

// ── Bug: Store.toggle inverts incorrectly ────────────────────────────────────
// toggle() sets `falsy` (is-the-current-value-falsy) as the new value.
// But for `0`, toggle should go to `true`, not `0` → true → false.

describe('Store.toggle edge cases', () => {
  it('toggles true → false', () => {
    const store = new Store({ flag: true })
    store.toggle('flag')
    expect(store.get('flag')).toBe(false)
  })

  it('toggles false → true', () => {
    const store = new Store({ flag: false })
    store.toggle('flag')
    expect(store.get('flag')).toBe(true)
  })

  it('toggles undefined → true (initializes)', () => {
    const store = new Store({})
    store.toggle('flag')
    expect(store.get('flag')).toBe(true)
  })

  it('toggles 0 → true (treats 0 as falsy)', () => {
    const store = new Store({ count: 0 })
    store.toggle('count')
    expect(store.get('count')).toBe(true)
  })

  it('toggles empty string → true', () => {
    const store = new Store({ name: '' })
    store.toggle('name')
    expect(store.get('name')).toBe(true)
  })
})

// ── Bug: Store.pop with out-of-bounds index ──────────────────────────────────

describe('Store.pop edge cases', () => {
  it('handles out-of-bounds index gracefully', () => {
    const store = new Store({ items: ['a', 'b', 'c'] })
    store.pop('items', 99)
    expect(store.get('items')).toEqual(['a', 'b', 'c']) // unchanged
  })

  it('handles negative index', () => {
    const store = new Store({ items: ['a', 'b', 'c'] })
    store.pop('items', -1)
    // splice(-1, 1) removes last element
    expect(store.get('items')).toEqual(['a', 'b'])
  })

  it('pop on non-array does nothing', () => {
    const store = new Store({ count: 42 })
    store.pop('count', 0)
    expect(store.get('count')).toBe(42) // unchanged
  })

  it('pop by string value removes matching element', () => {
    const store = new Store({ tags: ['red', 'green', 'blue'] })
    store.pop('tags', 'green')
    expect(store.get('tags')).toEqual(['red', 'blue'])
  })

  it('pop by non-existent string value does nothing', () => {
    const store = new Store({ tags: ['red', 'green'] })
    store.pop('tags', 'yellow')
    expect(store.get('tags')).toEqual(['red', 'green'])
  })
})

// ── Bug: cssClass applied to elements with existing className ────────────────
// Engine appends cssClass to existing className. If cssClass contains Rx,
// it should resolve the expression before applying.

describe('cssClass rendering', () => {
  it('appends cssClass to existing component class', () => {
    const ctx = makeCtx()
    const dom = renderNode({ type: 'Button', label: 'Go', cssClass: 'my-btn' } as ComponentNode, ctx) as HTMLElement
    expect(dom.className).toContain('pf-button')
    expect(dom.className).toContain('my-btn')
  })

  it('resolves Rx expression in cssClass', () => {
    const ctx = makeCtx({ theme: 'dark' })
    const dom = renderNode({ type: 'Button', label: 'Go', cssClass: '{{ theme }}-mode' } as ComponentNode, ctx) as HTMLElement
    expect(dom.className).toContain('dark-mode')
  })
})

// ── Bug: Heading level 0 and 7 (boundary) ───────────────────────────────────

describe('Heading edge cases', () => {
  it('clamps level 0 to h1', () => {
    const ctx = makeCtx()
    const dom = renderNode({ type: 'Heading', content: 'Title', level: 0 } as ComponentNode, ctx) as HTMLElement
    expect(dom.tagName).toBe('H1')
  })

  it('clamps level 7 to h6', () => {
    const ctx = makeCtx()
    const dom = renderNode({ type: 'Heading', content: 'Title', level: 7 } as ComponentNode, ctx) as HTMLElement
    expect(dom.tagName).toBe('H6')
  })
})

// ── Bug: Grid columns default ────────────────────────────────────────────────

describe('Grid rendering', () => {
  it('defaults to 3 columns', () => {
    const ctx = makeCtx()
    const dom = renderNode({ type: 'Grid' } as ComponentNode, ctx) as HTMLElement
    expect(dom.style.gridTemplateColumns).toBe('repeat(3, 1fr)')
  })

  it('respects custom column count', () => {
    const ctx = makeCtx()
    const dom = renderNode({ type: 'Grid', columns: 4 } as ComponentNode, ctx) as HTMLElement
    expect(dom.style.gridTemplateColumns).toBe('repeat(4, 1fr)')
  })

  it('applies gap from gap prop', () => {
    const ctx = makeCtx()
    const dom = renderNode({ type: 'Grid', gap: 4 } as ComponentNode, ctx) as HTMLElement
    // gap is multiplied by 4px
    expect(dom.style.gap).toBe('16px')
  })
})

// ── Bug: Badge with missing label/content ────────────────────────────────────

describe('Badge rendering', () => {
  it('renders label text', () => {
    const ctx = makeCtx()
    const dom = renderNode({ type: 'Badge', label: 'New' } as ComponentNode, ctx) as HTMLElement
    expect(dom.textContent).toBe('New')
    expect(dom.getAttribute('data-variant')).toBe('default')
  })

  it('falls back to content when label is missing', () => {
    const ctx = makeCtx()
    const dom = renderNode({ type: 'Badge', content: 'Beta' } as ComponentNode, ctx) as HTMLElement
    expect(dom.textContent).toBe('Beta')
  })

  it('renders empty when both label and content are missing', () => {
    const ctx = makeCtx()
    const dom = renderNode({ type: 'Badge' } as ComponentNode, ctx) as HTMLElement
    expect(dom.textContent).toBe('')
  })
})

// ── Bug: DataTable search filter ─────────────────────────────────────────────

describe('DataTable search', () => {
  function makeTable(): ComponentNode {
    return {
      type: 'DataTable',
      search: true,
      columns: [{ key: 'name', header: 'Name' }],
      rows: [
        { name: 'Alice' },
        { name: 'Bob' },
        { name: 'Charlie' },
      ],
    } as ComponentNode
  }

  it('renders search input when search=true', () => {
    const ctx = makeCtx()
    const dom = renderNode(makeTable(), ctx) as HTMLElement
    expect(dom.querySelector('.pf-datatable-search')).toBeTruthy()
  })

  it('does not render search input when search is omitted', () => {
    const ctx = makeCtx()
    const dom = renderNode({
      type: 'DataTable',
      columns: [{ key: 'name' }],
      rows: [{ name: 'Alice' }],
    } as ComponentNode, ctx) as HTMLElement
    expect(dom.querySelector('.pf-datatable-search')).toBeNull()
  })

  it('filters rows based on search input', () => {
    const ctx = makeCtx()
    const dom = renderNode(makeTable(), ctx) as HTMLElement
    const searchInput = dom.querySelector('.pf-datatable-search') as HTMLInputElement
    const tbody = dom.querySelector('tbody')!

    searchInput.value = 'bob'
    searchInput.dispatchEvent(new Event('input', { bubbles: true }))

    const rows = Array.from(tbody.querySelectorAll('tr'))
    const visible = rows.filter(r => (r as HTMLElement).style.display !== 'none')
    expect(visible.length).toBe(1)
    expect(visible[0].textContent).toContain('Bob')
  })
})

// ── Bug: Link with unsafe href ───────────────────────────────────────────────

describe('Link security', () => {
  it('blocks javascript: URLs', () => {
    const ctx = makeCtx()
    const dom = renderNode({ type: 'Link', content: 'Click', href: 'javascript:alert(1)' } as ComponentNode, ctx) as HTMLAnchorElement
    expect(dom.href).toBe('')
  })

  it('allows https: URLs', () => {
    const ctx = makeCtx()
    const dom = renderNode({ type: 'Link', content: 'Click', href: 'https://example.com' } as ComponentNode, ctx) as HTMLAnchorElement
    expect(dom.href).toContain('https://example.com')
  })

  it('blocks data: URLs', () => {
    const ctx = makeCtx()
    const dom = renderNode({ type: 'Link', content: 'Click', href: 'data:text/html,<script>alert(1)</script>' } as ComponentNode, ctx) as HTMLAnchorElement
    expect(dom.href).toBe('')
  })
})

// ── Bug: Prototype pollution via state path ──────────────────────────────────

describe('Store security', () => {
  it('blocks __proto__ path traversal', () => {
    const store = new Store({})
    store.set('__proto__.polluted', 'yes')
    expect(({} as Record<string, unknown>).polluted).toBeUndefined()
  })

  it('blocks constructor.prototype path', () => {
    const store = new Store({})
    store.set('constructor.prototype.polluted', 'yes')
    expect(({} as Record<string, unknown>).polluted).toBeUndefined()
  })
})

// ── Bug: onMount fires asynchronously ────────────────────────────────────────

describe('onMount action', () => {
  it('fires setState action on mount via microtask', async () => {
    const ctx = makeCtx({ loaded: false })
    renderNode({
      type: 'Text', content: 'Hello',
      onMount: { action: 'setState', key: 'loaded', value: true },
    } as ComponentNode, ctx)
    // onMount uses queueMicrotask — await it
    await new Promise(r => queueMicrotask(r))
    expect(ctx.store.get('loaded')).toBe(true)
  })
})

// ── Bug: Unknown component type fallback ─────────────────────────────────────

describe('Unknown component fallback', () => {
  it('renders generic div with data-prefab-type', () => {
    const ctx = makeCtx()
    const dom = renderNode({ type: 'SuperCustomWidget', id: 'w1' } as ComponentNode, ctx) as HTMLElement
    expect(dom.tagName).toBe('DIV')
    expect(dom.getAttribute('data-prefab-type')).toBe('SuperCustomWidget')
  })

  it('renders children of unknown component', () => {
    const ctx = makeCtx()
    const dom = renderNode({
      type: 'CustomContainer',
      children: [{ type: 'Text', content: 'Inside' }],
    } as ComponentNode, ctx) as HTMLElement
    expect(dom.textContent).toContain('Inside')
  })
})

// ── Bug: Container maxWidth and padding ──────────────────────────────────────

describe('Container rendering', () => {
  it('defaults maxWidth to 1200px', () => {
    const ctx = makeCtx()
    const dom = renderNode({ type: 'Container' } as ComponentNode, ctx) as HTMLElement
    expect(dom.style.maxWidth).toBe('1200px')
  })

  it('applies custom maxWidth', () => {
    const ctx = makeCtx()
    const dom = renderNode({ type: 'Container', maxWidth: '800px' } as ComponentNode, ctx) as HTMLElement
    expect(dom.style.maxWidth).toBe('800px')
  })

  it('applies padding multiplied by 4', () => {
    const ctx = makeCtx()
    const dom = renderNode({ type: 'Container', padding: 6 } as ComponentNode, ctx) as HTMLElement
    expect(dom.style.padding).toBe('24px')
  })
})

// ── Bug: GridItem colSpan/rowSpan ────────────────────────────────────────────

describe('GridItem rendering', () => {
  it('applies colSpan as grid-column span', () => {
    const ctx = makeCtx()
    const dom = renderNode({ type: 'GridItem', colSpan: 2 } as ComponentNode, ctx) as HTMLElement
    expect(dom.style.gridColumn).toBe('span 2')
  })

  it('applies rowSpan as grid-row span', () => {
    const ctx = makeCtx()
    const dom = renderNode({ type: 'GridItem', rowSpan: 3 } as ComponentNode, ctx) as HTMLElement
    expect(dom.style.gridRow).toBe('span 3')
  })
})
