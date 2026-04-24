/**
 * Tests for the custom pipe registry (registerPipe / unregisterPipe / listPipes).
 */

import { describe, test, expect, afterEach } from 'bun:test'
import { registerPipe, unregisterPipe, listPipes } from '../src/rx/pipes'
import { evaluateExpression } from '../src/renderer/rx'
import { Store } from '../src/renderer/state'
import { rx } from '../src/rx/rx'
import { collection } from '../src/rx/collection'
import { signal } from '../src/rx/signal'
import { resetAutoState } from '../src/rx/state-collector'

// Clean up custom pipes and auto-state after each test
afterEach(() => {
  for (const name of listPipes()) {
    unregisterPipe(name)
  }
  resetAutoState()
})

describe('registerPipe', () => {
  test('custom pipe is invoked via {{ expr | pipe }}', () => {
    registerPipe('shout', (v) => String(v).toUpperCase())
    const store = new Store({ greeting: 'hi' })
    expect(evaluateExpression("greeting | shout", store)).toBe('HI')
  })

  test('parameterized pipe receives parsed args', () => {
    registerPipe('repeat', (v, n) => String(v).repeat(Number(n)))
    const store = new Store({ word: 'ab' })
    expect(evaluateExpression("word | repeat:3", store)).toBe('ababab')
  })

  test('built-in pipe shadows custom pipe with same name', () => {
    // 'find' is a built-in — registering a custom 'find' must NOT replace it
    registerPipe('find', () => 'hacked')
    const store = new Store({
      items: [{ id: 'a', label: 'Alpha' }, { id: 'b', label: 'Beta' }],
      selected: 'b',
    })
    const result = evaluateExpression("items | find:'id',selected", store)
    expect(result).toEqual({ id: 'b', label: 'Beta' })
  })

  test('unregisterPipe removes a custom pipe', () => {
    registerPipe('shout', (v) => String(v).toUpperCase())
    expect(unregisterPipe('shout')).toBe(true)
    expect(listPipes()).toEqual([])
    // After removal, pipe falls through to passthrough
    const store = new Store({ greeting: 'hi' })
    expect(evaluateExpression("greeting | shout", store)).toBe('hi')
  })

  test('listPipes returns registered names', () => {
    registerPipe('a', (v) => v)
    registerPipe('b', (v) => v)
    expect(listPipes().sort()).toEqual(['a', 'b'])
  })

  test('re-registration with different fn warns but overwrites', () => {
    registerPipe('fmt', () => 'v1')
    // Re-register with different fn — should warn (we just verify the overwrite)
    registerPipe('fmt', () => 'v2')
    const store = new Store({ x: 'ignored' })
    expect(evaluateExpression("x | fmt", store)).toBe('v2')
  })

  test('multi-arg custom pipe', () => {
    registerPipe('between', (v, lo, hi) => {
      const n = Number(v)
      return n >= Number(lo) && n <= Number(hi)
    })
    const store = new Store({ val: 5 })
    expect(evaluateExpression("val | between:1,10", store)).toBe(true)
    expect(evaluateExpression("val | between:6,10", store)).toBe(false)
  })
})

// ═════════════════════════════════════════════════════════════════════════════
describe('Rx.pipe() builder', () => {
  test('no args', () => {
    expect(rx('name').pipe('humanName').toString()).toBe("{{ name | humanName }}")
  })

  test('single arg', () => {
    expect(rx('dob').pipe('date', 'long').toString()).toBe("{{ dob | date:'long' }}")
  })

  test('multiple args', () => {
    expect(rx('val').pipe('between', 1, 10).toString()).toBe("{{ val | between:1,10 }}")
  })

  test('undefined args are filtered out', () => {
    // Mimics convenience methods like .currency(undefined)
    expect(rx('price').pipe('currency', undefined).toString()).toBe("{{ price | currency }}")
  })

  test('chains with existing pipes', () => {
    expect(rx('x').upper().pipe('custom').toString()).toBe("{{ x | upper | custom }}")
  })

  test('existing convenience methods still work', () => {
    expect(rx('p').currency().toString()).toBe("{{ p | currency }}")
    expect(rx('p').currency('EUR').toString()).toBe("{{ p | currency:'EUR' }}")
  })
})

// ═════════════════════════════════════════════════════════════════════════════
describe('Ref.pipe() builder', () => {
  const patients = collection('patients', [
    { id: 'p1', name: [{ family: 'Meier', given: ['Hans'] }] },
  ], { key: 'id' })
  const sel = signal('sel', 'p1')
  const ref = patients.by(sel)

  test('pipe on ref', () => {
    expect(ref.pipe('humanName').toString()).toBe("{{ patients | find:'id',sel | humanName }}")
  })

  test('dot then pipe via Rx chain', () => {
    expect(ref.dot('name').pipe('humanName').toString())
      .toBe("{{ patients | find:'id',sel | dot:'name' | humanName }}")
  })

  test('pipe with args on ref', () => {
    expect(ref.dot('birthDate').pipe('date', 'long').toString())
      .toBe("{{ patients | find:'id',sel | dot:'birthDate' | date:'long' }}")
  })

  test('end-to-end: custom pipe resolves through Ref.pipe()', () => {
    registerPipe('exclaim', (v) => `${String(v)}!`)
    const store = new Store({ items: [{ id: 'a', text: 'hello' }], key: 'a' })
    const expr = "items | find:'id',key | dot:'text' | exclaim"
    expect(evaluateExpression(expr, store)).toBe('hello!')
  })
})
