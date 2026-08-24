/**
 * Registry-wide A2UI invariants.
 *
 * `test/a2ui.test.ts` runs one hand-written view per mapper family, which
 * checks that the mappings are *right*. It cannot check that they are *safe*:
 * a mapper only appears there if someone remembered to add a view for it, and
 * the branches that matter most are the guards deciding "this cannot be
 * expressed, drop it and say why". Those guards are what stop malformed input
 * becoming malformed output, and they are the least likely to be reached by a
 * hand-written happy-path view.
 *
 * So this file asserts two properties across every entry in the registry, which
 * means a mapper added later is covered the moment it is registered:
 *
 *   1. **Nothing a mapper emits is ever invalid.** Given generous props or none
 *      at all, the surface still passes the A2UI schemas and the structural
 *      rules.
 *   2. **Nothing is dropped silently.** A mapper that emits no component must
 *      say why, so a missing widget is traceable to a diagnostic rather than
 *      being discovered in a renderer.
 *
 * Property 1 alone could pass with every mapper broken, since emitting nothing
 * is trivially valid. The furnished pass closes that: every type outside
 * {@link NEEDS_SPECIFIC_CHILDREN} must actually produce a component.
 */

import { describe, expect, test } from 'bun:test'
import { mappedTypes } from '../src/a2ui/catalog.js'
import { emitA2UI } from '../src/a2ui/emit.js'
import type { ComponentJSON } from '../src/core/component.js'
import { allComponents, conformanceErrors } from './helpers/a2ui-validator.js'

/**
 * A superset of the props the mappers read. Handing every type the same bag is
 * deliberate: a mapper takes what it needs and ignores the rest, so one fixture
 * exercises all 81 without a per-type fixture to keep in sync.
 */
const FURNISHED: Record<string, unknown> = {
  content: 'Content', text: 'Text', label: 'Label', title: 'Title', name: 'field',
  value: 'v', src: 'https://example.com/a.png', url: 'https://example.com/a.mp4',
  href: 'https://example.com', alt: 'Alt', icon: 'mail', level: 2,
  min: 0, max: 10, step: 2, inputType: 'text',
  columns: [{ key: 'a', header: 'A' }], rows: [{ a: '1' }],
  onClick: { action: 'toolCall', tool: 't' },
  trigger: { type: 'Text', content: 'open' },
  children: [{ type: 'Text', content: 'child' }],
}

/**
 * Props the shared bag cannot supply generically.
 *
 * `Icon` is the only one so far: A2UI's icon names are a closed enum, so the
 * bag's `name: 'field'` is not a value any real icon could take.
 */
const FURNISHED_OVERRIDES: Record<string, Record<string, unknown>> = {
  Icon: { name: 'search' },
}

/**
 * Types that need children of a particular type rather than any child, so a
 * generic `Text` child leaves them with nothing to render. Their real mappings
 * are covered by the hand-written views in `a2ui.test.ts`.
 */
const NEEDS_SPECIFIC_CHILDREN = new Set(['Select', 'RadioGroup', 'Combobox', 'Table', 'Tabs'])

const emit = (view: ComponentJSON) => emitA2UI({ $prefab: { version: '0.3' }, view })

const TYPES = mappedTypes()

describe('every mapped type', () => {
  test('the registry is not empty', () => {
    // Guards the two loops below: an empty registry would make them vacuous.
    expect(TYPES.length).toBeGreaterThan(50)
  })

  describe('furnished with props', () => {
    for (const type of TYPES) {
      test(type, () => {
        const { messages } = emit({ type, ...FURNISHED, ...FURNISHED_OVERRIDES[type] })
        expect(conformanceErrors(messages)).toEqual([])

        if (!NEEDS_SPECIFIC_CHILDREN.has(type)) {
          expect(allComponents(messages).length, `${type} emitted nothing despite full props`).toBeGreaterThan(0)
        }
      })
    }
  })

  describe('starved of everything', () => {
    for (const type of TYPES) {
      test(type, () => {
        const { messages, diagnostics } = emit({ type })

        // A guard may drop the node. What it may not do is emit something the
        // catalog rejects, or drop it without a word.
        expect(conformanceErrors(messages)).toEqual([])
        if (allComponents(messages).length === 0) {
          expect(diagnostics.length, `${type} emitted nothing and reported nothing`).toBeGreaterThan(0)
        }
      })
    }
  })
})

describe('guards report what they dropped', () => {
  const dropped = (view: ComponentJSON) => emit(view).diagnostics.map(d => `${d.kind}:${d.subject}`)

  test('a TextField with no label', () => {
    expect(dropped({ type: 'Input' })).toContain('unsupported:Input')
  })

  test('a Slider with no upper bound', () => {
    expect(dropped({ type: 'Slider', label: 'Volume' })).toContain('unsupported:Slider')
  })

  test('a Button with nothing to do', () => {
    expect(dropped({ type: 'Button', label: 'Press' })).toContain('unsupported:Button')
  })

  test('a Link with no destination', () => {
    expect(dropped({ type: 'Link', content: 'Docs' })).toContain('unsupported:Link')
  })

  test('an Image with no source', () => {
    expect(dropped({ type: 'Image' })).toContain('unsupported:Image')
  })

  test('a Card with no body', () => {
    expect(dropped({ type: 'Card' })).toContain('unsupported:Card')
  })

  test('a ChoicePicker with no options', () => {
    expect(dropped({ type: 'Select', label: 'Role' })).toContain('unsupported:Select')
  })

  test('a DataTable with no rows', () => {
    expect(dropped({ type: 'DataTable', columns: [{ key: 'a' }] })).toContain('unsupported:DataTable')
  })

  test('a DataTable whose rows expression cannot be bound', () => {
    expect(dropped({ type: 'DataTable', columns: [{ key: 'a' }], rows: '{{ items | reverse }}' }))
      .toContain('expression:DataTable')
  })

  test('a container whose every child was dropped', () => {
    // The chart goes, so the Column has nothing left and goes too. Both are
    // reported, which is what makes an empty surface explainable.
    const diags = dropped({ type: 'Column', children: [{ type: 'LineChart' }] })
    expect(diags).toContain('unsupported:LineChart')
    expect(diags).toContain('unsupported:Column')
  })

  test('a component that only makes sense inside its parent', () => {
    expect(dropped({ type: 'TableRow' })).toContain('unsupported:TableRow')
  })

  test('a label that is an expression A2UI cannot bind', () => {
    // The label resolves to nothing, so the control has no label, so it goes.
    // Emitting a TextField with a missing required prop would be the failure.
    const view: ComponentJSON = { type: 'Input', name: 'x', label: '{{ a + 1 }}' }
    expect(dropped(view)).toContain('unsupported:Input')
    expect(conformanceErrors(emit(view).messages)).toEqual([])
  })
})
