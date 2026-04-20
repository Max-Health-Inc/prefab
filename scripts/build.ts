/**
 * Build script — uses Bun's bundler to produce ESM + declarations + renderer bundle.
 */

import { $ } from 'bun'

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
