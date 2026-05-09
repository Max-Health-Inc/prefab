/**
 * Action-builder sugar tests
 */

import { describe, it, expect } from 'bun:test'
import { set, toggle, append, pop } from '../src/actions/sugar'
import { Signal } from '../src/rx/signal'
import { Collection } from '../src/rx/collection'
import { RESULT } from '../src/rx/rx'

// ── Helpers ──────────────────────────────────────────────────────────────────

function sig<T extends string | number | boolean | null>(key: string, initial: T): Signal<T> {
  return new Signal(key, initial)
}

function col<T extends Record<string, unknown>>(stateKey: string, rows: T[], keyField: string): Collection<T> {
  return new Collection(stateKey, rows, keyField)
}

// ── set() ────────────────────────────────────────────────────────────────────

describe('set()', () => {
  it('accepts Signal', () => {
    const count = sig('count', 0)
    expect(set(count, 42).toJSON()).toEqual({
      action: 'setState', key: 'count', value: 42,
    })
  })

  it('accepts Collection', () => {
    const items = col('items', [{ id: '1' }], 'id')
    expect(set(items, []).toJSON()).toEqual({
      action: 'setState', key: 'items', value: [],
    })
  })

  it('accepts raw string key', () => {
    expect(set('theme', 'dark').toJSON()).toEqual({
      action: 'setState', key: 'theme', value: 'dark',
    })
  })

  it('accepts reactive value', () => {
    const count = sig('count', 0)
    expect(set(count, RESULT).toJSON()).toEqual({
      action: 'setState', key: 'count', value: '{{ $result }}',
    })
  })

  it('passes SetStateOpts through', () => {
    const count = sig('count', 0)
    const action = set(count, 1, {
      onSuccess: set('msg', 'done'),
    })
    const json = action.toJSON()
    expect(json.onSuccess).toEqual({ action: 'setState', key: 'msg', value: 'done' })
  })
})

// ── toggle() ─────────────────────────────────────────────────────────────────

describe('toggle()', () => {
  it('accepts Signal', () => {
    const visible = sig('visible', true)
    expect(toggle(visible).toJSON()).toEqual({
      action: 'toggleState', key: 'visible',
    })
  })

  it('accepts raw string key', () => {
    expect(toggle('expanded').toJSON()).toEqual({
      action: 'toggleState', key: 'expanded',
    })
  })
})

// ── append() ─────────────────────────────────────────────────────────────────

describe('append()', () => {
  it('accepts Collection', () => {
    const items = col('items', [], 'id')
    expect(append(items, { id: '2', name: 'New' }).toJSON()).toEqual({
      action: 'appendState', key: 'items', value: { id: '2', name: 'New' },
    })
  })

  it('accepts Signal (array state)', () => {
    const tags = sig('tags', 'placeholder' as string)
    // Even though Signal is scalar-typed, set/append work on any state key
    expect(append(tags, 'urgent').toJSON()).toEqual({
      action: 'appendState', key: 'tags', value: 'urgent',
    })
  })

  it('accepts raw string key', () => {
    expect(append('items', { x: 1 }).toJSON()).toEqual({
      action: 'appendState', key: 'items', value: { x: 1 },
    })
  })

  it('passes insertion index', () => {
    const items = col('items', [], 'id')
    const json = append(items, { id: '0' }, 0).toJSON()
    expect(json.index).toBe(0)
  })
})

// ── pop() ────────────────────────────────────────────────────────────────────

describe('pop()', () => {
  it('accepts Collection + numeric index', () => {
    const items = col('items', [{ id: '1' }], 'id')
    expect(pop(items, 0).toJSON()).toEqual({
      action: 'popState', key: 'items', index: 0,
    })
  })

  it('accepts Collection + string value', () => {
    const items = col('items', [{ id: '1' }], 'id')
    expect(pop(items, '1').toJSON()).toEqual({
      action: 'popState', key: 'items', index: '1',
    })
  })

  it('defaults to last element (-1) when no index given', () => {
    const items = col('items', [{ id: '1' }, { id: '2' }], 'id')
    expect(pop(items).toJSON()).toEqual({
      action: 'popState', key: 'items', index: -1,
    })
  })

  it('accepts raw string key', () => {
    expect(pop('items', 2).toJSON()).toEqual({
      action: 'popState', key: 'items', index: 2,
    })
  })
})

// ── Composition ──────────────────────────────────────────────────────────────

describe('sugar composition', () => {
  it('set with onSuccess chain', () => {
    const count = sig('count', 0)
    const msg = sig('message', '')
    const action = set(count, 1, {
      onSuccess: set(msg, 'Updated'),
      onError: set(msg, 'Failed'),
    })
    const json = action.toJSON()
    expect(json).toEqual({
      action: 'setState',
      key: 'count',
      value: 1,
      onSuccess: { action: 'setState', key: 'message', value: 'Updated' },
      onError: { action: 'setState', key: 'message', value: 'Failed' },
    })
  })

  it('works as onClick handler values', () => {
    // Simulate what you'd pass to a Button's onClick
    const selected = sig('selectedId', '')
    const actions = [
      set(selected, 'patient-123'),
      toggle(sig('detailOpen', false)),
    ]
    expect(actions.map(a => a.toJSON())).toEqual([
      { action: 'setState', key: 'selectedId', value: 'patient-123' },
      { action: 'toggleState', key: 'detailOpen' },
    ])
  })
})
