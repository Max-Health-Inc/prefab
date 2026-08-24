/**
 * Refresh the vendored A2UI v1.0 JSON Schemas.
 *
 * The schemas in `test/fixtures/a2ui/v1_0/` are checked in so `bun test` runs
 * offline and a slow a2ui.org cannot redden CI. Run this when A2UI publishes a
 * revision, then run the suite: any emitted payload the new schemas reject
 * shows up as a failing conformance test rather than as a silent drift.
 *
 *   bun scripts/sync-a2ui-schemas.ts
 *
 * Pass `--ref <sha|tag|branch>` to pin a different upstream revision.
 */

import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const REPO = 'a2ui-project/a2ui'
const DEST = join('test', 'fixtures', 'a2ui', 'v1_0')

/** Upstream path → local filename. */
const FILES: Record<string, string> = {
  'specification/v1_0/json/agent_to_renderer.json': 'agent_to_renderer.json',
  'specification/v1_0/json/agent_to_renderer_list.json': 'agent_to_renderer_list.json',
  'specification/v1_0/json/agent_to_renderer_list_wrapper.json': 'agent_to_renderer_list_wrapper.json',
  'specification/v1_0/json/common_types.json': 'common_types.json',
  'specification/v1_0/catalogs/basic/catalog.json': 'basic-catalog.json',
}

function argValue(flag: string): string | undefined {
  const i = process.argv.indexOf(flag)
  return i >= 0 ? process.argv[i + 1] : undefined
}

async function resolveRef(ref: string): Promise<string> {
  if (ref !== 'main') return ref
  const res = await fetch(`https://api.github.com/repos/${REPO}/commits/main`)
  if (!res.ok) throw new Error(`could not resolve ${REPO}@main: ${res.status} ${res.statusText}`)
  const body = await res.json() as { sha: string }
  return body.sha
}

const ref = await resolveRef(argValue('--ref') ?? 'main')
mkdirSync(DEST, { recursive: true })

for (const [remote, local] of Object.entries(FILES)) {
  const url = `https://raw.githubusercontent.com/${REPO}/${ref}/${remote}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${remote}: ${res.status} ${res.statusText}`)
  // Re-serialize so a formatting change upstream does not show as a diff here.
  const parsed: unknown = JSON.parse(await res.text())
  writeFileSync(join(DEST, local), `${JSON.stringify(parsed, null, 2)}\n`)
  console.log(`✓ ${local}`)
}

console.log(`\nVendored ${REPO}@${ref}`)
console.log(`Update the commit recorded in ${join(DEST, 'NOTICE.md')}, then run: bun test test/a2ui.test.ts`)
