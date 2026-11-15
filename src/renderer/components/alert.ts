/**
 * Alert component renderers — Alert, AlertTitle, AlertDescription
 */

import { registerComponent, renderChildren, resolveStr, el } from '../engine.js'
import type { ComponentNode, RenderContext } from '../engine.js'
import { optionalString } from '../../core/guards.js'
import { stringifyValue } from '../../core/stringify.js'
import { fillIcon } from '../icons.js'

export function registerAlertComponents(): void {
  registerComponent('Alert', renderAlert)
  registerComponent('AlertTitle', renderAlertTitle)
  registerComponent('AlertDescription', renderAlertDescription)
}

function renderAlert(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const e = el('div', 'pf-alert')
  e.setAttribute('role', 'alert')
  const variant = optionalString(node.variant) ?? 'default'
  e.setAttribute('data-variant', variant)

  if (node.icon != null) {
    const icon = el('span', 'pf-alert-icon')
    fillIcon(icon, stringifyValue(node.icon))
    e.appendChild(icon)
  }

  renderChildren(node, e, ctx)
  return e
}

function renderAlertTitle(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const e = el('h5', 'pf-alert-title')
  e.textContent = resolveStr(node.content, ctx)
  return e
}

function renderAlertDescription(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const e = el('p', 'pf-alert-description')
  e.textContent = resolveStr(node.content, ctx)
  return e
}
