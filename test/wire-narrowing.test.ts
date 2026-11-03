/**
 * Malformed wire values are skipped instead of crashing the renderer, the HTTP
 * transport or the A2UI emitter.
 *
 * @happy-dom
 */

import { describe, expect, test, beforeEach } from 'bun:test'
import { registerAllComponents } from '../src/renderer/components/index'
import { createHttpTransport } from '../src/renderer/transport'
import { emit } from '../src/a2ui/browser'
import { makeRenderCtx, renderEl, query, queryAll, textsOf } from './helpers/render'

beforeEach(() => { registerAllComponents() })

function respondWith(body: unknown): typeof fetch {
  return Object.assign(
    (_input: string | URL | Request, _init?: RequestInit) => Promise.resolve(new Response(JSON.stringify(body))),
    { preconnect: globalThis.fetch.preconnect },
  )
}

describe('renderer', () => {
  test('Select skips options that are not objects', () => {
    const dom = renderEl({ type: 'Select', options: [null, 'x', { label: 'A', value: 'a' }] }, makeRenderCtx())
    expect(queryAll(dom, 'option', HTMLOptionElement).map(o => o.value)).toEqual(['a'])
  })

  test('Condition skips cases that are not objects', () => {
    const node = {
      type: 'Condition',
      cases: [null, { when: 'flag', children: [{ type: 'Text', content: 'yes' }] }],
    }
    const host = document.createElement('div')
    host.appendChild(renderEl({ type: 'Div', children: [node] }, makeRenderCtx({ flag: true })))
    expect(host.textContent).toContain('yes')
  })

  test('Condition with cases that are not a list renders its else branch', () => {
    const node = { type: 'Condition', cases: { when: 'flag' }, else: [{ type: 'Text', content: 'fallback' }] }
    const dom = renderEl({ type: 'Div', children: [node] }, makeRenderCtx({ flag: true }))
    expect(dom.textContent).toContain('fallback')
  })

  test('DataTable skips columns that are not objects', () => {
    const dom = renderEl({ type: 'DataTable', columns: [null, { key: 'name' }], rows: [{ name: 'Ada' }] }, makeRenderCtx())
    expect(textsOf(dom, 'th')).toEqual(['name'])
    expect(textsOf(dom, 'td')).toEqual(['Ada'])
  })

  test('ExpandableRow ignores a summary that is not a list', () => {
    const node = { type: 'ExpandableRow', summary: { type: 'Text', content: 's' }, children: [{ type: 'Text', content: 'd' }] }
    const dom = renderEl(node, makeRenderCtx())
    expect(query(dom, '.pf-expandable-row-detail').textContent).toBe('d')
  })

  test('a Popover trigger that renders a fragment still toggles the content', () => {
    const node = {
      type: 'Popover',
      trigger: { type: 'If', condition: 'show', children: [{ type: 'Button', label: 'Open' }] },
      children: [{ type: 'Text', content: 'body' }],
    }
    const dom = renderEl(node, makeRenderCtx({ show: true }))
    document.body.appendChild(dom)
    const content = query(dom, '.pf-popover-content')
    query(dom, 'button').click()
    expect(content.style.display).toBe('block')
    dom.remove()
  })
})

describe('createHttpTransport', () => {
  test('skips content blocks that are not objects', async () => {
    const transport = createHttpTransport({
      baseUrl: 'http://test.local',
      fetch: respondWith({ result: { content: [null, { type: 'text', text: '"hi"' }] } }),
    })
    expect(await transport.callTool('tool', {})).toBe('hi')
  })

  test('returns a JSON null body as is', async () => {
    const transport = createHttpTransport({ baseUrl: 'http://test.local', fetch: respondWith(null) })
    expect(await transport.callTool('tool', {})).toBeNull()
  })
})

describe('PrefabA2UI.emit', () => {
  test('skips children that are not components', () => {
    const { messages } = emit({
      $prefab: { version: '0.3' },
      view: { type: 'Column', children: [null, { type: 'Text', content: 'hi' }] },
    })
    expect(JSON.stringify(messages)).toContain('"hi"')
  })

  test('ignores state that is not an object', () => {
    const { messages } = emit({ $prefab: { version: '0.3' }, view: { type: 'Text', content: 'hi' }, state: 'ab' })
    expect(JSON.stringify(messages)).not.toContain('dataModel')
  })
})
