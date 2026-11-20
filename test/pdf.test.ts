/**
 * PdfViewer component tests — server-side serialization + wire format.
 */

import { describe, it, expect } from 'bun:test'
import { PdfViewer } from '../src/components/pdf'
import { renderNode } from '../src/renderer/engine'
import { registerPdfComponents } from '../src/renderer/components/pdf'
import { makeRenderCtx } from './helpers/render'
import { cssLength } from '../src/core/guards'

describe('PdfViewer', () => {
  it('creates component from URL string', () => {
    const json = PdfViewer('https://example.com/doc.pdf').toJSON()
    expect(json.type).toBe('PdfViewer')
    expect(json.src).toBe('https://example.com/doc.pdf')
    expect(json.page).toBe(1)
    expect(json.zoom).toBe('fit-width')
    expect(json.toolbar).toBe(true)
    expect(json.height).toBe(600)
  })

  it('creates component from URL with options', () => {
    const json = PdfViewer('https://example.com/doc.pdf', {
      page: 3,
      zoom: 'fit-page',
      toolbar: false,
      height: 800,
    }).toJSON()
    expect(json.type).toBe('PdfViewer')
    expect(json.src).toBe('https://example.com/doc.pdf')
    expect(json.page).toBe(3)
    expect(json.zoom).toBe('fit-page')
    expect(json.toolbar).toBe(false)
    expect(json.height).toBe(800)
  })

  it('creates component from base64 data', () => {
    const base64 = 'JVBERi0xLjQK...' // truncated PDF header
    const json = PdfViewer({ data: base64 }).toJSON()
    expect(json.type).toBe('PdfViewer')
    expect(json.data).toBe(base64)
    expect(json.src).toBeUndefined()
    expect(json.page).toBe(1)
    expect(json.toolbar).toBe(true)
  })

  it('accepts numeric zoom scale', () => {
    const json = PdfViewer('https://example.com/doc.pdf', { zoom: 1.5 }).toJSON()
    expect(json.zoom).toBe(1.5)
  })

  it('props form with src', () => {
    const json = PdfViewer({ src: 'https://example.com/doc.pdf', height: 400 }).toJSON()
    expect(json.src).toBe('https://example.com/doc.pdf')
    expect(json.height).toBe(400)
  })

  it('serializes a CSS length height as written', () => {
    expect(PdfViewer('https://example.com/doc.pdf', { height: 'min(720px, 75vh)' }).toJSON().height).toBe('min(720px, 75vh)')
  })

  it('defaults page=1, zoom=fit-width, toolbar=true, height=600', () => {
    const json = PdfViewer({ data: 'abc123' }).toJSON()
    expect(json.page).toBe(1)
    expect(json.zoom).toBe('fit-width')
    expect(json.toolbar).toBe(true)
    expect(json.height).toBe(600)
  })
})

describe('PdfViewer renderer', () => {
  it('sizes the viewer from a numeric or CSS length height and falls back to 600px for anything else', () => {
    registerPdfComponents()
    const ctx = makeRenderCtx()
    const height = (value: unknown): string => {
      const el = renderNode({ type: 'PdfViewer', height: value }, ctx)
      return el instanceof HTMLElement ? el.style.height : 'not an element'
    }

    expect(height(480)).toBe('480px')
    expect(height('480')).toBe('480px')
    expect(height('calc(100% - 2rem)')).toBe('calc(100% - 2rem)')
    expect(height({ px: 480 })).toBe('600px')
    expect(height('tall')).toBe('600px')
  })
})

describe('cssLength', () => {
  it('keeps numbers as pixels for backward compatibility', () => {
    expect(cssLength(480, 600)).toBe('480px')
    expect(cssLength('480', 600)).toBe('480px')
    expect(cssLength(' 12.5 ', 600)).toBe('12.5px')
  })

  it('passes CSS lengths and length functions through', () => {
    for (const v of ['60dvh', '75vh', '32rem', '100%', 'min(720px, 75vh)', 'clamp(320px, 60svh, 900px)', 'calc(100vh - 4rem)', 'var(--viewer-height)', 'auto']) {
      expect(cssLength(v, 600)).toBe(v)
    }
    expect(cssLength('  60dvh ', 600)).toBe('60dvh')
  })

  it('falls back for anything that is not a length', () => {
    for (const v of ['tall', '', '   ', '60 dvh', 'red', 'min(1px); color: red', 'url(x)', null, undefined, {}, [], Number.NaN, Infinity]) {
      expect(cssLength(v, 600)).toBe('600px')
    }
  })
})

describe('PDF.js module detection', () => {
  it('accepts the PDF.js 4 module shape, where GlobalWorkerOptions is a class', async () => {
    const { isPdfjsLib } = await import('../src/renderer/components/pdf')
    const GlobalWorkerOptions = Object.assign(function GlobalWorkerOptions() { return undefined }, { workerSrc: '' })
    const namespace = Object.assign(Object.create(null) as object, { getDocument: () => ({}), GlobalWorkerOptions })
    expect(isPdfjsLib(namespace)).toBe(true)
    expect(isPdfjsLib({ getDocument: () => ({}), GlobalWorkerOptions: { workerSrc: '' } })).toBe(true)
    expect(isPdfjsLib({ getDocument: () => ({}) })).toBe(false)
  })
})
