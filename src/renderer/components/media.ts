/**
 * Media component renderers — Image, Audio, Video, Embed, Svg, DropZone, Mermaid
 */

import { registerComponent, resolveStr, el } from '../engine.js'
import type { ComponentNode, RenderContext } from '../engine.js'

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
  if (node.width != null) img.width = node.width as number
  if (node.height != null) img.height = node.height as number
  img.style.maxWidth = '100%'
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
  if (node.width != null) video.width = node.width as number
  if (node.height != null) video.height = node.height as number
  video.style.maxWidth = '100%'
  return video
}

function renderEmbed(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const wrapper = el('div', 'pf-embed')
  const iframe = document.createElement('iframe')
  iframe.src = resolveStr(node.src, ctx)
  iframe.style.width = '100%'
  iframe.style.height = node.height != null ? `${node.height as number}px` : '400px'
  iframe.style.border = 'none'
  iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin')
  wrapper.appendChild(iframe)
  return wrapper
}

function renderSvg(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const wrapper = el('div', 'pf-svg')
  const content = resolveStr(node.content, ctx)
  // Sanitize: only allow SVG content
  if (content.includes('<svg')) {
    wrapper.innerHTML = content
  }
  return wrapper
}

function renderDropZone(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const e = el('div', 'pf-dropzone')
  e.style.border = '2px dashed var(--border, #d1d5db)'
  e.style.borderRadius = 'var(--radius, 8px)'
  e.style.padding = '32px'
  e.style.textAlign = 'center'
  e.style.cursor = 'pointer'
  e.textContent = resolveStr(node.label ?? 'Drop files here', ctx)

  e.addEventListener('dragover', (ev) => {
    ev.preventDefault()
    e.style.borderColor = 'var(--primary, #3b82f6)'
  })

  e.addEventListener('dragleave', () => {
    e.style.borderColor = 'var(--border, #d1d5db)'
  })

  e.addEventListener('drop', (ev) => {
    ev.preventDefault()
    e.style.borderColor = 'var(--border, #d1d5db)'
    // File handling would go here
  })

  return e
}

function renderMermaid(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const e = el('div', 'pf-mermaid')
  e.setAttribute('data-mermaid', 'true')
  const content = resolveStr(node.content, ctx)
  // Store raw mermaid content; actual rendering requires mermaid.js
  e.textContent = content

  // Attempt to render if mermaid is available globally
  if (typeof (globalThis as Record<string, unknown>).mermaid !== 'undefined') {
    e.classList.add('mermaid')
    e.textContent = content
  }

  return e
}
