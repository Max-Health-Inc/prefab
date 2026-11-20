import { describe, expect, it, mock } from 'bun:test'
import {
  KEY_PAN_STEP, MAX_SCALE, MIN_SCALE, ZOOM_STEP,
  anchorAt, anchorScrollDelta, attachGestures, clampScale, clampScroll, isDoubleTap, keyCommand, overflows, wheelZoomFactor,
} from '../src/renderer/components/pdf/gestures'
import type { GestureHost, KeyCommand, ZoomAnchor } from '../src/renderer/components/pdf/gestures'

const PAD = 16

/** Client rect of a canvas centred in a scroll container at client x/y 0 with 16px padding. */
function canvasRect(pageW: number, pageH: number, scale: number, viewW: number, scroll: { x: number; y: number }): DOMRect {
  const w = pageW * scale
  const left = w + 2 * PAD <= viewW ? (viewW - w) / 2 : PAD - scroll.x
  return new DOMRect(left, PAD - scroll.y, w, pageH * scale)
}

describe('zoom anchoring', () => {
  it('keeps the page point under the pointer after the canvas is redrawn at a new scale', () => {
    const cases = [
      { from: 1, to: 2, pointer: { x: 300, y: 200 }, scroll: { x: 0, y: 0 } },
      { from: 1.5, to: 0.8, pointer: { x: 120, y: 410 }, scroll: { x: 240, y: 90 } },
      { from: 2, to: 5, pointer: { x: 790, y: 15 }, scroll: { x: 600, y: 1200 } },
    ]
    for (const c of cases) {
      const before = canvasRect(800, 1100, c.from, 800, c.scroll)
      const anchor = anchorAt(c.pointer, before, c.from)
      const after = canvasRect(800, 1100, c.to, 800, c.scroll)
      const d = anchorScrollDelta(anchor, after, c.to)
      const scroll = { x: c.scroll.x + d.x, y: c.scroll.y + d.y }
      const settled = canvasRect(800, 1100, c.to, 800, scroll)
      const centred = 800 * c.to + 2 * PAD <= 800
      if (!centred) expect(settled.left + anchor.page.x * c.to).toBeCloseTo(c.pointer.x, 6)
      expect(settled.top + anchor.page.y * c.to).toBeCloseTo(c.pointer.y, 6)
    }
  })

  it('maps the client point into unscaled page units', () => {
    const anchor = anchorAt({ x: 116, y: 66 }, new DOMRect(16, 16, 400, 500), 2)
    expect(anchor.page).toEqual({ x: 50, y: 25 })
  })
})

describe('clamping', () => {
  it('keeps scroll offsets between 0 and the scrollable range', () => {
    expect(clampScroll(-40, 300)).toBe(0)
    expect(clampScroll(120, 300)).toBe(120)
    expect(clampScroll(900, 300)).toBe(300)
    expect(clampScroll(50, -10)).toBe(0)
  })

  it('keeps the scale within MIN_SCALE and MAX_SCALE', () => {
    expect(clampScale(0.01)).toBe(MIN_SCALE)
    expect(clampScale(1.3)).toBe(1.3)
    expect(clampScale(99)).toBe(MAX_SCALE)
  })

  it('reports overflow only past a one-pixel rounding margin', () => {
    expect(overflows({ scrollWidth: 801, scrollHeight: 600, clientWidth: 800, clientHeight: 600 })).toBe(false)
    expect(overflows({ scrollWidth: 900, scrollHeight: 600, clientWidth: 800, clientHeight: 600 })).toBe(true)
    expect(overflows({ scrollWidth: 800, scrollHeight: 700, clientWidth: 800, clientHeight: 600 })).toBe(true)
  })
})

describe('wheel zoom factor', () => {
  it('zooms in on negative deltas and out on positive ones, symmetrically', () => {
    expect(wheelZoomFactor(-10, 0)).toBeGreaterThan(1)
    expect(wheelZoomFactor(10, 0)).toBeLessThan(1)
    expect(wheelZoomFactor(-10, 0) * wheelZoomFactor(10, 0)).toBeCloseTo(1, 10)
  })

  it('caps a mouse-wheel notch and converts line deltas to pixels', () => {
    expect(wheelZoomFactor(100, 0)).toBe(wheelZoomFactor(25, 0))
    expect(wheelZoomFactor(1, 1)).toBe(wheelZoomFactor(16, 0))
  })
})

describe('double tap', () => {
  it('needs two taps close in time and space', () => {
    expect(isDoubleTap(undefined, { x: 0, y: 0, time: 0 })).toBe(false)
    expect(isDoubleTap({ x: 10, y: 10, time: 0 }, { x: 14, y: 12, time: 200 })).toBe(true)
    expect(isDoubleTap({ x: 10, y: 10, time: 0 }, { x: 14, y: 12, time: 500 })).toBe(false)
    expect(isDoubleTap({ x: 10, y: 10, time: 0 }, { x: 80, y: 10, time: 100 })).toBe(false)
  })
})

describe('keyboard commands', () => {
  const key = (k: string, mods: Partial<{ ctrlKey: boolean; metaKey: boolean; altKey: boolean }> = {}): KeyCommand | undefined =>
    keyCommand({ key: k, ctrlKey: false, metaKey: false, altKey: false, ...mods })

  it('maps arrows to pans, +/- to zoom steps, 0 to fit and paging keys to pages', () => {
    expect(key('ArrowRight')).toEqual({ kind: 'pan', dx: KEY_PAN_STEP, dy: 0 })
    expect(key('ArrowUp')).toEqual({ kind: 'pan', dx: 0, dy: -KEY_PAN_STEP })
    expect(key('+')).toEqual({ kind: 'zoom', factor: ZOOM_STEP })
    expect(key('=')).toEqual({ kind: 'zoom', factor: ZOOM_STEP })
    expect(key('-')).toEqual({ kind: 'zoom', factor: 1 / ZOOM_STEP })
    expect(key('0')).toEqual({ kind: 'fit' })
    expect(key('PageDown')).toEqual({ kind: 'page', delta: 1 })
    expect(key('PageUp')).toEqual({ kind: 'page', delta: -1 })
    expect(key('Home')).toEqual({ kind: 'page-edge', edge: 'first' })
    expect(key('End')).toEqual({ kind: 'page-edge', edge: 'last' })
    expect(key('x')).toBeUndefined()
  })

  it('leaves browser shortcuts such as Ctrl+0 and Cmd+plus alone', () => {
    expect(key('0', { ctrlKey: true })).toBeUndefined()
    expect(key('+', { metaKey: true })).toBeUndefined()
    expect(key('ArrowLeft', { altKey: true })).toBeUndefined()
  })
})

interface Harness {
  container: HTMLElement
  canvas: HTMLElement
  zoomTo: ReturnType<typeof mock<(s: number, a: ZoomAnchor) => void>>
  preview: ReturnType<typeof mock<(s: number) => void>>
  doubleTap: ReturnType<typeof mock<(a: ZoomAnchor) => void>>
  command: ReturnType<typeof mock<GestureHost['command']>>
  destroy: () => void
}

function harness(dims = { scrollWidth: 1600, scrollHeight: 2200, clientWidth: 800, clientHeight: 600 }): Harness {
  const container = document.createElement('div')
  container.tabIndex = 0
  for (const [k, v] of Object.entries(dims)) Object.defineProperty(container, k, { value: v })
  Object.defineProperty(container, 'getBoundingClientRect', { value: () => new DOMRect(0, 0, dims.clientWidth, dims.clientHeight) })
  const canvas = document.createElement('canvas')
  Object.defineProperty(canvas, 'getBoundingClientRect', {
    value: () => new DOMRect(PAD - container.scrollLeft, PAD - container.scrollTop, 1568, 2168),
  })
  container.appendChild(canvas)
  document.body.appendChild(container)
  const zoomTo = mock<(s: number, a: ZoomAnchor) => void>()
  const preview = mock<(s: number) => void>()
  const doubleTap = mock<(a: ZoomAnchor) => void>()
  const command = mock<GestureHost['command']>()
  const ctl = attachGestures(container, { canvas: () => canvas, renderedScale: () => 2, preview, zoomTo, doubleTap, command }, { settleMs: 0 })
  return { container, canvas, zoomTo, preview, doubleTap, command, destroy: () => { ctl.destroy(); container.remove() } }
}

/** happy-dom's WheelEvent ignores the MouseEvent fields of its init dict, so they are set on the instance. */
function wheel(init: { deltaY: number; ctrlKey?: boolean; clientX: number; clientY: number }): WheelEvent {
  const e = new WheelEvent('wheel', { deltaY: init.deltaY, bubbles: true, cancelable: true })
  Object.defineProperties(e, {
    ctrlKey: { value: init.ctrlKey ?? false },
    clientX: { value: init.clientX },
    clientY: { value: init.clientY },
  })
  return e
}

function pointer(type: string, init: PointerEventInit): PointerEvent {
  return new PointerEvent(type, { bubbles: true, cancelable: true, pointerId: 1, pointerType: 'mouse', button: 0, ...init })
}

describe('gesture controller', () => {
  it('pans the container by dragging, clamped to the scrollable range', () => {
    const h = harness()
    h.container.dispatchEvent(pointer('pointerdown', { clientX: 400, clientY: 300 }))
    expect(h.container.classList.contains('pf-pdf-panning')).toBe(true)
    h.container.dispatchEvent(pointer('pointermove', { clientX: 300, clientY: 250 }))
    expect(h.container.scrollLeft).toBe(100)
    expect(h.container.scrollTop).toBe(50)
    h.container.dispatchEvent(pointer('pointermove', { clientX: 900, clientY: 900 }))
    expect(h.container.scrollLeft).toBe(0)
    expect(h.container.scrollTop).toBe(0)
    h.container.dispatchEvent(pointer('pointermove', { clientX: -2000, clientY: -5000 }))
    expect(h.container.scrollLeft).toBe(800)
    expect(h.container.scrollTop).toBe(1600)
    h.container.dispatchEvent(pointer('pointerup', { clientX: -2000, clientY: -5000 }))
    expect(h.container.classList.contains('pf-pdf-panning')).toBe(false)
    h.destroy()
  })

  it('does not start a pan when the page fits', () => {
    const h = harness({ scrollWidth: 800, scrollHeight: 600, clientWidth: 800, clientHeight: 600 })
    h.container.dispatchEvent(pointer('pointerdown', { clientX: 400, clientY: 300 }))
    h.container.dispatchEvent(pointer('pointermove', { clientX: 300, clientY: 200 }))
    expect(h.container.classList.contains('pf-pdf-panning')).toBe(false)
    expect(h.container.scrollLeft).toBe(0)
    h.destroy()
  })

  it('zooms around the pointer on Ctrl+wheel and leaves a plain wheel to scroll', async () => {
    const h = harness()
    const plain = wheel({ deltaY: 40, clientX: 200, clientY: 100 })
    h.container.dispatchEvent(plain)
    expect(plain.defaultPrevented).toBe(false)
    expect(h.preview).not.toHaveBeenCalled()

    const pinch = wheel({ deltaY: -10, ctrlKey: true, clientX: 216, clientY: 116 })
    h.container.dispatchEvent(pinch)
    expect(pinch.defaultPrevented).toBe(true)
    expect(h.preview).toHaveBeenCalledTimes(1)
    expect(h.canvas.style.transform).toContain('scale(')
    await new Promise((r) => setTimeout(r, 5))
    expect(h.zoomTo).toHaveBeenCalledTimes(1)
    const [scale, anchor] = h.zoomTo.mock.calls[0] ?? []
    expect(scale).toBeCloseTo(2 * wheelZoomFactor(-10, 0), 10)
    expect(anchor?.page).toEqual({ x: 100, y: 50 })
    expect(anchor?.client).toEqual({ x: 216, y: 116 })
    h.destroy()
  })

  it('reports a double click at the clicked point', () => {
    const h = harness()
    for (const t of ['pointerdown', 'pointerup', 'pointerdown', 'pointerup']) {
      h.container.dispatchEvent(pointer(t, { clientX: 116, clientY: 216 }))
    }
    expect(h.doubleTap).toHaveBeenCalledTimes(1)
    expect(h.doubleTap.mock.calls[0]?.[0].page).toEqual({ x: 50, y: 100 })
    h.destroy()
  })

  it('handles keys only while the viewer itself has focus', () => {
    const h = harness()
    h.container.focus()
    const down = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true })
    h.container.dispatchEvent(down)
    expect(down.defaultPrevented).toBe(true)
    expect(h.container.scrollTop).toBe(KEY_PAN_STEP)

    h.container.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageDown', bubbles: true, cancelable: true }))
    expect(h.command).toHaveBeenCalledWith({ kind: 'page', delta: 1 })

    h.container.dispatchEvent(new KeyboardEvent('keydown', { key: '+', bubbles: true, cancelable: true }))
    expect(h.zoomTo.mock.calls[0]?.[0]).toBeCloseTo(2 * ZOOM_STEP, 10)

    const input = document.createElement('input')
    h.container.appendChild(input)
    const typed = new KeyboardEvent('keydown', { key: '0', bubbles: true, cancelable: true })
    input.dispatchEvent(typed)
    expect(typed.defaultPrevented).toBe(false)
    h.destroy()
  })

  it('marks the container pannable only while the page overflows', () => {
    const h = harness()
    const fits = harness({ scrollWidth: 800, scrollHeight: 600, clientWidth: 800, clientHeight: 600 })
    const ctl = attachGestures(h.container, {
      canvas: () => h.canvas, renderedScale: () => 1, preview: () => undefined, zoomTo: () => undefined, doubleTap: () => undefined, command: () => undefined,
    })
    ctl.refresh()
    expect(h.container.classList.contains('pf-pdf-pannable')).toBe(true)
    const ctlFits = attachGestures(fits.container, {
      canvas: () => fits.canvas, renderedScale: () => 1, preview: () => undefined, zoomTo: () => undefined, doubleTap: () => undefined, command: () => undefined,
    })
    ctlFits.refresh()
    expect(fits.container.classList.contains('pf-pdf-pannable')).toBe(false)
    ctl.destroy()
    ctlFits.destroy()
    h.destroy()
    fits.destroy()
  })
})
