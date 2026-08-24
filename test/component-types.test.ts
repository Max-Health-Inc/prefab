/**
 * The generated component-type list must match the live renderer registry.
 *
 * `src/core/component-types.ts` is generated from the registry and committed,
 * because `src/core/validate.ts` imports it and a fresh clone has to typecheck
 * before any generator runs. Committed generated files go stale, so this is the
 * lockfile-style check that stops a stale one being merged: add a component to the
 * renderer without regenerating, and this fails.
 *
 * It replaces a hand-written list in the validator that had already drifted.
 * `Condition`, `Detail`, `MasterDetail` and `PdfViewer` were renderable but
 * rejected by strict validation, which broke two of the shipped examples in
 * `docs/public/examples/`.
 *
 * The comparison runs against `builtinComponentTypes()` rather than the whole
 * registry. The registry is a process-wide singleton that any test file can add
 * to, so reading all of it made this file's result depend on which test ran
 * first: `test/renderer-destroy.test.ts` and `test/pipe-wire.test.ts` register
 * a dozen widgets inside their test bodies, and once the runner reached them
 * first, every one of those became a "renderable type missing from the
 * generated list".
 */

import { describe, expect, test } from 'bun:test'
import { COMPONENT_TYPES } from '../src/core/component-types.js'
import { validateWireFormat } from '../src/core/validate.js'
import { registerAllComponents } from '../src/renderer/components/index.js'
import { builtinComponentTypes, registerComponent, registeredComponentTypes } from '../src/renderer/engine.js'

registerAllComponents()
const registered = builtinComponentTypes()

describe('component-types.ts is in sync with the registry', () => {
  test('the generated list is non-empty', () => {
    // Guards the generator itself: an empty list would make every assertion
    // below pass while disabling strict validation entirely.
    expect(COMPONENT_TYPES.length).toBeGreaterThan(0)
  })

  test('no renderable type is missing from the generated list', () => {
    const missing = registered.filter(t => !COMPONENT_TYPES.includes(t))
    expect(missing, `renderable but absent — run \`bun run gen:types\`: ${missing.join(', ')}`).toEqual([])
  })

  test('the generated list has no type the renderer cannot render', () => {
    const extra = COMPONENT_TYPES.filter(t => !registered.includes(t))
    expect(extra, `listed but not renderable — run \`bun run gen:types\`: ${extra.join(', ')}`).toEqual([])
  })
})

describe('strict validation accepts every renderable type', () => {
  // The behavioural consequence of the above, checked end to end rather than by
  // comparing lists: this is what actually broke.
  for (const type of registered) {
    test(type, () => {
      const result = validateWireFormat(
        { $prefab: { version: '0.3' }, view: { type } },
        { strict: true },
      )
      const detail = result.errors.map(e => `${e.path}: ${e.message}`).join('; ')
      expect(result.valid, `strict validation rejected renderable "${type}" — ${detail}`).toBe(true)
    })
  }

  test('an unregistered type is still rejected in strict mode', () => {
    // The other direction, so the checks above cannot pass by the validator
    // simply accepting everything.
    const result = validateWireFormat(
      { $prefab: { version: '0.3' }, view: { type: 'NotAComponent' } },
      { strict: true },
    )
    expect(result.valid).toBe(false)
  })

  test('a caller-registered component does not count as built in', () => {
    // The load-order bug this file used to have, pinned: registering a component
    // the way another test file does must not change what "built in" means.
    registerComponent('OrderDependenceGuard', () => document.createElement('div'))
    expect(registeredComponentTypes()).toContain('OrderDependenceGuard')
    expect(builtinComponentTypes()).not.toContain('OrderDependenceGuard')
  })
})
