/**
 * Renderer theme tests — verify components don't use inline styles for
 * theme-sensitive properties that should be handled by prefab.css classes.
 *
 * The renderer should rely on CSS classes (pf-card, pf-alert, etc.) for
 * background-color, color, border-color, and border-radius. Inline styles
 * override the stylesheet and prevent [data-theme] from cascading correctly.
 *
 * @happy-dom
 */

import { describe, it, expect, beforeEach } from 'bun:test'
import type { ComponentNode } from '../src/renderer/engine'
import { registerAllComponents } from '../src/renderer/components/index'
import { makeRenderCtx, renderEl, query, queryAll } from './helpers/render'

beforeEach(() => { registerAllComponents() })

/**
 * Theme-sensitive CSS properties that should NOT appear in inline styles
 * when they reference theme CSS variables.
 */
const THEME_PROPERTIES = [
  'background-color',
  'background',
  'border',
  'border-color',
  'border-top',
  'border-bottom',
  'border-left',
  'border-right',
  'border-radius',
  'border-bottom-color',
  'color',
]

/** Theme CSS variable patterns that indicate the style should come from the stylesheet */
function hasThemeVariable(value: string): boolean {
  return /var\(--(border|card|background|foreground|primary|secondary|muted|accent|destructive|success|warning|ring|input|radius|popover|card-foreground|muted-foreground|popover-foreground|secondary-foreground|primary-bg)/.test(value)
}

function getThemeInlineStyles(element: HTMLElement): string[] {
  return THEME_PROPERTIES.flatMap(prop => {
    const value = element.style.getPropertyValue(prop)
    return value && hasThemeVariable(value) ? [`${prop}: ${value}`] : []
  })
}

function collectAllElements(root: HTMLElement): HTMLElement[] {
  const elements: HTMLElement[] = [root]
  const walk = (el: HTMLElement) => {
    for (const child of Array.from(el.children)) {
      if (child instanceof HTMLElement) {
        elements.push(child)
        walk(child)
      }
    }
  }
  walk(root)
  return elements
}

/** Collect violations across all elements in a rendered tree */
function collectViolations(dom: HTMLElement): string[] {
  const allEls = collectAllElements(dom)
  const violations: string[] = []
  for (const el of allEls) {
    const v = getThemeInlineStyles(el)
    if (v.length) violations.push(`<${el.tagName.toLowerCase()} class="${el.className}">: ${v.join(', ')}`)
  }
  return violations
}

describe('Theme violation detector', () => {
  it('flags inline theme variables so the checks below can fail', () => {
    const el = document.createElement('div')
    el.style.backgroundColor = 'var(--card)'
    el.style.borderBottomColor = 'var(--primary)'
    expect(collectViolations(el)).toHaveLength(1)
    expect(getThemeInlineStyles(el)).toEqual(['background-color: var(--card)', 'border-bottom-color: var(--primary)'])
  })
})

// ── Card ─────────────────────────────────────────────────────────────────────

describe('Theme: Card', () => {
  it('should not inline background-color with var(--card)', () => {
    const ctx = makeRenderCtx()
    const node: ComponentNode = {
      type: 'Card',
      children: [{ type: 'CardContent', children: [{ type: 'Text', content: 'Hello' }] }],
    }
    const dom = renderEl(node, ctx)
    expect(collectViolations(dom)).toEqual([])
  })

  it('should not inline border with var(--border)', () => {
    const ctx = makeRenderCtx()
    const node: ComponentNode = { type: 'Card', children: [] }
    const dom = renderEl(node, ctx)
    expect(dom.style.border).toBe('')
  })

  it('should not inline border-radius with var(--radius)', () => {
    const ctx = makeRenderCtx()
    const node: ComponentNode = { type: 'Card', children: [] }
    const dom = renderEl(node, ctx)
    expect(dom.style.borderRadius).toBe('')
  })

  it('should have the pf-card class', () => {
    const ctx = makeRenderCtx()
    const node: ComponentNode = { type: 'Card', children: [] }
    const dom = renderEl(node, ctx)
    expect(dom.classList.contains('pf-card')).toBe(true)
  })
})

// ── Alert ────────────────────────────────────────────────────────────────────

describe('Theme: Alert', () => {
  it('should not inline theme-variable styles on default alert', () => {
    const ctx = makeRenderCtx()
    const node: ComponentNode = {
      type: 'Alert',
      variant: 'default',
      children: [{ type: 'AlertTitle', content: 'Info' }],
    }
    const dom = renderEl(node, ctx)
    expect(collectViolations(dom)).toEqual([])
  })

  it('should not inline border/color on destructive alert', () => {
    const ctx = makeRenderCtx()
    const node: ComponentNode = {
      type: 'Alert',
      variant: 'destructive',
      children: [{ type: 'AlertTitle', content: 'Error' }],
    }
    const dom = renderEl(node, ctx)
    expect(collectViolations(dom)).toEqual([])
  })

  it('should set data-variant for styling via CSS', () => {
    const ctx = makeRenderCtx()
    const node: ComponentNode = { type: 'Alert', variant: 'destructive', children: [] }
    const dom = renderEl(node, ctx)
    expect(dom.getAttribute('data-variant')).toBe('destructive')
  })
})

// ── DataTable ────────────────────────────────────────────────────────────────

describe('Theme: DataTable', () => {
  it('should not inline border styles with var(--border) on cells', () => {
    const ctx = makeRenderCtx()
    const node: ComponentNode = {
      type: 'DataTable',
      columns: [{ key: 'name', header: 'Name' }],
      rows: [{ name: 'Alice' }],
    }
    const dom = renderEl(node, ctx)
    expect(collectViolations(dom)).toEqual([])
  })

  it('should not inline background on selected rows', () => {
    const ctx = makeRenderCtx()
    const node: ComponentNode = {
      type: 'DataTable',
      columns: [{ key: 'name', header: 'Name' }],
      rows: [{ name: 'Alice' }, { name: 'Bob' }],
      selectable: true,
    }
    const dom = renderEl(node, ctx)
    expect(collectViolations(dom)).toEqual([])
  })
})

// ── Badge ────────────────────────────────────────────────────────────────────

describe('Theme: Badge', () => {
  it('should not inline background/color with theme variables on default badge', () => {
    const ctx = makeRenderCtx()
    const node: ComponentNode = { type: 'Badge', label: 'Test', variant: 'default' }
    const dom = renderEl(node, ctx)
    expect(collectViolations(dom)).toEqual([])
  })

  it('should not inline on secondary badge', () => {
    const ctx = makeRenderCtx()
    const node: ComponentNode = { type: 'Badge', label: 'Sec', variant: 'secondary' }
    const dom = renderEl(node, ctx)
    expect(collectViolations(dom)).toEqual([])
  })

  it('should not inline on destructive badge', () => {
    const ctx = makeRenderCtx()
    const node: ComponentNode = { type: 'Badge', label: 'Err', variant: 'destructive' }
    const dom = renderEl(node, ctx)
    expect(collectViolations(dom)).toEqual([])
  })

  it('should not inline outline badge border with var(--border)', () => {
    const ctx = makeRenderCtx()
    const node: ComponentNode = { type: 'Badge', label: 'Outline', variant: 'outline' }
    const dom = renderEl(node, ctx)
    expect(collectViolations(dom)).toEqual([])
  })

  it('should set data-variant for CSS styling', () => {
    const ctx = makeRenderCtx()
    const node: ComponentNode = { type: 'Badge', label: 'X', variant: 'secondary' }
    const dom = renderEl(node, ctx)
    expect(dom.getAttribute('data-variant')).toBe('secondary')
  })
})

// ── Separator ────────────────────────────────────────────────────────────────

describe('Theme: Separator', () => {
  it('should not inline border with var(--border)', () => {
    const ctx = makeRenderCtx()
    const node: ComponentNode = { type: 'Separator' }
    const dom = renderEl(node, ctx)
    expect(collectViolations(dom)).toEqual([])
  })
})

// ── Button ───────────────────────────────────────────────────────────────────

describe('Theme: Button', () => {
  it('should not inline background/color with theme variables on default button', () => {
    const ctx = makeRenderCtx()
    const node: ComponentNode = { type: 'Button', label: 'Click', variant: 'default' }
    const dom = renderEl(node, ctx)
    expect(collectViolations(dom)).toEqual([])
  })

  it('should not inline on secondary button', () => {
    const ctx = makeRenderCtx()
    const node: ComponentNode = { type: 'Button', label: 'Sec', variant: 'secondary' }
    const dom = renderEl(node, ctx)
    expect(collectViolations(dom)).toEqual([])
  })

  it('should not inline on destructive button', () => {
    const ctx = makeRenderCtx()
    const node: ComponentNode = { type: 'Button', label: 'Del', variant: 'destructive' }
    const dom = renderEl(node, ctx)
    expect(collectViolations(dom)).toEqual([])
  })

  it('should not inline border on outline button', () => {
    const ctx = makeRenderCtx()
    const node: ComponentNode = { type: 'Button', label: 'Click', variant: 'outline' }
    const dom = renderEl(node, ctx)
    expect(collectViolations(dom)).toEqual([])
  })

  it('should not inline color on link button', () => {
    const ctx = makeRenderCtx()
    const node: ComponentNode = { type: 'Button', label: 'Link', variant: 'link' }
    const dom = renderEl(node, ctx)
    expect(collectViolations(dom)).toEqual([])
  })

  it('should set data-variant for CSS styling', () => {
    const ctx = makeRenderCtx()
    const node: ComponentNode = { type: 'Button', label: 'X', variant: 'outline' }
    const dom = renderEl(node, ctx)
    expect(dom.getAttribute('data-variant')).toBe('outline')
  })
})

// ── Metric ───────────────────────────────────────────────────────────────────

describe('Theme: Metric', () => {
  it('should not inline color with var(--muted-foreground) on label', () => {
    const ctx = makeRenderCtx()
    const node: ComponentNode = { type: 'Metric', label: 'Users', value: '100' }
    const dom = renderEl(node, ctx)
    expect(collectViolations(dom)).toEqual([])
  })

  it('should not inline on metric with description', () => {
    const ctx = makeRenderCtx()
    const node: ComponentNode = { type: 'Metric', label: 'Rev', value: '$1M', description: 'YTD' }
    const dom = renderEl(node, ctx)
    expect(collectViolations(dom)).toEqual([])
  })
})

// ── Tabs ─────────────────────────────────────────────────────────────────────

describe('Theme: Tabs', () => {
  it('should not inline border on tab bar with var(--border)', () => {
    const ctx = makeRenderCtx()
    const node: ComponentNode = {
      type: 'Tabs',
      name: 'tabs',
      children: [
        { type: 'Tab', title: 'One', children: [{ type: 'Text', content: 'Content 1' }] },
        { type: 'Tab', title: 'Two', children: [{ type: 'Text', content: 'Content 2' }] },
      ],
    }
    const dom = renderEl(node, ctx)
    expect(collectViolations(dom)).toEqual([])
  })

  it('should not inline active tab indicator with var(--primary)', () => {
    const ctx = makeRenderCtx()
    const node: ComponentNode = {
      type: 'Tabs',
      name: 'tabs2',
      children: [
        { type: 'Tab', title: 'A', children: [{ type: 'Text', content: '1' }] },
      ],
    }
    const dom = renderEl(node, ctx)
    const triggers = queryAll(dom, '.pf-tab-trigger')
    expect(triggers).toHaveLength(1)
    expect(triggers.flatMap(getThemeInlineStyles)).toEqual([])
  })
})

// ── Progress ─────────────────────────────────────────────────────────────────

describe('Theme: Progress', () => {
  it('should not inline background with var(--muted) or var(--primary)', () => {
    const ctx = makeRenderCtx()
    const node: ComponentNode = { type: 'Progress', value: 50 }
    const dom = renderEl(node, ctx)
    expect(collectViolations(dom)).toEqual([])
  })
})

// ── Table (structured) ───────────────────────────────────────────────────────

describe('Theme: Table', () => {
  it('should not inline border on TableHeader cells', () => {
    const ctx = makeRenderCtx()
    const node: ComponentNode = {
      type: 'Table',
      children: [
        { type: 'TableHead', children: [
          { type: 'TableRow', children: [
            { type: 'TableHeader', content: 'Name' },
          ] },
        ] },
        { type: 'TableBody', children: [
          { type: 'TableRow', children: [
            { type: 'TableCell', children: [{ type: 'Text', content: 'Alice' }] },
          ] },
        ] },
      ],
    }
    const dom = renderEl(node, ctx)
    expect(collectViolations(dom)).toEqual([])
  })

  it('should not inline color on TableCaption', () => {
    const ctx = makeRenderCtx()
    const node: ComponentNode = {
      type: 'Table',
      children: [
        { type: 'TableCaption', content: 'A caption' },
        { type: 'TableBody', children: [] },
      ],
    }
    const dom = renderEl(node, ctx)
    expect(collectViolations(dom)).toEqual([])
  })
})

// ── Form inputs ──────────────────────────────────────────────────────────────

describe('Theme: Form inputs', () => {
  it('should not inline border on TextInput', () => {
    const ctx = makeRenderCtx()
    const node: ComponentNode = { type: 'TextInput', name: 'email', label: 'Email' }
    const dom = renderEl(node, ctx)
    expect(collectViolations(dom)).toEqual([])
  })

  it('should not inline border on Select', () => {
    const ctx = makeRenderCtx()
    const node: ComponentNode = {
      type: 'Select',
      name: 'fruit',
      label: 'Fruit',
      options: [{ value: 'a', label: 'Apple' }],
    }
    const dom = renderEl(node, ctx)
    expect(collectViolations(dom)).toEqual([])
  })

  it('should not inline border on Textarea', () => {
    const ctx = makeRenderCtx()
    const node: ComponentNode = { type: 'Textarea', name: 'bio', label: 'Bio' }
    const dom = renderEl(node, ctx)
    expect(collectViolations(dom)).toEqual([])
  })
})

// ── Dialog ───────────────────────────────────────────────────────────────────

describe('Theme: Dialog', () => {
  it('should not inline border/radius/color on dialog', () => {
    const ctx = makeRenderCtx()
    const node: ComponentNode = {
      type: 'Dialog',
      title: 'Confirm',
      children: [{ type: 'Text', content: 'Are you sure?' }],
    }
    const dom = renderEl(node, ctx)
    expect(collectViolations(dom)).toEqual([])
  })
})

// ── Popover ──────────────────────────────────────────────────────────────────

describe('Theme: Popover', () => {
  it('should not inline border/bg with theme vars on popover content', () => {
    const ctx = makeRenderCtx()
    const node: ComponentNode = {
      type: 'Popover',
      children: [{ type: 'Text', content: 'Popover content' }],
    }
    const dom = renderEl(node, ctx)
    expect(collectViolations(dom)).toEqual([])
  })
})

// ── HoverCard ────────────────────────────────────────────────────────────────

describe('Theme: HoverCard', () => {
  it('should not inline border/bg/radius on hover card content', () => {
    const ctx = makeRenderCtx()
    const node: ComponentNode = {
      type: 'HoverCard',
      children: [{ type: 'Text', content: 'Hover content' }],
    }
    const dom = renderEl(node, ctx)
    expect(collectViolations(dom)).toEqual([])
  })
})

// ── Accordion ────────────────────────────────────────────────────────────────

describe('Theme: Accordion', () => {
  it('should not inline border on accordion items', () => {
    const ctx = makeRenderCtx()
    const node: ComponentNode = {
      type: 'Accordion',
      children: [
        { type: 'AccordionItem', title: 'Section 1', children: [{ type: 'Text', content: 'Body' }] },
      ],
    }
    const dom = renderEl(node, ctx)
    expect(collectViolations(dom)).toEqual([])
  })
})

// ── Tooltip ──────────────────────────────────────────────────────────────────

describe('Theme: Tooltip', () => {
  it('should not inline bg with var(--popover) on tooltip', () => {
    const ctx = makeRenderCtx()
    const node: ComponentNode = {
      type: 'Tooltip',
      content: 'Hint text',
      children: [{ type: 'Text', content: 'Hover me' }],
    }
    const dom = renderEl(node, ctx)
    expect(collectViolations(dom)).toEqual([])
  })
})

// ── Ring (SVG) ───────────────────────────────────────────────────────────────
// SVG presentation attributes (setAttribute) cascade correctly with CSS custom
// properties — unlike HTML inline styles, they DON'T override class selectors.
// So using var(--primary) etc. in SVG stroke attributes is the correct approach.

describe('Theme: Ring', () => {
  it('should use theme vars in SVG stroke for theme awareness', () => {
    const ctx = makeRenderCtx()
    const node: ComponentNode = { type: 'Ring', value: 75 }
    const dom = renderEl(node, ctx)
    const circles = queryAll(dom, 'circle', SVGCircleElement)
    expect(circles).toHaveLength(2)
    expect(circles[0].getAttribute('stroke')).toContain('var(--muted')
    expect(circles[1].getAttribute('stroke')).toContain('var(--primary')
  })
})

// ── Sparkline (SVG) ──────────────────────────────────────────────────────────

describe('Theme: Sparkline', () => {
  it('should use theme vars in SVG stroke for theme awareness', () => {
    const ctx = makeRenderCtx()
    const node: ComponentNode = { type: 'Sparkline', data: [10, 20, 30, 25, 40] }
    const dom = renderEl(node, ctx)
    const polylines = queryAll(dom, 'polyline', SVGPolylineElement)
    expect(polylines).toHaveLength(1)
    expect(polylines[0].getAttribute('stroke')).toContain('var(--primary')
  })
})

// ── Theme Toggle ─────────────────────────────────────────────────────────────

import { createThemeToggle } from '../src/renderer/theme'

describe('Theme Toggle', () => {
  it('should inject a toggle button into the root element', () => {
    const root = document.createElement('div')
    document.body.appendChild(root)
    const cleanup = createThemeToggle(root)
    expect(query(root, '.pf-theme-toggle', HTMLButtonElement).getAttribute('aria-label')).toBe('Toggle theme')
    cleanup()
    root.remove()
  })

  it('should set data-theme on root and documentElement', () => {
    const root = document.createElement('div')
    document.body.appendChild(root)
    const cleanup = createThemeToggle(root, { storageKey: 'test-theme-toggle-1' })
    const theme = root.getAttribute('data-theme')
    expect(theme === 'light' || theme === 'dark').toBe(true)
    expect(document.documentElement.getAttribute('data-theme')).toBe(theme)
    cleanup()
    root.remove()
  })

  it('should toggle between light and dark on click', () => {
    const root = document.createElement('div')
    document.body.appendChild(root)
    const cleanup = createThemeToggle(root, { storageKey: 'test-theme-toggle-2' })
    const btn = query(root, '.pf-theme-toggle', HTMLButtonElement)
    const initial = root.getAttribute('data-theme')
    expect(initial === 'light' || initial === 'dark').toBe(true)
    btn.click()
    const toggled = root.getAttribute('data-theme')
    expect(toggled).toBe(initial === 'dark' ? 'light' : 'dark')
    btn.click()
    expect(root.getAttribute('data-theme')).toBe(initial)
    cleanup()
    root.remove()
  })

  it('should sync when document.documentElement data-theme changes externally', async () => {
    const root = document.createElement('div')
    document.body.appendChild(root)
    const cleanup = createThemeToggle(root, { storageKey: 'test-theme-toggle-3' })
    const btn = query(root, '.pf-theme-toggle', HTMLButtonElement)
    if (root.getAttribute('data-theme') !== 'dark') btn.click()
    expect(root.getAttribute('data-theme')).toBe('dark')
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')

    document.documentElement.setAttribute('data-theme', 'light')
    await new Promise(r => setTimeout(r, 0))
    expect(root.getAttribute('data-theme')).toBe('light')
    cleanup()
    root.remove()
  })

  it('should not sync document when syncDocument is false', () => {
    const root = document.createElement('div')
    document.body.appendChild(root)
    document.documentElement.removeAttribute('data-theme')
    const cleanup = createThemeToggle(root, { syncDocument: false, storageKey: 'test-theme-toggle-4' })
    const rootTheme = root.getAttribute('data-theme')
    expect(rootTheme === 'light' || rootTheme === 'dark').toBe(true)
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false)
    query(root, '.pf-theme-toggle', HTMLButtonElement).click()
    expect(root.getAttribute('data-theme')).not.toBe(rootTheme)
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false)
    cleanup()
    root.remove()
  })

  it('should remove button and observer on cleanup', () => {
    const root = document.createElement('div')
    document.body.appendChild(root)
    const cleanup = createThemeToggle(root, { storageKey: 'test-theme-toggle-5' })
    expect(root.querySelector('.pf-theme-toggle')).not.toBeNull()
    cleanup()
    expect(root.querySelector('.pf-theme-toggle')).toBeNull()
    root.remove()
  })

  it('should show moon icon for dark and sun icon for light', () => {
    const root = document.createElement('div')
    document.body.appendChild(root)
    const cleanup = createThemeToggle(root, { storageKey: 'test-theme-toggle-6' })
    const btn = query(root, '.pf-theme-toggle', HTMLButtonElement)

    root.setAttribute('data-theme', 'light')
    btn.click()
    expect(root.getAttribute('data-theme')).toBe('dark')
    expect(btn.innerHTML).toContain('21.752')
    btn.click()
    expect(root.getAttribute('data-theme')).toBe('light')
    expect(btn.innerHTML).toContain('M12 3v2.25')

    cleanup()
    root.remove()
  })

  it('should respect position option', () => {
    const root = document.createElement('div')
    document.body.appendChild(root)
    const cleanup = createThemeToggle(root, { position: 'bottom-left', storageKey: 'test-theme-toggle-7' })
    const btn = query(root, '.pf-theme-toggle', HTMLButtonElement)
    expect(btn.style.bottom).toBe('8px')
    expect(btn.style.left).toBe('8px')
    cleanup()
    root.remove()
  })
})
