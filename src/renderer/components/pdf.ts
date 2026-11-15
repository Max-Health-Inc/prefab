/** PdfViewer renderer: lazy-loads PDF.js from the CDN and draws one page at a time to a <canvas>, with a page toolbar. */

import { registerComponent, resolveStr, el } from '../engine.js'
import { isRecord, optionalString } from '../../core/guards.js'
import type { ComponentNode, RenderContext, RenderResult } from '../engine.js'
import { importFromCdn } from '../cdn.js'

const PDFJS_CDN = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.9/build/pdf.min.mjs'
const PDFJS_WORKER_CDN = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.9/build/pdf.worker.min.mjs'
const ZOOM_STEP = 1.25
const MIN_SCALE = 0.25
const MAX_SCALE = 5
const CANVAS_PADDING = 32

/** Minimal type interface for the parts of PDF.js we use. */
interface PdfjsLib {
  getDocument(src: { url: string } | { data: Uint8Array }): { promise: Promise<PdfDocument> }
  GlobalWorkerOptions: { workerSrc: string }
}

interface PdfDocument {
  numPages: number
  getPage(num: number): Promise<PdfPage>
}

interface PdfViewport { width: number; height: number }

interface PdfRenderTask { promise: Promise<void>; cancel(): void }

interface PdfPage {
  getViewport(opts: { scale: number }): PdfViewport
  render(opts: { canvasContext: CanvasRenderingContext2D; viewport: PdfViewport; transform?: number[] }): PdfRenderTask
}

/** PDF.js 4 exports `GlobalWorkerOptions` as a class, so it is a function there and an object in older builds. */
export function isPdfjsLib(mod: unknown): mod is PdfjsLib {
  if (!isRecord(mod) || typeof mod.getDocument !== 'function') return false
  const options = mod.GlobalWorkerOptions
  return typeof options === 'function' || isRecord(options)
}

/** A finite number, or a string holding one; otherwise `fallback`. */
function numberProp(value: unknown, fallback: number): number {
  const n = typeof value === 'string' && value.trim() !== '' ? Number(value) : value
  return typeof n === 'number' && Number.isFinite(n) ? n : fallback
}

type Zoom = 'fit-page' | 'fit-width' | number

function zoomProp(value: unknown): Zoom {
  return value === 'fit-page' || value === 'fit-width' ? value : numberProp(value, 0) || 'fit-width'
}

async function loadPdfjs(): Promise<PdfjsLib> {
  const mod = await importFromCdn(PDFJS_CDN)
  if (!isPdfjsLib(mod)) throw new Error('PDF.js did not load')
  mod.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_CDN
  return mod
}

export function registerPdfComponents(): void {
  registerComponent('PdfViewer', renderPdfViewer)
}

function renderPdfViewer(node: ComponentNode, ctx: RenderContext): RenderResult {
  const wrapper = el('div', 'pf-pdf-viewer')
  wrapper.style.height = `${numberProp(node.height, 600)}px`

  const message = el('div', 'pf-pdf-message')
  message.setAttribute('role', 'status')
  message.textContent = 'Loading PDF…'
  wrapper.appendChild(message)

  const session = { destroyed: false, cleanup: (): void => undefined }
  void renderPdfAsync(wrapper, message, session, {
    src: node.src != null ? resolveStr(node.src, ctx) : undefined,
    data: optionalString(node.data),
    initialPage: numberProp(node.page, 1),
    zoom: zoomProp(node.zoom),
    showToolbar: node.toolbar !== false,
  })

  return { element: wrapper, destroy: () => { session.destroyed = true; session.cleanup() } }
}

interface PdfRenderOpts {
  src?: string
  data?: string
  initialPage: number
  zoom: Zoom
  showToolbar: boolean
}

interface PdfSession { destroyed: boolean; cleanup: () => void }

function decodeBase64(data: string): Uint8Array {
  const binary = atob(data)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

async function renderPdfAsync(wrapper: HTMLElement, message: HTMLElement, session: PdfSession, opts: PdfRenderOpts): Promise<void> {
  try {
    if (!opts.src && !opts.data) throw new Error('No PDF source provided')
    const lib = await loadPdfjs()
    const doc = await lib.getDocument(opts.src ? { url: opts.src } : { data: decodeBase64(opts.data ?? '') }).promise
    if (session.destroyed) return
    message.remove()

    let currentPage = Math.max(1, Math.min(opts.initialPage, doc.numPages))
    let zoom: Zoom = opts.zoom
    let scale = 1
    let task: PdfRenderTask | undefined
    let generation = 0

    const toolbar = opts.showToolbar
      ? buildToolbar(doc.numPages, {
        onPage: (p) => { goTo(p) },
        onZoom: (factor) => { zoom = clampScale(scale * factor); void renderPage() },
        onFit: () => { zoom = zoom === 'fit-page' ? 'fit-width' : 'fit-page'; void renderPage() },
      })
      : undefined
    if (toolbar) wrapper.appendChild(toolbar.el)

    const canvasContainer = el('div', 'pf-pdf-canvas-container')
    const canvas = document.createElement('canvas')
    canvas.className = 'pf-pdf-canvas'
    canvasContainer.appendChild(canvas)
    wrapper.appendChild(canvasContainer)

    function goTo(page: number): void {
      const n = Math.max(1, Math.min(page, doc.numPages))
      if (n !== currentPage) { currentPage = n; void renderPage() }
    }

    async function renderPage(): Promise<void> {
      generation += 1
      const mine = generation
      task?.cancel()
      const page = await doc.getPage(currentPage)
      if (session.destroyed || mine !== generation) return
      const base = page.getViewport({ scale: 1 })
      const width = Math.max(1, canvasContainer.clientWidth - CANVAS_PADDING)
      const height = Math.max(1, canvasContainer.clientHeight - CANVAS_PADDING)
      scale = zoom === 'fit-width' ? width / base.width
        : zoom === 'fit-page' ? Math.min(width / base.width, height / base.height)
          : zoom

      const viewport = page.getViewport({ scale })
      const ratio = window.devicePixelRatio || 1
      canvas.width = Math.floor(viewport.width * ratio)
      canvas.height = Math.floor(viewport.height * ratio)
      canvas.style.width = `${Math.floor(viewport.width)}px`
      canvas.style.height = `${Math.floor(viewport.height)}px`

      const canvasCtx = canvas.getContext('2d')
      if (!canvasCtx) return
      const current = page.render({ canvasContext: canvasCtx, viewport, transform: ratio !== 1 ? [ratio, 0, 0, ratio, 0, 0] : undefined })
      task = current
      try {
        await current.promise
      } catch (err) {
        if (mine !== generation) return
        throw err
      }
      toolbar?.update(currentPage, scale, zoom)
    }

    if (typeof ResizeObserver !== 'undefined') {
      let lastWidth = 0
      const observer = new ResizeObserver((entries) => {
        const w = Math.round(entries[0]?.contentRect.width ?? 0)
        if (typeof zoom === 'number' || w === lastWidth) return
        lastWidth = w
        void renderPage()
      })
      observer.observe(canvasContainer)
      session.cleanup = () => { observer.disconnect() }
    }

    await renderPage()
  } catch (err) {
    message.textContent = `Could not load PDF: ${err instanceof Error ? err.message : String(err)}`
    message.setAttribute('data-state', 'error')
  }
}

function clampScale(s: number): number {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, s))
}

interface ToolbarCallbacks {
  onPage: (page: number) => void
  onZoom: (factor: number) => void
  onFit: () => void
}

interface Toolbar {
  el: HTMLElement
  update: (page: number, scale: number, zoom: Zoom) => void
}

function toolbarButton(glyph: string, label: string, onClick: () => void): HTMLButtonElement {
  const btn = document.createElement('button')
  btn.type = 'button'
  btn.className = 'pf-pdf-btn'
  btn.textContent = glyph
  btn.title = label
  btn.setAttribute('aria-label', label)
  btn.addEventListener('click', onClick)
  return btn
}

function buildToolbar(numPages: number, cb: ToolbarCallbacks): Toolbar {
  const toolbar = el('div', 'pf-pdf-toolbar')
  let page = 1

  const prevBtn = toolbarButton('‹', 'Previous page', () => { cb.onPage(page - 1) })
  const nextBtn = toolbarButton('›', 'Next page', () => { cb.onPage(page + 1) })

  const pageInput = document.createElement('input')
  pageInput.type = 'text'
  pageInput.inputMode = 'numeric'
  pageInput.className = 'pf-pdf-page-input'
  pageInput.setAttribute('aria-label', 'Page number')
  pageInput.addEventListener('change', () => {
    const val = parseInt(pageInput.value, 10)
    if (isNaN(val)) pageInput.value = String(page)
    else cb.onPage(val)
  })

  const pageCount = el('span', 'pf-pdf-page-count')
  pageCount.textContent = `/ ${String(numPages)}`

  const spacer = el('span', 'pf-pdf-spacer')
  const zoomOut = toolbarButton('−', 'Zoom out', () => { cb.onZoom(1 / ZOOM_STEP) })
  const zoomLabel = el('span', 'pf-pdf-zoom-label')
  const zoomIn = toolbarButton('+', 'Zoom in', () => { cb.onZoom(ZOOM_STEP) })
  const fit = toolbarButton('⤢', 'Fit page / fit width', cb.onFit)

  toolbar.append(prevBtn, pageInput, pageCount, nextBtn, spacer, zoomOut, zoomLabel, zoomIn, fit)

  return {
    el: toolbar,
    update(current, scale, zoom) {
      page = current
      pageInput.value = String(current)
      prevBtn.disabled = current <= 1
      nextBtn.disabled = current >= numPages
      zoomLabel.textContent = `${String(Math.round(scale * 100))}%`
      zoomOut.disabled = scale <= MIN_SCALE
      zoomIn.disabled = scale >= MAX_SCALE
      fit.setAttribute('aria-pressed', typeof zoom === 'number' ? 'false' : 'true')
    },
  }
}
