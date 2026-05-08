/**
 * PdfViewer component tests — server-side serialization + wire format.
 */

import { describe, it, expect } from 'bun:test'
import { PdfViewer } from '../src/components/pdf'

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

  it('defaults page=1, zoom=fit-width, toolbar=true, height=600', () => {
    const json = PdfViewer({ data: 'abc123' }).toJSON()
    expect(json.page).toBe(1)
    expect(json.zoom).toBe('fit-width')
    expect(json.toolbar).toBe(true)
    expect(json.height).toBe(600)
  })
})
