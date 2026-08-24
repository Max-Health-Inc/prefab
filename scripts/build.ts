/**
 * Build script — uses Bun's bundler to produce ESM + declarations + renderer bundle.
 */

import { $ } from 'bun'
import { readFileSync, writeFileSync, copyFileSync } from 'node:fs'

// ── Sync VERSION constant with package.json ──────────────────────────────────
const pkg = JSON.parse(readFileSync('package.json', 'utf-8')) as { version: string }
const appSrc = readFileSync('src/app.ts', 'utf-8')
const updated = appSrc.replace(
  /export const VERSION = '[^']*'/,
  `export const VERSION = '${pkg.version}'`,
)
if (updated !== appSrc) {
  writeFileSync('src/app.ts', updated)
  console.log(`✅ VERSION synced to ${pkg.version}`)
}

// Clean
await $`rm -rf dist`

// Compile TypeScript → JS + declarations (build config excludes test files)
await $`bunx tsc -p tsconfig.build.json`

// Bundle renderer as a single IIFE for CDN usage
const result = await Bun.build({
  entrypoints: ['src/renderer/index.ts'],
  outdir: 'dist',
  naming: 'renderer.min.js',
  target: 'browser',
  format: 'iife',
  minify: true,
})

if (!result.success) {
  console.error('❌ Renderer bundle failed:')
  for (const log of result.logs) {
    console.error(log)
  }
  process.exit(1)
}

console.log('✅ Build complete → dist/')
console.log('✅ Renderer bundle → dist/renderer.min.js')

// Bundle auto-mount renderer (self-executing, no inline script needed)
const autoResult = await Bun.build({
  entrypoints: ['src/renderer/auto.ts'],
  outdir: 'dist',
  naming: 'renderer.auto.min.js',
  target: 'browser',
  format: 'iife',
  minify: true,
})

if (!autoResult.success) {
  console.error('❌ Auto-mount bundle failed:')
  for (const log of autoResult.logs) {
    console.error(log)
  }
  process.exit(1)
}

console.log('✅ Auto-mount bundle → dist/renderer.auto.min.js')

// Bundle the A2UI emitter separately from the renderer. Almost no page that
// renders $prefab also emits A2UI, so folding it into renderer.min.js would tax
// every consumer for a feature they do not use.
const a2uiResult = await Bun.build({
  entrypoints: ['src/a2ui/browser.ts'],
  outdir: 'dist',
  naming: 'a2ui.min.js',
  target: 'browser',
  format: 'iife',
  minify: true,
})

if (!a2uiResult.success) {
  console.error('❌ A2UI bundle failed:')
  for (const log of a2uiResult.logs) {
    console.error(log)
  }
  process.exit(1)
}

console.log('✅ A2UI bundle → dist/a2ui.min.js')

// Copy CSS theme file to dist
copyFileSync('src/prefab.css', 'dist/prefab.css')
console.log('✅ Base theme → dist/prefab.css')

// Regenerate the skill's example assets from the single canonical source
// (docs/public/examples/). These copies are git-ignored, so a normal build
// keeps the skill bundle self-contained without committing duplicate JSON.
const { genSkillAssets } = await import('./gen-skill-assets.ts')
genSkillAssets()

// Refresh the component-type list from the render registry. Unlike the skill
// assets this output IS committed (src/core/validate.ts imports it, so a fresh
// clone must typecheck before any generator runs), which is why
// test/component-types.test.ts fails on a stale copy rather than trusting this.
const { genComponentTypes } = await import('./gen-component-types.ts')
genComponentTypes()
