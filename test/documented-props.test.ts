/**
 * Props the reference documented before they existed.
 *
 * `bun run check:docs` flagged these as documented-but-unimplemented. Each is now
 * real, and each replaces a hardcoded value in the renderer, so these tests pin
 * both the wire shape and the rendered result.
 */

import { describe, expect, test } from 'bun:test'
import { Column, Select, DatePicker, Table, TableBody, TableRow, TableCell, Tabs, Tab, Text, Sparkline } from '../src/index'
import { PrefabRenderer } from '../src/renderer/index'

function render(node: unknown): HTMLElement {
  const host = document.createElement('div')
  PrefabRenderer.mount(host, {
    $prefab: { version: '0.3' },
    view: node as never,
  })
  return host
}

describe('label on stateful controls', () => {
  test('Select serializes and renders its label', () => {
    const json = Select({ name: 'role', label: 'Role' }).toJSON()
    expect(json.label).toBe('Role')

    const host = render(Select({ name: 'role', label: 'Role' }).toJSON())
    expect(host.querySelector('.pf-input-label')?.textContent).toBe('Role')
  })

  test('DatePicker serializes and renders its label', () => {
    const json = DatePicker({ name: 'dob', label: 'Date of birth' }).toJSON()
    expect(json.label).toBe('Date of birth')

    const host = render(DatePicker({ name: 'dob', label: 'Date of birth' }).toJSON())
    expect(host.querySelector('.pf-input-label')?.textContent).toBe('Date of birth')
  })

  test('the label is optional', () => {
    expect(Select({ name: 'role' }).toJSON().label).toBeUndefined()
    const host = render(Select({ name: 'role' }).toJSON())
    expect(host.querySelector('.pf-input-label')).toBeNull()
  })
})

describe('Table striped', () => {
  test('adds the modifier class only when set', () => {
    expect(Table({ striped: true }).toJSON().striped).toBe(true)

    const striped = render(Table({ striped: true, children: [TableBody({ children: [TableRow({ children: [TableCell({ children: [Text('a')] })] })] })] }).toJSON())
    expect(striped.querySelector('table')?.className).toContain('pf-table-striped')

    const plain = render(Table({ children: [] }).toJSON())
    expect(plain.querySelector('table')?.className).not.toContain('pf-table-striped')
  })
})

describe('Tabs defaultTab', () => {
  const tabs = (defaultTab?: string | number) =>
    Tabs({
      ...(defaultTab !== undefined && { defaultTab }),
      children: [
        Tab({ title: 'First', children: [Text('one')] }),
        Tab({ title: 'Second', children: [Text('two')] }),
        Tab({ title: 'Third', children: [Text('three')] }),
      ],
    }).toJSON()

  const activeIndex = (host: HTMLElement): number =>
    [...host.querySelectorAll('.pf-tab-trigger')].findIndex(b => b.getAttribute('aria-selected') === 'true')

  test('defaults to the first tab', () => {
    expect(activeIndex(render(tabs()))).toBe(0)
  })

  test('selects by index', () => {
    expect(activeIndex(render(tabs(2)))).toBe(2)
  })

  test('selects by Tab title', () => {
    expect(activeIndex(render(tabs('Second')))).toBe(1)
  })

  test('falls back to the first tab when unmatched', () => {
    // A title that does not exist, and an out-of-range index, must not leave the
    // widget with no selected tab.
    expect(activeIndex(render(tabs('Nope')))).toBe(0)
    expect(activeIndex(render(tabs(99)))).toBe(0)
  })
})

describe('Sparkline width and height', () => {
  test('override the previously hardcoded 120x32', () => {
    const json = Sparkline({ data: [1, 2, 3], width: 300, height: 80 }).toJSON()
    expect(json.width).toBe(300)
    expect(json.height).toBe(80)

    const host = render(Column({ children: [Sparkline({ data: [1, 2, 3], width: 300, height: 80 })] }).toJSON())
    const svg = host.querySelector('svg')
    expect(svg?.getAttribute('width')).toBe('300')
    expect(svg?.getAttribute('height')).toBe('80')
  })

  test('keep their defaults when omitted', () => {
    const host = render(Column({ children: [Sparkline({ data: [1, 2, 3] })] }).toJSON())
    const svg = host.querySelector('svg')
    expect(svg?.getAttribute('width')).toBe('120')
    expect(svg?.getAttribute('height')).toBe('32')
  })
})
