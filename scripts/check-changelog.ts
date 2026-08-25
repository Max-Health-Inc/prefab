/**
 * Guard released changelog sections against being rewritten by a merge.
 *
 * Releasing promotes `## [Unreleased]` to a version heading on `main`, then
 * merges `main` back into `dev`. Both sides inserted lines at the same point, so
 * git's line-based merge can order them heading-first and file `dev`'s newer
 * entries under the version that just shipped. It does that without conflicting,
 * which is what makes it dangerous: the release workflow's best-effort sync has
 * nothing to report, and the changelog quietly claims unshipped work was
 * released. It has happened three times.
 *
 * `scripts/changelog-release.ts` keeps an anchor line under `## [Unreleased]` to
 * make that merge conflict instead of guessing. This is the check that catches
 * it when it does not: every version section that exists on `main` must be
 * byte-identical here.
 *
 *   bun run scripts/check-changelog.ts [baseRef]
 *
 * Exits 0 when the base ref is unavailable — on `main` itself, or in a shallow
 * clone that has not fetched it. A check that cannot run is not a failure, and
 * failing the build for a missing ref would teach people to ignore it.
 */

import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

/**
 * Normalize line endings before comparing.
 *
 * `git show` hands back what the repository stores (LF) while a Windows working
 * tree holds CRLF, so a byte comparison reports every section as drifted and the
 * check becomes noise on the platform most likely to run it locally.
 */
function normalize(md: string): string {
  return md.replace(/\r\n/g, '\n')
}

/** A `## [x.y.z]` section, keyed by the version it documents. */
export function releasedSections(source: string): Map<string, string> {
  const md = normalize(source)
  const sections = new Map<string, string>()
  // Split on version headings, keeping the heading with its body. `[Unreleased]`
  // is deliberately excluded: it is the section that is meant to change.
  const pattern = /^##\s*\[(\d+\.\d+\.\d+[^\]]*)\][^\n]*$/gm

  const starts: { version: string; index: number }[] = []
  for (const match of md.matchAll(pattern)) {
    starts.push({ version: match[1], index: match.index })
  }

  for (let i = 0; i < starts.length; i++) {
    const end = i + 1 < starts.length ? starts[i + 1].index : md.length
    sections.set(starts[i].version, md.slice(starts[i].index, end).trimEnd())
  }
  return sections
}

/** Versions whose section differs between the two texts. */
export function driftedVersions(base: string, head: string): string[] {
  const baseSections = releasedSections(base)
  const headSections = releasedSections(head)

  const drifted: string[] = []
  for (const [version, body] of baseSections) {
    const current = headSections.get(version)
    // A version missing here is a different problem (a dropped section), and
    // just as wrong, so it counts.
    if (current !== body) drifted.push(version)
  }
  return drifted
}

if (import.meta.main) {
  const baseRef = process.argv[2] ?? 'origin/main'
  const path = process.env.CHANGELOG_PATH ?? 'CHANGELOG.md'

  const show = spawnSync('git', ['show', `${baseRef}:${path}`], { encoding: 'utf8' })
  if (show.status !== 0) {
    console.log(`ℹ changelog check skipped: ${baseRef}:${path} is not available here.`)
    process.exit(0)
  }

  const drifted = driftedVersions(show.stdout, readFileSync(path, 'utf8'))

  if (drifted.length > 0) {
    console.error(`❌ Released changelog sections differ from ${baseRef}: ${drifted.join(', ')}`)
    console.error()
    console.error('   A released section must not change. This usually means a release merge filed')
    console.error('   new entries under a published version instead of under [Unreleased].')
    console.error(`   Compare with:  git diff ${baseRef} -- ${path}`)
    console.error('   Move the new entries back under [Unreleased] and keep the marker line beneath it.')
    process.exit(1)
  }

  console.log(`✅ Released changelog sections match ${baseRef}.`)
}
