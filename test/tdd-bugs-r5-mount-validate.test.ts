/**
 * TDD R5 (cont.) — mount() should surface wire-validation problems.
 *
 * A silent renderer is what let the `then` bug hide. Mounting a payload with
 * misplaced children (or a showToast missing `message`) must emit a console
 * warning so authors see it immediately — without breaking the render.
 *
 * @happy-dom
 */

import { describe, it, expect, beforeEach, afterEach, spyOn } from 'bun:test'
import { PrefabRenderer } from '../src/renderer/index'

let warnSpy: ReturnType<typeof spyOn>

beforeEach(() => { warnSpy = spyOn(console, 'warn').mockImplementation(() => { /* silence */ }) })
afterEach(() => { warnSpy.mockRestore() })

function warnings(): string[] {
  return (warnSpy.mock.calls as unknown[][]).map(c => c.map(x => String(x)).join(' '))
}

describe('mount() wire validation warnings', () => {
  it('warns when children are parked under `then` (still renders)', () => {
    const root = document.createElement('div')
    const data = {
      $prefab: { version: '0.3' },
      view: {
        type: 'If',
        condition: '{{ ok }}',
        then: [{ type: 'Alert', children: [{ type: 'AlertTitle', content: 'Hi' }] }],
      },
    }
    const app = PrefabRenderer.mount(root, data as never)
    expect(warnings().some(w => w.includes('then') && w.includes('children'))).toBe(true)
    // Non-fatal: mount still returns a working handle.
    expect(typeof app.destroy).toBe('function')
    app.destroy()
  })

  it('warns when showToast omits message', () => {
    const root = document.createElement('div')
    const data = {
      $prefab: { version: '0.3' },
      view: { type: 'Button', label: 'Send', onClick: { action: 'showToast', title: 'Sent!' } },
    }
    const app = PrefabRenderer.mount(root, data as never)
    expect(warnings().some(w => w.includes('message'))).toBe(true)
    app.destroy()
  })

  it('is silent for a clean payload', () => {
    const root = document.createElement('div')
    const data = {
      $prefab: { version: '0.3' },
      view: { type: 'Column', children: [{ type: 'Text', content: 'ok' }] },
    }
    const app = PrefabRenderer.mount(root, data as never)
    expect(warnings().some(w => w.includes('validation'))).toBe(false)
    app.destroy()
  })

  it('can be disabled with { validate: false }', () => {
    const root = document.createElement('div')
    const data = {
      $prefab: { version: '0.3' },
      view: { type: 'If', condition: '{{ ok }}', then: [{ type: 'Alert' }] },
    }
    const app = PrefabRenderer.mount(root, data as never, { validate: false })
    expect(warnings().some(w => w.includes('validation'))).toBe(false)
    app.destroy()
  })
})
