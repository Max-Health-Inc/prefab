/**
 * Icon vocabulary.
 *
 * A2UI's `Icon.name` is a closed enum, which makes it the one place the two
 * catalogs disagree on values rather than on shape. An unrecognised name does
 * not degrade to a fallback glyph — it fails validation and takes the component
 * with it, so the enum is duplicated in `src/a2ui/icons.ts` and has to stay
 * exactly in step with the specification.
 */

import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { A2UI_ICONS, a2uiIconName } from '../src/a2ui/icons.js'
import { emitA2UI } from '../src/a2ui/emit.js'
import { conformanceErrors } from './helpers/a2ui-validator.js'

const CATALOG = join(dirname(fileURLToPath(import.meta.url)), 'fixtures', 'a2ui', 'v1_0', 'basic-catalog.json')

/** The enum as the specification states it, read from the vendored catalog. */
function catalogIcons(): string[] {
  const catalog = JSON.parse(readFileSync(CATALOG, 'utf-8')) as {
    components: { Icon: { properties: { name: { oneOf: { enum?: string[] }[] } } } }
  }
  const variant = catalog.components.Icon.properties.name.oneOf.find(v => v.enum != null)
  if (variant?.enum == null) throw new Error('a2ui: the Icon schema no longer carries an enum')
  return variant.enum
}

const emitIcon = (name: string) => emitA2UI({ $prefab: { version: '0.3' }, view: { type: 'Icon', name } })

describe('the vendored icon enum', () => {
  test('matches the specification exactly', () => {
    // The failure this catches: a spec revision adds icons, `sync-a2ui-schemas`
    // pulls them in, and the hard-coded list silently keeps rejecting them.
    expect([...A2UI_ICONS].sort()).toEqual(catalogIcons().sort())
  })

  test('every name in it round-trips', () => {
    for (const name of A2UI_ICONS) expect(a2uiIconName(name)).toBe(name)
  })
})

describe('resolving a prefab icon name', () => {
  test('ignores case and separators', () => {
    expect(a2uiIconName('ArrowBack')).toBe('arrowBack')
    expect(a2uiIconName('arrow-back')).toBe('arrowBack')
    expect(a2uiIconName('arrow_back')).toBe('arrowBack')
  })

  test('translates the Lucide names prefab ships with', () => {
    // display_error() and display_success() use these two.
    expect(a2uiIconName('AlertCircle')).toBe('error')
    expect(a2uiIconName('CheckCircle')).toBe('check')
    expect(a2uiIconName('Trash2')).toBe('delete')
    expect(a2uiIconName('User')).toBe('person')
    expect(a2uiIconName('Bell')).toBe('notifications')
  })

  test('gives up rather than guessing', () => {
    expect(a2uiIconName('Stethoscope')).toBeUndefined()
    expect(a2uiIconName('')).toBeUndefined()
  })
})

describe('emitting an Icon', () => {
  test('an unmappable name costs the glyph, not the payload', () => {
    const { messages, diagnostics } = emitIcon('Stethoscope')
    expect(conformanceErrors(messages)).toEqual([])
    expect(diagnostics.some(d => d.kind === 'unsupported' && d.subject === 'Icon')).toBe(true)
  })

  test('a translated name is reported as a translation', () => {
    const { messages, diagnostics } = emitIcon('AlertCircle')
    expect(conformanceErrors(messages)).toEqual([])
    expect(diagnostics.some(d => d.kind === 'degraded' && d.detail.includes('error'))).toBe(true)
  })

  test('an exact name passes through unremarked', () => {
    const { messages, diagnostics } = emitIcon('search')
    expect(conformanceErrors(messages)).toEqual([])
    expect(diagnostics).toEqual([])
  })
})
