/**
 * PdfViewer component — render PDF documents inside MCP Apps.
 *
 * Uses Mozilla PDF.js loaded on-demand from CDN. Renders pages to `<canvas>`
 * with an optional text layer for copy/paste and search.
 *
 * CSP requirements:
 * - `resourceDomains`: include the PDF.js CDN (jsdelivr by default)
 * - `connectDomains`: include the origin serving your PDF files
 */

import { Component } from '../../core/component.js'
import type { ComponentProps } from '../../core/component.js'

export type PdfZoom = 'fit-width' | 'fit-page' | number

export interface PdfViewerProps extends ComponentProps {
  /** URL to the PDF file (requires origin in `connectDomains`). */
  src?: string
  /** Base64-encoded PDF data (inline, no CORS needed). */
  data?: string
  /** Initial page number (1-based). @default 1 */
  page?: number
  /** Zoom mode or scale factor. @default 'fit-width' */
  zoom?: PdfZoom
  /** Show navigation toolbar (page nav + zoom). @default true */
  toolbar?: boolean
  /** Container height in pixels. @default 600 */
  height?: number
}

/**
 * PDF viewer component.
 *
 * @example From URL:
 * ```ts
 * PdfViewer('https://api.example.com/reports/q1.pdf')
 * ```
 *
 * @example From base64:
 * ```ts
 * PdfViewer({ data: base64String, toolbar: true })
 * ```
 *
 * @example With options:
 * ```ts
 * PdfViewer('https://example.com/doc.pdf', { page: 3, zoom: 'fit-page', height: 800 })
 * ```
 */
export function PdfViewer(srcOrProps: string | PdfViewerProps, opts?: Omit<PdfViewerProps, 'src'>): Component {
  const src = typeof srcOrProps === 'string' ? srcOrProps : srcOrProps.src
  const data = typeof srcOrProps === 'string' ? undefined : srcOrProps.data
  const baseProps = typeof srcOrProps === 'string' ? opts : srcOrProps
  const page = baseProps?.page ?? 1
  const zoom = baseProps?.zoom ?? 'fit-width'
  const toolbar = baseProps?.toolbar ?? true
  const height = baseProps?.height ?? 600

  const c = new Component('PdfViewer', baseProps)
  c.getProps = () => ({
    ...(src && { src }),
    ...(data && { data }),
    page,
    zoom,
    toolbar,
    height,
  })
  return c
}
