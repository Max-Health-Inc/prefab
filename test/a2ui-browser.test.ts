/**
 * The browser bundle's public surface.
 *
 * `dist/a2ui.min.js` is what the playground and any other in-page tool load, so
 * its entry point is a real API rather than an implementation detail. The bundle
 * itself is built by `scripts/build.ts`; this covers the module it is built
 * from, which is where the behaviour lives.
 */

import { describe, expect, test } from 'bun:test'
import PrefabA2UI, { emit, envelope } from '../src/a2ui/browser.js'
import { A2UI_MIME } from '../src/a2ui/types.js'
import { conformanceErrors } from './helpers/a2ui-validator.js'

const WIRE = {
  $prefab: { version: '0.3' },
  view: { type: 'Column', children: [{ type: 'Text', content: 'hi' }] },
}

describe('PrefabA2UI.emit', () => {
  test('translates a payload', () => {
    const { messages, diagnostics } = emit(WIRE)
    expect(conformanceErrors(messages)).toEqual([])
    expect(diagnostics).toEqual([])
  })

  test('honours emit options', () => {
    const kinds = (wire: unknown) => emit(wire, { stream: true }).messages
      .map(m => Object.keys(m).find(k => k !== 'version'))

    // No state means no data model, so the third message would carry nothing.
    expect(kinds(WIRE)).toEqual(['createSurface', 'updateComponents'])
    expect(kinds({ ...WIRE, state: { a: 1 } }))
      .toEqual(['createSurface', 'updateComponents', 'updateDataModel'])
  })

  test('rejects input that is not a $prefab payload', () => {
    // The caller is usually handing over parsed editor text or a tool result,
    // neither of which is typed, so this is a runtime guard rather than a
    // formality: without it a payload with no view emits an empty surface and
    // the mistake surfaces much further downstream.
    for (const bad of [null, undefined, 'string', 42, {}, { $prefab: { version: '0.3' } }]) {
      expect(() => emit(bad)).toThrow(TypeError)
    }
  })
})

describe('PrefabA2UI.envelope', () => {
  test('wraps messages in the list form a resource body needs', () => {
    const { messages } = emit(WIRE)
    expect(envelope(messages)).toEqual({ messages })
  })
})

describe('the global surface', () => {
  test('exposes what a page needs and nothing half-built', () => {
    expect(typeof PrefabA2UI.emit).toBe('function')
    expect(typeof PrefabA2UI.envelope).toBe('function')
    expect(typeof PrefabA2UI.mappedTypes).toBe('function')
    expect(PrefabA2UI.A2UI_VERSION).toBe('v1.0')
    expect(PrefabA2UI.A2UI_MIME).toBe(A2UI_MIME)
  })

  test('attaches itself to window when there is one', () => {
    // happy-dom supplies a window, which is the environment the bundle targets.
    expect((window as unknown as Record<string, unknown>).PrefabA2UI).toBe(PrefabA2UI)
  })
})
