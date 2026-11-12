/**
 * Generates the skill bundle's copies of canonical docs: the example UIs from
 * `docs/public/examples/` and the wire-format reference from `docs/reference/`.
 * The outputs are git-ignored and rebuilt by `scripts/build.ts`.
 */

import { copyFileSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const skillDir = join(repoRoot, 'skills', 'prefab-ui')
const examplesSource = join(repoRoot, 'docs', 'public', 'examples')
const examplesTarget = join(skillDir, 'assets', 'examples')

const REFERENCES = ['wire-format.md']

function stripFrontmatter(markdown: string): string {
  return markdown.replace(/\r\n/g, '\n').replace(/^---\n[\s\S]*?\n---\n+/, '')
}

function syncExamples(): number {
  mkdirSync(examplesTarget, { recursive: true })
  const files = readdirSync(examplesSource).filter((f) => f.endsWith('.json'))
  const canonical = new Set(files)
  for (const existing of readdirSync(examplesTarget)) {
    if (existing.endsWith('.json') && !canonical.has(existing)) rmSync(join(examplesTarget, existing))
  }
  for (const file of files) copyFileSync(join(examplesSource, file), join(examplesTarget, file))
  return files.length
}

function syncReferences(): void {
  const target = join(skillDir, 'references')
  mkdirSync(target, { recursive: true })
  for (const file of REFERENCES) {
    const source = readFileSync(join(repoRoot, 'docs', 'reference', file), 'utf8')
    writeFileSync(join(target, file), stripFrontmatter(source))
  }
}

export function genSkillAssets(): void {
  const examples = syncExamples()
  syncReferences()
  console.log(`✅ Skill assets synced → skills/prefab-ui/ (${examples} examples, ${REFERENCES.join(', ')})`)
}

if (import.meta.main) {
  genSkillAssets()
}
