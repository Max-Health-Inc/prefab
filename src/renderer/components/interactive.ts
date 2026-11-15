/**
 * Interactive component renderers — Tabs, Accordion, Dialog, Popover, Tooltip, etc.
 */

import { registerComponent, renderChildren, renderNode, resolveStr, el } from '../engine.js'
import type { ComponentNode, RenderContext, RenderResult } from '../engine.js'
import { optionalString } from '../../core/guards.js'
import { isComponentNode } from '../node-guard.js'

const uid = (prefix: string): string => `${prefix}-${Math.random().toString(36).slice(2, 8)}`

function renderTrigger(trigger: unknown, ctx: RenderContext): HTMLElement | undefined {
  if (!isComponentNode(trigger)) return undefined
  const rendered = renderNode(trigger, ctx)
  if (rendered instanceof HTMLElement) return rendered
  const host = el('span', 'pf-trigger')
  host.style.display = 'contents'
  host.appendChild(rendered)
  return host
}

export function registerInteractiveComponents(): void {
  registerComponent('Tabs', renderTabs)
  registerComponent('Tab', renderTab)
  registerComponent('Accordion', renderAccordion)
  registerComponent('AccordionItem', renderAccordionItem)
  registerComponent('Dialog', renderDialog)
  registerComponent('Popover', renderPopover)
  registerComponent('Tooltip', renderTooltip)
  registerComponent('HoverCard', renderHoverCard)
  registerComponent('Carousel', renderCarousel)
}

function renderTabs(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const wrapper = el('div', 'pf-tabs')
  const tabBar = el('div', 'pf-tabs-bar')
  tabBar.setAttribute('role', 'tablist')

  const panels: HTMLElement[] = []
  const buttons: HTMLButtonElement[] = []

  // `defaultTab` accepts a Tab title or a 0-based index; anything unmatched falls back to the first tab.
  const children = node.children ?? []
  const active = ((): number => {
    const want = node.defaultTab
    if (typeof want === 'number') return want >= 0 && want < children.length ? want : 0
    if (typeof want === 'string') {
      const byTitle = children.findIndex(c => c.title === want)
      return byTitle >= 0 ? byTitle : 0
    }
    return 0
  })()

  children.forEach((tab, i) => {
    const tabId = uid('pf-tab')
    const panelId = uid('pf-panel')

    const btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'pf-tab-trigger'
    btn.textContent = optionalString(tab.title) ?? `Tab ${String(i + 1)}`
    btn.setAttribute('role', 'tab')
    btn.setAttribute('aria-controls', panelId)
    btn.id = tabId
    btn.addEventListener('click', () => { activateTab(i, true) })

    const panel = el('div', 'pf-tab-panel')
    panel.setAttribute('role', 'tabpanel')
    panel.setAttribute('aria-labelledby', tabId)
    panel.id = panelId
    panel.tabIndex = 0
    renderChildren(tab, panel, ctx)

    buttons.push(btn)
    panels.push(panel)
    tabBar.appendChild(btn)
  })

  function activateTab(index: number, focus: boolean): void {
    buttons.forEach((b, i) => {
      const selected = i === index
      b.classList.toggle('pf-tab-active', selected)
      b.setAttribute('aria-selected', selected ? 'true' : 'false')
      b.tabIndex = selected ? 0 : -1
      panels[i].style.display = selected ? 'block' : 'none'
    })
    if (focus) buttons[index]?.focus()
  }
  if (buttons.length > 0) activateTab(active, false)

  tabBar.addEventListener('keydown', (e) => {
    const current = buttons.findIndex(b => b === e.target)
    if (current < 0) return
    let next: number
    if (e.key === 'ArrowRight') next = (current + 1) % buttons.length
    else if (e.key === 'ArrowLeft') next = (current - 1 + buttons.length) % buttons.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = buttons.length - 1
    else return
    e.preventDefault()
    activateTab(next, true)
  })

  wrapper.appendChild(tabBar)
  for (const panel of panels) wrapper.appendChild(panel)
  return wrapper
}

function renderTab(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const e = el('div', 'pf-tab')
  renderChildren(node, e, ctx)
  return e
}

function renderAccordion(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const e = el('div', 'pf-accordion')
  renderChildren(node, e, ctx)
  return e
}

function renderAccordionItem(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const wrapper = el('div', 'pf-accordion-item')

  const trigger = document.createElement('button')
  trigger.type = 'button'
  trigger.className = 'pf-accordion-trigger'
  trigger.id = uid('pf-acc-trigger')
  trigger.textContent = optionalString(node.title) ?? ''
  trigger.setAttribute('aria-expanded', 'false')

  const content = el('div', 'pf-accordion-content')
  content.id = uid('pf-acc')
  content.setAttribute('role', 'region')
  content.setAttribute('aria-labelledby', trigger.id)
  content.style.display = 'none'
  trigger.setAttribute('aria-controls', content.id)
  renderChildren(node, content, ctx)

  trigger.addEventListener('click', () => {
    const open = content.style.display !== 'none'
    content.style.display = open ? 'none' : 'block'
    trigger.setAttribute('aria-expanded', open ? 'false' : 'true')
  })

  wrapper.appendChild(trigger)
  wrapper.appendChild(content)
  return wrapper
}

function renderDialog(node: ComponentNode, ctx: RenderContext): RenderResult {
  const wrapper = el('div', 'pf-dialog-wrapper')
  const dialog = document.createElement('dialog')
  dialog.className = 'pf-dialog'
  dialog.setAttribute('aria-modal', 'true')
  const dismissible = node.dismissible !== false

  const triggerEl = renderTrigger(node.trigger, ctx)
  if (triggerEl) {
    triggerEl.setAttribute('aria-haspopup', 'dialog')
    triggerEl.addEventListener('click', () => { dialog.showModal() })
    wrapper.appendChild(triggerEl)
  }

  if (node.title != null) {
    const title = el('h2', 'pf-dialog-title')
    title.textContent = resolveStr(node.title, ctx)
    title.id = uid('pf-dialog-title')
    dialog.setAttribute('aria-labelledby', title.id)
    dialog.appendChild(title)
  }

  if (node.description != null) {
    const desc = el('p', 'pf-dialog-desc')
    desc.textContent = resolveStr(node.description, ctx)
    desc.id = uid('pf-dialog-desc')
    dialog.setAttribute('aria-describedby', desc.id)
    dialog.appendChild(desc)
  }

  const body = el('div', 'pf-dialog-body')
  renderChildren(node, body, ctx)
  dialog.appendChild(body)

  if (dismissible) {
    const close = document.createElement('button')
    close.type = 'button'
    close.className = 'pf-dialog-close'
    close.setAttribute('aria-label', 'Close')
    close.textContent = '×'
    close.addEventListener('click', () => { dialog.close() })
    dialog.appendChild(close)
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) dialog.close()
    })
  } else {
    dialog.addEventListener('cancel', (e) => { e.preventDefault() })
  }

  const closeOverlay = (): void => { dialog.close() }
  document.addEventListener('prefab:close-overlay', closeOverlay)

  wrapper.appendChild(dialog)
  return { element: wrapper, destroy: () => { document.removeEventListener('prefab:close-overlay', closeOverlay) } }
}

function renderPopover(node: ComponentNode, ctx: RenderContext): RenderResult {
  const wrapper = el('div', 'pf-popover')

  const content = el('div', 'pf-popover-content')
  content.id = uid('pf-popover')
  content.setAttribute('role', 'dialog')
  content.style.display = 'none'

  if (node.title != null) {
    const title = el('div', 'pf-popover-title')
    title.textContent = resolveStr(node.title, ctx)
    content.appendChild(title)
  }

  renderChildren(node, content, ctx)

  const triggerEl = renderTrigger(node.trigger, ctx)
  const isOpen = (): boolean => content.style.display !== 'none'
  const setOpen = (open: boolean): void => {
    content.style.display = open ? 'block' : 'none'
    triggerEl?.setAttribute('aria-expanded', open ? 'true' : 'false')
  }

  if (triggerEl) {
    triggerEl.setAttribute('aria-haspopup', 'dialog')
    triggerEl.setAttribute('aria-controls', content.id)
    triggerEl.setAttribute('aria-expanded', 'false')
    triggerEl.addEventListener('click', (e) => { e.stopPropagation(); setOpen(!isOpen()) })
    wrapper.appendChild(triggerEl)
  } else {
    wrapper.addEventListener('click', (e) => {
      if (e.target instanceof Node && content.contains(e.target) && isOpen()) return
      setOpen(!isOpen())
    })
  }

  const onDocumentClick = (e: MouseEvent): void => {
    if (isOpen() && e.target instanceof Node && !wrapper.contains(e.target)) setOpen(false)
  }
  const onKeydown = (e: KeyboardEvent): void => {
    if (e.key === 'Escape' && isOpen()) setOpen(false)
  }
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onKeydown)

  wrapper.appendChild(content)
  return {
    element: wrapper,
    destroy: () => {
      document.removeEventListener('click', onDocumentClick)
      document.removeEventListener('keydown', onKeydown)
    },
  }
}

function renderTooltip(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const wrapper = el('div', 'pf-tooltip')

  const tip = el('div', 'pf-tooltip-content')
  tip.id = uid('pf-tip')
  tip.setAttribute('role', 'tooltip')
  tip.textContent = resolveStr(node.content ?? '', ctx)
  tip.style.display = 'none'

  renderChildren(node, wrapper, ctx)
  wrapper.setAttribute('aria-describedby', tip.id)

  const show = (): void => { tip.style.display = 'block' }
  const hide = (): void => { tip.style.display = 'none' }
  wrapper.addEventListener('mouseenter', show)
  wrapper.addEventListener('mouseleave', hide)
  wrapper.addEventListener('focus', show, true)
  wrapper.addEventListener('blur', hide, true)

  wrapper.appendChild(tip)
  return wrapper
}

function renderHoverCard(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const wrapper = el('div', 'pf-hover-card')

  const content = el('div', 'pf-hover-card-content')
  content.style.display = 'none'

  // `trigger` is the always-visible hover target; children are the card content.
  const triggerEl = renderTrigger(node.trigger, ctx)
  if (triggerEl) wrapper.appendChild(triggerEl)
  renderChildren(node, content, ctx)

  wrapper.addEventListener('mouseenter', () => { content.style.display = 'block' })
  wrapper.addEventListener('mouseleave', () => { content.style.display = 'none' })
  wrapper.addEventListener('focusin', () => { content.style.display = 'block' })
  wrapper.addEventListener('focusout', () => { content.style.display = 'none' })

  wrapper.appendChild(content)
  return wrapper
}

function renderCarousel(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const wrapper = el('div', 'pf-carousel')
  wrapper.setAttribute('role', 'region')
  wrapper.setAttribute('aria-roledescription', 'carousel')
  wrapper.setAttribute('aria-label', resolveStr(node.label ?? 'Carousel', ctx))

  const track = el('div', 'pf-carousel-track')
  renderChildren(node, track, ctx)

  let current = 0
  const slideCount = node.children?.length ?? 0

  const arrow = (cls: string, glyph: string, label: string): HTMLButtonElement => {
    const b = document.createElement('button')
    b.type = 'button'
    b.className = cls
    b.textContent = glyph
    b.setAttribute('aria-label', label)
    return b
  }
  const prev = arrow('pf-carousel-prev', '‹', 'Previous slide')
  const next = arrow('pf-carousel-next', '›', 'Next slide')

  const update = (): void => {
    track.style.transform = `translateX(-${String(current * 100)}%)`
    prev.disabled = current <= 0
    next.disabled = current >= slideCount - 1
  }

  prev.addEventListener('click', () => {
    if (slideCount === 0) return
    current = Math.max(0, current - 1)
    update()
  })

  next.addEventListener('click', () => {
    if (slideCount === 0) return
    current = Math.min(slideCount - 1, current + 1)
    update()
  })

  update()
  wrapper.appendChild(track)
  wrapper.appendChild(prev)
  wrapper.appendChild(next)
  return wrapper
}
