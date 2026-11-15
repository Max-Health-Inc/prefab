/**
 * Choice control renderers - Select, Radio, Combobox, ChoiceCard.
 *
 * Split from `form.ts`, which had grown past the point where the controls that
 * offer a fixed set of choices could be read as a group. They share `required`
 * marking and label wrapping with the text inputs, so those helpers stay in
 * `form.ts` and are imported here.
 */

import { registerComponent, renderChildren, renderNode, resolveStr, resolveValue, el, makeDispatchCtx } from '../engine.js'
import type { ComponentNode, RenderContext } from '../engine.js'
import { dispatchActions, fireAndForget } from '../actions.js'
import { stringifyValue } from '../../core/stringify.js'
import { optionalString, recordList } from '../../core/guards.js'
import { withLabel, markRequired, controlId, renderContainerDiv, renderTextSpan, renderSeparatorHr } from './form.js'

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
  if (node.name != null) select.name = stringifyValue(node.name)
  select.id = controlId('select', optionalString(node.name))
  if (node.multiple === true) select.multiple = true
  if (node.disabled === true) select.disabled = true
  markRequired(select, node)

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

  for (const o of recordList(node.options)) {
    const option = document.createElement('option')
    option.value = stringifyValue(o.value)
    option.textContent = o.label != null ? stringifyValue(o.label) : option.value
    select.appendChild(option)
  }

  // Render SelectOption children
  if (node.children) {
    for (const child of node.children) {
      if (child.type === 'SelectOption') {
        const option = document.createElement('option')
        option.value = optionalString(child.value) ?? ''
        option.textContent = optionalString(child.label) ?? option.value
        select.appendChild(option)
      } else {
        select.appendChild(renderNode(child, ctx))
      }
    }
  }

  const name = optionalString(node.name)
  if (name) {
    const stateVal = ctx.store.get(name)
    if (stateVal != null) applySelectValue(select, stateVal)
    select.addEventListener('change', () => {
      const current = selectValue(select)
      ctx.store.set(name, current)
      if (node.onChange != null) {
        fireAndForget(dispatchActions(node.onChange, { ...makeDispatchCtx(ctx), scope: { ...ctx.scope, $event: current } }), 'onChange')
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

  const input = document.createElement('input')
  input.type = 'radio'
  input.className = 'pf-radio-input'
  if (node.disabled === true) input.disabled = true
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

  if (node.label != null) {
    const legend = document.createElement('legend')
    legend.className = 'pf-radio-legend'
    legend.textContent = resolveStr(node.label, ctx)
    if (node.required === true) legend.setAttribute('data-required', '')
    e.appendChild(legend)
  }

  renderChildren(node, e, ctx)

  // Wire up name attribute on child radios and pre-select from state
  const name = resolveStr(node.name, ctx)
  const stateVal = ctx.store.get(name)
  for (const radio of e.querySelectorAll('input[type="radio"]')) {
    if (!(radio instanceof HTMLInputElement)) continue
    radio.name = name
    if (stateVal != null && radio.value === stringifyValue(stateVal)) radio.checked = true
  }

  e.addEventListener('change', (evt) => {
    const target = evt.target
    if (target instanceof HTMLInputElement && target.type === 'radio') {
      ctx.store.set(name, target.value)
      if (node.onChange != null) {
        fireAndForget(dispatchActions(node.onChange, makeDispatchCtx(ctx)), 'onChange')
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
  input.id = controlId('combobox', input.name || undefined)
  input.autocomplete = 'off'
  input.setAttribute('role', 'combobox')
  input.setAttribute('aria-autocomplete', 'list')
  input.setAttribute('aria-expanded', 'false')
  markRequired(input, node)
  if (node.placeholder != null) input.placeholder = resolveStr(node.placeholder, ctx)
  if (node.value !== undefined) input.value = resolveStr(node.value, ctx)
  if (node.disabled === true) input.disabled = true
  const cbStateVal = ctx.store.get(input.name)
  if (cbStateVal != null) input.value = stringifyValue(cbStateVal)

  const dropdown = el('div', 'pf-combobox-dropdown')
  dropdown.id = `${input.id}-list`
  dropdown.setAttribute('role', 'listbox')
  dropdown.style.display = 'none'
  input.setAttribute('aria-controls', dropdown.id)
  renderChildren(node, dropdown, ctx)

  const options = (): HTMLElement[] =>
    Array.from(dropdown.querySelectorAll<HTMLElement>('.pf-combobox-option')).filter(o => o.style.display !== 'none')
  const setOpen = (open: boolean): void => {
    dropdown.style.display = open ? 'block' : 'none'
    input.setAttribute('aria-expanded', open ? 'true' : 'false')
    if (!open) for (const o of options()) o.setAttribute('aria-selected', 'false')
  }
  const move = (step: number): void => {
    const list = options()
    if (list.length === 0) return
    const current = list.findIndex(o => o.getAttribute('aria-selected') === 'true')
    const next = list[(current + step + list.length) % list.length]
    for (const o of list) o.setAttribute('aria-selected', o === next ? 'true' : 'false')
    next.scrollIntoView({ block: 'nearest' })
  }

  input.addEventListener('focus', () => { setOpen(true) })
  input.addEventListener('blur', () => {
    setTimeout(() => { setOpen(false) }, 150)
  })
  input.addEventListener('keydown', (evt) => {
    if (evt.key === 'ArrowDown' || evt.key === 'ArrowUp') {
      evt.preventDefault()
      setOpen(true)
      move(evt.key === 'ArrowDown' ? 1 : -1)
    } else if (evt.key === 'Enter') {
      const active = options().find(o => o.getAttribute('aria-selected') === 'true')
      if (active) {
        evt.preventDefault()
        active.dispatchEvent(new MouseEvent('mousedown'))
        setOpen(false)
      }
    } else if (evt.key === 'Escape') {
      setOpen(false)
    }
  })
  if (node.searchable !== false) {
    input.addEventListener('input', () => {
      const q = input.value.toLowerCase()
      for (const opt of dropdown.querySelectorAll('.pf-combobox-option')) {
        if (opt instanceof HTMLElement) opt.style.display = opt.textContent.toLowerCase().includes(q) ? '' : 'none'
      }
      setOpen(true)
    })
  }

  if (node.onChange != null) {
    e.addEventListener('pf-combobox-select', () => {
      fireAndForget(dispatchActions(node.onChange, { ...makeDispatchCtx(ctx), scope: { ...ctx.scope, $event: input.value } }), 'onChange')
    })
  }

  e.appendChild(input)
  e.appendChild(dropdown)
  return e
}

function renderComboboxOption(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const e = el('div', 'pf-combobox-option')
  e.setAttribute('role', 'option')
  e.setAttribute('aria-selected', 'false')
  e.textContent = resolveStr(node.label ?? node.value, ctx)
  e.dataset.value = resolveStr(node.value, ctx)
  e.addEventListener('mousedown', () => {
    const combobox = e.closest('.pf-combobox')
    const input = combobox?.querySelector('input')
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
  e.dataset.value = resolveStr(node.value, ctx)
  const selected = typeof node.selected === 'string' ? resolveValue(node.selected, ctx) : node.selected
  if (selected === true || selected === 'true') e.dataset.selected = 'true'
  if (node.onClick != null) e.setAttribute('aria-pressed', e.dataset.selected === 'true' ? 'true' : 'false')

  if (node.label != null) {
    const title = el('div', 'pf-choice-card-label')
    title.textContent = resolveStr(node.label, ctx)
    e.appendChild(title)
  }
  if (node.description != null) {
    const desc = el('div', 'pf-choice-card-description')
    desc.textContent = resolveStr(node.description, ctx)
    e.appendChild(desc)
  }

  renderChildren(node, e, ctx)
  return e
}
