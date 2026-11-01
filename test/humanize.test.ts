import { describe, it, expect } from 'bun:test'
import { humanizeKey, humanizeColumnKey } from '../src/core/humanize'
import { formSchema } from '../src/mcp/input-required'

describe('humanizeKey', () => {
  it('gives camelCase, snake_case and kebab-case the same sentence-case label', () => {
    expect(humanizeKey('firstName')).toBe('First name')
    expect(humanizeKey('first_name')).toBe('First name')
    expect(humanizeKey('first-name')).toBe('First name')
    expect(humanizeKey('proposedStartDate')).toBe('Proposed start date')
  })

  it('keeps acronyms whole', () => {
    expect(humanizeKey('userID')).toBe('User ID')
    expect(humanizeKey('HTMLContent')).toBe('HTML content')
    expect(humanizeKey('patientMRN')).toBe('Patient MRN')
  })

  it('reads id as ID in column headers', () => {
    expect(humanizeColumnKey('userId')).toBe('User ID')
    expect(humanizeColumnKey('user_id')).toBe('User ID')
  })
})

describe('formSchema titles', () => {
  it('title a field the way autoForm labels it', () => {
    const { properties } = formSchema([{ name: 'firstName' }, { name: 'zip_code' }])
    expect(properties.firstName?.title).toBe(humanizeKey('firstName'))
    expect(properties.zip_code?.title).toBe(humanizeKey('zip_code'))
  })
})
