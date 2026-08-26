/**
 * Choice control renderers - Select, Radio, Combobox, ChoiceCard.
 *
 * Split from `form.ts`, which had grown past the point where the controls that
 * offer a fixed set of choices could be read as a group. They share `required`
 * marking and label wrapping with the text inputs, so those helpers stay in
 * `form.ts` and are imported here.
 */

import { registerComponent, renderChildren, renderNode, resolveStr, el, makeDispatchCtx } from '../engine.js'
import type { ComponentNode, RenderContext } from '../engine.js'
import { dispatchActions, fireAndForget } from '../actions.js'
import type { ActionJSON } from '../actions.js'
import { stringifyValue } from '../../core/stringify.js'
import { withLabel, markRequired, applyInputStyle, renderContainerDiv, renderTextSpan, renderSeparatorHr } from './form.js'

export function registerChoiceComponents(): void {
  registerComponent('Select', withLabel(renderSelect))
  registerComponent('SelectOption', renderSelectOption)
  registerComponent('SelectGroup', renderContainerDiv('pf-select-group'))
  registerComponent('SelectLabel', renderTextSpan('pf-select-label'))
  registerComponent('SelectSeparator', renderSeparatorHr)
  registerComponent('Radio', renderRadio)
  registerComponent('RadioGroup', renderRadioGroup)
  registerComponent('Combobox', withLabel(renderCombobox))
  registerComponent('ComboboxOption', renderComboboxOption)
  registerComponent('ComboboxGroup', renderContainerDiv('pf-combobox-group'))
  registerComponent('ComboboxLabel', renderTextSpan('pf-combobox-label'))
  registerComponent('ComboboxSeparator', renderSeparatorHr)
  registerComponent('ChoiceCard', renderChoiceCard)
}

function renderSelect(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const wrapper = el('div', 'pf-select-wrapper')

  const select = document.createElement('select')
  select.className = 'pf-select'
  if (node.name != null) select.name = node.name as string
  if (node.multiple === true) select.multiple = true
  markRequired(select, node)
  applyInputStyle(select)

  // Placeholder option
  if (node.placeholder != null) {
    const ph = document.createElement('option')
    ph.value = ''
    ph.textContent = resolveStr(node.placeholder, ctx)
    ph.disabled = true
    ph.selected = true
    ph.hidden = true
    select.appendChild(ph)
  }

  // Support shorthand `options` array: [{label, value}]
  const opts = node.options as { label?: string; value?: string }[] | undefined
  if (Array.isArray(opts)) {
    for (const o of opts) {
      const option = document.createElement('option')
      option.value = o.value ?? ''
      option.textContent = o.label ?? option.value
      select.appendChild(option)
    }
  }

  // Render SelectOption children
  if (node.children) {
    for (const child of node.children) {
      if (child.type === 'SelectOption') {
        const option = document.createElement('option')
        option.value = (child.value as string | undefined) ?? ''
        option.textContent = (child.label as string | undefined) ?? option.value
        select.appendChild(option)
      } else {
        select.appendChild(renderNode(child, ctx) as HTMLElement)
      }
    }
  }

  const name = node.name as string | undefined
  if (name) {
    const stateVal = ctx.store.get(name)
    if (stateVal != null) applySelectValue(select, stateVal)
    select.addEventListener('change', () => {
      const current = selectValue(select)
      ctx.store.set(name, current)
      if (node.onChange != null) {
        fireAndForget(dispatchActions(node.onChange as ActionJSON | ActionJSON[], { ...makeDispatchCtx(ctx), scope: { ...ctx.scope, $event: current } }), 'onChange')
      }
    })
  }

  wrapper.appendChild(select)
  return wrapper
}

/** The chosen value: an array on a multi-select, the single value otherwise. */
function selectValue(select: HTMLSelectElement): string | string[] {
  if (!select.multiple) return select.value
  return Array.from(select.selectedOptions, o => o.value)
}

/** Restore a stored value, which for a multi-select is a list of them. */
function applySelectValue(select: HTMLSelectElement, stored: unknown): void {
  if (!select.multiple) {
    select.value = stringifyValue(stored)
    return
  }
  const chosen = new Set((Array.isArray(stored) ? stored : [stored]).map(v => stringifyValue(v)))
  for (const option of select.options) option.selected = chosen.has(option.value)
}

function renderSelectOption(_node: ComponentNode, _ctx: RenderContext): HTMLElement {
  // Handled inline by renderSelect
  return el('span')
}


// ── Radio ────────────────────────────────────────────────────────────────────

function renderRadio(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const label = el('label', 'pf-radio')
  label.style.display = 'flex'
  label.style.alignItems = 'center'
  label.style.gap = '8px'
  label.style.cursor = 'pointer'

  const input = document.createElement('input')
  input.type = 'radio'
  input.value = resolveStr(node.value, ctx)
  label.appendChild(input)

  if (node.label != null) {
    const text = el('span', 'pf-radio-label')
    text.textContent = resolveStr(node.label, ctx)
    label.appendChild(text)
  }

  return label
}

// ── RadioGroup ───────────────────────────────────────────────────────────────

function renderRadioGroup(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const e = el('fieldset', 'pf-radio-group')
  markRequired(e, node)
  e.style.border = 'none'
  e.style.padding = '0'
  e.style.display = 'flex'
  e.style.flexDirection = 'column'
  e.style.gap = '8px'

  if (node.label != null) {
    const legend = document.createElement('legend')
    legend.textContent = resolveStr(node.label, ctx)
    legend.style.fontWeight = '500'
    legend.style.marginBottom = '4px'
    e.appendChild(legend)
  }

  renderChildren(node, e, ctx)

  // Wire up name attribute on child radios and pre-select from state
  const name = resolveStr(node.name, ctx)
  const stateVal = ctx.store.get(name)
  for (const radio of Array.from(e.querySelectorAll('input[type="radio"]'))) {
    ;(radio as HTMLInputElement).name = name
    if (stateVal != null && (radio as HTMLInputElement).value === stringifyValue(stateVal)) {
      ;(radio as HTMLInputElement).checked = true
    }
  }

  e.addEventListener('change', (evt) => {
    const target = evt.target as HTMLInputElement
    if (target.type === 'radio') {
      ctx.store.set(name, target.value)
      if (node.onChange != null) {
        fireAndForget(dispatchActions(node.onChange as ActionJSON | ActionJSON[], makeDispatchCtx(ctx)), 'onChange')
      }
    }
  })

  return e
}

// ── Combobox ─────────────────────────────────────────────────────────────────

function renderCombobox(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const e = el('div', 'pf-combobox')
  const input = document.createElement('input')
  input.className = 'pf-combobox-input'
  input.type = 'text'
  input.name = resolveStr(node.name, ctx)
  markRequired(input, node)
  if (node.placeholder != null) input.placeholder = resolveStr(node.placeholder, ctx)
  if (node.value !== undefined) input.value = resolveStr(node.value, ctx)
  // Read initial value from state
  const cbName = input.name
  const cbStateVal = ctx.store.get(cbName)
  if (cbStateVal != null) input.value = stringifyValue(cbStateVal)

  input.style.padding = '6px 12px'
  input.style.borderRadius = '6px'
  input.style.width = '100%'
  input.style.boxSizing = 'border-box'

  const dropdown = el('div', 'pf-combobox-dropdown')
  dropdown.style.display = 'none'
  dropdown.style.position = 'absolute'
  dropdown.style.borderRadius = '6px'
  dropdown.style.maxHeight = '200px'
  dropdown.style.overflowY = 'auto'
  dropdown.style.zIndex = '50'
  renderChildren(node, dropdown, ctx)

  input.addEventListener('focus', () => { dropdown.style.display = 'block' })
  input.addEventListener('blur', () => {
    setTimeout(() => { dropdown.style.display = 'none' }, 150)
  })
  if (node.searchable !== false) {
    input.addEventListener('input', () => {
      const q = input.value.toLowerCase()
      for (const opt of Array.from(dropdown.querySelectorAll('.pf-combobox-option'))) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- textContent is string | null per DOM spec
        const text = ((opt as HTMLElement).textContent ?? '').toLowerCase()
        ;(opt as HTMLElement).style.display = text.includes(q) ? '' : 'none'
      }
    })
  }

  // Listen for option selection (custom event from ComboboxOption)
  if (node.onChange != null) {
    e.addEventListener('pf-combobox-select', () => {
      fireAndForget(dispatchActions(node.onChange as ActionJSON | ActionJSON[], { ...makeDispatchCtx(ctx), scope: { ...ctx.scope, $event: input.value } }), 'onChange')
    })
  }

  e.style.position = 'relative'
  e.appendChild(input)
  e.appendChild(dropdown)
  return e
}

function renderComboboxOption(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const e = el('div', 'pf-combobox-option')
  e.style.padding = '6px 12px'
  e.style.cursor = 'pointer'
  e.textContent = resolveStr(node.label ?? node.value, ctx)
  e.dataset.value = resolveStr(node.value, ctx)
  e.addEventListener('mousedown', () => {
    const combobox = e.closest('.pf-combobox')
    const input = combobox?.querySelector('input') as HTMLInputElement | null
    if (input) {
      input.value = e.dataset.value ?? ''
      ctx.store.set(input.name, input.value)
      combobox?.dispatchEvent(new CustomEvent('pf-combobox-select', { bubbles: false }))
    }
  })
  return e
}


// ── ChoiceCard ───────────────────────────────────────────────────────────────

function renderChoiceCard(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const e = el('div', 'pf-choice-card')
  e.style.padding = '16px'
  e.style.cursor = 'pointer'
  e.style.transition = 'border-color 0.2s'
  e.dataset.value = resolveStr(node.value, ctx)

  if (node.selected === true) {
    e.dataset.selected = 'true'
  }

  if (node.label != null) {
    const title = el('div', 'pf-choice-card-label')
    title.textContent = resolveStr(node.label, ctx)
    title.style.fontWeight = '600'
    e.appendChild(title)
  }
  if (node.description != null) {
    const desc = el('div', 'pf-choice-card-description')
    desc.textContent = resolveStr(node.description, ctx)
    desc.style.fontSize = '14px'
    e.appendChild(desc)
  }

  renderChildren(node, e, ctx)

  return e
}
