/**
 * Multi Round-Trip input requests (protocol revision 2026-07-28).
 *
 * The restricted elicitation schema is the part worth pinning: it is the one
 * thing prefab hands to a client that prefab does not render itself, and the
 * wire only accepts a flat object of primitives.
 */

import { describe, expect, test } from 'bun:test'
import { acceptedFormInput, formInputRequest, formSchema, inputResponse } from '../src/mcp/input-required.js'
import { display_form } from '../src/mcp/display.js'
import type { AutoFormField } from '../src/auto/form.js'
import type { McpInputResponses, McpPrimitiveSchema } from '../src/mcp/types.js'

const FIELDS: AutoFormField[] = [
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'age', type: 'number', min: 18, max: 120 },
  { name: 'agree', type: 'checkbox', required: true },
  { name: 'plan', options: [{ value: 'pro', label: 'Pro' }, { value: 'team' }] },
  { name: 'tags', options: [{ value: 'a' }, { value: 'b' }], multiple: true },
  { name: 'homepage', type: 'url' },
  { name: 'starts', type: 'date' },
]

/** Keys the restricted wire schema allows, per primitive type. */
const ALLOWED_KEYS = new Set([
  'type', 'title', 'description', 'default',
  'minLength', 'maxLength', 'format',
  'minimum', 'maximum',
  'enum', 'oneOf',
  'items', 'minItems', 'maxItems',
])

describe('formSchema', () => {
  const schema = formSchema(FIELDS)

  test('is a flat object of primitives', () => {
    expect(schema.type).toBe('object')
    for (const [name, prop] of Object.entries(schema.properties)) {
      expect(['string', 'number', 'integer', 'boolean', 'array']).toContain(prop.type)
      for (const key of Object.keys(prop)) {
        expect(ALLOWED_KEYS.has(key)).toBe(true)
      }
      // Nesting is what the restricted subset exists to forbid.
      expect(JSON.stringify(prop)).not.toContain('"properties"')
      expect(name).not.toContain('.')
    }
  })

  test('lists only the required fields', () => {
    expect(schema.required).toEqual(['email', 'agree'])
  })

  test('maps types onto wire formats and bounds', () => {
    expect(schema.properties.email).toMatchObject({ type: 'string', format: 'email' })
    expect(schema.properties.homepage).toMatchObject({ type: 'string', format: 'uri' })
    expect(schema.properties.starts).toMatchObject({ type: 'string', format: 'date' })
    expect(schema.properties.age).toMatchObject({ type: 'number', minimum: 18, maximum: 120 })
    expect(schema.properties.agree).toMatchObject({ type: 'boolean' })
  })

  test('turns options into an enum and multiple into an enum array', () => {
    expect(schema.properties.plan).toMatchObject({ type: 'string', enum: ['pro', 'team'] })
    expect(schema.properties.tags).toMatchObject({ type: 'array', items: { type: 'string', enum: ['a', 'b'] } })
  })

  test('titles a field from its name when no label is given', () => {
    const [prop] = Object.values(formSchema([{ name: 'first_name' }]).properties) as McpPrimitiveSchema[]
    expect(prop.title).toBe('First Name')
  })

  test('gives a password field no format it cannot honour', () => {
    const prop = formSchema([{ name: 'secret', type: 'password' }]).properties.secret
    expect(prop).toEqual({ type: 'string', title: 'Secret' })
  })
})

describe('formInputRequest', () => {
  test('stamps the discriminator a client needs in order to retry', () => {
    const result = formInputRequest(FIELDS, { key: 'signup', message: 'Sign up' })
    expect(result.resultType).toBe('input_required')
    expect(result.inputRequests?.signup).toMatchObject({
      method: 'elicitation/create',
      params: { mode: 'form', message: 'Sign up' },
    })
  })

  test('defaults the response key to form', () => {
    expect(Object.keys(formInputRequest(FIELDS).inputRequests ?? {})).toEqual(['form'])
  })

  test('passes requestState through untouched', () => {
    expect(formInputRequest(FIELDS, { requestState: 'signed.token' }).requestState).toBe('signed.token')
  })

  test('refuses an empty field list rather than asking for nothing', () => {
    expect(() => formInputRequest([])).toThrow(TypeError)
  })
})

describe('display_form', () => {
  test('renders prefab UI by default', () => {
    const result = display_form(FIELDS, 'signup')
    expect(result.structuredContent.$prefab).toBeDefined()
  })

  test('returns an input_required result when asked to elicit', () => {
    const result = display_form(FIELDS, 'signup', { elicit: true, title: 'Create your account' })
    expect(result.resultType).toBe('input_required')
    expect(result.inputRequests?.form.params.message).toBe('Create your account')
  })

  test('lets an explicit message win over the form title', () => {
    const result = display_form(FIELDS, 'signup', { elicit: { message: 'Just the email' }, title: 'Create' })
    expect(result.inputRequests?.form.params.message).toBe('Just the email')
  })

  test('asks for exactly what the rendered form asks for', () => {
    const elicited = display_form(FIELDS, 'signup', { elicit: true })
    const request = elicited.inputRequests?.form
    const requested = request != null && 'requestedSchema' in request.params
      ? Object.keys(request.params.requestedSchema.properties)
      : []
    expect(requested).toEqual(FIELDS.map(f => f.name))
  })
})

describe('acceptedFormInput', () => {
  const accepted = (content: Record<string, unknown>): McpInputResponses =>
    ({ form: { action: 'accept', content: content as Record<string, string | number | boolean | string[]> } })

  test('returns the values once every required field has arrived', () => {
    const values = acceptedFormInput(accepted({ email: 'a@b.com', agree: true, age: 30 }), 'form', FIELDS)
    expect(values).toEqual({ email: 'a@b.com', agree: true, age: 30 })
  })

  test('withholds the answer while a required field is missing', () => {
    expect(acceptedFormInput(accepted({ email: 'a@b.com' }), 'form', FIELDS)).toBeUndefined()
  })

  test('drops a field the schema never asked for', () => {
    const values = acceptedFormInput(accepted({ email: 'a@b.com', agree: true, isAdmin: true }), 'form', FIELDS)
    expect(values).not.toHaveProperty('isAdmin')
  })

  test('drops a value of the wrong type', () => {
    const values = acceptedFormInput(accepted({ email: 'a@b.com', agree: true, age: 'thirty' }), 'form', FIELDS)
    expect(values).not.toHaveProperty('age')
  })

  test('drops a number outside the bounds it advertised', () => {
    const values = acceptedFormInput(accepted({ email: 'a@b.com', agree: true, age: 7 }), 'form', FIELDS)
    expect(values).not.toHaveProperty('age')
  })

  test('drops an enum value that was never offered', () => {
    const values = acceptedFormInput(accepted({ email: 'a@b.com', agree: true, plan: 'enterprise' }), 'form', FIELDS)
    expect(values).not.toHaveProperty('plan')
  })

  test('drops a multi-select carrying an unoffered value', () => {
    const values = acceptedFormInput(accepted({ email: 'a@b.com', agree: true, tags: ['a', 'z'] }), 'form', FIELDS)
    expect(values).not.toHaveProperty('tags')
  })

  test('treats a decline like a first entry, and says so through inputResponse', () => {
    const declined: McpInputResponses = { form: { action: 'decline' } }
    expect(acceptedFormInput(declined, 'form', FIELDS)).toBeUndefined()
    expect(inputResponse(declined, 'form')?.action).toBe('decline')
  })

  test('is undefined before the first round', () => {
    expect(acceptedFormInput(undefined, 'form', FIELDS)).toBeUndefined()
  })
})
