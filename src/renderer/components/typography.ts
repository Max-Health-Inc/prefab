/**
 * Typography component renderers — Heading, Text, Muted, Code, Markdown, etc.
 */

import { registerComponent, resolveStr, el, text } from '../engine.js'
import type { ComponentNode, RenderContext } from '../engine.js'

export function registerTypographyComponents(): void {
  registerComponent('Heading', renderHeading)
  registerComponent('H1', (n, c) => renderHx(n, c, 'h1'))
  registerComponent('H2', (n, c) => renderHx(n, c, 'h2'))
  registerComponent('H3', (n, c) => renderHx(n, c, 'h3'))
  registerComponent('H4', (n, c) => renderHx(n, c, 'h4'))
  registerComponent('Text', renderText)
  registerComponent('P', renderP)
  registerComponent('Lead', (n, c) => renderStyled(n, c, 'p', 'pf-lead'))
  registerComponent('Large', (n, c) => renderStyled(n, c, 'span', 'pf-large'))
  registerComponent('Small', (n, c) => renderStyled(n, c, 'small', 'pf-small'))
  registerComponent('Muted', (n, c) => renderStyled(n, c, 'p', 'pf-muted'))
  registerComponent('BlockQuote', (n, c) => renderStyled(n, c, 'blockquote', 'pf-blockquote'))
  registerComponent('Label', (n, c) => renderStyled(n, c, 'label', 'pf-label'))
  registerComponent('Link', renderLink)
  registerComponent('Code', renderCode)
  registerComponent('Markdown', renderMarkdown)
  registerComponent('Kbd', renderKbd)
}

function renderHeading(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const level = (node.level as number | undefined) ?? 2
  const tag = `h${Math.min(Math.max(level, 1), 6)}`
  const e = document.createElement(tag)
  e.className = `pf-heading pf-${tag}`
  e.textContent = resolveStr(node.content, ctx)
  return e
}

function renderHx(node: ComponentNode, ctx: RenderContext, tag: string): HTMLElement {
  const e = document.createElement(tag)
  e.className = `pf-heading pf-${tag}`
  e.textContent = resolveStr(node.content, ctx)
  return e
}

function renderText(node: ComponentNode, ctx: RenderContext): HTMLElement {
  return text(el('span', 'pf-text'), resolveStr(node.content, ctx))
}

function renderP(node: ComponentNode, ctx: RenderContext): HTMLElement {
  return text(el('p', 'pf-p'), resolveStr(node.content, ctx))
}

function renderStyled(node: ComponentNode, ctx: RenderContext, tag: string, cls: string): HTMLElement {
  const e = document.createElement(tag)
  e.className = cls
  e.textContent = resolveStr(node.content, ctx)
  return e
}

/** Blocked URL schemes that can execute code. */
const UNSAFE_SCHEMES = /^\s*(javascript|vbscript|data):/i

function renderLink(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const a = document.createElement('a')
  a.className = 'pf-link'
  a.textContent = resolveStr(node.content, ctx)
  if (node.href != null) {
    const href = resolveStr(node.href, ctx)
    if (!UNSAFE_SCHEMES.test(href)) {
      a.href = href
    }
  }
  if (node.target != null) a.target = resolveStr(node.target, ctx)
  return a
}

function renderCode(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const pre = el('pre', 'pf-code')
  const code = el('code')
  code.textContent = resolveStr(node.content, ctx)
  if (node.language != null) code.setAttribute('data-language', node.language as string)
  pre.appendChild(code)
  return pre
}

function renderMarkdown(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const e = el('div', 'pf-markdown')
  // Basic markdown rendering — just set innerHTML with escaped content
  // A real implementation would use a markdown parser
  const content = resolveStr(node.content, ctx)
  e.textContent = content
  e.setAttribute('data-markdown', 'true')
  return e
}

function renderKbd(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const e = document.createElement('kbd')
  e.className = 'pf-kbd'
  e.textContent = resolveStr(node.content, ctx)
  return e
}
