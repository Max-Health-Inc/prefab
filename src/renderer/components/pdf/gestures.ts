/** Pan, pinch, wheel, double-tap and keyboard input for a zoomable scroll container; framework-free, exported as `@maxhealth.tech/prefab/gestures`. */

export const ZOOM_STEP = 1.25
export const MIN_SCALE = 0.25
export const MAX_SCALE = 5
export const KEY_PAN_STEP = 48

const WHEEL_DELTA_LIMIT = 25
const WHEEL_SENSITIVITY = 0.01
const WHEEL_LINE_PX = 16
const WHEEL_PAGE_PX = 400
const PINCH_SETTLE_MS = 200
const DOUBLE_TAP_MS = 300
const DOUBLE_TAP_SLOP = 24
const DRAG_SLOP = 4
const SCALE_EPSILON = 0.001

export interface Point { x: number; y: number }

interface RectLike { left: number; top: number; width: number; height: number }

/** A point on the page in unscaled PDF units, and the client point it should sit under. */
export interface ZoomAnchor { page: Point; client: Point }

export interface Tap { x: number; y: number; time: number }

export type KeyCommand =
  | { kind: 'pan'; dx: number; dy: number }
  | { kind: 'zoom'; factor: number }
  | { kind: 'fit' }
  | { kind: 'page'; delta: number }
  | { kind: 'page-edge'; edge: 'first' | 'last' }

export interface KeyInput { key: string; ctrlKey: boolean; metaKey: boolean; altKey: boolean }

export function clampScale(s: number): number {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, s))
}

export function clampScroll(value: number, max: number): number {
  return Math.max(0, Math.min(Math.max(0, max), value))
}

export function anchorAt(client: Point, canvasRect: RectLike, scale: number): ZoomAnchor {
  return { client, page: { x: (client.x - canvasRect.left) / scale, y: (client.y - canvasRect.top) / scale } }
}

/** The scroll offset that puts the anchor's page point back under its client point once the canvas is drawn at `scale`. */
export function anchorScrollDelta(anchor: ZoomAnchor, canvasRect: RectLike, scale: number): Point {
  return {
    x: canvasRect.left + anchor.page.x * scale - anchor.client.x,
    y: canvasRect.top + anchor.page.y * scale - anchor.client.y,
  }
}

/** Zoom factor for one wheel event; equal deltas in and out cancel, and a mouse-wheel notch is capped. */
export function wheelZoomFactor(deltaY: number, deltaMode: number): number {
  const px = deltaMode === 1 ? deltaY * WHEEL_LINE_PX : deltaMode === 2 ? deltaY * WHEEL_PAGE_PX : deltaY
  const d = Math.max(-WHEEL_DELTA_LIMIT, Math.min(WHEEL_DELTA_LIMIT, px))
  return Math.exp(-d * WHEEL_SENSITIVITY)
}

export function isDoubleTap(prev: Tap | undefined, next: Tap): boolean {
  return prev !== undefined
    && next.time - prev.time <= DOUBLE_TAP_MS
    && Math.hypot(next.x - prev.x, next.y - prev.y) <= DOUBLE_TAP_SLOP
}

export function keyCommand(e: KeyInput): KeyCommand | undefined {
  if (e.ctrlKey || e.metaKey || e.altKey) return undefined
  switch (e.key) {
    case 'ArrowLeft': return { kind: 'pan', dx: -KEY_PAN_STEP, dy: 0 }
    case 'ArrowRight': return { kind: 'pan', dx: KEY_PAN_STEP, dy: 0 }
    case 'ArrowUp': return { kind: 'pan', dx: 0, dy: -KEY_PAN_STEP }
    case 'ArrowDown': return { kind: 'pan', dx: 0, dy: KEY_PAN_STEP }
    case '+': case '=': return { kind: 'zoom', factor: ZOOM_STEP }
    case '-': case '_': return { kind: 'zoom', factor: 1 / ZOOM_STEP }
    case '0': return { kind: 'fit' }
    case 'PageUp': return { kind: 'page', delta: -1 }
    case 'PageDown': return { kind: 'page', delta: 1 }
    case 'Home': return { kind: 'page-edge', edge: 'first' }
    case 'End': return { kind: 'page-edge', edge: 'last' }
    default: return undefined
  }
}

export interface ScrollBox { scrollWidth: number; scrollHeight: number; clientWidth: number; clientHeight: number }

export function overflows(box: ScrollBox): boolean {
  return box.scrollWidth > box.clientWidth + 1 || box.scrollHeight > box.clientHeight + 1
}

export interface GestureHost {
  /** The canvas currently on screen. */
  canvas: () => HTMLElement
  /** The scale that canvas was drawn at. */
  renderedScale: () => number
  /** Show `scale` in the toolbar while a gesture previews it. */
  preview: (scale: number) => void
  /** Re-render at `scale`, then scroll so the anchor stays put. */
  zoomTo: (scale: number, anchor: ZoomAnchor) => void
  /** Double-click or double-tap at the anchor. */
  doubleTap: (anchor: ZoomAnchor) => void
  /** Keyboard commands other than panning and stepped zoom. */
  command: (cmd: Exclude<KeyCommand, { kind: 'pan' } | { kind: 'zoom' }>) => void
}

export interface GestureController {
  /** Call after a re-render swaps the canvas or the container resizes. */
  refresh: () => void
  /** Zoom by `factor` around the middle of the visible area. */
  zoomBy: (factor: number) => void
  centerAnchor: () => ZoomAnchor
  destroy: () => void
}

interface Pinch {
  startScale: number
  scale: number
  anchor: ZoomAnchor
  client: Point
  timer?: ReturnType<typeof setTimeout>
}

interface Drag { id: number; start: Point; scroll: Point; moved: boolean }

export interface GestureOptions {
  settleMs?: number
  /** Class on the container while its content overflows. @default 'pf-pdf-pannable' */
  pannableClass?: string
  /** Class on the container during a drag. @default 'pf-pdf-panning' */
  panningClass?: string
}

export function attachGestures(container: HTMLElement, host: GestureHost, options: GestureOptions = {}): GestureController {
  const { settleMs = PINCH_SETTLE_MS, pannableClass = 'pf-pdf-pannable', panningClass = 'pf-pdf-panning' } = options
  const touches = new Map<number, Point>()
  let pinch: Pinch | undefined
  let touchPinch: { startDist: number; startMid: Point } | undefined
  let drag: Drag | undefined
  let lastTap: Tap | undefined
  let touchStart: Tap | undefined

  const maxScroll = (): Point => ({
    x: container.scrollWidth - container.clientWidth,
    y: container.scrollHeight - container.clientHeight,
  })

  function scrollTo(left: number, top: number): void {
    const max = maxScroll()
    container.scrollLeft = clampScroll(left, max.x)
    container.scrollTop = clampScroll(top, max.y)
  }

  function anchorFor(client: Point): ZoomAnchor {
    return anchorAt(client, host.canvas().getBoundingClientRect(), host.renderedScale())
  }

  function centerAnchor(): ZoomAnchor {
    const r = container.getBoundingClientRect()
    return anchorFor({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
  }

  function paintPreview(p: Pinch): void {
    const canvas = host.canvas()
    canvas.style.transformOrigin = `${String(p.anchor.page.x * p.startScale)}px ${String(p.anchor.page.y * p.startScale)}px`
    const dx = p.client.x - p.anchor.client.x
    const dy = p.client.y - p.anchor.client.y
    canvas.style.transform = `translate(${String(dx)}px, ${String(dy)}px) scale(${String(p.scale / p.startScale)})`
    host.preview(p.scale)
  }

  function clearPreview(): void {
    const canvas = host.canvas()
    canvas.style.transform = ''
    canvas.style.transformOrigin = ''
  }

  function beginPinch(client: Point): Pinch {
    const startScale = host.renderedScale()
    const p: Pinch = { startScale, scale: startScale, anchor: anchorFor(client), client }
    pinch = p
    return p
  }

  function commitPinch(): void {
    const p = pinch
    if (!p) return
    if (p.timer !== undefined) clearTimeout(p.timer)
    pinch = undefined
    if (Math.abs(p.scale - p.startScale) < SCALE_EPSILON) {
      clearPreview()
      host.preview(p.startScale)
      scrollTo(container.scrollLeft - (p.client.x - p.anchor.client.x), container.scrollTop - (p.client.y - p.anchor.client.y))
      return
    }
    host.zoomTo(p.scale, { page: p.anchor.page, client: p.client })
  }

  function cancelPinch(): void {
    const p = pinch
    if (!p) return
    if (p.timer !== undefined) clearTimeout(p.timer)
    pinch = undefined
    clearPreview()
    host.preview(p.startScale)
  }

  function refresh(): void {
    container.classList.toggle(pannableClass, overflows(container))
    const p = pinch
    const canvas = host.canvas()
    if (!p || canvas.style.transform !== '') return
    const scale = host.renderedScale()
    const rect = canvas.getBoundingClientRect()
    p.anchor = { page: p.anchor.page, client: { x: rect.left + p.anchor.page.x * scale, y: rect.top + p.anchor.page.y * scale } }
    p.startScale = scale
    paintPreview(p)
  }

  function zoomBy(factor: number): void {
    host.zoomTo(clampScale(host.renderedScale() * factor), centerAnchor())
  }

  function onWheel(e: WheelEvent): void {
    if (!e.ctrlKey && !e.metaKey) return
    e.preventDefault()
    const client = { x: e.clientX, y: e.clientY }
    const p = pinch ?? beginPinch(client)
    p.client = client
    p.scale = clampScale(p.scale * wheelZoomFactor(e.deltaY, e.deltaMode))
    paintPreview(p)
    if (p.timer !== undefined) clearTimeout(p.timer)
    p.timer = setTimeout(commitPinch, settleMs)
  }

  function registerTap(tap: Tap): void {
    if (isDoubleTap(lastTap, tap)) {
      lastTap = undefined
      host.doubleTap(anchorFor(tap))
    } else {
      lastTap = tap
    }
  }

  function touchPair(): [Point, Point] | undefined {
    const pts = [...touches.values()]
    return pts.length >= 2 ? [pts[0], pts[1]] : undefined
  }

  function midpoint(): Point {
    const pair = touchPair()
    return pair ? { x: (pair[0].x + pair[1].x) / 2, y: (pair[0].y + pair[1].y) / 2 } : { x: 0, y: 0 }
  }

  function spread(): number {
    const pair = touchPair()
    return pair ? Math.hypot(pair[0].x - pair[1].x, pair[0].y - pair[1].y) : 0
  }

  function onPointerDown(e: PointerEvent): void {
    if (e.pointerType === 'touch') {
      touches.set(e.pointerId, { x: e.clientX, y: e.clientY })
      touchStart = touches.size === 1 ? { x: e.clientX, y: e.clientY, time: e.timeStamp } : undefined
      if (touches.size === 2) {
        const startDist = spread()
        if (startDist > 0) {
          cancelPinch()
          const mid = midpoint()
          touchPinch = { startDist, startMid: mid }
          beginPinch(mid)
        }
      }
      return
    }
    if (e.button !== 0) return
    e.preventDefault()
    container.focus({ preventScroll: true })
    if (!overflows(container)) return
    drag = { id: e.pointerId, start: { x: e.clientX, y: e.clientY }, scroll: { x: container.scrollLeft, y: container.scrollTop }, moved: false }
    container.setPointerCapture(e.pointerId)
    container.classList.add(panningClass)
  }

  function onPointerMove(e: PointerEvent): void {
    if (e.pointerType === 'touch') {
      if (!touches.has(e.pointerId)) return
      touches.set(e.pointerId, { x: e.clientX, y: e.clientY })
      const p = pinch
      if (touchPinch && p && touches.size >= 2) {
        p.client = midpoint()
        p.scale = clampScale(p.startScale * spread() / touchPinch.startDist)
        paintPreview(p)
      }
      return
    }
    const d = drag
    if (d?.id !== e.pointerId) return
    const dx = e.clientX - d.start.x
    const dy = e.clientY - d.start.y
    if (!d.moved && Math.hypot(dx, dy) < DRAG_SLOP) return
    d.moved = true
    scrollTo(d.scroll.x - dx, d.scroll.y - dy)
  }

  function endDrag(e: PointerEvent): boolean {
    const d = drag
    if (d?.id !== e.pointerId) return false
    drag = undefined
    container.classList.remove(panningClass)
    if (container.hasPointerCapture(e.pointerId)) container.releasePointerCapture(e.pointerId)
    return d.moved
  }

  function onPointerUp(e: PointerEvent): void {
    if (e.pointerType === 'touch') {
      touches.delete(e.pointerId)
      if (touchPinch) {
        if (touches.size < 2) { touchPinch = undefined; commitPinch() }
        return
      }
      const start = touchStart
      touchStart = undefined
      if (start && e.timeStamp - start.time <= DOUBLE_TAP_MS && Math.hypot(e.clientX - start.x, e.clientY - start.y) <= DOUBLE_TAP_SLOP) {
        registerTap({ x: e.clientX, y: e.clientY, time: e.timeStamp })
      }
      return
    }
    if (e.button !== 0) return
    const moved = endDrag(e)
    if (!moved) registerTap({ x: e.clientX, y: e.clientY, time: e.timeStamp })
  }

  function onPointerCancel(e: PointerEvent): void {
    if (e.pointerType === 'touch') {
      touches.delete(e.pointerId)
      touchStart = undefined
      if (touchPinch && touches.size < 2) { touchPinch = undefined; cancelPinch() }
      return
    }
    endDrag(e)
  }

  function onTouchMove(e: TouchEvent): void {
    if (e.touches.length >= 2) e.preventDefault()
  }

  function onKeyDown(e: KeyboardEvent): void {
    if (e.target !== container) return
    const cmd = keyCommand(e)
    if (!cmd) return
    e.preventDefault()
    if (cmd.kind === 'pan') scrollTo(container.scrollLeft + cmd.dx, container.scrollTop + cmd.dy)
    else if (cmd.kind === 'zoom') zoomBy(cmd.factor)
    else host.command(cmd)
  }

  container.addEventListener('wheel', onWheel, { passive: false })
  container.addEventListener('pointerdown', onPointerDown)
  container.addEventListener('pointermove', onPointerMove)
  container.addEventListener('pointerup', onPointerUp)
  container.addEventListener('pointercancel', onPointerCancel)
  container.addEventListener('touchmove', onTouchMove, { passive: false })
  container.addEventListener('keydown', onKeyDown)

  return {
    refresh,
    zoomBy,
    centerAnchor,
    destroy() {
      if (pinch?.timer !== undefined) clearTimeout(pinch.timer)
      pinch = undefined
      container.removeEventListener('wheel', onWheel)
      container.removeEventListener('pointerdown', onPointerDown)
      container.removeEventListener('pointermove', onPointerMove)
      container.removeEventListener('pointerup', onPointerUp)
      container.removeEventListener('pointercancel', onPointerCancel)
      container.removeEventListener('touchmove', onTouchMove)
      container.removeEventListener('keydown', onKeyDown)
    },
  }
}
