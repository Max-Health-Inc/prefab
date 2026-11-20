/** PdfViewer renderer: lazy-loads PDF.js from the CDN and draws one page at a time to a <canvas>, with a page toolbar, drag-to-pan, pointer-anchored zoom and keyboard control. */

import { registerComponent, resolveStr, el } from '../../engine.js'
import { cssLength, isRecord, optionalString } from '../../../core/guards.js'
import type { ComponentNode, RenderContext, RenderResult } from '../../engine.js'
import { importFromCdn } from '../../cdn.js'
import { ZOOM_STEP, anchorScrollDelta, attachGestures, clampScale, clampScroll } from './gestures.js'
import type { GestureController, ZoomAnchor } from './gestures.js'
import { buildToolbar } from './toolbar.js'
import type { Zoom } from './toolbar.js'

const PDFJS_CDN = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.9/build/pdf.min.mjs'
const PDFJS_WORKER_CDN = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.9/build/pdf.worker.min.mjs'
const CANVAS_PADDING = 32
const DEFAULT_HEIGHT = 600

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
  wrapper.style.height = cssLength(node.height, DEFAULT_HEIGHT)

  const message = el('div', 'pf-pdf-message')
  message.setAttribute('role', 'status')
  message.textContent = 'Loading PDF…'
  wrapper.appendChild(message)

  const session: PdfSession = { destroyed: false, cleanup: [] }
  void renderPdfAsync(wrapper, message, session, {
    src: node.src != null ? resolveStr(node.src, ctx) : undefined,
    data: optionalString(node.data),
    initialPage: numberProp(node.page, 1),
    zoom: zoomProp(node.zoom),
    showToolbar: node.toolbar !== false,
  })

  return {
    element: wrapper,
    destroy: () => {
      session.destroyed = true
      for (const fn of session.cleanup) fn()
    },
  }
}

interface PdfRenderOpts {
  src?: string
  data?: string
  initialPage: number
  zoom: Zoom
  showToolbar: boolean
}

interface PdfSession { destroyed: boolean; cleanup: (() => void)[] }

function decodeBase64(data: string): Uint8Array {
  const binary = atob(data)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

function newCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.className = 'pf-pdf-canvas'
  return canvas
}

interface RenderRequest { anchor?: ZoomAnchor; toTop?: boolean }

async function renderPdfAsync(wrapper: HTMLElement, message: HTMLElement, session: PdfSession, opts: PdfRenderOpts): Promise<void> {
  try {
    if (!opts.src && !opts.data) throw new Error('No PDF source provided')
    const lib = await loadPdfjs()
    const doc = await lib.getDocument(opts.src ? { url: opts.src } : { data: decodeBase64(opts.data ?? '') }).promise
    if (session.destroyed) return
    message.remove()

    let currentPage = Math.max(1, Math.min(opts.initialPage, doc.numPages))
    let zoom: Zoom = opts.zoom
    let lastFit: Zoom = typeof opts.zoom === 'number' ? 'fit-width' : opts.zoom
    let scale = 1
    let task: PdfRenderTask | undefined
    let generation = 0

    const toolbar = opts.showToolbar
      ? buildToolbar(doc.numPages, {
        onPage: (p) => { goTo(p) },
        onZoom: (factor) => { gestures.zoomBy(factor) },
        onFit: () => { setZoom(zoom === 'fit-page' ? 'fit-width' : 'fit-page', gestures.centerAnchor()) },
      })
      : undefined
    if (toolbar) wrapper.appendChild(toolbar.el)

    const canvasContainer = el('div', 'pf-pdf-canvas-container')
    canvasContainer.tabIndex = 0
    canvasContainer.setAttribute('role', 'region')
    let canvas = newCanvas()
    canvasContainer.appendChild(canvas)
    wrapper.appendChild(canvasContainer)

    const gestures: GestureController = attachGestures(canvasContainer, {
      canvas: () => canvas,
      renderedScale: () => scale,
      preview: (s) => { toolbar?.update(currentPage, s, s) },
      zoomTo: (s, anchor) => { setZoom(clampScale(s), anchor) },
      doubleTap: (anchor) => {
        if (typeof zoom === 'number') setZoom(lastFit, anchor)
        else setZoom(clampScale(scale * ZOOM_STEP), anchor)
      },
      command: (cmd) => {
        if (cmd.kind === 'fit') setZoom(lastFit, gestures.centerAnchor())
        else if (cmd.kind === 'page') goTo(currentPage + cmd.delta)
        else goTo(cmd.edge === 'first' ? 1 : doc.numPages)
      },
    })
    session.cleanup.push(() => { gestures.destroy() })

    function setZoom(next: Zoom, anchor?: ZoomAnchor): void {
      if (typeof next !== 'number') lastFit = next
      zoom = next
      void renderPage({ anchor })
    }

    function goTo(page: number): void {
      const n = Math.max(1, Math.min(page, doc.numPages))
      if (n !== currentPage) { currentPage = n; void renderPage({ toTop: true }) }
    }

    function scrollAfterRender(req: RenderRequest): void {
      const maxX = canvasContainer.scrollWidth - canvasContainer.clientWidth
      const maxY = canvasContainer.scrollHeight - canvasContainer.clientHeight
      if (req.anchor) {
        const d = anchorScrollDelta(req.anchor, canvas.getBoundingClientRect(), scale)
        canvasContainer.scrollLeft = clampScroll(canvasContainer.scrollLeft + d.x, maxX)
        canvasContainer.scrollTop = clampScroll(canvasContainer.scrollTop + d.y, maxY)
      } else if (req.toTop) {
        canvasContainer.scrollTop = 0
      }
    }

    async function renderPage(req: RenderRequest = {}): Promise<void> {
      generation += 1
      const mine = generation
      const stale = (): boolean => session.destroyed || mine !== generation
      task?.cancel()
      const page = await doc.getPage(currentPage)
      if (stale()) return
      const base = page.getViewport({ scale: 1 })
      const width = Math.max(1, canvasContainer.clientWidth - CANVAS_PADDING)
      const height = Math.max(1, canvasContainer.clientHeight - CANVAS_PADDING)
      const nextScale = zoom === 'fit-width' ? width / base.width
        : zoom === 'fit-page' ? Math.min(width / base.width, height / base.height)
          : zoom

      const viewport = page.getViewport({ scale: nextScale })
      const ratio = window.devicePixelRatio || 1
      const next = newCanvas()
      next.width = Math.floor(viewport.width * ratio)
      next.height = Math.floor(viewport.height * ratio)
      next.style.width = `${String(Math.floor(viewport.width))}px`
      next.style.height = `${String(Math.floor(viewport.height))}px`

      const canvasCtx = next.getContext('2d')
      if (!canvasCtx) return
      const current = page.render({ canvasContext: canvasCtx, viewport, transform: ratio !== 1 ? [ratio, 0, 0, ratio, 0, 0] : undefined })
      task = current
      try {
        await current.promise
      } catch (err) {
        if (stale()) return
        throw err
      }
      if (stale()) return
      canvas.replaceWith(next)
      canvas = next
      scale = nextScale
      scrollAfterRender(req)
      gestures.refresh()
      canvasContainer.setAttribute('aria-label', `PDF page ${String(currentPage)} of ${String(doc.numPages)}`)
      toolbar?.update(currentPage, scale, zoom)
    }

    if (typeof ResizeObserver !== 'undefined') {
      let lastWidth = 0
      const observer = new ResizeObserver((entries) => {
        const w = Math.round(entries[0]?.contentRect.width ?? 0)
        if (typeof zoom === 'number' || w === lastWidth) { gestures.refresh(); return }
        lastWidth = w
        void renderPage()
      })
      observer.observe(canvasContainer)
      session.cleanup.push(() => { observer.disconnect() })
    }

    await renderPage()
  } catch (err) {
    message.textContent = `Could not load PDF: ${err instanceof Error ? err.message : String(err)}`
    message.setAttribute('data-state', 'error')
    if (!message.isConnected) wrapper.appendChild(message)
  }
}
