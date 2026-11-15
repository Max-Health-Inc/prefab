/**
 * Form component renderers — Form, Input, Textarea, Button, Checkbox, Switch,
 * Slider and the date controls. The controls that offer a fixed set of choices
 * live in `choice.ts` and share the helpers exported from here.
 */

import { registerComponent, renderChildren, resolveStr, el, makeDispatchCtx } from '../engine.js'
import type { ComponentNode, RenderContext } from '../engine.js'
import { dispatchActions, fireAndForget } from '../actions.js'
import { stringifyValue } from '../../core/stringify.js'
import { optionalString } from '../../core/guards.js'

export function registerFormComponents(): void {
  registerComponent('Form', renderForm)
  registerComponent('Input', renderInput)
  registerComponent('Textarea', withLabel(renderTextarea))
  registerComponent('Button', renderButton)
  registerComponent('ButtonGroup', renderContainerDiv('pf-button-group'))
  registerComponent('Checkbox', renderToggle('pf-checkbox'))
  registerComponent('Switch', renderToggle('pf-switch'))
  registerComponent('Slider', withLabel(renderSlider))
  registerComponent('Calendar', withLabel(renderDateInput('pf-calendar')))
  registerComponent('DatePicker', withLabel(renderDateInput('pf-datepicker')))
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
    // A multi-select contributes one entry per chosen option, so it is read
    // through getAll and stays an array even when a single option is chosen.
    const data = new FormData(form)
    const values: Record<string, unknown> = {}
    for (const key of new Set(data.keys())) {
      const all = data.getAll(key)
      const field = form.elements.namedItem(key)
      const isList = (field instanceof HTMLSelectElement && field.multiple) || all.length > 1
      values[key] = isList ? all : all[0]
    }
    for (const toggle of form.querySelectorAll<HTMLInputElement>('input[type="checkbox"][name]')) {
      values[toggle.name] = toggle.checked
    }

    ctx.store.merge(values)

    if (node.onSubmit != null) {
      const dispCtx = makeDispatchCtx(ctx)
      dispCtx.scope = { ...ctx.scope, ...values }
      fireAndForget(dispatchActions(node.onSubmit, dispCtx), 'onSubmit')
    }
  })

  renderChildren(node, form, ctx)
  return form
}

let uid = 0

/** A document-unique id; the field name keeps it readable in devtools. */
export function controlId(kind: string, name?: string): string {
  uid += 1
  return `pf-${kind}-${name ?? 'field'}-${String(uid)}`
}

function prependLabel(wrapper: HTMLElement, node: ComponentNode, ctx: RenderContext): void {
  if (node.label == null) return
  const label = document.createElement('label')
  label.className = 'pf-input-label'
  label.textContent = resolveStr(node.label, ctx)
  const control = wrapper.querySelector('input, select, textarea')
  if (control) {
    if (!control.id) control.id = controlId('control', optionalString(node.name))
    label.htmlFor = control.id
  }
  if (node.required === true) label.setAttribute('data-required', '')
  wrapper.insertBefore(label, wrapper.firstChild)
}

/** Show `error` under the control and point the control's description at it. */
function appendError(wrapper: HTMLElement, node: ComponentNode, ctx: RenderContext): void {
  if (node.error == null || node.error === false || node.error === '') return
  const control = wrapper.querySelector('input, select, textarea')
  control?.setAttribute('aria-invalid', 'true')
  if (node.error === true) return
  const message = el('p', 'pf-field-error')
  message.id = controlId('error', optionalString(node.name))
  message.textContent = resolveStr(node.error, ctx)
  control?.setAttribute('aria-describedby', message.id)
  wrapper.appendChild(message)
}

/**
 * Wrap a renderer that lays its control out vertically with label and error support.
 * Checkbox, Switch, Radio, RadioGroup and ChoiceCard place their own label beside the
 * control, so they are deliberately not wrapped.
 */
export function withLabel(
  fn: (node: ComponentNode, ctx: RenderContext) => HTMLElement,
): (node: ComponentNode, ctx: RenderContext) => HTMLElement {
  return (node, ctx) => {
    const element = fn(node, ctx)
    element.classList.add('pf-labeled')
    prependLabel(element, node, ctx)
    appendError(element, node, ctx)
    return element
  }
}

/**
 * Mark a control as required, on the element and for assistive technology.
 * `aria-required` is also the only marker Combobox and RadioGroup can carry.
 */
export function markRequired(element: HTMLElement, node: ComponentNode): void {
  if (node.required !== true) return
  if (element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement) {
    element.required = true
  }
  element.setAttribute('aria-required', 'true')
}

/** Seed a text-like control from state and write every edit back, firing onChange. */
export function bindValue(
  control: HTMLInputElement | HTMLTextAreaElement,
  node: ComponentNode,
  ctx: RenderContext,
  event: 'input' | 'change' = 'input',
  read: () => unknown = () => control.value,
): void {
  const name = optionalString(node.name) ?? (control.name || undefined)
  if (!name) return
  const stateVal = ctx.store.get(name)
  if (stateVal != null) control.value = stringifyValue(stateVal)
  control.addEventListener(event, () => {
    const value = read()
    ctx.store.set(name, value)
    if (node.onChange != null) {
      fireAndForget(dispatchActions(node.onChange, { ...makeDispatchCtx(ctx), scope: { ...ctx.scope, $event: value } }), 'onChange')
    }
  })
}

function renderInput(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const wrapper = el('div', 'pf-input-wrapper')

  const input = document.createElement('input')
  input.className = 'pf-input'
  input.type = optionalString(node.inputType) ?? 'text'
  if (node.name != null) input.name = stringifyValue(node.name)
  input.id = controlId('input', optionalString(node.name))
  if (node.placeholder != null) input.placeholder = resolveStr(node.placeholder, ctx)
  if (node.disabled === true) input.disabled = true
  markRequired(input, node)
  bindValue(input, node, ctx)

  wrapper.appendChild(input)
  prependLabel(wrapper, node, ctx)
  appendError(wrapper, node, ctx)
  return wrapper
}

function renderTextarea(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const wrapper = el('div', 'pf-textarea-wrapper')

  const textarea = document.createElement('textarea')
  textarea.className = 'pf-textarea'
  if (node.name != null) textarea.name = stringifyValue(node.name)
  textarea.id = controlId('textarea', optionalString(node.name))
  if (node.placeholder != null) textarea.placeholder = resolveStr(node.placeholder, ctx)
  if (node.rows != null) textarea.rows = Number(node.rows)
  if (node.disabled === true) textarea.disabled = true
  markRequired(textarea, node)
  bindValue(textarea, node, ctx)

  wrapper.appendChild(textarea)
  return wrapper
}

function renderButton(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const btn = document.createElement('button')
  btn.className = 'pf-button'
  btn.type = node.submit === true ? 'submit' : 'button'
  btn.textContent = resolveStr(node.label, ctx)
  btn.setAttribute('data-variant', optionalString(node.variant) ?? 'default')
  if (node.size != null) btn.setAttribute('data-size', stringifyValue(node.size))
  if (node.disabled === true) btn.disabled = true
  return btn
}

function renderToggle(className: 'pf-checkbox' | 'pf-switch') {
  return (node: ComponentNode, ctx: RenderContext): HTMLElement => {
    const wrapper = el('label', `${className}-wrapper`)

    const input = document.createElement('input')
    input.type = 'checkbox'
    input.className = className
    if (className === 'pf-switch') input.setAttribute('role', 'switch')
    if (node.name != null) input.name = stringifyValue(node.name)
    if (node.checked === true) input.checked = true
    if (node.disabled === true) input.disabled = true

    const name = optionalString(node.name)
    if (name) {
      const stateVal = ctx.store.get(name)
      if (typeof stateVal === 'boolean') input.checked = stateVal
      input.addEventListener('change', () => {
        ctx.store.set(name, input.checked)
        if (node.onChange != null) {
          fireAndForget(dispatchActions(node.onChange, { ...makeDispatchCtx(ctx), scope: { ...ctx.scope, $event: input.checked } }), 'onChange')
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
}

function sliderFill(input: HTMLInputElement): void {
  const min = Number(input.min || 0)
  const max = Number(input.max || 100)
  const pct = max > min ? ((Number(input.value) - min) / (max - min)) * 100 : 0
  input.style.setProperty('--pf-fill', `${String(Math.round(Math.max(0, Math.min(100, pct)) * 100) / 100)}%`)
}

function renderSlider(node: ComponentNode, ctx: RenderContext): HTMLElement {
  const wrapper = el('div', 'pf-slider-wrapper')

  const input = document.createElement('input')
  input.type = 'range'
  input.className = 'pf-slider'
  if (node.name != null) input.name = stringifyValue(node.name)
  if (node.min != null) input.min = stringifyValue(node.min)
  if (node.max != null) input.max = stringifyValue(node.max)
  if (node.step != null) input.step = stringifyValue(node.step)
  if (node.disabled === true) input.disabled = true

  bindValue(input, node, ctx, 'input', () => Number(input.value))
  sliderFill(input)
  input.addEventListener('input', () => { sliderFill(input) })

  wrapper.appendChild(input)
  return wrapper
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
  return hr
}

// ── Calendar & DatePicker ────────────────────────────────────────────────────

function renderDateInput(className: 'pf-calendar' | 'pf-datepicker') {
  return (node: ComponentNode, ctx: RenderContext): HTMLElement => {
    const e = el('div', className)
    const input = document.createElement('input')
    input.type = 'date'
    input.className = 'pf-input'
    input.name = resolveStr(node.name, ctx)
    input.id = controlId('date', input.name || undefined)
    markRequired(input, node)
    if (node.placeholder != null) input.placeholder = resolveStr(node.placeholder, ctx)
    if (node.value !== undefined) input.value = resolveStr(node.value, ctx)
    if (node.minDate != null) input.min = resolveStr(node.minDate, ctx)
    if (node.maxDate != null) input.max = resolveStr(node.maxDate, ctx)
    if (node.disabled === true) input.disabled = true

    const stateVal = ctx.store.get(input.name)
    if (stateVal != null) input.value = stringifyValue(stateVal)
    input.addEventListener('change', () => {
      ctx.store.set(input.name, input.value)
      if (node.onChange != null) {
        fireAndForget(dispatchActions(node.onChange, makeDispatchCtx(ctx)), 'onChange')
      }
    })

    e.appendChild(input)
    return e
  }
}
