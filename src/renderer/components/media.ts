/**
 * Media component renderers — Image, Audio, Video, Embed, Svg, DropZone, Mermaid
 */

import { registerComponent, resolveStr, el, makeDispatchCtx } from '../engine.js'
import type { ComponentNode, RenderContext } from '../engine.js'
import { dispatchActions, fireAndForget } from '../actions.js'
import { cssLength, isRecord, optionalString } from '../../core/guards.js'
import { importFromCdn, prefersDark } from '../cdn.js'
import { stringifyValue } from '../../core/stringify.js'

export function registerMediaComponents(): void {
  registerComponent('Image', renderImage)
  registerComponent('Audio', renderAudio)
  registerComponent('Video', renderVideo)
  registerComponent('Embed', renderEmbed)
  registerComponent('Svg', renderSvg)
  registerComponent('DropZone', renderDropZone)
  registerComponent('Mermaid', renderMermaid)
}

function renderImage(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const img = document.createElement('img')
  img.className = 'pf-image'
  img.src = resolveStr(node.src, ctx)
  if (node.alt != null) img.alt = resolveStr(node.alt, ctx)
  if (node.width != null) img.width = Number(node.width)
  if (node.height != null) img.height = Number(node.height)
  img.loading = 'lazy'
  return img
}

function renderAudio(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const audio = document.createElement('audio')
  audio.className = 'pf-audio'
  audio.src = resolveStr(node.src, ctx)
  audio.controls = true
  return audio
}

function renderVideo(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const video = document.createElement('video')
  video.className = 'pf-video'
  video.src = resolveStr(node.src, ctx)
  video.controls = true
  if (node.width != null) video.width = Number(node.width)
  if (node.height != null) video.height = Number(node.height)
  return video
}

function renderEmbed(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const wrapper = el('div', 'pf-embed')
  const iframe = document.createElement('iframe')
  iframe.src = resolveStr(node.src, ctx)
  iframe.style.height = cssLength(node.height, 400)
  iframe.setAttribute('sandbox', 'allow-scripts')
  wrapper.appendChild(iframe)
  return wrapper
}

/** SVG element/attribute allowlist for sanitization. */
const SVG_ALLOWED_TAGS = new Set([
  'svg', 'g', 'path', 'rect', 'circle', 'ellipse', 'line', 'polyline',
  'polygon', 'text', 'tspan', 'textpath', 'defs', 'use', 'symbol',
  'clippath', 'mask', 'pattern', 'lineargradient', 'radialgradient',
  'stop', 'filter', 'fegaussianblur', 'feoffset', 'femerge',
  'femergenode', 'fecolormatrix', 'feblend', 'title', 'desc',
])

function renderSvg(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const wrapper = el('div', 'pf-svg')
  let content = resolveStr(node.content, ctx)
  if (!content.includes('<svg')) return wrapper

  // DOMParser image/svg+xml is strict XML: without an explicit xmlns the
  // elements get no namespace and render at 0x0. xmlns is optional in HTML, so
  // authors routinely omit it — inject the SVG namespace when it's missing.
  if (!/<svg[^>]*\sxmlns\s*=/.test(content)) {
    content = content.replace(/<svg\b/, '<svg xmlns="http://www.w3.org/2000/svg"')
  }

  // Parse via DOMParser to avoid innerHTML XSS
  const doc = new DOMParser().parseFromString(content, 'image/svg+xml')
  const svg = doc.querySelector('svg')
  if (!svg) return wrapper

  sanitizeSvgNode(svg)
  wrapper.appendChild(document.importNode(svg, true))
  return wrapper
}

function sanitizeSvgNode(node: Element): void {
  // Remove disallowed elements
  const children = Array.from(node.children)
  for (const child of children) {
    if (!SVG_ALLOWED_TAGS.has(child.tagName.toLowerCase())) {
      child.remove()
      continue
    }
    // Strip event handler attributes (on*) and dangerous attrs
    for (const attr of Array.from(child.attributes)) {
      const name = attr.name.toLowerCase()
      if (name.startsWith('on') || name === 'href' && attr.value.trim().toLowerCase().startsWith('javascript:')) {
        child.removeAttribute(attr.name)
      }
    }
    sanitizeSvgNode(child)
  }
}

/**
 * Does a file satisfy an HTML `accept` list (`image/*,.pdf,text/csv`)?
 *
 * The browser enforces `accept` for the file picker but NOT for drag-and-drop, so
 * dropped files have to be filtered here or the prop would only half work.
 */
export function matchesAccept(file: File, accept?: string): boolean {
  const patterns = (accept ?? '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
  if (patterns.length === 0) return true
  const name = file.name.toLowerCase()
  const type = file.type.toLowerCase()
  return patterns.some(p => {
    if (p.startsWith('.')) return name.endsWith(p)
    if (p.endsWith('/*')) return type.startsWith(p.slice(0, -1))
    return type === p
  })
}

function renderDropZone(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const e = el('div', 'pf-dropzone')
  e.textContent = resolveStr(node.label ?? 'Drop files here', ctx)

  // Click-to-browse, so the zone is not drag-only (and is reachable by keyboard).
  const input = document.createElement('input')
  input.type = 'file'
  input.style.display = 'none'
  if (node.accept != null) input.accept = stringifyValue(node.accept)
  if (node.multiple === true) input.multiple = true
  e.appendChild(input)

  e.setAttribute('role', 'button')
  e.tabIndex = 0

  function accepted(files: FileList | null): File[] {
    const all = Array.from(files ?? []).filter(f => matchesAccept(f, optionalString(node.accept)))
    return node.multiple === true ? all : all.slice(0, 1)
  }

  function handle(files: File[]): void {
    if (files.length === 0) return
    const resultKey = optionalString(node.resultKey)
    if (resultKey != null) {
      ctx.store.set(resultKey, files)
      ctx.rerender()
    }
    if (node.onDrop != null) {
      fireAndForget(
        dispatchActions(node.onDrop, {
          ...makeDispatchCtx(ctx),
          scope: { ...ctx.scope, $result: files },
        }),
        'onDrop',
      )
    }
  }

  input.addEventListener('change', () => {
    handle(accepted(input.files))
    input.value = ''
  })

  e.addEventListener('click', () => input.click())
  e.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault()
      input.click()
    }
  })

  e.addEventListener('dragover', (ev) => {
    ev.preventDefault()
    e.classList.add('pf-dropzone-active')
  })

  e.addEventListener('dragleave', () => {
    e.classList.remove('pf-dropzone-active')
  })

  e.addEventListener('drop', (ev) => {
    ev.preventDefault()
    e.classList.remove('pf-dropzone-active')
    handle(accepted(ev.dataTransfer?.files ?? null))
  })

  return e
}

const MERMAID_CDN = 'https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.esm.min.mjs'
let mermaidSeq = 0

interface MermaidApi {
  initialize(config: Record<string, unknown>): void
  render(id: string, text: string): Promise<{ svg: string }>
}

function isMermaidApi(value: unknown): value is MermaidApi {
  return isRecord(value) && typeof value.initialize === 'function' && typeof value.render === 'function'
}

/** Show the diagram source right away, then swap in the SVG once mermaid.js loads from the CDN. */
function renderMermaid(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const e = el('div', 'pf-mermaid')
  e.setAttribute('data-mermaid', 'true')
  const content = resolveStr(node.content, ctx)
  const source = el('pre', 'pf-mermaid-source')
  source.textContent = content
  e.appendChild(source)
  if (content.trim() === '') return e

  void importFromCdn(MERMAID_CDN).then(async (mod) => {
    const api = isRecord(mod) ? mod.default : undefined
    if (!isMermaidApi(api)) return
    api.initialize({ startOnLoad: false, securityLevel: 'strict', theme: prefersDark(e) ? 'dark' : 'neutral', fontFamily: 'inherit' })
    mermaidSeq += 1
    const { svg } = await api.render(`pf-mermaid-${String(mermaidSeq)}`, content)
    e.innerHTML = svg
    e.setAttribute('data-state', 'rendered')
  }).catch(() => { e.setAttribute('data-state', 'source') })

  return e
}
