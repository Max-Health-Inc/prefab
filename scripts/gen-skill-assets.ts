/**
 * Generate skill example assets from the single canonical source.
 *
 * The example UI JSON files live exactly once under `docs/public/examples/`
 * (served at `/prefab/examples/<name>.json` and consumed by the demo + playground
 * apps at runtime). The skill bundle needs its own on-disk copies, but committing
 * them would re-introduce the duplication this DRY refactor removes. Instead this
 * script copies the canonical files into `skills/prefab-ui/assets/examples/`,
 * which is git-ignored and regenerated as part of the build.
 *
 * Run directly:  bun run scripts/gen-skill-assets.ts
 */

import { copyFileSync, mkdirSync, readdirSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const sourceDir = join(repoRoot, 'docs', 'public', 'examples')
const targetDir = join(repoRoot, 'skills', 'prefab-ui', 'assets', 'examples')

export function genSkillAssets(): void {
  mkdirSync(targetDir, { recursive: true })

  const files = readdirSync(sourceDir).filter((f) => f.endsWith('.json'))
  const canonical = new Set(files)

  // Drop any stale JSON that is no longer part of the canonical set so the
  // skill folder always mirrors docs/public/examples/ exactly.
  for (const existing of readdirSync(targetDir)) {
    if (existing.endsWith('.json') && !canonical.has(existing)) {
      rmSync(join(targetDir, existing))
    }
  }

  for (const file of files) {
    copyFileSync(join(sourceDir, file), join(targetDir, file))
  }

  console.log(
    `✅ Skill assets synced → skills/prefab-ui/assets/examples/ (${files.length} files)`,
  )
}

// Run when invoked directly (`bun run scripts/gen-skill-assets.ts`).
if (import.meta.main) {
  genSkillAssets()
}
