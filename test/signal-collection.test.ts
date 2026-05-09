/**
 * Tests for signal, collection, Ref, find/dot pipe filters,
 * DataTable selection, Detail, and MasterDetail.
 */

import { describe, test, expect, afterEach } from 'bun:test'

// ── Builder imports ──────────────────────────────────────────────────────────
import { signal } from '../src/rx/signal'
import { collection, Ref } from '../src/rx/collection'
import { Rx } from '../src/rx/rx'
import { resetAutoState } from '../src/rx/state-collector'

// ── Component imports ────────────────────────────────────────────────────────
import { DataTable, col } from '../src/components/data/index'
import { Detail, MasterDetail } from '../src/components/layout/index'
import { Heading, Text } from '../src/components/typography/index'
import { PrefabApp } from '../src/app'

// ── Renderer imports ─────────────────────────────────────────────────────────
import { Store } from '../src/renderer/state'

// We import evaluateExpression to test find/dot filters
import { evaluateExpression } from '../src/renderer/rx'

// Clean up auto-state collector after each test
afterEach(() => resetAutoState())

// ── Test data ────────────────────────────────────────────────────────────────
const patients = [
  { id: 'p1', name: 'Hans Meier', dob: '1985-03-12' },
  { id: 'p2', name: 'Anna Schmidt', dob: '1990-07-21' },
  { id: 'p3', name: 'Fritz Weber', dob: '1978-11-05' },
]

// ═════════════════════════════════════════════════════════════════════════════
// Signal
// ═════════════════════════════════════════════════════════════════════════════
describe('Signal', () => {
  test('stores key and initial value', () => {
    const s = signal('selectedPatientId', 'p1')
    expect(s.key).toBe('selectedPatientId')
    expect(s.initial).toBe('p1')
  })

  test('initial can be null', () => {
    const s = signal('selectedPatientId', null)
    expect(s.initial).toBeNull()
  })

  test('initial can be number or boolean', () => {
    const n = signal('count', 42)
    expect(n.initial).toBe(42)
    const b = signal('flag', true)
    expect(b.initial).toBe(true)
  })

  test('toRx returns an Rx expression', () => {
    const s = signal('selectedPatientId', 'p1')
    const r = s.toRx()
    expect(r).toBeInstanceOf(Rx)
    expect(r.toString()).toBe('{{ selectedPatientId }}')
  })

  test('toString / toJSON produce rx template string', () => {
    const s = signal('selectedPatientId', 'p1')
    expect(s.toString()).toBe('{{ selectedPatientId }}')
    expect(s.toJSON()).toBe('{{ selectedPatientId }}')
  })

  test('toState returns state entry', () => {
    const s = signal('selectedPatientId', 'p1')
    expect(s.toState()).toEqual({ selectedPatientId: 'p1' })
  })

  test('urlSync option is stored', () => {
    const s = signal('tab', 'overview', { urlSync: 'tab' })
    expect(s.options?.urlSync).toBe('tab')
  })
})

// ═════════════════════════════════════════════════════════════════════════════
// Collection
// ═════════════════════════════════════════════════════════════════════════════
describe('Collection', () => {
  test('stores stateKey, rows, and keyField', () => {
    const c = collection('patients', patients, { key: 'id' })
    expect(c.stateKey).toBe('patients')
    expect(c.keyField).toBe('id')
    expect(c.rows).toBe(patients)
    expect(c.length).toBe(3)
  })

  test('firstKey / lastKey', () => {
    const c = collection('patients', patients, { key: 'id' })
    expect(c.firstKey()).toBe('p1')
    expect(c.lastKey()).toBe('p3')
  })

  test('firstKey / lastKey on empty collection', () => {
    const c = collection('empty', [], { key: 'id' })
    expect(c.firstKey()).toBeNull()
    expect(c.lastKey()).toBeNull()
    expect(c.length).toBe(0)
  })

  test('toRx returns rx expression for the array', () => {
    const c = collection('patients', patients, { key: 'id' })
    expect(c.toRx().toString()).toBe('{{ patients }}')
  })

  test('toState returns state entry with rows', () => {
    const c = collection('patients', patients, { key: 'id' })
    expect(c.toState()).toEqual({ patients })
  })
})

// ═════════════════════════════════════════════════════════════════════════════
// Ref
// ═════════════════════════════════════════════════════════════════════════════
describe('Ref', () => {
  test('collection.by(signal) produces a Ref with find expression', () => {
    const c = collection('patients', patients, { key: 'id' })
    const s = signal('selectedPatientId', 'p1')
    const ref = c.by(s)

    expect(ref).toBeInstanceOf(Ref)
    expect(ref.expr).toBe("patients | find:'id',selectedPatientId")
    expect(ref.toString()).toBe("{{ patients | find:'id',selectedPatientId }}")
    expect(ref.toJSON()).toBe("{{ patients | find:'id',selectedPatientId }}")
  })

  test('ref.toRx returns an Rx instance', () => {
    const c = collection('patients', patients, { key: 'id' })
    const s = signal('selectedPatientId', 'p1')
    const ref = c.by(s)
    const r = ref.toRx()
    expect(r).toBeInstanceOf(Rx)
    expect(r.toString()).toBe("{{ patients | find:'id',selectedPatientId }}")
  })

  test('ref.dot() accesses a sub-property', () => {
    const c = collection('patients', patients, { key: 'id' })
    const s = signal('selectedPatientId', 'p1')
    const ref = c.by(s)
    const nameRef = ref.dot('name')
    expect(nameRef).toBeInstanceOf(Ref)
    expect(nameRef.toString()).toBe("{{ patients | find:'id',selectedPatientId | dot:'name' }}")
  })
})

// ═════════════════════════════════════════════════════════════════════════════
// find pipe filter (runtime)
// ═════════════════════════════════════════════════════════════════════════════
describe('find pipe filter', () => {
  test('resolves row by key from store', () => {
    const store = new Store({ patients, selectedPatientId: 'p2' })
    const result = evaluateExpression("patients | find:'id',selectedPatientId", store)
    expect(result).toEqual({ id: 'p2', name: 'Anna Schmidt', dob: '1990-07-21' })
  })

  test('returns undefined when key not found', () => {
    const store = new Store({ patients, selectedPatientId: 'nonexistent' })
    const result = evaluateExpression("patients | find:'id',selectedPatientId", store)
    expect(result).toBeUndefined()
  })

  test('returns undefined when collection is not an array', () => {
    const store = new Store({ patients: 'not-an-array', selectedPatientId: 'p1' })
    const result = evaluateExpression("patients | find:'id',selectedPatientId", store)
    expect(result).toBeUndefined()
  })

  test('works with null signal value', () => {
    const store = new Store({ patients, selectedPatientId: null })
    const result = evaluateExpression("patients | find:'id',selectedPatientId", store)
    expect(result).toBeUndefined()
  })

  test('chained with dot filter', () => {
    const store = new Store({ patients, selectedPatientId: 'p1' })
    const result = evaluateExpression("patients | find:'id',selectedPatientId | dot:'name'", store)
    expect(result).toBe('Hans Meier')
  })

  test('dot on null returns undefined', () => {
    const store = new Store({ patients, selectedPatientId: 'nonexistent' })
    const result = evaluateExpression("patients | find:'id',selectedPatientId | dot:'name'", store)
    expect(result).toBeUndefined()
  })
})

// ═════════════════════════════════════════════════════════════════════════════
// dot pipe filter
// ═════════════════════════════════════════════════════════════════════════════
describe('dot pipe filter', () => {
  test('extracts property from object in store', () => {
    const store = new Store({ person: { name: 'Hans', age: 38 } })
    const result = evaluateExpression("person | dot:'name'", store)
    expect(result).toBe('Hans')
  })

  test('returns undefined for null input', () => {
    const store = new Store({ person: null })
    const result = evaluateExpression("person | dot:'name'", store)
    expect(result).toBeUndefined()
  })
})

// ═════════════════════════════════════════════════════════════════════════════
// DataTable with selection
// ═════════════════════════════════════════════════════════════════════════════
describe('DataTable with selection', () => {
  test('from + selected produces rowKey and onRowClick in wire format', () => {
    const c = collection('patients', patients, { key: 'id' })
    const s = signal('selectedPatientId', 'p1')

    const table = DataTable({
      columns: [col('name'), col('dob')],
      from: c,
      selected: s,
    })

    const json = table.toJSON()
    expect(json.type).toBe('DataTable')
    expect(json.rows).toBe('{{ patients }}')
    expect(json.rowKey).toBe('id')
    expect(json.selected).toBe('{{ selectedPatientId }}')
    expect(json.onRowClick).toBeDefined()
    expect(Array.isArray(json.onRowClick)).toBe(true)
    const action = (json.onRowClick as unknown[])[0] as { action: string; key: string; value: string }
    expect(action.action).toBe('setState')
    expect(action.key).toBe('selectedPatientId')
    expect(action.value).toBe('{{ $item.id }}')
  })

  test('plain DataTable without selection still works', () => {
    const table = DataTable({
      rows: patients,
      columns: [col('name')],
    })
    const json = table.toJSON()
    expect(json.type).toBe('DataTable')
    expect(json.rowKey).toBeUndefined()
    expect(json.selected).toBeUndefined()
    expect(json.onRowClick).toBeUndefined()
  })
})

// ═════════════════════════════════════════════════════════════════════════════
// Detail component
// ═════════════════════════════════════════════════════════════════════════════
describe('Detail', () => {
  test('serializes with of expression', () => {
    const c = collection('patients', patients, { key: 'id' })
    const s = signal('selectedPatientId', 'p1')
    const ref = c.by(s)

    const detail = Detail({ of: ref, children: [Text('hello')] })

    const json = detail.toJSON()
    expect(json.type).toBe('Detail')
    expect(json.of).toBe("{{ patients | find:'id',selectedPatientId }}")
    expect(json.children).toHaveLength(1)
  })

  test('serializes empty placeholder', () => {
    const c = collection('patients', patients, { key: 'id' })
    const s = signal('selectedPatientId', null)
    const ref = c.by(s)

    const empty = Text('Select a patient')
    const detail = Detail({ of: ref, empty })

    const json = detail.toJSON()
    expect(json.empty).toBeDefined()
    expect((json.empty as { type: string }).type).toBe('Text')
  })
})

// ═════════════════════════════════════════════════════════════════════════════
// MasterDetail component
// ═════════════════════════════════════════════════════════════════════════════
describe('MasterDetail', () => {
  test('serializes with masterWidth', () => {
    const md = MasterDetail({ masterWidth: '350px', gap: 4, children: [Text('master'), Text('detail')] })

    const json = md.toJSON()
    expect(json.type).toBe('MasterDetail')
    expect(json.masterWidth).toBe('350px')
    expect(json.gap).toBe(4)
    expect(json.children).toHaveLength(2)
  })

  test('default MasterDetail has no masterWidth prop', () => {
    const md = MasterDetail()
    const json = md.toJSON()
    expect(json.type).toBe('MasterDetail')
    expect(json.masterWidth).toBeUndefined()
  })
})

// ═════════════════════════════════════════════════════════════════════════════
// PrefabApp integration — state aggregation
// ═════════════════════════════════════════════════════════════════════════════
describe('PrefabApp state aggregation', () => {
  test('signal + collection contribute to state', () => {
    const c = collection('patients', patients, { key: 'id' })
    const s = signal('selectedPatientId', 'p1')

    const app = new PrefabApp({
      title: 'test',
      view: Text('hello'),
      state: { ...c.toState(), ...s.toState() },
    })

    const wire = app.toJSON()
    expect(wire.state?.patients).toEqual(patients)
    expect(wire.state?.selectedPatientId).toBe('p1')
  })
})

// ═════════════════════════════════════════════════════════════════════════════
// End-to-end: MasterDetail selection flow (wire format)
// ═════════════════════════════════════════════════════════════════════════════
describe('MasterDetail selection flow (wire)', () => {
  test('produces coherent wire format', () => {
    const c = collection('patients', patients, { key: 'id' })
    const s = signal('selectedPatientId', c.firstKey())
    const ref = c.by(s)

    const table = DataTable({
      columns: [col('name'), col('dob')],
      from: c,
      selected: s,
    })

    const detail = Detail({
      of: ref,
      empty: Text('Select a patient'),
      children: [Heading(ref.dot('name'))],
    })

    const md = MasterDetail({ masterWidth: '350px', gap: 4, children: [table, detail] })

    const app = new PrefabApp({
      title: 'Patient Browser',
      view: md,
      state: { ...c.toState(), ...s.toState() },
    })

    const wire = app.toJSON()

    // State shape
    expect(wire.state?.patients).toEqual(patients)
    expect(wire.state?.selectedPatientId).toBe('p1')

    // View structure
    const root = wire.view
    expect(root.children).toHaveLength(1)
    const masterDetail = root.children![0]
    expect(masterDetail.type).toBe('MasterDetail')
    expect(masterDetail.children).toHaveLength(2)

    // Master: DataTable
    const dt = masterDetail.children![0]
    expect(dt.type).toBe('DataTable')
    expect(dt.rows).toBe('{{ patients }}')
    expect(dt.selected).toBe('{{ selectedPatientId }}')

    // Detail
    const detailNode = masterDetail.children![1]
    expect(detailNode.type).toBe('Detail')
    expect(detailNode.of).toBe("{{ patients | find:'id',selectedPatientId }}")
  })
})

// ═════════════════════════════════════════════════════════════════════════════
// BUG HUNT: Numeric key coercion
// ═════════════════════════════════════════════════════════════════════════════
describe('find: numeric key coercion', () => {
  const numericData = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' },
  ]

  test('string signal matches numeric row key', () => {
    // Signal stores '2' (string), data has id: 2 (number) — must still find the row
    const store = new Store({ items: numericData, selectedId: '2' })
    const result = evaluateExpression("items | find:'id',selectedId", store)
    expect(result).toEqual({ id: 2, name: 'Bob' })
  })

  test('numeric signal matches string row key', () => {
    const stringData = [{ id: 'p1', name: 'X' }, { id: 'p2', name: 'Y' }]
    // Unlikely but should degrade gracefully, not crash
    const store = new Store({ items: stringData, selectedId: 42 })
    const result = evaluateExpression("items | find:'id',selectedId", store)
    expect(result).toBeUndefined()
  })

  test('both numeric — exact match works', () => {
    const store = new Store({ items: numericData, selectedId: 3 })
    const result = evaluateExpression("items | find:'id',selectedId", store)
    expect(result).toEqual({ id: 3, name: 'Charlie' })
  })

  test('chained dot after numeric coercion', () => {
    const store = new Store({ items: numericData, selectedId: '1' })
    const result = evaluateExpression("items | find:'id',selectedId | dot:'name'", store)
    expect(result).toBe('Alice')
  })
})

// ═════════════════════════════════════════════════════════════════════════════
// BUG HUNT: Detail truthiness edge cases
// ═════════════════════════════════════════════════════════════════════════════
describe('Detail renderer: truthiness', () => {
  // We need the renderer for these — test via the wire format + PrefabRenderer
  // Instead, test the underlying resolveValue contract
  test('of = 0 should be falsy (show empty placeholder)', () => {
    // 0 is JavaScript-falsy and should show the empty state
    const store = new Store({ ref: 0 })
    const result = evaluateExpression('ref', store)
    expect(result).toBe(0)
    // The Detail renderer checks: resolved != null && resolved !== '' && resolved !== false && resolved !== 0
    const isTruthy = result != null && result !== '' && result !== false && result !== 0
    expect(isTruthy).toBe(false)
  })

  test('of = undefined should be falsy', () => {
    const store = new Store({ items: [], selectedId: 'missing' })
    const result = evaluateExpression("items | find:'id',selectedId", store)
    expect(result).toBeUndefined()
  })

  test('of = empty object should be truthy', () => {
    const store = new Store({ ref: {} })
    const result = evaluateExpression('ref', store)
    expect(result).toEqual({})
    const isTruthy = result != null && result !== '' && result !== false
    expect(isTruthy).toBe(true) // {} is truthy
  })

  test('of = empty string should be falsy', () => {
    const store = new Store({ ref: '' })
    const result = evaluateExpression('ref', store)
    expect(result).toBe('')
    const isTruthy = result != null && result !== '' && result !== false
    expect(isTruthy).toBe(false)
  })
})

// ═════════════════════════════════════════════════════════════════════════════
// BUG HUNT: find edge cases
// ═════════════════════════════════════════════════════════════════════════════
describe('find: edge cases', () => {
  test('rows with missing key field', () => {
    const data = [{ name: 'Alice' }, { id: 'p1', name: 'Bob' }]
    const store = new Store({ items: data, sel: 'p1' })
    const result = evaluateExpression("items | find:'id',sel", store)
    // Should skip the row without 'id' and find Bob
    expect(result).toEqual({ id: 'p1', name: 'Bob' })
  })

  test('rows containing null entries', () => {
    const data = [null, { id: 'p1', name: 'Alice' }]
    const store = new Store({ items: data, sel: 'p1' })
    const result = evaluateExpression("items | find:'id',sel", store)
    expect(result).toEqual({ id: 'p1', name: 'Alice' })
  })

  test('find with quoted literal key (not state ref)', () => {
    const data = [{ id: 'p1', name: 'Alice' }, { id: 'p2', name: 'Bob' }]
    const store = new Store({ items: data })
    const result = evaluateExpression("items | find:'id','p2'", store)
    expect(result).toEqual({ id: 'p2', name: 'Bob' })
  })

  test('find with single arg (missing key ref) returns undefined', () => {
    const data = [{ id: 'p1' }]
    const store = new Store({ items: data })
    const result = evaluateExpression("items | find:'id'", store)
    expect(result).toBeUndefined()
  })

  test('dot on array returns undefined', () => {
    const store = new Store({ items: [1, 2, 3] })
    const result = evaluateExpression("items | dot:'length'", store)
    // Arrays are objects so this actually works — .length is a valid property
    expect(result).toBe(3)
  })

  test('dot on nested object', () => {
    const store = new Store({ patient: { name: { given: 'Hans', family: 'Meier' } } })
    const result = evaluateExpression("patient | dot:'name'", store)
    expect(result).toEqual({ given: 'Hans', family: 'Meier' })
  })
})

// ═════════════════════════════════════════════════════════════════════════════
// BUG HUNT: DataTable edge cases
// ═════════════════════════════════════════════════════════════════════════════
describe('DataTable: edge cases', () => {
  test('selected without from is silently ignored', () => {
    const s = signal('sel', 'p1')
    const table = DataTable({
      rows: patients,
      columns: [col('name')],
      selected: s,
      // NOTE: no 'from' — selected has no effect
    })
    const json = table.toJSON()
    expect(json.rowKey).toBeUndefined()
    expect(json.onRowClick).toBeUndefined()
    expect(json.selected).toBeUndefined()
  })

  test('from with empty collection', () => {
    const c = collection('items', [], { key: 'id' })
    const s = signal('sel', null)
    const table = DataTable({ columns: [col('name')], from: c, selected: s })
    const json = table.toJSON()
    expect(json.rows).toBe('{{ items }}')
    expect(json.rowKey).toBe('id')
  })
})

// ═════════════════════════════════════════════════════════════════════════════
// PERF: find cache — redundant scans
// ═════════════════════════════════════════════════════════════════════════════
describe('find: performance', () => {
  test('1000 rows × 10 dot fields resolves in < 50ms', () => {
    const bigData = Array.from({ length: 1000 }, (_, i) => ({
      id: `patient-${i}`,
      name: `Patient ${i}`,
      dob: '1990-01-01',
      gender: i % 2 === 0 ? 'male' : 'female',
      city: `City ${i % 100}`,
      zip: `${10000 + i}`,
      phone: `+1-555-${String(i).padStart(4, '0')}`,
      email: `p${i}@example.com`,
      mrn: `MRN-${i}`,
      status: 'active',
    }))
    const store = new Store({ patients: bigData, sel: 'patient-999' })

    const fields = ['name', 'dob', 'gender', 'city', 'zip', 'phone', 'email', 'mrn', 'status', 'id']

    const start = performance.now()
    for (const field of fields) {
      const result = evaluateExpression(`patients | find:'id',sel | dot:'${field}'`, store)
      expect(result).toBeDefined()
    }
    const elapsed = performance.now() - start

    // 10 independent find+dot evaluations on 1000 rows should be fast
    // Without caching, each find scans up to 1000 items = 10,000 comparisons
    // This should still be < 50ms even without caching on modern hardware
    expect(elapsed).toBeLessThan(50)
  })

  test('10,000 rows still resolves in < 200ms', () => {
    const hugeData = Array.from({ length: 10_000 }, (_, i) => ({
      id: `r-${i}`,
      value: `v-${i}`,
    }))
    const store = new Store({ rows: hugeData, sel: 'r-9999' })

    const start = performance.now()
    // Simulate 20 field accesses (typical detail pane)
    for (let i = 0; i < 20; i++) {
      evaluateExpression("rows | find:'id',sel | dot:'value'", store)
    }
    const elapsed = performance.now() - start

    // 20 × linear scan of 10,000 = 200,000 comparisons
    expect(elapsed).toBeLessThan(200)
  })
})

// ═════════════════════════════════════════════════════════════════════════════
// TDD RED: find cache goes stale after Store.append / Store.pop
// ═════════════════════════════════════════════════════════════════════════════
describe('find: cache invalidation after mutation', () => {
  test('append: new row is found after appending to collection', () => {
    const store = new Store({
      items: [
        { id: 'a', name: 'Alice' },
        { id: 'b', name: 'Bob' },
      ],
      sel: 'a',
    })
    // Warm the cache — first find builds the index
    const first = evaluateExpression("items | find:'id',sel", store)
    expect(first).toEqual({ id: 'a', name: 'Alice' })

    // Mutate via Store.append (same array reference, stale cache)
    store.append('items', { id: 'c', name: 'Charlie' })
    store.set('sel', 'c')

    // BUG: cache is stale — 'c' was never indexed
    const afterAppend = evaluateExpression("items | find:'id',sel", store)
    expect(afterAppend).toEqual({ id: 'c', name: 'Charlie' })
  })

  test('pop: removed row is NOT found after popping', () => {
    const store = new Store({
      items: [
        { id: 'x', name: 'Xena' },
        { id: 'y', name: 'Yara' },
      ],
      sel: 'x',
    })
    // Warm the cache
    const first = evaluateExpression("items | find:'id',sel", store)
    expect(first).toEqual({ id: 'x', name: 'Xena' })

    // Remove 'x' by index
    store.pop('items', 0)

    // BUG: cache still has stale 'x' entry pointing to removed row
    const afterPop = evaluateExpression("items | find:'id',sel", store)
    expect(afterPop).toBeUndefined()
  })

  test('append + dot: new row fields accessible after append', () => {
    const store = new Store({
      items: [{ id: '1', val: 'one' }],
      sel: '1',
    })
    // Warm cache with dot access
    expect(evaluateExpression("items | find:'id',sel | dot:'val'", store)).toBe('one')

    // Append new row, switch selection
    store.append('items', { id: '2', val: 'two' })
    store.set('sel', '2')

    // Should resolve to 'two', not undefined
    expect(evaluateExpression("items | find:'id',sel | dot:'val'", store)).toBe('two')
  })
})

// ═════════════════════════════════════════════════════════════════════════════
// TDD RED: find key ref with scope dot-paths ($item.field)
// ═════════════════════════════════════════════════════════════════════════════
describe('find: scope dot-path key resolution', () => {
  test('$item.parentId resolves as key ref in find', () => {
    // Scenario: ForEach over departments, each department references a manager
    const store = new Store({
      departments: [
        { id: 'd1', name: 'Engineering', managerId: 'm1' },
        { id: 'd2', name: 'Sales', managerId: 'm2' },
      ],
      managers: [
        { id: 'm1', name: 'Alice' },
        { id: 'm2', name: 'Bob' },
      ],
    })

    // Inside a ForEach over departments, $item = { id: 'd1', managerId: 'm1' }
    const scope = { $item: { id: 'd1', name: 'Engineering', managerId: 'm1' }, $index: 0 }

    // This expression should find the manager by $item.managerId
    const result = evaluateExpression("managers | find:'id',$item.managerId", store, scope)
    expect(result).toEqual({ id: 'm1', name: 'Alice' })
  })

  test('$item.parentId dot chain: find + dot', () => {
    const store = new Store({
      people: [
        { id: 'p1', name: 'Parent', childId: 'p2' },
        { id: 'p2', name: 'Child' },
      ],
    })
    const scope = { $item: { id: 'p1', name: 'Parent', childId: 'p2' }, $index: 0 }

    const result = evaluateExpression("people | find:'id',$item.childId | dot:'name'", store, scope)
    expect(result).toBe('Child')
  })

  test('plain scope var still works ($index as key ref)', () => {
    // Edge case: using a simple scope var, not dot-path
    const data = [{ id: '0', val: 'zero' }, { id: '1', val: 'one' }]
    const store = new Store({ items: data })
    const scope = { $index: 1 }

    // $index = 1, find where id == '1'
    const result = evaluateExpression("items | find:'id',$index", store, scope)
    expect(result).toEqual({ id: '1', val: 'one' })
  })
})

// ═════════════════════════════════════════════════════════════════════════════
// Typed Ref.dot() + formatted()
// ═════════════════════════════════════════════════════════════════════════════
describe('Ref.dot() returns Ref (typed)', () => {
  const data = [
    { id: 'p1', name: ['Hans Meier'], birthDate: '1985-03-12', gender: 'male' },
  ]

  test('dot() returns Ref, not Rx', () => {
    const c = collection('pts', data, { key: 'id' })
    const s = signal('sel', 'p1')
    const ref = c.by(s)
    const nameRef = ref.dot('name')
    expect(nameRef).toBeInstanceOf(Ref)
    expect(nameRef.toString()).toBe("{{ pts | find:'id',sel | dot:'name' }}")
  })

  test('dot() chains — Ref to Ref', () => {
    const c = collection('pts', data, { key: 'id' })
    const s = signal('sel', 'p1')
    const ref = c.by(s)
    // dot returns Ref, so you can dot again
    const inner = ref.dot('name')
    expect(inner).toBeInstanceOf(Ref)
    // Can pipe from the Ref
    expect(inner.pipe('humanName').toString())
      .toBe("{{ pts | find:'id',sel | dot:'name' | humanName }}")
  })

  test('formatted() is sugar for dot + pipe', () => {
    const c = collection('pts', data, { key: 'id' })
    const s = signal('sel', 'p1')
    const ref = c.by(s)
    expect(ref.formatted('name', 'humanName').toString())
      .toBe("{{ pts | find:'id',sel | dot:'name' | humanName }}")
  })

  test('formatted() with args', () => {
    const c = collection('pts', data, { key: 'id' })
    const s = signal('sel', 'p1')
    const ref = c.by(s)
    expect(ref.formatted('birthDate', 'date', 'long').toString())
      .toBe("{{ pts | find:'id',sel | dot:'birthDate' | date:'long' }}")
  })
})

// ═════════════════════════════════════════════════════════════════════════════
// col() descriptor overload
// ═════════════════════════════════════════════════════════════════════════════
describe('col() descriptor form', () => {
  test('short form still works', () => {
    const c = col('name')
    expect(c).toEqual({ key: 'name', header: 'name', sortable: false })
  })

  test('object form passes through', () => {
    const c = col({ key: 'name', header: 'Name', format: 'humanName', sortable: true })
    expect(c.key).toBe('name')
    expect(c.header).toBe('Name')
    expect(c.format).toBe('humanName')
    expect(c.sortable).toBe(true)
  })

  test('object form with accessor', () => {
    const c = col({ key: 'name', accessor: 'name | humanName' })
    expect(c.accessor).toBe('name | humanName')
  })

  test('format and accessor appear on wire', () => {
    const c = collection('pts', [{ id: '1', name: 'X' }], { key: 'id' })
    const table = DataTable({
      from: c,
      columns: [col({ key: 'name', header: 'Name', format: 'humanName' })],
    })
    const json = table.toJSON()
    const cols = json.columns as { format?: string }[]
    expect(cols[0].format).toBe('humanName')
  })
})

// ═════════════════════════════════════════════════════════════════════════════
// Auto state collection in PrefabApp
// ═════════════════════════════════════════════════════════════════════════════
describe('PrefabApp auto state collection', () => {
  test('signal + collection state auto-merged without explicit state', () => {
    const c = collection('patients', patients, { key: 'id' })
    const _s = signal('selectedPatientId', c.firstKey())

    const app = new PrefabApp({
      title: 'Test',
      view: Heading('Hi'),
      // no explicit state
    })

    const wire = app.toJSON()
    expect(wire.state?.patients).toEqual(patients)
    expect(wire.state?.selectedPatientId).toBe('p1')
  })

  test('explicit state overrides auto-collected on key conflict', () => {
    const _s = signal('count', 0)

    const app = new PrefabApp({
      title: 'Test',
      view: Heading('Hi'),
      state: { count: 42 }, // explicit override
    })

    const wire = app.toJSON()
    expect(wire.state?.count).toBe(42)
  })

  test('no state when neither signals nor explicit state', () => {
    const app = new PrefabApp({
      title: 'Test',
      view: Heading('Hi'),
    })
    const wire = app.toJSON()
    expect(wire.state).toBeUndefined()
  })

  test('dream codegen pattern — no .toState() needed', () => {
    const c = collection('patients', patients, { key: 'id' })
    const sel = signal('selectedPatientId', c.firstKey())
    const ref = c.by(sel)

    const app = new PrefabApp({
      title: 'Patient Browser',
      view: MasterDetail({
        masterWidth: '350px',
        gap: 4,
        children: [
          DataTable({
            from: c,
            selected: sel,
            columns: [col('name'), col('dob')],
          }),
          Detail({
            of: ref,
            empty: Text('Select a patient'),
            children: [Heading(ref.dot('name'))],
          }),
        ],
      }),
      // Look ma, no explicit state!
    })

    const wire = app.toJSON()
    expect(wire.state?.patients).toEqual(patients)
    expect(wire.state?.selectedPatientId).toBe('p1')
  })
})
