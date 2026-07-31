/**
 * Drift guard for the shared brandc design-token contract (issue #26).
 *
 * prefab does not take a runtime dependency on brandc, and it deliberately does
 * not adopt brandc's token *values*: prefab.css defines each token as a fallback
 * chain (MCP Apps var → VS Code var → static default) so a viewer inherits its
 * host's theme, whereas brandc emits concrete `oklch()` values. Replacing the
 * chains with literals would break host theming and change prefab's default look.
 *
 * What must not drift is the *vocabulary*. These tests pin prefab's token names
 * to brandc's declared `CONTRACT` and prove a brandc brand drives prefab end to
 * end through `toPrefabTheme()`, which already emits exactly prefab's wire
 * `Theme` shape.
 *
 * Everything iterates `BRANDS` rather than naming brands, so a brand added
 * upstream is covered here automatically.
 */

import { describe, it, expect } from 'bun:test'
import { readFileSync } from 'node:fs'
import {
  BRANDS,
  CONTRACT,
  CONTRACT_SCALARS,
  DEPRECATED_TOKENS,
  brandExtras,
  dashboard,
  maxhealth,
  toPrefabTheme,
} from 'brandc'
import { PrefabApp, Column, Text } from '../src/index'
import type { Theme } from '../src/index'

function prefabCss(): string {
  return readFileSync(new URL('../src/prefab.css', import.meta.url), 'utf8')
}

/** Token names prefab.css defines in its `:root` block (without the leading `--`). */
function prefabTokenNames(): string[] {
  const root = /:root\s*\{([\s\S]*?)\n\}/.exec(prefabCss())
  if (root === null) throw new Error('prefab.css: could not locate the :root block')
  const names = new Set<string>()
  for (const m of root[1].matchAll(/^\s*--([a-z0-9-]+)\s*:/gm)) names.add(m[1])
  return [...names].sort()
}

/**
 * Every custom property prefab.css *reads* through `var()`, anywhere in the file.
 *
 * Case-sensitive on purpose: VS Code's names are camelCase past the first
 * segment (`--vscode-descriptionForeground`), and a lowercase-only pattern
 * silently truncates them into names that look wrong but are not.
 */
function prefabTokenReads(): string[] {
  const names = new Set<string>()
  for (const m of prefabCss().matchAll(/var\(\s*--([A-Za-z0-9_-]+)/g)) names.add(m[1])
  return [...names].sort()
}

/**
 * Host-provided variables prefab reads as the front of each fallback chain.
 * These are deliberately outside brandc's contract: they belong to the MCP Apps
 * design-token spec and to VS Code's webview, and prefab reads them so a viewer
 * inherits its host's theme.
 */
const HOST_VARIABLE = /^(color-|border-radius-|vscode-)/

describe('brandc token contract', () => {
  it('prefab.css defines a non-trivial set of tokens', () => {
    // Guards the extraction itself: a regex that silently matched nothing would
    // make every subset assertion below pass for the wrong reason.
    expect(prefabTokenNames().length).toBeGreaterThan(20)
  })

  it('every prefab token name exists in the declared contract', () => {
    const contract = new Set<string>(CONTRACT)
    const foreign = prefabTokenNames().filter(name => !contract.has(name))
    expect(foreign).toEqual([])
  })

  it('prefab.css reads a non-trivial set of variables', () => {
    // Same trap as above: a `var()` pattern matching nothing would make the
    // read-side checks below vacuous.
    expect(prefabTokenReads().length).toBeGreaterThan(40)
  })

  it('every variable prefab.css reads is a contract token or a host variable', () => {
    // The definition-side checks cannot catch a component rule that reads a
    // token prefab never defines, e.g. `color: var(--maxhealth)`.
    const contract = new Set<string>(CONTRACT)
    const unknown = prefabTokenReads()
      .filter(name => !contract.has(name) && !HOST_VARIABLE.test(name))
    expect(unknown).toEqual([])
  })

  it('prefab reads no token that left the contract', () => {
    // brandc keeps deprecated names emitted as brand-private extras, so reading
    // one would work today and silently break on the brand that drops it.
    // Checked against definitions AND `var()` reads.
    const deprecated = new Set(Object.keys(DEPRECATED_TOKENS))
    const stale = [...prefabTokenNames(), ...prefabTokenReads()]
      .filter(name => deprecated.has(name))
    expect(stale).toEqual([])
  })

  it('toPrefabTheme emits only contract names plus that brand’s declared extras', () => {
    // A brand may carry private tokens beyond the contract, and brandc keeps
    // emitting deprecated names as extras so consumers can migrate. Both are
    // legitimate; anything else is an undeclared token.
    for (const brand of BRANDS) {
      const allowed = new Set<string>([...CONTRACT, ...brandExtras(brand)])
      const theme = toPrefabTheme(brand)
      const undeclared = [...Object.keys(theme.light), ...Object.keys(theme.dark)]
        .filter(name => !allowed.has(name))
      expect(undeclared).toEqual([])
    }
  })

  it('prefab reads none of any brand’s private extras', () => {
    // Reading an extra would tie prefab to one brand and break under another.
    const touched = new Set([...prefabTokenNames(), ...prefabTokenReads()])
    for (const brand of BRANDS) {
      expect(brandExtras(brand).filter(name => touched.has(name))).toEqual([])
    }
  })

  it('toPrefabTheme output is assignable to prefab’s wire Theme', () => {
    // Structural check: if brandc's shape drifts from prefab's `Theme`, this
    // stops compiling rather than failing at runtime in a consumer.
    const theme: Theme = toPrefabTheme(maxhealth)
    expect(Object.keys(theme.light ?? {}).length).toBeGreaterThan(0)
    expect(Object.keys(theme.dark ?? {}).length).toBeGreaterThan(0)
  })

  it('every brand supplies every token prefab reads', () => {
    // The guarantee prefab depends on: swapping brands can never leave one of
    // prefab's own tokens undefined.
    const needed = prefabTokenNames()
    const scalars = new Set<string>(CONTRACT_SCALARS)
    const colors = needed.filter(name => !scalars.has(name))

    for (const brand of BRANDS) {
      const theme = toPrefabTheme(brand)

      // `light` compiles to `:root`, so it must cover everything prefab reads.
      expect(needed.filter(name => theme.light[name] === undefined)).toEqual([])

      // `dark` only overrides scheme-dependent tokens. Scalars (radius, shadow,
      // font) correctly live in `:root` alone, where they still apply under the
      // dark selector via the cascade.
      expect(colors.filter(name => theme.dark[name] === undefined)).toEqual([])
    }
  })

  it('a brandc brand drives a prefab app through the wire', () => {
    const app = new PrefabApp({
      title: 'Branded',
      view: Column({ children: [Text('hello')] }),
      theme: toPrefabTheme(dashboard),
    })

    // Protocol 0.3 folds the theme into the wire `css` array.
    const css = app.toJSON().css?.join('\n') ?? ''
    expect(css).toContain(':root')
    // A value unique to the dashboard brand (its blue primary).
    expect(css).toContain(dashboard.colors.primary.light)
    // And its dark counterpart, under both dark selectors prefab emits.
    expect(css).toContain(dashboard.colors.primary.dark)
    expect(css).toContain('[data-theme="dark"]')
  })

  it('the shipped brands are genuinely different values on one vocabulary', () => {
    // If this ever passes trivially (identical brands), the coverage guard above
    // stops proving the vocabulary is brand-agnostic.
    expect(BRANDS.length).toBeGreaterThan(1)
    const primaries = BRANDS.map(b => toPrefabTheme(b).light.primary)
    expect(new Set(primaries).size).toBe(primaries.length)
  })
})
