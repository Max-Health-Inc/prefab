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
 * to brandc's `CONTRACT` in both directions that matter, and prove a brandc brand
 * drives prefab end to end through `toPrefabTheme()`, which already emits exactly
 * prefab's wire `Theme` shape.
 */

import { describe, it, expect } from 'bun:test'
import { readFileSync } from 'node:fs'
import { CONTRACT, maxhealth, dashboard, toPrefabTheme } from 'brandc'
import { PrefabApp, Column, Text } from '../src/index'
import type { Theme } from '../src/index'

/** Token names prefab.css defines in its `:root` block (without the leading `--`). */
function prefabTokenNames(): string[] {
  const css = readFileSync(new URL('../src/prefab.css', import.meta.url), 'utf8')
  const root = /:root\s*\{([\s\S]*?)\n\}/.exec(css)
  if (root === null) throw new Error('prefab.css: could not locate the :root block')
  const names = new Set<string>()
  for (const m of root[1].matchAll(/^\s*--([a-z0-9-]+)\s*:/gm)) names.add(m[1])
  return [...names].sort()
}

describe('brandc token contract', () => {
  it('prefab.css defines a non-trivial set of tokens', () => {
    // Guards the extraction itself: a regex that silently matched nothing would
    // make every subset assertion below pass for the wrong reason.
    expect(prefabTokenNames().length).toBeGreaterThan(20)
  })

  it('every prefab token name exists in the shared contract', () => {
    const contract = new Set(CONTRACT)
    const foreign = prefabTokenNames().filter(name => !contract.has(name))
    expect(foreign).toEqual([])
  })

  it('toPrefabTheme emits only contract token names', () => {
    const contract = new Set(CONTRACT)
    for (const brand of [maxhealth, dashboard]) {
      const theme = toPrefabTheme(brand)
      const foreign = [...Object.keys(theme.light), ...Object.keys(theme.dark)]
        .filter(name => !contract.has(name))
      expect(foreign).toEqual([])
    }
  })

  it('toPrefabTheme output is assignable to prefab’s wire Theme', () => {
    // Structural check: if brandc's shape drifts from prefab's `Theme`, this
    // stops compiling rather than failing at runtime in a consumer.
    const theme: Theme = toPrefabTheme(maxhealth)
    expect(Object.keys(theme.light ?? {}).length).toBeGreaterThan(0)
    expect(Object.keys(theme.dark ?? {}).length).toBeGreaterThan(0)
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

  it('any brand on the contract supplies every token prefab reads', () => {
    // The guarantee prefab depends on: swapping brands can never leave one of
    // prefab's own tokens undefined. Note brandc's brands are not required to
    // define identical key sets (`maxhealth` carries two extra accent tokens
    // `dashboard` has no use for), so this checks coverage of prefab's set
    // rather than equality between brands.
    const needed = prefabTokenNames()
    for (const brand of [maxhealth, dashboard]) {
      const theme = toPrefabTheme(brand)

      // `light` compiles to `:root`, so it must cover everything prefab reads.
      expect(needed.filter(name => theme.light[name] === undefined)).toEqual([])

      // `dark` only overrides scheme-dependent tokens. Scalars (radius, shadow,
      // font) are scheme-independent and correctly live in `:root` alone, where
      // they still apply under the dark selector via the cascade.
      const scalars = new Set(Object.keys(brand.scalars))
      const colors = needed.filter(name => !scalars.has(name))
      expect(colors.filter(name => theme.dark[name] === undefined)).toEqual([])
    }
  })

  it('the two shipped brands are genuinely different values', () => {
    // If this ever passes trivially (identical brands), the coverage guard above
    // stops proving the vocabulary is brand-agnostic.
    expect(toPrefabTheme(maxhealth).light.primary)
      .not.toBe(toPrefabTheme(dashboard).light.primary)
  })
})
