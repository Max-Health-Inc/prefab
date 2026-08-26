/**
 * Form components — Form, Input, Button, Select, Checkbox, etc.
 */

import { Component, ContainerComponent, StatefulComponent, statefulProps } from '../../core/component.js'
import type { ContainerProps, ComponentProps, StatefulProps, RxStr } from '../../core/component.js'
import type { Action } from '../../actions/types.js'

// ── Form ─────────────────────────────────────────────────────────────────────

export interface FormProps extends ContainerProps {
  onSubmit: Action | Action[]
}

export function Form(props: FormProps): ContainerComponent {
  const c = new ContainerComponent('Form', props)
  c.getProps = () => ({
    onSubmit: Array.isArray(props.onSubmit)
      ? props.onSubmit.map(a => a.toJSON())
      : props.onSubmit.toJSON(),
  })
  return c
}

// ── Input ────────────────────────────────────────────────────────────────────

export interface InputProps extends StatefulProps {
  placeholder?: string
  inputType?: string
}

export function Input(props: InputProps): StatefulComponent {
  const c = new StatefulComponent('Input', props)
  const origGetProps = c.getProps.bind(c)
  c.getProps = () => ({
    ...origGetProps(),
    inputType: props.inputType ?? 'text',
    ...(props.placeholder && { placeholder: props.placeholder }),
    disabled: false,
    readOnly: false,
    required: props.required ?? false,
  })
  return c
}

// ── Textarea ─────────────────────────────────────────────────────────────────

export interface TextareaProps extends StatefulProps {
  placeholder?: string
  rows?: number
}

export function Textarea(props: TextareaProps): StatefulComponent {
  const c = new StatefulComponent('Textarea', props)
  const origGetProps = c.getProps.bind(c)
  c.getProps = () => ({
    ...origGetProps(),
    ...(props.placeholder && { placeholder: props.placeholder }),
    ...(props.rows !== undefined && { rows: props.rows }),
    disabled: false,
    // Defaulted rather than omitted: the Python reference emits it on every
    // Textarea, and the wire-parity goldens are compared field for field.
    required: props.required ?? false,
  })
  return c
}

// ── Button ───────────────────────────────────────────────────────────────────

export type ButtonVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link'
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon'

export interface ButtonProps extends ComponentProps {
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  /** Set to true to make this a submit button inside a Form. */
  submit?: boolean
  onClick?: Action | Action[]
}

export function Button(label: RxStr, props?: ButtonProps): Component {
  const c = new Component('Button', props)
  c.getProps = () => {
    const p: Record<string, unknown> = { label: String(label) }
    p.variant = props?.variant ?? 'default'
    p.size = props?.size ?? 'default'
    p.disabled = props?.disabled ?? false
    if (props?.submit) p.submit = true
    if (props?.onClick) {
      p.onClick = Array.isArray(props.onClick)
        ? props.onClick.map((a: Action) => a.toJSON())
        : props.onClick.toJSON()
    }
    return p
  }
  return c
}

// ── ButtonGroup ──────────────────────────────────────────────────────────────

export function ButtonGroup(props?: ContainerProps): ContainerComponent {
  return new ContainerComponent('ButtonGroup', props)
}

// ── Select + SelectOption ────────────────────────────────────────────────────

export interface SelectProps extends StatefulProps {
  /** Shown until a choice is made. */
  placeholder?: string
  /** Accept several choices. Submits an array under `name`. */
  multiple?: boolean
  children?: Component[]
}

export function Select(props: SelectProps): ContainerComponent {
  const c = new ContainerComponent('Select', props) as ContainerComponent & StatefulComponent
  c.getProps = () => ({
    ...statefulProps(props),
    ...(props.placeholder != null && { placeholder: props.placeholder }),
    ...(props.multiple === true && { multiple: true }),
  })
  return c
}

export function SelectOption(value: string, label?: string, props?: ComponentProps): Component {
  const c = new Component('SelectOption', props)
  c.getProps = () => ({ value, label: label ?? value })
  return c
}

// ── Checkbox ─────────────────────────────────────────────────────────────────

export interface CheckboxProps extends StatefulProps {
  checked?: boolean
}

export function Checkbox(props: CheckboxProps): StatefulComponent {
  const c = new StatefulComponent('Checkbox', props)
  const origGetProps = c.getProps.bind(c)
  c.getProps = () => ({
    ...origGetProps(),
    ...(props.checked !== undefined && { checked: props.checked }),
  })
  return c
}

// ── Switch ───────────────────────────────────────────────────────────────────

export type SwitchProps = StatefulProps

export function Switch(props: SwitchProps): StatefulComponent {
  return new StatefulComponent('Switch', props)
}

// ── Slider ───────────────────────────────────────────────────────────────────

export interface SliderProps extends StatefulProps {
  min?: number
  max?: number
  step?: number
}

export function Slider(props: SliderProps): StatefulComponent {
  const c = new StatefulComponent('Slider', props)
  const origGetProps = c.getProps.bind(c)
  c.getProps = () => ({
    ...origGetProps(),
    ...(props.min !== undefined && { min: props.min }),
    ...(props.max !== undefined && { max: props.max }),
    ...(props.step !== undefined && { step: props.step }),
  })
  return c
}

// ── SelectGroup ──────────────────────────────────────────────────────────────

export function SelectGroup(props?: ContainerProps): ContainerComponent {
  return new ContainerComponent('SelectGroup', props)
}

// ── SelectLabel ──────────────────────────────────────────────────────────────

export function SelectLabel(content: string, props?: ComponentProps): Component {
  const c = new Component('SelectLabel', props)
  c.getProps = () => ({ content })
  return c
}

// ── SelectSeparator ──────────────────────────────────────────────────────────

export function SelectSeparator(props?: ComponentProps): Component {
  return new Component('SelectSeparator', props)
}

// ── Radio ────────────────────────────────────────────────────────────────────

export interface RadioProps extends ComponentProps {
  value: string
  label?: string
}

export function Radio(props: RadioProps): Component {
  const c = new Component('Radio', props)
  // Radio is not stateful (the RadioGroup holds the value), so it carries its own label.
  c.getProps = () => ({
    value: props.value,
    ...(props.label && { label: props.label }),
  })
  return c
}

// ── RadioGroup ───────────────────────────────────────────────────────────────

export interface RadioGroupProps extends StatefulProps {
  children?: Component[]
}

export function RadioGroup(props: RadioGroupProps): ContainerComponent {
  const c = new ContainerComponent('RadioGroup', props)
  c.getProps = () => statefulProps(props)
  return c
}

// ── Combobox ─────────────────────────────────────────────────────────────────

export interface ComboboxProps extends StatefulProps {
  placeholder?: string
  searchable?: boolean
  children?: Component[]
}

export function Combobox(props: ComboboxProps): ContainerComponent {
  const c = new ContainerComponent('Combobox', props)
  c.getProps = () => ({
    ...statefulProps(props),
    ...(props.placeholder && { placeholder: props.placeholder }),
    ...(props.searchable !== undefined && { searchable: props.searchable }),
  })
  return c
}

// ── ComboboxOption ───────────────────────────────────────────────────────────

export function ComboboxOption(value: string, label?: string, props?: ComponentProps): Component {
  const c = new Component('ComboboxOption', props)
  c.getProps = () => ({ value, label: label ?? value })
  return c
}

// ── ComboboxGroup ────────────────────────────────────────────────────────────

export function ComboboxGroup(props?: ContainerProps): ContainerComponent {
  return new ContainerComponent('ComboboxGroup', props)
}

// ── ComboboxLabel ────────────────────────────────────────────────────────────

export function ComboboxLabel(content: string, props?: ComponentProps): Component {
  const c = new Component('ComboboxLabel', props)
  c.getProps = () => ({ content })
  return c
}

// ── ComboboxSeparator ────────────────────────────────────────────────────────

export function ComboboxSeparator(props?: ComponentProps): Component {
  return new Component('ComboboxSeparator', props)
}

// ── Calendar ─────────────────────────────────────────────────────────────────

export interface CalendarProps extends StatefulProps {
  mode?: 'single' | 'range' | 'multiple'
  minDate?: string
  maxDate?: string
}

export function Calendar(props: CalendarProps): StatefulComponent {
  const c = new StatefulComponent('Calendar', props)
  const origGetProps = c.getProps.bind(c)
  c.getProps = () => ({
    ...origGetProps(),
    ...(props.mode && { mode: props.mode }),
    ...(props.minDate && { minDate: props.minDate }),
    ...(props.maxDate && { maxDate: props.maxDate }),
  })
  return c
}

// ── DatePicker ───────────────────────────────────────────────────────────────

export interface DatePickerProps extends StatefulProps {
  placeholder?: string
  format?: string
  minDate?: string
  maxDate?: string
}

export function DatePicker(props: DatePickerProps): StatefulComponent {
  const c = new StatefulComponent('DatePicker', props)
  const origGetProps = c.getProps.bind(c)
  c.getProps = () => ({
    ...origGetProps(),
    ...(props.placeholder && { placeholder: props.placeholder }),
    ...(props.format && { format: props.format }),
    ...(props.minDate && { minDate: props.minDate }),
    ...(props.maxDate && { maxDate: props.maxDate }),
  })
  return c
}

// ── Field ────────────────────────────────────────────────────────────────────

export function Field(props?: ContainerProps): ContainerComponent {
  return new ContainerComponent('Field', props)
}

// ── FieldTitle ───────────────────────────────────────────────────────────────

export function FieldTitle(content: RxStr, props?: ComponentProps): Component {
  const c = new Component('FieldTitle', props)
  c.getProps = () => ({ content: String(content) })
  return c
}

// ── FieldDescription ─────────────────────────────────────────────────────────

export function FieldDescription(content: RxStr, props?: ComponentProps): Component {
  const c = new Component('FieldDescription', props)
  c.getProps = () => ({ content: String(content) })
  return c
}

// ── FieldContent ─────────────────────────────────────────────────────────────

export function FieldContent(props?: ContainerProps): ContainerComponent {
  return new ContainerComponent('FieldContent', props)
}

// ── FieldError ───────────────────────────────────────────────────────────────

export function FieldError(content: RxStr, props?: ComponentProps): Component {
  const c = new Component('FieldError', props)
  c.getProps = () => ({ content: String(content) })
  return c
}

// ── ChoiceCard ───────────────────────────────────────────────────────────────

export interface ChoiceCardProps extends ContainerProps {
  value: string
  label?: string
  description?: string
  selected?: boolean
  onClick?: Action | Action[]
}

export function ChoiceCard(props: ChoiceCardProps): ContainerComponent {
  const c = new ContainerComponent('ChoiceCard', props)
  c.getProps = () => ({
    value: props.value,
    // Not stateful, so it carries its own label.
    ...(props.label && { label: props.label }),
    ...(props.description && { description: props.description }),
    ...(props.selected !== undefined && { selected: props.selected }),
    ...(props.onClick && {
      onClick: Array.isArray(props.onClick)
        ? props.onClick.map((a: Action) => a.toJSON())
        : props.onClick.toJSON(),
    }),
  })
  return c
}
