/**
 * Form component renderers — Form, Input, Textarea, Button, Checkbox, Switch,
 * Slider and the date controls. The controls that offer a fixed set of choices
 * live in `choice.ts` and share the helpers exported from here.
 */

import { registerComponent, renderChildren, resolveStr, el, makeDispatchCtx } from '../engine.js'
import type { ComponentNode, RenderContext } from '../engine.js'
import { dispatchActions, fireAndForget } from '../actions.js'
import type { ActionJSON } from '../actions.js'
import { stringifyValue } from '../../core/stringify.js'

export function registerFormComponents(): void {
  registerComponent('Form', renderForm)
  registerComponent('Input', renderInput)
  registerComponent('Textarea', withLabel(renderTextarea))
  registerComponent('Button', renderButton)
  registerComponent('ButtonGroup', renderButtonGroup)
  registerComponent('Checkbox', renderCheckbox)
  registerComponent('Switch', renderSwitch)
  registerComponent('Slider', withLabel(renderSlider))
  registerComponent('Calendar', renderCalendar)
  registerComponent('DatePicker', withLabel(renderDatePicker))
  registerComponent('Field', renderContainerDiv('pf-field'))
  registerComponent('FieldTitle', renderTextSpan('pf-field-title'))
  registerComponent('FieldDescription', renderTextSpan('pf-field-description'))
  registerComponent('FieldContent', renderContainerDiv('pf-field-content'))
  registerComponent('FieldError', renderTextSpan('pf-field-error'))
}

function renderForm(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const form = document.createElement('form')
  form.className = 'pf-form'

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    // Collect form data into state. A multi-select contributes one entry per
    // chosen option, so it is read through getAll and stays an array even when
    // a single option is chosen — the field asked for a list either way.
    const data = new FormData(form)
    const values: Record<string, unknown> = {}
    for (const key of new Set(data.keys())) {
      const all = data.getAll(key)
      const field = form.elements.namedItem(key)
      const isList = (field instanceof HTMLSelectElement && field.multiple) || all.length > 1
      values[key] = isList ? all : all[0]
    }

    // Merge form values into state before dispatching
    ctx.store.merge(values)

    if (node.onSubmit != null) {
      const dispCtx = makeDispatchCtx(ctx)
      // Resolve form field values into tool call arguments
      dispCtx.scope = { ...ctx.scope, ...values }
      fireAndForget(dispatchActions(node.onSubmit as ActionJSON | ActionJSON[], dispCtx), 'onSubmit')
    }
  })

  renderChildren(node, form, ctx)
  return form
}

/**
 * Prepend the field label, if the node carries one.
 *
 * Every stateful control accepts `label` (see `statefulProps`), so this is shared
 * rather than repeated per renderer.
 */
function prependLabel(wrapper: HTMLElement, node: ComponentNode, ctx: RenderContext): void {
  if (node.label == null) return
  const label = document.createElement('label')
  label.className = 'pf-input-label'
  label.textContent = resolveStr(node.label, ctx)
  if (node.name != null) label.htmlFor = node.name as string
  label.style.fontSize = '14px'
  label.style.fontWeight = '500'
  wrapper.insertBefore(label, wrapper.firstChild)
}

/**
 * Add label support to a renderer that lays its control out vertically.
 *
 * Applied at registration rather than inside each renderer. Checkbox, Switch,
 * Radio, RadioGroup and ChoiceCard place their own label beside the control, so
 * they are deliberately not wrapped.
 */
export function withLabel(
  fn: (node: ComponentNode, ctx: RenderContext) => HTMLElement,
): (node: ComponentNode, ctx: RenderContext) => HTMLElement {
  return (node, ctx) => {
    const element = fn(node, ctx)
    element.style.display = 'flex'
    element.style.flexDirection = 'column'
    element.style.gap = '4px'
    prependLabel(element, node, ctx)
    return element
  }
}

/**
 * Mark a control as required, on the element and for assistive technology.
 *
 * `aria-required` is set even where the native attribute already implies it,
 * because the wrappers around these controls are what a screen reader reaches
 * first, and it is the only marker Combobox and RadioGroup can carry at all.
 */
export function markRequired(element: HTMLElement, node: ComponentNode): void {
  if (node.required !== true) return
  if ('required' in element) (element as HTMLInputElement).required = true
  element.setAttribute('aria-required', 'true')
}

function renderInput(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const wrapper = el('div', 'pf-input-wrapper')
  wrapper.style.display = 'flex'
  wrapper.style.flexDirection = 'column'
  wrapper.style.gap = '4px'

  prependLabel(wrapper, node, ctx)

  const input = document.createElement('input')
  input.className = 'pf-input'
  input.type = (node.inputType as string | undefined) ?? 'text'
  if (node.name != null) input.name = node.name as string
  if (node.name != null) input.id = `pf-input-${node.name as string}`
  if (node.placeholder != null) input.placeholder = resolveStr(node.placeholder, ctx)
  markRequired(input, node)
  if (node.error != null) input.setAttribute('aria-invalid', 'true')

  // Bind to state
  const name = node.name as string | undefined
  if (name) {
    const stateVal = ctx.store.get(name)
    if (stateVal != null) input.value = stringifyValue(stateVal)
    input.addEventListener('input', () => {
      ctx.store.set(name, input.value)
      if (node.onChange != null) {
        fireAndForget(dispatchActions(node.onChange as ActionJSON | ActionJSON[], { ...makeDispatchCtx(ctx), scope: { ...ctx.scope, $event: input.value } }), 'onChange')
      }
    })
  }

  applyInputStyle(input)
  wrapper.appendChild(input)
  return wrapper
}

function renderTextarea(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const wrapper = el('div', 'pf-textarea-wrapper')

  const textarea = document.createElement('textarea')
  textarea.className = 'pf-textarea'
  if (node.name != null) textarea.name = node.name as string
  if (node.name != null) textarea.id = `pf-textarea-${node.name as string}`
  if (node.placeholder != null) textarea.placeholder = resolveStr(node.placeholder, ctx)
  if (node.rows != null) textarea.rows = node.rows as number
  markRequired(textarea, node)

  const name = node.name as string | undefined
  if (name != null) {
    const stateVal = ctx.store.get(name)
    if (stateVal != null) textarea.value = stringifyValue(stateVal)
    textarea.addEventListener('input', () => {
      ctx.store.set(name, textarea.value)
      if (node.onChange != null) {
        fireAndForget(dispatchActions(node.onChange as ActionJSON | ActionJSON[], { ...makeDispatchCtx(ctx), scope: { ...ctx.scope, $event: textarea.value } }), 'onChange')
      }
    })
  }

  applyInputStyle(textarea)
  wrapper.appendChild(textarea)
  return wrapper
}

function renderButton(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const btn = document.createElement('button')
  btn.className = 'pf-button'
  btn.type = node.submit === true ? 'submit' : 'button'
  btn.textContent = resolveStr(node.label, ctx)

  const variant = (node.variant as string | undefined) ?? 'default'
  btn.setAttribute('data-variant', variant)
  applyButtonStyle(btn, variant)

  if (node.size != null) btn.setAttribute('data-size', node.size as string)
  if (node.disabled === true) btn.disabled = true

  return btn
}

function renderButtonGroup(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const e = el('div', 'pf-button-group')
  e.style.display = 'flex'
  e.style.gap = '8px'
  renderChildren(node, e, ctx)
  return e
}

function renderCheckbox(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const wrapper = el('label', 'pf-checkbox-wrapper')
  wrapper.style.display = 'flex'
  wrapper.style.alignItems = 'center'
  wrapper.style.gap = '8px'
  wrapper.style.cursor = 'pointer'

  const input = document.createElement('input')
  input.type = 'checkbox'
  input.className = 'pf-checkbox'
  if (node.name != null) input.name = node.name as string
  if (node.checked === true) input.checked = true

  const name = node.name as string | undefined
  if (name) {
    const stateVal = ctx.store.get(name)
    if (typeof stateVal === 'boolean') input.checked = stateVal
    input.addEventListener('change', () => {
      ctx.store.set(name, input.checked)
      if (node.onChange != null) {
        fireAndForget(dispatchActions(node.onChange as ActionJSON | ActionJSON[], { ...makeDispatchCtx(ctx), scope: { ...ctx.scope, $event: input.checked } }), 'onChange')
      }
    })
  }

  wrapper.appendChild(input)
  if (node.label != null) {
    const span = el('span')
    span.textContent = resolveStr(node.label, ctx)
    wrapper.appendChild(span)
  }

  return wrapper
}

function renderSwitch(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const wrapper = el('label', 'pf-switch-wrapper')
  wrapper.style.display = 'flex'
  wrapper.style.alignItems = 'center'
  wrapper.style.gap = '8px'
  wrapper.style.cursor = 'pointer'

  const input = document.createElement('input')
  input.type = 'checkbox'
  input.className = 'pf-switch'
  input.setAttribute('role', 'switch')
  if (node.name != null) input.name = node.name as string

  const name = node.name as string | undefined
  if (name) {
    const stateVal = ctx.store.get(name)
    if (typeof stateVal === 'boolean') input.checked = stateVal
    input.addEventListener('change', () => {
      ctx.store.set(name, input.checked)
      if (node.onChange != null) {
        fireAndForget(dispatchActions(node.onChange as ActionJSON | ActionJSON[], { ...makeDispatchCtx(ctx), scope: { ...ctx.scope, $event: input.checked } }), 'onChange')
      }
    })
  }

  wrapper.appendChild(input)
  if (node.label != null) {
    const span = el('span')
    span.textContent = resolveStr(node.label, ctx)
    wrapper.appendChild(span)
  }

  return wrapper
}

function renderSlider(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const wrapper = el('div', 'pf-slider-wrapper')

  const input = document.createElement('input')
  input.type = 'range'
  input.className = 'pf-slider'
  if (node.name != null) input.name = node.name as string
  if (node.min != null) input.min = stringifyValue(node.min)
  if (node.max != null) input.max = stringifyValue(node.max)
  if (node.step != null) input.step = stringifyValue(node.step)

  const name = node.name as string | undefined
  if (name) {
    const stateVal = ctx.store.get(name)
    if (stateVal != null) input.value = stringifyValue(stateVal)
    input.addEventListener('input', () => {
      ctx.store.set(name, Number(input.value))
      if (node.onChange != null) {
        fireAndForget(dispatchActions(node.onChange as ActionJSON | ActionJSON[], { ...makeDispatchCtx(ctx), scope: { ...ctx.scope, $event: Number(input.value) } }), 'onChange')
      }
    })
  }

  wrapper.appendChild(input)
  return wrapper
}

// ── Helpers ──────────────────────────────────────────────────────────────────

export function applyInputStyle(e: HTMLElement): void {
  e.style.padding = '8px 12px'
  e.style.fontSize = '14px'
  e.style.width = '100%'
  e.style.boxSizing = 'border-box'
}

function applyButtonStyle(btn: HTMLButtonElement, variant: string): void {
  btn.style.padding = '8px 16px'
  btn.style.fontSize = '14px'
  btn.style.fontWeight = '500'
  btn.style.cursor = 'pointer'
  btn.style.border = 'none'

  // Only apply non-theme static colors for ghost (transparent bg)
  if (variant === 'ghost') {
    btn.style.backgroundColor = 'transparent'
    btn.style.color = 'inherit'
  }
  // All themed variants (default, secondary, destructive, outline, link) are
  // handled by prefab.css via .pf-button[data-variant="..."] selectors
}

// ── Generic helpers for simple container/text renderers ──────────────────────

export function renderContainerDiv(className: string): (node: ComponentNode, ctx: RenderContext) => HTMLElement {
  return (node, ctx) => {
    const e = el('div', className)
    renderChildren(node, e, ctx)
    return e
  }
}

export function renderTextSpan(className: string): (node: ComponentNode, ctx: RenderContext) => HTMLElement {
  return (node, ctx) => {
    const e = el('span', className)
    e.textContent = resolveStr(node.content, ctx)
    return e
  }
}

export function renderSeparatorHr(): HTMLElement {
  const hr = document.createElement('hr')
  hr.className = 'pf-separator'
  hr.style.border = 'none'
  hr.style.margin = '4px 0'
  return hr
}

// ── Calendar ─────────────────────────────────────────────────────────────────

function renderCalendar(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const e = el('div', 'pf-calendar')
  const input = document.createElement('input')
  input.type = 'date'
  input.name = resolveStr(node.name, ctx)
  markRequired(input, node)
  if (node.value !== undefined) input.value = resolveStr(node.value, ctx)
  // Read initial value from state
  const calName = input.name
  const calStateVal = ctx.store.get(calName)
  if (calStateVal != null) input.value = stringifyValue(calStateVal)
  if (node.minDate != null) input.min = resolveStr(node.minDate, ctx)
  if (node.maxDate != null) input.max = resolveStr(node.maxDate, ctx)
  input.style.padding = '6px 12px'
  input.style.borderRadius = '6px'

  input.addEventListener('change', () => {
    ctx.store.set(input.name, input.value)
    if (node.onChange != null) {
      fireAndForget(dispatchActions(node.onChange as ActionJSON | ActionJSON[], makeDispatchCtx(ctx)), 'onChange')
    }
  })

  e.appendChild(input)
  return e
}

// ── DatePicker ───────────────────────────────────────────────────────────────

function renderDatePicker(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const e = el('div', 'pf-datepicker')
  const input = document.createElement('input')
  input.type = 'date'
  input.name = resolveStr(node.name, ctx)
  markRequired(input, node)
  if (node.placeholder != null) input.placeholder = resolveStr(node.placeholder, ctx)
  if (node.value !== undefined) input.value = resolveStr(node.value, ctx)
  // Read initial value from state
  const dpName = input.name
  const dpStateVal = ctx.store.get(dpName)
  if (dpStateVal != null) input.value = stringifyValue(dpStateVal)
  if (node.minDate != null) input.min = resolveStr(node.minDate, ctx)
  if (node.maxDate != null) input.max = resolveStr(node.maxDate, ctx)
  input.style.padding = '6px 12px'
  input.style.borderRadius = '6px'
  input.style.width = '100%'
  input.style.boxSizing = 'border-box'

  input.addEventListener('change', () => {
    ctx.store.set(input.name, input.value)
    if (node.onChange != null) {
      fireAndForget(dispatchActions(node.onChange as ActionJSON | ActionJSON[], makeDispatchCtx(ctx)), 'onChange')
    }
  })

  e.appendChild(input)
  return e
}
