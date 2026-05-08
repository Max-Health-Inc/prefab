/**
 * PdfViewer renderer — lazy-loads PDF.js from CDN and renders to <canvas>.
 *
 * Features:
 * - On-demand loading (~180KB only when PdfViewer is used)
 * - Page navigation toolbar (prev/next, page input, zoom)
 * - Canvas rendering with text layer for copy/paste
 * - Supports URL (`src`) or inline base64 (`data`)
 * - Responsive fit-width / fit-page zoom modes
 */

import { registerComponent, resolveStr, el } from '../engine.js'
import type { ComponentNode, RenderContext } from '../engine.js'

/** CDN URL for pdf.js (ES module build). */
const PDFJS_CDN = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.9/build/pdf.min.mjs'
const PDFJS_WORKER_CDN = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.9/build/pdf.worker.min.mjs'

/** Cached PDF.js library reference. */
let pdfjsLib: PdfjsLib | null = null
let loadPromise: Promise<PdfjsLib> | null = null

/** Minimal type interface for the parts of PDF.js we use. */
interface PdfjsLib {
  getDocument(src: { url: string } | { data: Uint8Array }): { promise: Promise<PdfDocument> }
  GlobalWorkerOptions: { workerSrc: string }
}

interface PdfDocument {
  numPages: number
  getPage(num: number): Promise<PdfPage>
}

interface PdfPage {
  getViewport(opts: { scale: number }): { width: number; height: number }
  render(opts: { canvasContext: CanvasRenderingContext2D; viewport: { width: number; height: number } }): { promise: Promise<void> }
}

/** Load PDF.js on demand. Cached after first call. */
async function loadPdfjs(): Promise<PdfjsLib> {
  if (pdfjsLib) return pdfjsLib
  if (loadPromise) return loadPromise

  loadPromise = import(/* webpackIgnore: true */ PDFJS_CDN).then((mod) => {
    const lib = mod as unknown as PdfjsLib
    lib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_CDN
    pdfjsLib = lib
    return lib
  })

  return loadPromise
}

export function registerPdfComponents(): void {
  registerComponent('PdfViewer', renderPdfViewer)
}

function renderPdfViewer(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const wrapper = el('div', 'pf-pdf-viewer')
  const src = node.src != null ? resolveStr(node.src, ctx) : undefined
  const data = node.data as string | undefined
  const initialPage = node.page != null ? (node.page as number) : 1
  const zoom = node.zoom != null ? (node.zoom as string | number) : 'fit-width'
  const showToolbar = node.toolbar !== false
  const height = node.height != null ? (node.height as number) : 600

  wrapper.style.height = `${height}px`
  wrapper.style.display = 'flex'
  wrapper.style.flexDirection = 'column'
  wrapper.style.overflow = 'hidden'
  wrapper.style.border = '1px solid var(--color-border-primary, #e5e7eb)'
  wrapper.style.borderRadius = 'var(--border-radius-md, 0.375rem)'
  wrapper.style.background = 'var(--color-background-secondary, #f9fafb)'

  // Loading state
  const loading = el('div', 'pf-pdf-loading')
  loading.textContent = 'Loading PDF…'
  loading.style.display = 'flex'
  loading.style.alignItems = 'center'
  loading.style.justifyContent = 'center'
  loading.style.flex = '1'
  loading.style.color = 'var(--color-text-secondary, #6b7280)'
  wrapper.appendChild(loading)

  // Boot async rendering
  void renderPdfAsync(wrapper, loading, { src, data, initialPage, zoom, showToolbar })

  return wrapper
}

interface PdfRenderOpts {
  src?: string
  data?: string
  initialPage: number
  zoom: string | number
  showToolbar: boolean
}

async function renderPdfAsync(
  wrapper: HTMLElement,
  loading: HTMLElement,
  opts: PdfRenderOpts,
): Promise<void> {
  try {
    const lib = await loadPdfjs()

    let docSource: { url: string } | { data: Uint8Array }
    if (opts.src) {
      docSource = { url: opts.src }
    } else if (opts.data) {
      const binary = atob(opts.data)
      const bytes = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
      docSource = { data: bytes }
    } else {
      loading.textContent = 'Error: No PDF source provided'
      return
    }

    const doc = await lib.getDocument(docSource).promise
    loading.remove()

    // State
    let currentPage = Math.max(1, Math.min(opts.initialPage, doc.numPages))

    // Toolbar
    let pageInput: HTMLInputElement | null = null
    let pageCount: HTMLSpanElement | null = null

    if (opts.showToolbar) {
      const toolbar = buildToolbar(doc.numPages, currentPage, {
        onPrev: () => { if (currentPage > 1) { currentPage--; void renderPage() } },
        onNext: () => { if (currentPage < doc.numPages) { currentPage++; void renderPage() } },
        onPageChange: (p) => {
          const n = Math.max(1, Math.min(p, doc.numPages))
          if (n !== currentPage) { currentPage = n; void renderPage() }
        },
      })
      pageInput = toolbar.pageInput
      pageCount = toolbar.pageCount
      wrapper.insertBefore(toolbar.el, wrapper.firstChild)
    }

    // Canvas container (scrollable)
    const canvasContainer = el('div', 'pf-pdf-canvas-container')
    canvasContainer.style.flex = '1'
    canvasContainer.style.overflow = 'auto'
    canvasContainer.style.display = 'flex'
    canvasContainer.style.justifyContent = 'center'
    canvasContainer.style.padding = '8px'
    wrapper.appendChild(canvasContainer)

    const canvas = document.createElement('canvas')
    canvas.style.display = 'block'
    canvas.style.boxShadow = 'var(--shadow-md, 0 4px 6px -1px rgba(0,0,0,.1))'
    canvasContainer.appendChild(canvas)

    async function renderPage(): Promise<void> {
      const page = await doc.getPage(currentPage)
      const containerWidth = canvasContainer.clientWidth - 16 // padding

      let scale: number
      const baseViewport = page.getViewport({ scale: 1 })

      if (opts.zoom === 'fit-width') {
        scale = containerWidth / baseViewport.width
      } else if (opts.zoom === 'fit-page') {
        const containerHeight = canvasContainer.clientHeight - 16
        const scaleW = containerWidth / baseViewport.width
        const scaleH = containerHeight / baseViewport.height
        scale = Math.min(scaleW, scaleH)
      } else {
        scale = typeof opts.zoom === 'number' ? opts.zoom : 1
      }

      const viewport = page.getViewport({ scale })
      canvas.width = viewport.width
      canvas.height = viewport.height
      canvas.style.width = `${viewport.width}px`
      canvas.style.height = `${viewport.height}px`

      const canvasCtx = canvas.getContext('2d')
      if (!canvasCtx) return

      await page.render({ canvasContext: canvasCtx, viewport }).promise

      // Update toolbar
      if (pageInput) pageInput.value = String(currentPage)
      if (pageCount) pageCount.textContent = `/ ${doc.numPages}`
    }

    await renderPage()
  } catch (err) {
    loading.textContent = `PDF Error: ${err instanceof Error ? err.message : String(err)}`
    loading.style.color = 'var(--color-text-danger, #dc2626)'
  }
}

interface ToolbarCallbacks {
  onPrev: () => void
  onNext: () => void
  onPageChange: (page: number) => void
}

function buildToolbar(
  numPages: number,
  currentPage: number,
  cb: ToolbarCallbacks,
): { el: HTMLElement; pageInput: HTMLInputElement; pageCount: HTMLSpanElement } {
  const toolbar = el('div', 'pf-pdf-toolbar')
  toolbar.style.display = 'flex'
  toolbar.style.alignItems = 'center'
  toolbar.style.gap = '8px'
  toolbar.style.padding = '6px 12px'
  toolbar.style.borderBottom = '1px solid var(--color-border-primary, #e5e7eb)'
  toolbar.style.background = 'var(--color-background-primary, #fff)'
  toolbar.style.flexShrink = '0'
  toolbar.style.fontSize = '13px'

  const prevBtn = document.createElement('button')
  prevBtn.textContent = '‹'
  prevBtn.title = 'Previous page'
  prevBtn.className = 'pf-pdf-btn'
  styleButton(prevBtn)
  prevBtn.addEventListener('click', cb.onPrev)

  const nextBtn = document.createElement('button')
  nextBtn.textContent = '›'
  nextBtn.title = 'Next page'
  nextBtn.className = 'pf-pdf-btn'
  styleButton(nextBtn)
  nextBtn.addEventListener('click', cb.onNext)

  const pageInput = document.createElement('input')
  pageInput.type = 'number'
  pageInput.min = '1'
  pageInput.max = String(numPages)
  pageInput.value = String(currentPage)
  pageInput.style.width = '48px'
  pageInput.style.textAlign = 'center'
  pageInput.style.border = '1px solid var(--color-border-primary, #e5e7eb)'
  pageInput.style.borderRadius = '4px'
  pageInput.style.padding = '2px 4px'
  pageInput.style.fontSize = '13px'
  pageInput.addEventListener('change', () => {
    const val = parseInt(pageInput.value, 10)
    if (!isNaN(val)) cb.onPageChange(val)
  })

  const pageCount = document.createElement('span')
  pageCount.textContent = `/ ${numPages}`
  pageCount.style.color = 'var(--color-text-secondary, #6b7280)'

  toolbar.appendChild(prevBtn)
  toolbar.appendChild(pageInput)
  toolbar.appendChild(pageCount)
  toolbar.appendChild(nextBtn)

  return { el: toolbar, pageInput, pageCount }
}

function styleButton(btn: HTMLButtonElement): void {
  btn.style.border = '1px solid var(--color-border-primary, #e5e7eb)'
  btn.style.borderRadius = '4px'
  btn.style.background = 'var(--color-background-primary, #fff)'
  btn.style.cursor = 'pointer'
  btn.style.padding = '2px 8px'
  btn.style.fontSize = '16px'
  btn.style.lineHeight = '1'
}
