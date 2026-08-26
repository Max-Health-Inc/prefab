/**
 * `required` and `multiple` on the controls that offer a choice.
 *
 * `required` lived on `InputProps`, so only a text input could state it. Select,
 * RadioGroup and Combobox are containers that call `statefulProps` instead of
 * inheriting it — the same seam `label` went missing through — and `autoForm`
 * turns any field carrying `options` into a Select, so exactly the fields with a
 * fixed choice set were the ones that lost their constraint. The A2UI emitter
 * reads `node.required` to build a `ChoicePicker`'s checks, so it could never
 * emit one either.
 *
 * `multiple` was declared on `AutoFormField` and honoured only on the
 * elicitation path: the derived schema asked for an array while the rendered
 * form offered a single choice, from one field definition. A2UI's
 * `multipleSelection` variant had no source component for the same reason.
 *
 * Each layer is asserted separately — wire, DOM, form collection, autoForm and
 * A2UI — because a break in any one of them is silent at every other.
 *
 * @happy-dom
 */
import { describe, it, expect, beforeEach } from 'bun:test'
import { Select, SelectOption, Input, RadioGroup, Radio } from '../src/components/form'
import { autoForm } from '../src/auto/form'
import { emitA2UI } from '../src/a2ui/emit'
import { allComponents } from './helpers/a2ui-validator'
import type { A2uiComponent } from '../src/a2ui/types'
import { Store } from '../src/renderer/state'
import { renderNode } from '../src/renderer/engine'
import type { ComponentNode, RenderContext } from '../src/renderer/engine'
import { registerAllComponents } from '../src/renderer/components/index'
import { createNoopTransport } from '../src/renderer/transport'
import type { ComponentJSON } from '../src/core/component'

beforeEach(() => { registerAllComponents() })

function makeCtx(state?: Record<string, unknown>): RenderContext {
  const ctx = {
    store: new Store(state),
    scope: {},
    transport: createNoopTransport(),
    rerender: () => {},
  }
  return ctx
}

const options = [{ value: 'a', label: 'Apple' }, { value: 'b', label: 'Banana' }]

/** The ChoicePicker a view crosses over to. */
function choicePicker(view: ComponentJSON): A2uiComponent {
  const { messages } = emitA2UI({ $prefab: { version: '0.3' }, view, state: { fruit: '' } })
  const picker = allComponents(messages).find(c => c.component === 'ChoicePicker')
  if (picker == null) throw new Error('no ChoicePicker was emitted')
  return picker
}

describe('required on the wire', () => {
  it('reaches a Select', () => {
    expect(Select({ name: 'fruit', label: 'Fruit', required: true }).toJSON().required).toBe(true)
  })

  it('reaches a RadioGroup', () => {
    const json = RadioGroup({ name: 'fruit', required: true, children: [Radio({ value: 'a' })] }).toJSON()
    expect(json.required).toBe(true)
  })

  it('is absent when not asked for', () => {
    expect(Select({ name: 'fruit' }).toJSON().required).toBeUndefined()
  })

  it('still defaults to false on Input, which the wire goldens pin', () => {
    expect(Input({ name: 'note' }).toJSON().required).toBe(false)
  })

  it('carries a Select placeholder, which statefulProps alone dropped', () => {
    expect(Select({ name: 'fruit', placeholder: 'Pick one' }).toJSON().placeholder).toBe('Pick one')
  })
})

describe('required in the DOM', () => {
  const selectOf = (node: Partial<ComponentNode>): HTMLSelectElement => {
    const dom = renderNode({ type: 'Select', name: 'fruit', options, ...node } as ComponentNode, makeCtx()) as HTMLElement
    return dom.querySelector('select')!
  }

  it('marks a required Select natively and for assistive technology', () => {
    const select = selectOf({ required: true })
    expect(select.required).toBe(true)
    expect(select.getAttribute('aria-required')).toBe('true')
  })

  it('leaves an optional Select unmarked', () => {
    expect(selectOf({}).hasAttribute('aria-required')).toBe(false)
  })

  it('marks a required RadioGroup, which has no native attribute to set', () => {
    const dom = renderNode(
      { type: 'RadioGroup', name: 'fruit', required: true, children: [{ type: 'Radio', value: 'a' }] } as ComponentNode,
      makeCtx(),
    ) as HTMLElement
    expect(dom.getAttribute('aria-required')).toBe('true')
  })
})

describe('multiple choice', () => {
  const render = (node: Partial<ComponentNode>, state?: Record<string, unknown>): HTMLSelectElement => {
    const ctx = makeCtx(state)
    const dom = renderNode({ type: 'Select', name: 'fruit', options, multiple: true, ...node } as ComponentNode, ctx) as HTMLElement
    return dom.querySelector('select')!
  }

  it('renders a multi-select', () => {
    expect(render({}).multiple).toBe(true)
  })

  it('restores every stored choice', () => {
    const select = render({}, { fruit: ['a', 'b'] })
    expect(Array.from(select.selectedOptions, o => o.value)).toEqual(['a', 'b'])
  })

  it('stores the chosen values as an array', () => {
    const ctx = makeCtx()
    const dom = renderNode({ type: 'Select', name: 'fruit', options, multiple: true } as ComponentNode, ctx) as HTMLElement
    const select = dom.querySelector('select')!
    select.options[1]!.selected = true
    select.dispatchEvent(new Event('change'))
    expect(ctx.store.get('fruit')).toEqual(['b'])
  })

  it('submits one choice as a one-element array, not a bare string', async () => {
    const ctx = makeCtx()
    const form = renderNode({
      type: 'Form',
      onSubmit: { action: 'setState', key: 'done', value: true },
      children: [
        { type: 'Select', name: 'fruit', options, multiple: true },
        { type: 'Button', label: 'Go', submit: true },
      ],
    } as ComponentNode, ctx) as HTMLFormElement
    form.querySelector('select')!.options[0]!.selected = true
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await new Promise(r => queueMicrotask(r))
    expect(ctx.store.get('fruit')).toEqual(['a'])
  })

  it('leaves a single-choice Select submitting a bare value', async () => {
    const ctx = makeCtx()
    const form = renderNode({
      type: 'Form',
      onSubmit: { action: 'setState', key: 'done', value: true },
      children: [
        { type: 'Select', name: 'fruit', options },
        { type: 'Button', label: 'Go', submit: true },
      ],
    } as ComponentNode, ctx) as HTMLFormElement
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await new Promise(r => queueMicrotask(r))
    expect(ctx.store.get('fruit')).toBe('a')
  })
})

describe('autoForm asks the UI for what the schema asks for', () => {
  const selectJson = (field: Record<string, unknown>): ComponentJSON => {
    const json = autoForm([{ name: 'fruit', options, ...field } as never], 'pick').toJSON()
    const found = JSON.stringify(json).includes('"Select"')
    expect(found).toBe(true)
    const walk = (node: ComponentJSON): ComponentJSON | undefined => {
      if (node.type === 'Select') return node
      for (const child of (node.children ?? [])) {
        const hit = walk(child)
        if (hit) return hit
      }
      return undefined
    }
    return walk(json)!
  }

  it('marks a required choice field', () => {
    expect(selectJson({ required: true }).required).toBe(true)
  })

  it('renders a multi-value choice field as a multi-select', () => {
    expect(selectJson({ multiple: true }).multiple).toBe(true)
  })
})

describe('A2UI crossing', () => {
  it('emits a required check for a ChoicePicker', () => {
    const picker = choicePicker({
      type: 'Select', name: 'fruit', label: 'Fruit', required: true,
      children: [SelectOption('a', 'Apple').toJSON()],
    })
    expect(picker.checks).toEqual([{ condition: { call: 'required', args: { value: { path: '/fruit' } } } }])
  })

  it('maps a multi-select onto the multipleSelection variant', () => {
    const picker = choicePicker({
      type: 'Select', name: 'fruit', label: 'Fruit', multiple: true,
      children: [SelectOption('a', 'Apple').toJSON()],
    })
    expect(picker.variant).toBe('multipleSelection')
  })

  it('keeps a single-choice Select mutually exclusive', () => {
    const picker = choicePicker({
      type: 'Select', name: 'fruit', label: 'Fruit',
      children: [SelectOption('a', 'Apple').toJSON()],
    })
    expect(picker.variant).toBe('mutuallyExclusive')
  })
})
