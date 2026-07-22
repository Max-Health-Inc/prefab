/**
 * Release-time changelog gate. The pure core is tested here; the CLI wrapper in
 * scripts/changelog-release.ts just does the fs + process.exit around it.
 */
import { describe, it, expect } from 'bun:test'
import { promoteChangelog } from '../scripts/changelog-release'

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
