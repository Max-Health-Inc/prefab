import { describe, it, expect } from 'bun:test'
import { autoForm, fieldsFromJsonSchema } from '../src/auto/index'
import { registerAllComponents } from '../src/renderer/components/index'
import { makeRenderCtx, renderEl, query, childNodes } from './helpers/render'

registerAllComponents()

function controlTypes(json: unknown): string[] {
  const types: string[] = []
  const walk = (n: unknown): void => {
    for (const child of childNodes(n)) {
      if (typeof child.type === 'string') types.push(child.type)
      walk(child)
    }
  }
  walk(json)
  return types
}

describe('autoForm control types', () => {
  it('renders switch, checkbox and textarea fields as their own controls', () => {
    const json = autoForm([
      { name: 'active', type: 'switch' },
      { name: 'agree', type: 'checkbox' },
      { name: 'notes', type: 'textarea' },
      { name: 'email', type: 'email' },
    ], 'save').toJSON()
    const types = controlTypes(json)
    expect(types).toContain('Switch')
    expect(types).toContain('Checkbox')
    expect(types).toContain('Textarea')
    expect(types.filter(t => t === 'Input')).toHaveLength(1)
  })

  it('renders a JSON-schema boolean as a Checkbox', () => {
    const fields = fieldsFromJsonSchema({ type: 'object', properties: { subscribed: { type: 'boolean', default: true } } })
    expect(controlTypes(autoForm(fields, 'save').toJSON())).toContain('Checkbox')
  })
})

describe('Form submission', () => {
  it('submits checkboxes and switches as booleans, unchecked ones included', () => {
    const ctx = makeRenderCtx()
    const form = renderEl({ type: 'Form', children: [
      { type: 'Checkbox', name: 'agree', checked: true },
      { type: 'Switch', name: 'beta' },
      { type: 'Input', name: 'title' },
    ] }, ctx)
    query(form, 'input[name="title"]', HTMLInputElement).value = 'Hi'
    form.dispatchEvent(new Event('submit', { cancelable: true }))
    expect(ctx.store.get('agree')).toBe(true)
    expect(ctx.store.get('beta')).toBe(false)
    expect(ctx.store.get('title')).toBe('Hi')
  })
})
