/**
 * Formatting pipes and renderer-side validation.
 *
 * Both close gaps that were mine rather than the protocol's: A2UI has no
 * expression language, but its catalog has the formatting functions the common
 * pipes correspond to, and every A2UI input is `Checkable`.
 */

import { describe, expect, test } from 'bun:test'
import { emitA2UI } from '../src/a2ui/emit.js'
import { mappedPipes, parsePipe } from '../src/a2ui/pipes.js'
import type { ComponentJSON } from '../src/core/component.js'
import { allComponents, conformanceErrors } from './helpers/a2ui-validator.js'

const STATE = { price: 10, n: 3, when: '2026-01-01', s: 'text', email: '', flag: false }

const emit = (view: ComponentJSON) => emitA2UI({ $prefab: { version: '0.3' }, view, state: STATE })
const rootOf = (view: ComponentJSON) => {
  const { messages } = emit(view)
  return allComponents(messages).find(c => c.id === 'root')
}
const textFrom = (content: string) => rootOf({ type: 'Text', content })?.text

describe('parsePipe', () => {
  test('reads a bare pipe', () => {
    expect(parsePipe('price | currency')).toEqual({ base: 'price', name: 'currency' })
  })

  test('reads quoted and numeric arguments', () => {
    expect(parsePipe("price | currency:'EUR'")).toEqual({ base: 'price', name: 'currency', arg: 'EUR' })
    expect(parsePipe('n | number:2')).toEqual({ base: 'n', name: 'number', arg: 2 })
  })

  test('refuses a chain', () => {
    // No single catalog function is two pipes, and half-translating would change
    // the value silently.
    expect(parsePipe('n | round | currency')).toBeUndefined()
  })

  test('refuses an argument that is itself a reference', () => {
    // A2UI function arguments take a value, not an expression to evaluate.
    expect(parsePipe('n | number:decimals')).toBeUndefined()
  })

  test('is not confused by a plain path', () => {
    expect(parsePipe('user.name')).toBeUndefined()
  })
})

describe('pipes that map onto catalog functions', () => {
  test('currency, with the code prefab defaults to', () => {
    expect(textFrom("{{ price | currency:'EUR' }}"))
      .toEqual({ call: 'formatCurrency', args: { value: { path: '/price' }, currency: 'EUR' } })
    expect(textFrom('{{ price | currency }}'))
      .toEqual({ call: 'formatCurrency', args: { value: { path: '/price' }, currency: 'USD' } })
  })

  test('number and round', () => {
    expect(textFrom('{{ n | number:2 }}'))
      .toEqual({ call: 'formatNumber', args: { value: { path: '/n' }, decimals: 2 } })
    // `round` with no argument means whole numbers.
    expect(textFrom('{{ n | round }}'))
      .toEqual({ call: 'formatNumber', args: { value: { path: '/n' }, decimals: 0 } })
  })

  test('pluralize, using the rule prefab can express', () => {
    expect(textFrom("{{ n | pluralize:'item' }}"))
      .toEqual({ call: 'pluralize', args: { value: { path: '/n' }, one: 'item', other: 'items' } })
  })

  test('the date pipes, reporting the format they had to pick', () => {
    // prefab renders in the reader's locale; A2UI needs an explicit pattern, so
    // the change in appearance is reported rather than made silently.
    const { messages, diagnostics } = emit({ type: 'Text', content: '{{ when | date }}' })
    const root = allComponents(messages).find(c => c.id === 'root')
    expect(root?.text).toEqual({ call: 'formatDate', args: { value: { path: '/when' }, format: 'y-MM-dd' } })
    expect(diagnostics.some(d => d.kind === 'degraded' && d.detail.includes('locale'))).toBe(true)
  })

  test('every mapped pipe emits something the catalog accepts', () => {
    for (const name of mappedPipes()) {
      // An argument every builder can use, so none bails for want of one.
      const { messages } = emit({ type: 'Text', content: `{{ n | ${name}:'x' }}` })
      expect(conformanceErrors(messages), name).toEqual([])
    }
  })
})

describe('pipes that transform rather than format', () => {
  for (const expr of ['s | truncate:10', 's | upper', 'items | join', 'items | selectattr:"a"', 'n | percent']) {
    test(expr, () => {
      // These have no catalog equivalent, so they stay reported rather than
      // being approximated into something that means something else.
      const { messages, diagnostics } = emit({ type: 'Text', content: `{{ ${expr} }}` })
      expect(conformanceErrors(messages)).toEqual([])
      expect(diagnostics.some(d => d.kind === 'expression')).toBe(true)
    })
  }
})

describe('validation checks', () => {
  test('a required field stays required', () => {
    const checks = rootOf({ type: 'Input', name: 'email', label: 'Email', required: true })?.checks
    expect(checks).toEqual([{ condition: { call: 'required', args: { value: { path: '/email' } } } }])
  })

  test('an email field carries the format check too', () => {
    const checks = rootOf({ type: 'Input', name: 'email', label: 'Email', inputType: 'email', required: true })?.checks
    expect(checks).toHaveLength(2)
    expect(JSON.stringify(checks)).toContain('"call":"email"')
  })

  test('a field with nothing to check carries no checks', () => {
    expect(rootOf({ type: 'Input', name: 'a', label: 'A' })?.checks).toBeUndefined()
  })

  test('checkboxes and pickers are checkable too', () => {
    expect(rootOf({ type: 'Checkbox', name: 'flag', label: 'Agree', required: true })?.checks).toBeDefined()
    expect(rootOf({
      type: 'Select',
      name: 's',
      label: 'Pick',
      required: true,
      children: [{ type: 'SelectOption', value: 'a', label: 'A' }],
    })?.checks).toBeDefined()
  })

  test('a number field emits no bare numeric check', () => {
    // The catalog requires `numeric` to carry a min or a max — it is a range
    // check, not a type check — so a bare one fails validation. prefab's number
    // inputs carry no range, and `variant: 'number'` already says it is numeric.
    const view: ComponentJSON = { type: 'Input', name: 'n', label: 'N', inputType: 'number', required: true }
    expect(conformanceErrors(emit(view).messages)).toEqual([])
    expect(JSON.stringify(rootOf(view)?.checks)).not.toContain('numeric')
  })

  test('a form built by autoForm keeps its validation', () => {
    const view: ComponentJSON = {
      type: 'Form',
      children: [
        { type: 'Input', name: 'email', label: 'Email', inputType: 'email', required: true },
        { type: 'Input', name: 'name', label: 'Name', required: true },
      ],
    }
    const { messages } = emit(view)
    expect(conformanceErrors(messages)).toEqual([])
    const checked = allComponents(messages).filter(c => c.checks != null)
    expect(checked).toHaveLength(2)
  })
})
