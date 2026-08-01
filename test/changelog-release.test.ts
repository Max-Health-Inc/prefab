/**
 * Release-time changelog gate. The pure core is tested here; the CLI wrapper in
 * scripts/changelog-release.ts just does the fs + process.exit around it.
 */
import { describe, it, expect } from 'bun:test'
import { promoteChangelog } from '../scripts/changelog-release'
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
