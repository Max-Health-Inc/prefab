/**
 * stringifyValue tests — value → string coercion for display and identity.
 *
 * The point of the helper is that no reachable input renders as
 * `[object Object]`, since every table cell, chart label and state-bound input
 * feeds it a value typed `unknown`.
 */

import { describe, it, expect } from 'bun:test'
import { stringifyValue } from '../src/core/stringify'

describe('stringifyValue — primitives', () => {
  it('renders null and undefined as an empty string', () => {
    expect(stringifyValue(null)).toBe('')
    expect(stringifyValue(undefined)).toBe('')
  })

  it('passes strings through verbatim', () => {
    expect(stringifyValue('hello')).toBe('hello')
    expect(stringifyValue('')).toBe('')
    expect(stringifyValue('[object Object]')).toBe('[object Object]')
  })

  it('coerces numbers, booleans and bigints', () => {
    expect(stringifyValue(42)).toBe('42')
    expect(stringifyValue(0)).toBe('0')
    expect(stringifyValue(-1.5)).toBe('-1.5')
    expect(stringifyValue(NaN)).toBe('NaN')
    expect(stringifyValue(true)).toBe('true')
    expect(stringifyValue(false)).toBe('false')
    expect(stringifyValue(9007199254740993n)).toBe('9007199254740993')
  })
})

describe('stringifyValue — objects', () => {
  it('never renders an object as [object Object]', () => {
    expect(stringifyValue({ a: 1 })).toBe('{"a":1}')
    expect(stringifyValue({})).toBe('{}')
    expect(stringifyValue({ nested: { b: [1, 2] } })).toBe('{"nested":{"b":[1,2]}}')
  })

  it('honours toJSON()', () => {
    expect(stringifyValue({ toJSON: () => ({ id: 'x' }) })).toBe('{"id":"x"}')
  })

  it('falls back to an empty string when toJSON() yields undefined', () => {
    expect(stringifyValue({ toJSON: () => undefined })).toBe('')
  })

  it('survives circular structures', () => {
    const cyclic: Record<string, unknown> = { name: 'loop' }
    cyclic.self = cyclic
    expect(stringifyValue(cyclic)).toBe('')
  })

  it('renders dates as ISO strings', () => {
    expect(stringifyValue(new Date('2026-07-31T10:20:30.000Z'))).toBe('2026-07-31T10:20:30.000Z')
    expect(stringifyValue(new Date('not a date'))).toBe('')
  })
})

describe('stringifyValue — arrays', () => {
  it('joins members with a comma', () => {
    expect(stringifyValue([1, 2, 3])).toBe('1, 2, 3')
    expect(stringifyValue(['a', 'b'])).toBe('a, b')
    expect(stringifyValue([])).toBe('')
  })

  it('stringifies object members instead of blanking them', () => {
    expect(stringifyValue([{ a: 1 }, { b: 2 }])).toBe('{"a":1}, {"b":2}')
  })

  it('renders holes and nullish members as empty entries', () => {
    expect(stringifyValue([1, null, 3])).toBe('1, , 3')
  })
})

describe('stringifyValue — identity use', () => {
  it('distinguishes objects that String() would collide', () => {
    expect(stringifyValue({ id: 1 })).not.toBe(stringifyValue({ id: 2 }))
  })

  it('is stable for equal values, so it works as a lookup key', () => {
    expect(stringifyValue({ id: 1, name: 'a' })).toBe(stringifyValue({ id: 1, name: 'a' }))
  })

  it('keeps numeric and string keys comparable', () => {
    expect(stringifyValue(7)).toBe(stringifyValue('7'))
  })
})
