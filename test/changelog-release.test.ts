/**
 * Release-time changelog gate. The pure core is tested here; the CLI wrapper in
 * scripts/changelog-release.ts just does the fs + process.exit around it.
 */
import { describe, it, expect } from 'bun:test'
import { promoteChangelog, UNRELEASED_MARKER } from '../scripts/changelog-release'
import { driftedVersions } from '../scripts/check-changelog'
import { readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'

const base = (unreleasedBody: string) => `# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
${unreleasedBody}## [0.3.3] — 2026-07-22

### Fixed

- something old
`

describe('promoteChangelog', () => {
  it('promotes an Unreleased section that has entries', () => {
    const md = base('\n### Fixed\n\n- new thing\n\n')
    const r = promoteChangelog(md, '0.3.4', '2026-07-22')
    expect(r.status).toBe('promoted')
    const out = r.content ?? ''
    expect(out).toContain('## [0.3.4] — 2026-07-22')
    // a fresh empty [Unreleased] stays above the stamped version
    expect(out.indexOf('## [Unreleased]')).toBeLessThan(out.indexOf('## [0.3.4]'))
    // the entry moved under the new version, above the previous release
    expect(out.indexOf('- new thing')).toBeLessThan(out.indexOf('## [0.3.3]'))
  })

  it('fails when Unreleased is empty', () => {
    expect(promoteChangelog(base('\n'), '0.3.4', '2026-07-22').status).toBe('missing')
  })

  it('fails when Unreleased has only sub-headings, no entries', () => {
    expect(promoteChangelog(base('\n### Fixed\n\n'), '0.3.4', '2026-07-22').status).toBe('missing')
  })

  it('is a no-op when the version entry already exists', () => {
    const md = base('\n- new thing\n\n')
    const r = promoteChangelog(md, '0.3.3', '2026-07-22')
    expect(r.status).toBe('present')
    expect(r.content).toBe(md)
  })

  it('fails when there is neither an Unreleased section nor the version', () => {
    const md = '# Changelog\n\n## [0.3.3] — 2026-07-22\n\n- old\n'
    expect(promoteChangelog(md, '0.3.4', '2026-07-22').status).toBe('missing')
  })
})

// ── CLI wrapper ──────────────────────────────────────────────────────────────
//
// The release workflow branches on this CLI's stdout, so `--check` is load-bearing
// and is exercised here rather than only through the pure core. It also pins the
// fact that a plain invocation MUTATES the file, which is easy to mistake for a
// dry run (and was mistaken for one while wiring the workflow up).

describe('changelog-release CLI', () => {
  const WITH_ENTRIES = base('\n### Fixed\n\n- new thing\n\n')
  const EMPTY = base('\n')

  /** Run the CLI against a throwaway changelog; returns stdout, exit code, and the file after. */
  function run(md: string, args: string[]): { out: string; code: number; after: string } {
    const path = join(tmpdir(), `prefab-changelog-${randomUUID()}.md`)
    writeFileSync(path, md)
    try {
      const p = Bun.spawnSync(['bun', 'scripts/changelog-release.ts', ...args], {
        env: { ...process.env, CHANGELOG_PATH: path },
      })
      return {
        out: p.stdout.toString().trim(),
        code: p.exitCode,
        after: readFileSync(path, 'utf8'),
      }
    } finally {
      rmSync(path, { force: true })
    }
  }

  it('--check reports "promoted" without writing', () => {
    const r = run(WITH_ENTRIES, ['--check', '0.3.8'])
    expect(r.out).toBe('promoted')
    expect(r.code).toBe(0)
    expect(r.after).toBe(WITH_ENTRIES)
  })

  it('--check reports "missing" and still exits 0', () => {
    // This is what lets a docs-only merge skip the release instead of failing it.
    const r = run(EMPTY, ['--check', '0.3.8'])
    expect(r.out).toBe('missing')
    expect(r.code).toBe(0)
    expect(r.after).toBe(EMPTY)
  })

  it('--check reports "present" for an already-released version', () => {
    const r = run(WITH_ENTRIES, ['--check', '0.3.3'])
    expect(r.out).toBe('present')
    expect(r.code).toBe(0)
  })

  it('without --check, a missing entry fails the release', () => {
    expect(run(EMPTY, ['0.3.8']).code).toBe(1)
  })

  it('without --check, the file is rewritten (not a dry run)', () => {
    const r = run(WITH_ENTRIES, ['0.3.8', '2026-08-01'])
    expect(r.code).toBe(0)
    expect(r.after).not.toBe(WITH_ENTRIES)
    expect(r.after).toContain('## [0.3.8] — 2026-08-01')
    expect(r.after).toContain('## [Unreleased]')
  })
})

/**
 * The anchor line, and the check that catches the mis-merge when the anchor does
 * not. Both exist for one failure: a release promotes `[Unreleased]` on `main`,
 * `dev` adds its next entries in the same place, and merging `main` back files
 * those entries under the version that just shipped — without conflicting, so
 * nothing reports it.
 */
describe('the unreleased marker', () => {
  it('is placed under the fresh Unreleased heading', () => {
    const result = promoteChangelog(base('\n### Added\n\n- a thing\n\n'), '0.3.4', '2026-08-01')
    expect(result.status).toBe('promoted')
    const lines = (result.content ?? '').split('\n')
    const heading = lines.indexOf('## [Unreleased]')
    // Directly under, with one blank line between: that position is what makes
    // both sides of the merge insert at the same offset.
    expect(lines[heading + 1]).toBe('')
    expect(lines[heading + 2]).toBe(UNRELEASED_MARKER)
  })

  it('does not follow the entries into the released section', () => {
    const withMarker = base(`\n${UNRELEASED_MARKER}\n\n### Added\n\n- a thing\n\n`)
    const content = promoteChangelog(withMarker, '0.3.4', '2026-08-01').content ?? ''
    const released = content.slice(content.indexOf('## [0.3.4]'))
    expect(released).not.toContain(UNRELEASED_MARKER)
    expect(released).toContain('- a thing')
    // Exactly one marker survives, under [Unreleased].
    expect(content.split(UNRELEASED_MARKER).length - 1).toBe(1)
  })

  it('is not mistaken for an entry when the section is otherwise empty', () => {
    // Otherwise a release would ship on the strength of its own marker.
    const result = promoteChangelog(base(`\n${UNRELEASED_MARKER}\n\n`), '0.3.4', '2026-08-01')
    expect(result.status).toBe('missing')
  })
})

describe('driftedVersions', () => {
  const released = `# Changelog

## [Unreleased]

## [0.3.4] — 2026-08-01

- shipped
`

  it('passes when released sections match', () => {
    expect(driftedVersions(released, released)).toEqual([])
  })

  it('ignores changes under Unreleased', () => {
    const head = released.replace('## [Unreleased]\n', '## [Unreleased]\n\n### Added\n\n- new work\n')
    expect(driftedVersions(released, head)).toEqual([])
  })

  it('catches an entry filed under a released version', () => {
    // The exact shape of the mis-merge: new work appended to a shipped section.
    const head = released.replace('- shipped', '- shipped\n- work that never shipped in 0.3.4')
    expect(driftedVersions(released, head)).toEqual(['0.3.4'])
  })

  it('catches a released section that disappeared', () => {
    expect(driftedVersions(released, '# Changelog\n\n## [Unreleased]\n')).toEqual(['0.3.4'])
  })

  it('is indifferent to line endings', () => {
    // git hands back LF; a Windows working tree holds CRLF. Without this the
    // check fails on every section and becomes noise.
    expect(driftedVersions(released, released.replace(/\n/g, '\r\n'))).toEqual([])
  })
})
