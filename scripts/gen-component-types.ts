/**
 * Generate the component-type list from the renderer registry.
 *
 * The registry in `src/renderer/engine.ts` is the only thing that actually knows
 * which component types can be rendered. `validateWireFormat`'s strict mode needs
 * the same set, and it used to carry its own hand-written copy, which drifted:
 * `Condition`, `Detail`, `MasterDetail` and `PdfViewer` were renderable but
 * rejected as unknown, so strict validation failed on valid UIs (including two of
 * the shipped examples).
 *
 * Rather than maintain the list twice, it is derived here. The output is committed
 * because `src/core/validate.ts` imports it and a fresh clone must typecheck
 * before any generator runs; `test/component-types.test.ts` fails if the committed
 * file and the live registry disagree, so a stale copy cannot be merged.
 *
 * Registration only populates a Map, so this needs no DOM and the generated module
 * stays free of imports — the validator has to keep working server-side, where the
 * renderer is never loaded.
 *
 * Run directly:  bun run scripts/gen-component-types.ts
 */

import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { registerAllComponents } from '../src/renderer/components/index.js'
import { registeredComponentTypes } from '../src/renderer/engine.js'

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const targetFile = join(repoRoot, 'src', 'core', 'component-types.ts')

/** Collect the registry's types. Sorted by `registeredComponentTypes()`. */
export function collectComponentTypes(): string[] {
  registerAllComponents()
  return registeredComponentTypes()
}

function render(types: string[]): string {
  const entries = types.map((t) => `  '${t}',`).join('\n')
  return `/**
 * Every component type the renderer can render.
 *
 * GENERATED FILE — do not edit by hand. Regenerate with:
 *   bun run gen:types
 *
 * Derived from the render registry in \`src/renderer/engine.ts\`, which is the
 * authority. \`validateWireFormat\` consumes this for strict mode instead of
 * keeping a second list, because the second list drifted and rejected valid UIs.
 *
 * Deliberately import-free so \`src/core/validate.ts\` stays usable on a server
 * where the renderer is never loaded.
 */

export const COMPONENT_TYPES: readonly string[] = [
${entries}
]
`
}

export function genComponentTypes(): void {
  const types = collectComponentTypes()
  writeFileSync(targetFile, render(types), 'utf8')
  console.log(`✅ Component types → src/core/component-types.ts (${types.length} types)`)
}

// Run when invoked directly (`bun run scripts/gen-component-types.ts`).
if (import.meta.main) {
  genComponentTypes()
}
