/**
 * fieldsFromJsonSchema — JSON Schema in, form fields out.
 *
 * The round-trip against `formSchema()` is the invariant worth holding: the two
 * functions are inverses, so a field list that survives a trip through the
 * elicitation schema and back must describe the same form.
 */

import { describe, expect, test } from 'bun:test'
import { fieldsFromJsonSchema } from '../src/auto/schema.js'
import { formSchema } from '../src/mcp/input-required.js'
import { autoForm } from '../src/auto/form.js'
import type { AutoFormField } from '../src/auto/form.js'

const SCHEMA = {
  type: 'object',
  required: ['email', 'seats'],
  properties: {
    email: { type: 'string', format: 'email', title: 'Email address' },
    seats: { type: 'integer', minimum: 1, maximum: 50, description: 'How many people' },
    plan: { type: 'string', enum: ['pro', 'team'], default: 'pro' },
    tags: { type: 'array', items: { type: 'string', enum: ['a', 'b'] }, maxItems: 2 },
    agree: { type: 'boolean', default: false },
    homepage: { type: 'string', format: 'uri' },
    starts: { type: 'string', format: 'date-time' },
    secret: { type: 'string', format: 'password', maxLength: 64 },
  },
}

const byName = (fields: AutoFormField[], name: string): AutoFormField | undefined =>
  fields.find(f => f.name === name)

describe('fieldsFromJsonSchema', () => {
  test('maps formats onto real input types', () => {
    const fields = fieldsFromJsonSchema(SCHEMA)
    expect(byName(fields, 'email')?.type).toBe('email')
    expect(byName(fields, 'homepage')?.type).toBe('url')
    expect(byName(fields, 'starts')?.type).toBe('datetime-local')
    expect(byName(fields, 'secret')?.type).toBe('password')
    expect(byName(fields, 'agree')?.type).toBe('checkbox')
  })

  test('renders an integer as a number field, not as type="integer"', () => {
    const seats = byName(fieldsFromJsonSchema(SCHEMA), 'seats')
    expect(seats?.type).toBe('number')
    expect(seats?.min).toBe(1)
    expect(seats?.max).toBe(50)
  })

  test('carries required, title, description and default across', () => {
    const fields = fieldsFromJsonSchema(SCHEMA)
    expect(byName(fields, 'email')?.required).toBe(true)
    expect(byName(fields, 'email')?.label).toBe('Email address')
    expect(byName(fields, 'seats')?.description).toBe('How many people')
    expect(byName(fields, 'plan')?.default).toBe('pro')
    expect(byName(fields, 'agree')?.default).toBe(false)
    expect(byName(fields, 'plan')?.required).toBeUndefined()
  })

  test('an enum becomes options, an enum array becomes a multi-select', () => {
    const fields = fieldsFromJsonSchema(SCHEMA)
    expect(byName(fields, 'plan')?.options).toEqual([{ value: 'pro' }, { value: 'team' }])
    expect(byName(fields, 'tags')?.multiple).toBe(true)
    expect(byName(fields, 'tags')?.max).toBe(2)
  })

  test('string length bounds land on min/max', () => {
    expect(byName(fieldsFromJsonSchema(SCHEMA), 'secret')?.max).toBe(64)
  })

  test('a const is an enum of one', () => {
    const fields = fieldsFromJsonSchema({
      type: 'object',
      properties: { kind: { const: 'patient' } },
    })
    expect(fields[0]?.options).toEqual([{ value: 'patient' }])
  })
})

describe('fieldsFromJsonSchema — what it refuses to render', () => {
  test('skips nested objects and arrays of objects', () => {
    const fields = fieldsFromJsonSchema({
      type: 'object',
      properties: {
        name: { type: 'string' },
        address: { type: 'object', properties: { city: { type: 'string' } } },
        contacts: { type: 'array', items: { type: 'object', properties: { tel: { type: 'string' } } } },
        freeform: { type: 'array', items: { type: 'string' } },
      },
    })
    expect(fields.map(f => f.name)).toEqual(['name'])
  })

  test('skips readOnly properties unless asked for them', () => {
    const schema = {
      type: 'object',
      properties: { id: { type: 'string', readOnly: true }, name: { type: 'string' } },
    }
    expect(fieldsFromJsonSchema(schema).map(f => f.name)).toEqual(['name'])
    expect(fieldsFromJsonSchema(schema, { includeReadOnly: true }).map(f => f.name)).toEqual(['id', 'name'])
  })

  test('returns an empty list for anything that is not an object schema', () => {
    expect(fieldsFromJsonSchema(undefined)).toEqual([])
    expect(fieldsFromJsonSchema({ type: 'string' })).toEqual([])
    expect(fieldsFromJsonSchema({ type: 'array', items: { type: 'string' } })).toEqual([])
  })

  test('honours exclude and include', () => {
    expect(fieldsFromJsonSchema(SCHEMA, { exclude: ['email', 'seats'] }).map(f => f.name))
      .not.toContain('email')
    expect(fieldsFromJsonSchema(SCHEMA, { include: ['plan', 'email', 'nope'] }).map(f => f.name))
      .toEqual(['plan', 'email'])
  })
})

describe('fieldsFromJsonSchema — unions', () => {
  test('resolves a nullable field to its one control', () => {
    const fields = fieldsFromJsonSchema({
      type: 'object',
      properties: {
        a: { type: ['string', 'null'], format: 'email' },
        b: { anyOf: [{ type: 'number' }, { type: 'null' }] },
      },
    })
    expect(byName(fields, 'a')?.type).toBe('email')
    expect(byName(fields, 'b')?.type).toBe('number')
  })

  test("resolves Elysia's coercion union to the type it means", () => {
    // t.Integer() compiles to a string branch (so a query string can carry it)
    // plus the integer branch that says what the value actually is.
    const fields = fieldsFromJsonSchema({
      type: 'object',
      properties: {
        limit: {
          title: 'Limit',
          anyOf: [{ type: 'string', format: 'integer' }, { type: 'integer', minimum: 1 }],
        },
      },
    })
    expect(fields[0]?.type).toBe('number')
    expect(fields[0]?.min).toBe(1)
    expect(fields[0]?.label).toBe('Limit')
  })

  test('an enum branch wins over a bare type branch', () => {
    const fields = fieldsFromJsonSchema({
      type: 'object',
      properties: { mode: { anyOf: [{ type: 'string' }, { type: 'string', enum: ['on', 'off'] }] } },
    })
    expect(fields[0]?.options).toEqual([{ value: 'on' }, { value: 'off' }])
  })

  test('a union with no renderable branch is skipped', () => {
    const fields = fieldsFromJsonSchema({
      type: 'object',
      properties: { weird: { anyOf: [{ type: 'null' }, { type: 'object' }] } },
    })
    expect(fields).toEqual([])
  })
})

describe('fieldsFromJsonSchema ∘ formSchema', () => {
  const FIELDS: AutoFormField[] = [
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'age', label: 'Age', type: 'number', min: 18, max: 120 },
    { name: 'agree', label: 'Agree', type: 'checkbox', required: true },
    { name: 'plan', label: 'Plan', options: [{ value: 'pro' }, { value: 'team' }] },
    { name: 'tags', label: 'Tags', options: [{ value: 'a' }, { value: 'b' }], multiple: true },
    { name: 'homepage', label: 'Homepage', type: 'url' },
    { name: 'starts', label: 'Starts', type: 'date' },
  ]

  test('a field list survives the round trip through the elicitation schema', () => {
    expect(fieldsFromJsonSchema(formSchema(FIELDS))).toEqual(FIELDS)
  })

  test('the derived fields still build a form', () => {
    const form = autoForm(fieldsFromJsonSchema(SCHEMA), 'create_account', { title: 'New account' })
    expect(JSON.stringify(form.toJSON())).toContain('create_account')
  })
})
