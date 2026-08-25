/**
 * Release-time CHANGELOG gate + promotion.
 *
 * Guarantees the version about to ship is documented, then stamps it:
 *   - `## [<version>]` already present  → no-op (status 'present').
 *   - `## [Unreleased]` has entries      → promote to `## [<version>] — <date>`,
 *                                          leaving a fresh empty `## [Unreleased]`.
 *   - otherwise                          → fail (status 'missing').
 *
 * The CLI wrapper exits non-zero on 'missing' so a release with no changelog
 * entry fails in CI. Run: `bun run scripts/changelog-release.ts <version> [date]`.
 *
 * `--check` reports the status on stdout and always exits 0, writing nothing.
 * Note the plain invocation is NOT a dry run: it rewrites CHANGELOG.md in place.
 * Use `--check <version>` to ask whether there is anything to ship.
 *
 * ## The marker
 *
 * Promotion leaves {@link UNRELEASED_MARKER} directly under `## [Unreleased]`.
 * It exists for git, not for readers.
 *
 * A release inserts the new version heading immediately below `## [Unreleased]`,
 * and `dev` adds its next entries in exactly the same place. When `main` is
 * merged back, git's line-based merge sees two insertions at one point and
 * orders them heading-first, filing unreleased work under a published version
 * with no conflict to notice. That has happened three times.
 *
 * A line both sides carry unchanged forces the two insertions to the same offset
 * and makes the merge conflict rather than guess. It is a guard rather than a
 * guarantee, which is why `scripts/check-changelog.ts` verifies the outcome
 * independently.
 */

import { readFileSync, writeFileSync } from 'node:fs'

export interface ChangelogResult {
  status: 'promoted' | 'present' | 'missing'
  /** Rewritten changelog (for 'promoted'), or the unchanged input (for 'present'). */
  content?: string
  message: string
}

const UNRELEASED = /^##\s*\[Unreleased\][^\n]*$/m

/** Anchor line kept directly under `## [Unreleased]`. See the note above. */
export const UNRELEASED_MARKER =
  '<!-- Add new entries directly below. Keep this line: it makes a release merge conflict rather than file them under a published version. -->'

/** Matches the marker wherever it currently sits, so promotion can re-place it. */
const MARKER_LINE = /^<!-- Add new entries directly below\..*-->$/m

/**
 * Validate and (if needed) promote the `[Unreleased]` section to `version`.
 * Pure: takes the changelog text, returns the outcome. No I/O.
 */
export function promoteChangelog(md: string, version: string, date: string): ChangelogResult {
  const escaped = version.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  if (new RegExp(`^##\\s*\\[${escaped}\\]`, 'm').test(md)) {
    return { status: 'present', content: md, message: `CHANGELOG: entry for ${version} already present.` }
  }

  const heading = UNRELEASED.exec(md)
  if (!heading) {
    return {
      status: 'missing',
      message: `CHANGELOG.md has no "## [Unreleased]" section and no "## [${version}]" entry. Add an entry before releasing.`,
    }
  }

  // Body = everything between the [Unreleased] heading and the next "## [" heading.
  const rest = md.slice(heading.index + heading[0].length)
  const nextHeading = rest.search(/^##\s+\[/m)
  const body = nextHeading === -1 ? rest : rest.slice(0, nextHeading)
  const after = nextHeading === -1 ? '' : rest.slice(nextHeading)

  // The marker belongs to [Unreleased], so it is lifted out before the body
  // becomes the release's notes, then re-placed under the fresh heading.
  const notes = body.replace(MARKER_LINE, '').trim()

  // A real entry is a non-blank line that is not itself a heading (### Fixed, etc.).
  const hasEntry = notes.split('\n').some(line => {
    const t = line.trim()
    return t.length > 0 && !t.startsWith('#')
  })
  if (!hasEntry) {
    return {
      status: 'missing',
      message: `CHANGELOG.md "## [Unreleased]" has no entries. Document what ${version} ships before releasing.`,
    }
  }

  const content = [
    md.slice(0, heading.index),
    '## [Unreleased]\n\n',
    `${UNRELEASED_MARKER}\n\n`,
    `## [${version}] — ${date}\n\n`,
    `${notes}\n\n`,
    after,
  ].join('')

  return { status: 'promoted', content, message: `CHANGELOG: promoted [Unreleased] to [${version}] — ${date}.` }
}

// ── CLI ──────────────────────────────────────────────────────────────────────
//
// `--check` reports the status on stdout and always exits 0, writing nothing.
// The release workflow uses it to decide whether a merge to `main` should cut a
// release at all, versus one that merely documented nothing (a README or CI-only
// merge should not redden `main`). Without it the only way to ask "is there
// anything to ship?" is to run the promotion, which mutates the file.
if (import.meta.main) {
  const argv = process.argv.slice(2)
  const checkOnly = argv[0] === '--check'
  const args = checkOnly ? argv.slice(1) : argv

  const version = args[0]
  if (!version) {
    console.error('changelog-release: missing <version> argument')
    process.exit(2)
  }
  const date = args[1] ?? new Date().toISOString().slice(0, 10)
  const path = process.env.CHANGELOG_PATH ?? 'CHANGELOG.md'

  const result = promoteChangelog(readFileSync(path, 'utf8'), version, date)

  if (checkOnly) {
    console.log(result.status)
    process.exit(0)
  }

  if (result.status === 'missing') {
    console.error(`❌ ${result.message}`)
    process.exit(1)
  }
  if (result.status === 'promoted' && result.content) {
    writeFileSync(path, result.content)
  }
  console.log(`✅ ${result.message}`)
}
