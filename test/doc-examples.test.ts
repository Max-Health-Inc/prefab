/**
 * The shipped example UIs must be valid wire format.
 *
 * `docs/public/examples/*.json` is the single source for the demo, the
 * playground, and the `skills/prefab-ui` assets the build copies out of it. The
 * package already exports the authority on whether a payload is well-formed
 * (`validateWireFormat`), and until now nothing pointed it at these files, so an
 * example could ship a key the renderer ignores and simply render nothing.
 *
 * That has already happened: 0.3.5 repaired playground examples that declared
 * conditional branches under a non-existent `then` key. This is the check that
 * would have caught it, and it reuses the validator rather than restating any
 * rules.
 *
 * `strict: true` also rejects unknown component types, which is the other half
 * of that failure mode: a typo'd `type` renders as nothing.
 */

import { describe, expect, test } from 'bun:test'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { validateWireFormat } from '../src/core/validate.js'

const EXAMPLES_DIR = join(import.meta.dir, '..', 'docs', 'public', 'examples')

const exampleFiles = readdirSync(EXAMPLES_DIR)
  .filter(f => f.endsWith('.json'))
  .sort()

describe('docs/public/examples', () => {
  test('the directory is found and non-empty', () => {
    // Guards the glob itself: a renamed directory would otherwise turn this
    // whole suite into a silent no-op.
    expect(exampleFiles.length).toBeGreaterThan(0)
  })

  for (const file of exampleFiles) {
    test(`${file} is valid wire format`, () => {
      const raw = readFileSync(join(EXAMPLES_DIR, file), 'utf8')
      const parsed: unknown = JSON.parse(raw)
      const result = validateWireFormat(parsed, { strict: true })

      // Surface the actual paths and messages; "expected true, got false" on a
      // 200-line JSON file is not a usable failure.
      const detail = result.errors.map(e => `  ${e.path}: ${e.message}`).join('\n')
      expect(result.valid, `${file} failed validation:\n${detail}`).toBe(true)
    })
  }
})
