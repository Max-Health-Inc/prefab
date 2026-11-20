/** The PdfViewer toolbar: page navigation, zoom out / in with a percentage, and a fit toggle. */

import { el } from '../../engine.js'
import { MAX_SCALE, MIN_SCALE, ZOOM_STEP } from './gestures.js'

export type Zoom = 'fit-page' | 'fit-width' | number

export interface ToolbarCallbacks {
  onPage: (page: number) => void
  onZoom: (factor: number) => void
  onFit: () => void
}

export interface Toolbar {
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

export function buildToolbar(numPages: number, cb: ToolbarCallbacks): Toolbar {
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
