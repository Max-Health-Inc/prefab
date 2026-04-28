/**
 * autoForm — Generates a Form from field definitions that submits to an MCP tool.
 *
 * Ported from mcp-generator-3.x display_tools.py → show_form.
 */

import { type Component, type ContainerComponent } from '../core/component.js'
import { Column } from '../components/layout/index.js'
import { Heading, Muted } from '../components/typography/index.js'
import { Card, CardContent } from '../components/card/index.js'
import { Form, Input, Button } from '../components/form/index.js'
import { CallTool } from '../actions/mcp.js'
import { ShowToast } from '../actions/client.js'
import type { Action } from '../actions/types.js'

export interface AutoFormField {
  /** Field name (used as the key in submitted data). */
  name: string
  /** Display label. Defaults to humanized name. */
  label?: string
  /** Input type: 'text', 'email', 'number', 'password', 'url', etc. */
  type?: string
  /** Placeholder text. */
  placeholder?: string
  /** Whether the field is required. */
  required?: boolean
}

export interface AutoFormOptions {
  /** Form heading. */
  title?: string
  /** Optional subtitle. */
  subtitle?: string
  /** Submit button text. Default 'Submit'. */
  submitLabel?: string
  /** Custom onSubmit action. Overrides submitTool. */
  onSubmit?: Action | Action[]
  /** Success toast message. */
  successMessage?: string
  /** Error toast message. */
  errorMessage?: string
}

/**
 * Auto-generate a Form that submits to an MCP tool.
 *
 * @example
 * ```ts
 * autoForm(
 *   [
 *     { name: 'email', label: 'Email', type: 'email', required: true },
 *     { name: 'name', label: 'Full Name', required: true },
 *   ],
 *   'create_user',
 *   { title: 'Create User', submitLabel: 'Create' },
 * )
 * ```
 */
export function autoForm(
  fields: AutoFormField[],
  submitTool: string,
  options?: AutoFormOptions,
): ContainerComponent {
  const submitLabel = options?.submitLabel ?? 'Submit'
  const successMsg = options?.successMessage ?? 'Success!'
  const errorMsg = options?.errorMessage ?? 'Something went wrong'

  const onSubmit = options?.onSubmit ?? new CallTool(submitTool, {
    onSuccess: new ShowToast(successMsg, { variant: 'success' }),
    onError: new ShowToast(errorMsg, { variant: 'error' }),
  })

  const inputComponents: Component[] = fields.map(f => Input({
    name: f.name,
    label: f.label ?? humanizeFieldName(f.name),
    ...(f.type && { inputType: f.type }),
    ...(f.placeholder && { placeholder: f.placeholder }),
    ...(f.required && { required: true }),
  }))

  const formChildren = [
    Column({ gap: 4, children: [
      ...inputComponents,
      Button(submitLabel, { submit: true, cssClass: 'w-full' }),
    ] }),
  ]

  const children: Component[] = []
  if (options?.title) children.push(Heading(options.title))
  if (options?.subtitle) children.push(Muted(options.subtitle))

  children.push(Card({ children: [
    CardContent({ cssClass: 'py-4', children: [
      Form({ onSubmit, children: formChildren }),
    ] }),
  ] }))

  return Column({ gap: 5, cssClass: 'p-6 max-w-2xl', children })
}

// ── QuickForm — Composable builder ──────────────────────────────────────────

/**
 * Chainable form builder for rapid MCP tool UI generation.
 *
 * @example
 * ```ts
 * const ui = QuickForm('create_user')
 *   .title('Create User')
 *   .text('name', { required: true })
 *   .email('email', { required: true })
 *   .submit('Create')
 *   .build()
 * ```
 */
export class QuickFormBuilder {
  private _fields: AutoFormField[] = []
  private _title?: string
  private _subtitle?: string
  private _submitLabel = 'Submit'
  private _onSubmit?: Action | Action[]
  private _successMessage?: string
  private _errorMessage?: string
  private _toolName: string

  constructor(toolName: string) {
    this._toolName = toolName
  }

  title(t: string): this { this._title = t; return this }
  subtitle(s: string): this { this._subtitle = s; return this }
  submit(label: string): this { this._submitLabel = label; return this }
  onSubmit(action: Action | Action[]): this { this._onSubmit = action; return this }
  successMessage(msg: string): this { this._successMessage = msg; return this }
  errorMessage(msg: string): this { this._errorMessage = msg; return this }

  /** Add a field with explicit type. */
  field(name: string, opts?: Omit<AutoFormField, 'name'>): this {
    this._fields.push({ name, ...opts })
    return this
  }

  /** Shorthand for type: 'text'. */
  text(name: string, opts?: Omit<AutoFormField, 'name' | 'type'>): this {
    return this.field(name, { ...opts, type: 'text' })
  }

  /** Shorthand for type: 'email'. */
  email(name: string, opts?: Omit<AutoFormField, 'name' | 'type'>): this {
    return this.field(name, { ...opts, type: 'email' })
  }

  /** Shorthand for type: 'number'. */
  number(name: string, opts?: Omit<AutoFormField, 'name' | 'type'>): this {
    return this.field(name, { ...opts, type: 'number' })
  }

  /** Shorthand for type: 'password'. */
  password(name: string, opts?: Omit<AutoFormField, 'name' | 'type'>): this {
    return this.field(name, { ...opts, type: 'password' })
  }

  /** Shorthand for type: 'url'. */
  url(name: string, opts?: Omit<AutoFormField, 'name' | 'type'>): this {
    return this.field(name, { ...opts, type: 'url' })
  }

  /** Shorthand for type: 'tel'. */
  tel(name: string, opts?: Omit<AutoFormField, 'name' | 'type'>): this {
    return this.field(name, { ...opts, type: 'tel' })
  }

  /** Build the form component tree. */
  build(): ContainerComponent {
    return autoForm(this._fields, this._toolName, {
      title: this._title,
      subtitle: this._subtitle,
      submitLabel: this._submitLabel,
      onSubmit: this._onSubmit,
      successMessage: this._successMessage,
      errorMessage: this._errorMessage,
    })
  }
}

/** Factory function for the chainable QuickForm builder. */
export function QuickForm(toolName: string): QuickFormBuilder {
  return new QuickFormBuilder(toolName)
}

function humanizeFieldName(name: string): string {
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]/g, ' ')
    .trim()
    .replace(/^\w/, c => c.toUpperCase())
}
