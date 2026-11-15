import { describe, it, expect } from 'bun:test'
import { PrefabRenderer } from '../src/renderer/index'
import { registerAllComponents } from '../src/renderer/components/index'
import { makeRenderCtx, renderEl, query, queryAll } from './helpers/render'

registerAllComponents()

describe('mount root carries the base theme class', () => {
  it('adds pf-app-root to the container, so raw wire payloads get fonts and colors', () => {
    const root = document.createElement('div')
    const app = PrefabRenderer.mount(root, { $prefab: { version: '0.3' }, view: { type: 'Text', content: 'hi' } }, { themeToggle: false })
    expect(root.classList.contains('pf-app-root')).toBe(true)
    app.destroy()
  })
})

describe('presentation lives in prefab.css', () => {
  const styled = [
    { type: 'Button', label: 'Go', variant: 'outline' },
    { type: 'Separator' },
    { type: 'Badge', label: 'ok', variant: 'success' },
    { type: 'Card', children: [{ type: 'CardHeader', children: [] }] },
    { type: 'Alert', children: [] },
    { type: 'Loader' },
  ]
  for (const node of styled) {
    it(`${node.type} sets no inline presentation`, () => {
      const dom = renderEl(node, makeRenderCtx())
      for (const e of [dom, ...queryAll(dom, '*')]) {
        expect(e.style.border).toBe('')
        expect(e.style.padding).toBe('')
        expect(e.style.backgroundColor).toBe('')
        expect(e.style.fontSize).toBe('')
      }
    })
  }
})

describe('Loader', () => {
  it('draws the CSS spinner without an emoji inside it, and announces itself', () => {
    const dom = renderEl({ type: 'Loader' }, makeRenderCtx())
    expect(dom.textContent).toBe('')
    expect(dom.getAttribute('role')).toBe('status')
    expect(dom.getAttribute('aria-label')).toBe('Loading')
  })
})

describe('Input error', () => {
  it('shows the message and describes the input with it', () => {
    const dom = renderEl({ type: 'Input', name: 'email', error: 'Required' }, makeRenderCtx())
    const input = query(dom, 'input', HTMLInputElement)
    const message = query(dom, '.pf-field-error')
    expect(message.textContent).toBe('Required')
    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(input.getAttribute('aria-describedby')).toBe(message.id)
  })
})

describe('labels are linked to their control', () => {
  for (const type of ['Textarea', 'Select', 'DatePicker', 'Slider'] as const) {
    it(`${type} label targets the control id`, () => {
      const dom = renderEl({ type, name: 'field', label: 'Field', required: true }, makeRenderCtx())
      const label = query(dom, 'label', HTMLLabelElement)
      const control = query(dom, 'input, select, textarea')
      expect(label.htmlFor).not.toBe('')
      expect(label.htmlFor).toBe(control.id)
      expect(label.hasAttribute('data-required')).toBe(true)
    })
  }
})

describe('Metric delta', () => {
  it('carries its sentiment as data for the theme to color', () => {
    const dom = renderEl({ type: 'Metric', label: 'Churn', value: '3%', delta: '1%', trendSentiment: 'negative' }, makeRenderCtx())
    const delta = query(dom, '.pf-metric-delta')
    expect(delta.getAttribute('data-sentiment')).toBe('negative')
    expect(delta.style.color).toBe('')
  })
})

describe('Slider', () => {
  it('exposes its fill ratio for the track gradient and keeps it current', () => {
    const ctx = makeRenderCtx({ v: 25 })
    const dom = renderEl({ type: 'Slider', name: 'v', min: 0, max: 50 }, ctx)
    const input = query(dom, 'input', HTMLInputElement)
    expect(input.style.getPropertyValue('--pf-fill')).toBe('50%')
    input.value = '10'
    input.dispatchEvent(new Event('input'))
    expect(input.style.getPropertyValue('--pf-fill')).toBe('20%')
  })
})

describe('Accordion', () => {
  it('labels each region by its trigger', () => {
    const dom = renderEl({ type: 'AccordionItem', title: 'Q', children: [] }, makeRenderCtx())
    const trigger = query(dom, '.pf-accordion-trigger')
    const region = query(dom, '.pf-accordion-content')
    expect(trigger.id).not.toBe('')
    expect(region.getAttribute('aria-labelledby')).toBe(trigger.id)
  })
})

describe('Dialog', () => {
  it('offers a close button when dismissible', () => {
    const dom = renderEl({ type: 'Dialog', title: 'T', children: [] }, makeRenderCtx())
    expect(query(dom, '.pf-dialog-close', HTMLButtonElement).getAttribute('aria-label')).toBe('Close')
  })

  it('has no close button when not dismissible', () => {
    const dom = renderEl({ type: 'Dialog', title: 'T', dismissible: false, children: [] }, makeRenderCtx())
    expect(dom.querySelector('.pf-dialog-close')).toBeNull()
  })
})

describe('Table accepts both header naming conventions', () => {
  it('renders TableHeader with children as a thead section and TableHead with content as a cell', () => {
    const dom = renderEl({
      type: 'Table',
      children: [
        { type: 'TableHeader', children: [{ type: 'TableRow', children: [{ type: 'TableHead', content: 'Name' }] }] },
        { type: 'TableBody', children: [{ type: 'TableRow', children: [{ type: 'TableCell', content: 'Ada' }] }] },
      ],
    }, makeRenderCtx())
    expect(query(dom, 'thead th').textContent).toBe('Name')
    expect(query(dom, 'tbody td').textContent).toBe('Ada')
  })
})

describe('ExpandableRow', () => {
  it('accepts a plain string summary and exposes its state', () => {
    const dom = renderEl({ type: 'ExpandableRow', summary: 'Details', children: [] }, makeRenderCtx())
    const summary = query(dom, '.pf-expandable-row-summary')
    expect(summary.textContent).toContain('Details')
    expect(summary.getAttribute('aria-expanded')).toBe('false')
    summary.click()
    expect(summary.getAttribute('aria-expanded')).toBe('true')
  })
})

describe('Carousel', () => {
  it('disables the arrow that has nowhere to go', () => {
    const dom = renderEl({ type: 'Carousel', children: [{ type: 'Text', content: 'a' }, { type: 'Text', content: 'b' }] }, makeRenderCtx())
    const prev = query(dom, '.pf-carousel-prev', HTMLButtonElement)
    const next = query(dom, '.pf-carousel-next', HTMLButtonElement)
    expect(prev.disabled).toBe(true)
    expect(next.disabled).toBe(false)
    next.click()
    expect(prev.disabled).toBe(false)
    expect(next.disabled).toBe(true)
  })
})

describe('Combobox keyboard', () => {
  it('moves through options with the arrow keys and picks one with Enter', () => {
    const ctx = makeRenderCtx()
    const dom = renderEl({
      type: 'Combobox',
      name: 'fw',
      children: [
        { type: 'ComboboxOption', value: 'react', label: 'React' },
        { type: 'ComboboxOption', value: 'vue', label: 'Vue' },
      ],
    }, ctx)
    const input = query(dom, 'input', HTMLInputElement)
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
    expect(input.getAttribute('aria-expanded')).toBe('true')
    expect(queryAll(dom, '[aria-selected="true"]').map(o => o.textContent)).toEqual(['Vue'])
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
    expect(ctx.store.get('fw')).toBe('vue')
    expect(input.getAttribute('aria-expanded')).toBe('false')
  })
})

describe('ChoiceCard selected', () => {
  it('follows an expression over state', () => {
    const node = { type: 'ChoiceCard', value: 'pro', label: 'Pro', selected: "{{ plan == 'pro' }}", onClick: { action: 'setState', key: 'plan', value: 'pro' } }
    expect(renderEl(node, makeRenderCtx({ plan: 'pro' })).getAttribute('data-selected')).toBe('true')
    const other = renderEl(node, makeRenderCtx({ plan: 'free' }))
    expect(other.hasAttribute('data-selected')).toBe(false)
    expect(other.getAttribute('aria-pressed')).toBe('false')
  })
})

describe('Pages', () => {
  const view = {
    type: 'Pages', name: 'page', value: 'home',
    children: [
      { type: 'Page', name: 'home', children: [{ type: 'Text', content: 'Home' }] },
      { type: 'Page', name: 'settings', children: [{ type: 'Text', content: 'Settings' }] },
    ],
  }

  it('renders only the initial page', () => {
    expect(renderEl(view, makeRenderCtx()).textContent).toBe('Home')
  })

  it('follows the state key, so SetState navigates', () => {
    expect(renderEl(view, makeRenderCtx({ page: 'settings' })).textContent).toBe('Settings')
  })

  it('falls back to the first page and accepts the upstream value/title fields', () => {
    const upstream = { type: 'Pages', children: [
      { type: 'Page', title: 'One', children: [{ type: 'Text', content: '1' }] },
      { type: 'Page', title: 'Two', value: 'two', children: [{ type: 'Text', content: '2' }] },
    ] }
    expect(renderEl(upstream, makeRenderCtx()).textContent).toBe('1')
    expect(renderEl({ ...upstream, value: 'two' }, makeRenderCtx()).textContent).toBe('2')
  })
})

describe('Dashboard', () => {
  it('applies rowHeight and places items by col/row', () => {
    const dom = renderEl({ type: 'Dashboard', columns: 4, rowHeight: 120, children: [
      { type: 'DashboardItem', col: 2, row: 1, colSpan: 2, children: [] },
    ] }, makeRenderCtx())
    expect(dom.style.gridAutoRows).toBe('minmax(120px, auto)')
    const item = query(dom, '.pf-grid-item')
    expect(item.style.gridColumn).toBe('2 / span 2')
    expect(item.style.gridRow).toBe('1')
  })
})
