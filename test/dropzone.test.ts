/**
 * DropZone file handling.
 *
 * The renderer used to be a stub (`// File handling would go here`), so `accept`
 * was documented against nothing. Prop names mirror the `OpenFilePicker` action,
 * which already defines how files reach state.
 */

import { describe, expect, test } from 'bun:test'
import { DropZone, SetState } from '../src/index'
import { matchesAccept } from '../src/renderer/components/media'
import { PrefabRenderer } from '../src/renderer/index'
import { Store } from '../src/renderer/state'
import { renderNode } from '../src/renderer/engine'
import type { ComponentNode } from '../src/renderer/engine'
import { registerAllComponents } from '../src/renderer/components/index'
import { createNoopTransport } from '../src/renderer/transport'

/** Render a DropZone against a real Store, so state writes can be asserted. */
function renderZone(props: Parameters<typeof DropZone>[0]): { zone: HTMLElement; store: Store } {
  registerAllComponents()
  const store = new Store({})
  const zone = renderNode(DropZone(props).toJSON() as ComponentNode, {
    store,
    scope: {},
    transport: createNoopTransport(),
    rerender: () => {},
  }) as HTMLElement
  return { zone, store }
}

function file(name: string, type = ''): File {
  return new File(['x'], name, { type })
}

function mount(node: unknown): HTMLElement {
  const host = document.createElement('div')
  PrefabRenderer.mount(host, { $prefab: { version: '0.3' }, view: node as never })
  return host
}

function zoneOf(host: HTMLElement): HTMLElement {
  const z = host.querySelector('.pf-dropzone')
  if (!z) throw new Error('no dropzone rendered')
  return z as HTMLElement
}

/** A drop event carrying files, since happy-dom has no DataTransfer constructor. */
function dropWith(files: File[]): Event {
  const ev = new Event('drop', { bubbles: true, cancelable: true })
  Object.defineProperty(ev, 'dataTransfer', { value: { files } })
  return ev
}

describe('matchesAccept', () => {
  test('no accept list takes everything', () => {
    expect(matchesAccept(file('a.png', 'image/png'))).toBe(true)
    expect(matchesAccept(file('a.png', 'image/png'), '')).toBe(true)
  })

  test('wildcard matches the type prefix', () => {
    expect(matchesAccept(file('a.png', 'image/png'), 'image/*')).toBe(true)
    expect(matchesAccept(file('a.pdf', 'application/pdf'), 'image/*')).toBe(false)
  })

  test('extension patterns match the filename', () => {
    expect(matchesAccept(file('report.pdf', 'application/pdf'), '.pdf')).toBe(true)
    expect(matchesAccept(file('report.PDF', 'application/pdf'), '.pdf')).toBe(true)
    expect(matchesAccept(file('report.txt', 'text/plain'), '.pdf')).toBe(false)
  })

  test('exact mime types match', () => {
    expect(matchesAccept(file('a.csv', 'text/csv'), 'text/csv')).toBe(true)
    expect(matchesAccept(file('a.csv', 'text/plain'), 'text/csv')).toBe(false)
  })

  test('a comma list matches any entry', () => {
    const accept = 'image/*,.pdf,text/csv'
    expect(matchesAccept(file('a.png', 'image/png'), accept)).toBe(true)
    expect(matchesAccept(file('a.pdf', ''), accept)).toBe(true)
    expect(matchesAccept(file('a.csv', 'text/csv'), accept)).toBe(true)
    expect(matchesAccept(file('a.exe', 'application/x-msdownload'), accept)).toBe(false)
  })

  test('a file with no reported type still matches by extension', () => {
    // Browsers often report an empty type for unusual extensions.
    expect(matchesAccept(file('scan.dcm', ''), '.dcm')).toBe(true)
  })
})

describe('DropZone serialization', () => {
  test('emits the documented props', () => {
    const json = DropZone({
      accept: 'image/*',
      multiple: true,
      resultKey: 'files',
      onDrop: new SetState('done', true),
    }).toJSON()

    expect(json.accept).toBe('image/*')
    expect(json.multiple).toBe(true)
    expect(json.resultKey).toBe('files')
    expect(json.onDrop).toBeDefined()
  })

  test('stays empty when nothing is configured', () => {
    const json = DropZone().toJSON()
    expect(json.accept).toBeUndefined()
    expect(json.onDrop).toBeUndefined()
  })
})

describe('DropZone rendering', () => {
  test('exposes a file input carrying accept and multiple', () => {
    const host = mount(DropZone({ accept: '.pdf', multiple: true }).toJSON())
    const input = zoneOf(host).querySelector('input')
    expect(input?.getAttribute('type')).toBe('file')
    expect(input?.accept).toBe('.pdf')
    expect(input?.multiple).toBe(true)
  })

  test('is keyboard reachable', () => {
    const zone = zoneOf(mount(DropZone().toJSON()))
    expect(zone.getAttribute('role')).toBe('button')
    expect(zone.tabIndex).toBe(0)
  })

  test('a drop writes the files to resultKey', () => {
    const { zone, store } = renderZone({ resultKey: 'picked', multiple: true })
    zone.dispatchEvent(dropWith([file('a.png', 'image/png'), file('b.png', 'image/png')]))

    const picked = store.get('picked') as File[]
    expect(picked.map(f => f.name)).toEqual(['a.png', 'b.png'])
  })

  test('a drop filters by accept, which the browser does not do', () => {
    // The whole reason matchesAccept exists: accept is not enforced on drop.
    const { zone, store } = renderZone({ resultKey: 'picked', accept: 'image/*', multiple: true })
    zone.dispatchEvent(dropWith([file('a.png', 'image/png'), file('b.exe', 'application/x-msdownload')]))

    const picked = store.get('picked') as File[]
    expect(picked.map(f => f.name)).toEqual(['a.png'])
  })

  test('without multiple, only the first accepted file is taken', () => {
    const { zone, store } = renderZone({ resultKey: 'picked' })
    zone.dispatchEvent(dropWith([file('a.png', 'image/png'), file('b.png', 'image/png')]))

    expect((store.get('picked') as File[]).map(f => f.name)).toEqual(['a.png'])
  })

  test('a drop of only rejected files writes nothing', () => {
    const { zone, store } = renderZone({ resultKey: 'picked', accept: 'image/*' })
    zone.dispatchEvent(dropWith([file('b.exe', 'application/x-msdownload')]))

    expect(store.get('picked')).toBeUndefined()
  })

  test('onDrop fires with the files as $result', () => {
    const { zone, store } = renderZone({
      resultKey: 'picked',
      onDrop: new SetState('dropped', true),
    })
    zone.dispatchEvent(dropWith([file('a.png', 'image/png')]))

    expect(store.get('dropped')).toBe(true)
  })

  test('drag styling toggles', () => {
    const zone = zoneOf(mount(DropZone().toJSON()))
    zone.dispatchEvent(new Event('dragover', { bubbles: true, cancelable: true }))
    expect(zone.classList.contains('pf-dropzone-active')).toBe(true)
    zone.dispatchEvent(new Event('dragleave', { bubbles: true }))
    expect(zone.classList.contains('pf-dropzone-active')).toBe(false)
  })
})
