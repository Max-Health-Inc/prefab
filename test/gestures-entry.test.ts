import { describe, expect, it } from 'bun:test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = join(import.meta.dir, '..')
const manifest: unknown = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'))

function gesturesEntry(): { import: string; types: string } {
  if (typeof manifest !== 'object' || manifest === null || !('exports' in manifest)) throw new Error('package.json has no exports')
  const { exports } = manifest
  if (typeof exports !== 'object' || exports === null || !('./gestures' in exports)) throw new Error('no ./gestures export')
  const entry = exports['./gestures']
  if (typeof entry !== 'object' || entry === null || !('import' in entry) || !('types' in entry)) throw new Error('./gestures needs import and types')
  const { import: js, types } = entry
  if (typeof js !== 'string' || typeof types !== 'string') throw new Error('./gestures paths must be strings')
  return { import: js, types }
}

const sourceOf = (distPath: string): string => join(ROOT, distPath.replace(/^\.\/dist\//, 'src/').replace(/\.js$/, '.ts'))

describe('@maxhealth.tech/prefab/gestures', () => {
  it('maps to one compiled module and its declarations', () => {
    const entry = gesturesEntry()
    expect(entry.import).toMatch(/^\.\/dist\/.+\.js$/)
    expect(entry.types).toBe(entry.import.replace(/\.js$/, '.d.ts'))
    expect(existsSync(sourceOf(entry.import))).toBe(true)
  })

  it('imports nothing, so a consumer bundles only this module', () => {
    const source = readFileSync(sourceOf(gesturesEntry().import), 'utf8')
    expect(source).not.toMatch(/^\s*import\s/m)
    expect(source).not.toMatch(/\bfrom\s+['"]/)
    expect(source).not.toMatch(/\bimport\(/)
  })

  it('exports the gesture API', async () => {
    const api: Record<string, unknown> = await import(sourceOf(gesturesEntry().import))
    for (const name of ['attachGestures', 'clampScale', 'clampScroll', 'anchorAt', 'anchorScrollDelta', 'wheelZoomFactor', 'isDoubleTap', 'keyCommand', 'overflows']) {
      expect(typeof api[name]).toBe('function')
    }
    expect(api.ZOOM_STEP).toBe(1.25)
    expect(api.MIN_SCALE).toBeLessThan(1)
    expect(api.MAX_SCALE).toBeGreaterThan(1)
  })

  it('is the module PdfViewer uses, not a copy', () => {
    const viewer = readFileSync(join(ROOT, 'src/renderer/components/pdf/index.ts'), 'utf8')
    expect(viewer).toContain("from './gestures.js'")
  })
})
