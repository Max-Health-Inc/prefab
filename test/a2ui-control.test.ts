/**
 * Control flow, interpolation, and the invariant that a dropped node takes its
 * subtree with it.
 *
 * Also runs every shipped example through the emitter. That is the test that
 * would have caught the orphan bug below: a payload can be built entirely from
 * mappers that each behave correctly on their own and still come out invalid,
 * because the failure is in how one mapper's partial work interacts with its
 * own decision to give up.
 */

import { describe, expect, test } from 'bun:test'
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { emitA2UI } from '../src/a2ui/emit.js'
import type { ComponentJSON } from '../src/core/component.js'
import type { PrefabWireFormat } from '../src/app.js'
import { allComponents, conformanceErrors } from './helpers/a2ui-validator.js'

const emit = (view: ComponentJSON, state?: Record<string, unknown>) =>
  emitA2UI({ $prefab: { version: '0.3' }, view, ...(state != null && { state }) })

const subjects = (view: ComponentJSON, state?: Record<string, unknown>) =>
  emit(view, state).diagnostics.map(d => `${d.kind}:${d.subject}`)

/** The component the surface's root points at, for asserting shape. */
const rootOf = (messages: ReturnType<typeof emit>['messages']) =>
  allComponents(messages).find(c => c.id === 'root')

describe('ForEach', () => {
  const loop: ComponentJSON = {
    type: 'ForEach',
    expression: '{{ items }}',
    children: [{ type: 'Text', content: '{{ $item.label }}' }],
  }

  test('becomes a templated list rather than inlined copies', () => {
    const { messages } = emit(loop, { items: [{ label: 'a' }, { label: 'b' }] })
    expect(conformanceErrors(messages)).toEqual([])
    expect(rootOf(messages)?.children).toEqual({ path: '/items', componentId: expect.any(String) })
  })

  test('resolves $item to a path relative to the current item', () => {
    // Relative, with no leading slash: absolute would read the data-model root
    // and render the same value for every row.
    const { messages } = emit(loop, { items: [] })
    const text = allComponents(messages).find(c => c.component === 'Text')
    expect(text?.text).toEqual({ path: 'label' })
  })

  test('maps $index onto the A2UI system function', () => {
    const { messages } = emit({
      type: 'ForEach',
      expression: '{{ items }}',
      children: [{ type: 'Text', content: '{{ $index }}' }],
    }, { items: [] })
    const text = allComponents(messages).find(c => c.component === 'Text')
    expect(text?.text).toEqual({ call: '@index' })
  })

  test('reports a list expression it cannot bind', () => {
    expect(subjects({ type: 'ForEach', expression: '{{ items | reverse }}', children: [{ type: 'Text', content: 'x' }] }))
      .toContain('expression:ForEach')
  })

  test('$item outside a loop binds to nothing', () => {
    // The scope is what makes `$item` meaningful; without it there is no item.
    expect(subjects({ type: 'Text', content: '{{ $item.label }}' })).toContain('expression:Text')
  })
})

describe('string interpolation', () => {
  test('mixed literal and template text becomes formatString', () => {
    const { messages, diagnostics } = emit({ type: 'Text', content: 'Score: {{ score }}' }, { score: 1 })
    expect(rootOf(messages)?.text).toEqual({ call: 'formatString', args: { value: 'Score: ${/score}' } })
    expect(diagnostics).toEqual([])
  })

  test('interpolates several values in one string', () => {
    const { messages } = emit({ type: 'Text', content: '{{ a }} of {{ b }}' }, { a: 1, b: 2 })
    expect(rootOf(messages)?.text).toEqual({ call: 'formatString', args: { value: '${/a} of ${/b}' } })
  })

  test('escapes a literal ${ so the renderer does not read it as an expression', () => {
    const { messages } = emit({ type: 'Text', content: 'cost ${x} is {{ n }}' }, { n: 1 })
    expect(rootOf(messages)?.text).toEqual({ call: 'formatString', args: { value: 'cost \\${x} is ${/n}' } })
  })

  test('refuses the whole string when one embedded expression is too rich', () => {
    // Interpolating the bindable half and dropping the rest would silently
    // change what the text says.
    expect(subjects({ type: 'Text', content: 'Total: {{ a + b }}' })).toContain('expression:Text')
  })
})

describe('Define / Use / Slot', () => {
  const withDef = (use: ComponentJSON): ComponentJSON => ({
    type: 'Column',
    children: [
      { type: 'Define', name: 'card', children: [{ type: 'Text', content: '{{ title }}' }] },
      use,
    ],
  })

  test('a definition renders nothing where it is declared', () => {
    // The renderer draws nothing at the point of definition. Emitting the body
    // there would put the template's content on screen twice.
    const { messages } = emit({
      type: 'Column',
      children: [
        { type: 'Define', name: 'card', children: [{ type: 'Text', content: 'inside' }] },
        { type: 'Text', content: 'visible' },
      ],
    })
    const texts = allComponents(messages).filter(c => c.component === 'Text').map(c => c.text)
    expect(texts).toEqual(['visible'])
  })

  test('a use inlines the definition', () => {
    const { messages } = emit(withDef({ type: 'Use', def: 'card' }), { title: 'Hello' })
    expect(conformanceErrors(messages)).toEqual([])
    expect(allComponents(messages).some(c => c.text != null)).toBe(true)
  })

  test('overrides are scoped to the use rather than the model root', () => {
    // Without scoping, `{{ title }}` inside the body would read /title and every
    // use of the definition would render the same thing.
    const { messages } = emit(withDef({ type: 'Use', def: 'card', overrides: { title: 'Local' } }))
    const bound = allComponents(messages).find(c => c.component === 'Text')?.text
    expect(bound).toEqual({ path: '/use_card/title' })
  })

  test('a slot takes the content passed at the use site', () => {
    const view: ComponentJSON = {
      type: 'Column',
      children: [
        { type: 'Define', name: 'shell', children: [{ type: 'Slot' }] },
        { type: 'Use', def: 'shell', children: [{ type: 'Text', content: 'filled' }] },
      ],
    }
    const { messages } = emit(view)
    expect(allComponents(messages).some(c => c.text === 'filled')).toBe(true)
  })

  test('a slot falls back to its own children', () => {
    const view: ComponentJSON = {
      type: 'Column',
      children: [
        { type: 'Define', name: 'shell', children: [{ type: 'Slot', children: [{ type: 'Text', content: 'fallback' }] }] },
        { type: 'Use', def: 'shell' },
      ],
    }
    expect(allComponents(emit(view).messages).some(c => c.text === 'fallback')).toBe(true)
  })

  test('resolves a definition used before it is declared', () => {
    // prefab imposes no ordering, so neither does the emitter.
    const view: ComponentJSON = {
      type: 'Column',
      children: [
        { type: 'Use', def: 'later' },
        { type: 'Define', name: 'later', children: [{ type: 'Text', content: 'found' }] },
      ],
    }
    expect(allComponents(emit(view).messages).some(c => c.text === 'found')).toBe(true)
  })

  test('reports a use of an undeclared definition', () => {
    expect(subjects({ type: 'Use', def: 'missing' })).toContain('unsupported:Use')
  })

  test('reports a definition that uses itself instead of recursing', () => {
    const view: ComponentJSON = {
      type: 'Column',
      children: [
        { type: 'Define', name: 'loop', children: [{ type: 'Use', def: 'loop' }] },
        { type: 'Use', def: 'loop' },
      ],
    }
    expect(subjects(view)).toContain('unsupported:Use')
  })
})

describe('conditionals', () => {
  for (const type of ['If', 'Elif', 'Else', 'Condition']) {
    test(`${type} is reported rather than faked`, () => {
      // A one-item list template would look like a conditional and behave like
      // one only by accident. An honest diagnostic beats a UI that is wrong in a
      // way nothing reports.
      const view: ComponentJSON = { type, condition: '{{ ok }}', children: [{ type: 'Text', content: 'x' }] }
      const { messages, diagnostics } = emit(view, { ok: true })
      expect(conformanceErrors(messages)).toEqual([])
      expect(diagnostics.some(d => d.kind === 'unsupported' && d.subject === type)).toBe(true)
    })
  }
})

describe('actions', () => {
  test('accepts callTool as well as toolCall', () => {
    // The renderer honours both spellings and the shipped examples use the
    // former, so knowing only one downgraded every hand-written tool call into a
    // generic agent event and dropped its arguments.
    const view: ComponentJSON = {
      type: 'Button',
      label: 'Go',
      onClick: { action: 'callTool', tool: 'search', arguments: { q: '{{ query }}' } },
    }
    const { messages, diagnostics } = emit(view, { query: '' })
    const button = allComponents(messages).find(c => c.component === 'Button')
    expect(button?.action).toEqual({ event: { name: 'search', context: { q: { path: '/query' } } } })
    expect(diagnostics).toEqual([])
  })
})

describe('a dropped node takes its subtree with it', () => {
  test('a Modal whose trigger will not map keeps the dialog', () => {
    // prefab's dialog trigger is a Button with no onClick, because opening the
    // dialog is implicit. The Button mapper rightly refuses it; the Modal falls
    // back to the label as Text rather than losing the whole dialog.
    const view: ComponentJSON = {
      type: 'Dialog',
      title: 'Delete project?',
      trigger: { type: 'Button', label: 'Open dialog', variant: 'destructive' },
      children: [{ type: 'Text', content: 'Are you sure?' }],
    }
    const { messages } = emit(view)
    expect(conformanceErrors(messages)).toEqual([])
    expect(rootOf(messages)?.component).toBe('Modal')
  })

  test('a mapper that gives up after emitting children leaves no orphans', () => {
    // The failure this pins: a mapper reads its children, then finds it cannot
    // map, and the children stay in the adjacency list with nothing pointing at
    // them. The payload is then rejected for unreachability.
    const view: ComponentJSON = {
      type: 'Column',
      children: [
        { type: 'Text', content: 'kept' },
        // No max, so the Slider is dropped after its label was resolved.
        { type: 'Slider', name: 'v', label: 'Volume' },
      ],
    }
    const { messages } = emit(view)
    expect(conformanceErrors(messages)).toEqual([])
  })
})

describe('every shipped example', () => {
  const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'public', 'examples')
  const files = readdirSync(dir).filter(f => f.endsWith('.json')).sort()

  test('there are examples to check', () => {
    expect(files.length).toBeGreaterThan(10)
  })

  for (const file of files) {
    test(file, () => {
      const wire = JSON.parse(readFileSync(join(dir, file), 'utf-8')) as PrefabWireFormat
      expect(conformanceErrors(emitA2UI(wire).messages)).toEqual([])
    })
  }
})
