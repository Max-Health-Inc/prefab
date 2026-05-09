/**
 * Client-side actions — executed by the prefab renderer without server roundtrip.
 */

import type { Action, ActionJSON } from './types.js'
import { serializeCallbacks } from './types.js'
import { serializeValue } from '../core/component.js'

// ── SetState ─────────────────────────────────────────────────────────────────

export interface SetStateOpts {
  onSuccess?: Action | Action[]
  onError?: Action | Action[]
}

export class SetState implements Action {
  constructor(
    readonly key: string,
    readonly value: unknown,
    private readonly opts?: SetStateOpts,
  ) {}

  toJSON(): ActionJSON {
    const json: ActionJSON = {
      action: 'setState',
      key: this.key,
      value: serializeValue(this.value),
    }
    if (this.opts?.onSuccess) json.onSuccess = serializeCallbacks(this.opts.onSuccess)
    if (this.opts?.onError) json.onError = serializeCallbacks(this.opts.onError)
    return json
  }
}

// ── ToggleState ──────────────────────────────────────────────────────────────

export class ToggleState implements Action {
  constructor(readonly key: string) {}

  toJSON(): ActionJSON {
    return { action: 'toggleState', key: this.key }
  }
}

// ── AppendState ──────────────────────────────────────────────────────────────

export class AppendState implements Action {
  constructor(
    readonly key: string,
    readonly value: unknown,
    readonly index?: number,
  ) {}

  toJSON(): ActionJSON {
    const json: ActionJSON = {
      action: 'appendState',
      key: this.key,
      value: serializeValue(this.value),
    }
    if (this.index !== undefined) json.index = this.index
    return json
  }
}

// ── PopState ─────────────────────────────────────────────────────────────────

export class PopState implements Action {
  constructor(
    readonly key: string,
    readonly index: number | string,
  ) {}

  toJSON(): ActionJSON {
    return { action: 'popState', key: this.key, index: this.index }
  }
}

// ── ShowToast ────────────────────────────────────────────────────────────────

export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info'

export interface ShowToastOpts {
  description?: string
  variant?: ToastVariant
  duration?: number
}

export class ShowToast implements Action {
  constructor(
    readonly message: string,
    private readonly opts?: ShowToastOpts,
  ) {}

  toJSON(): ActionJSON {
    const json: ActionJSON = { action: 'showToast', message: this.message }
    if (this.opts?.description) json.description = this.opts.description
    if (this.opts?.variant) json.variant = this.opts.variant
    if (this.opts?.duration != null) json.duration = this.opts.duration
    return json
  }
}

// ── CloseOverlay ─────────────────────────────────────────────────────────────

export class CloseOverlay implements Action {
  toJSON(): ActionJSON {
    return { action: 'closeOverlay' }
  }
}

// ── OpenLink ─────────────────────────────────────────────────────────────────

export class OpenLink implements Action {
  constructor(
    readonly url: string,
    readonly target = '_blank',
  ) {}

  toJSON(): ActionJSON {
    return { action: 'openLink', url: this.url, target: this.target }
  }
}

// ── SetInterval ──────────────────────────────────────────────────────────────

export class SetInterval implements Action {
  constructor(
    readonly intervalMs: number,
    readonly onTick: Action | Action[],
  ) {}

  toJSON(): ActionJSON {
    return {
      action: 'setInterval',
      intervalMs: this.intervalMs,
      onTick: serializeCallbacks(this.onTick),
    }
  }
}

// ── Fetch ────────────────────────────────────────────────────────────────────

export interface FetchOpts {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: unknown
  resultKey?: string
  onSuccess?: Action | Action[]
  onError?: Action | Action[]
}

export class Fetch implements Action {
  constructor(
    readonly url: string,
    private readonly opts?: FetchOpts,
  ) {}

  toJSON(): ActionJSON {
    const json: ActionJSON = { action: 'fetch', url: this.url }
    if (this.opts?.method) json.method = this.opts.method
    if (this.opts?.headers) json.headers = this.opts.headers
    if (this.opts?.body !== undefined) json.body = serializeValue(this.opts.body)
    if (this.opts?.resultKey) json.resultKey = this.opts.resultKey
    if (this.opts?.onSuccess) json.onSuccess = serializeCallbacks(this.opts.onSuccess)
    if (this.opts?.onError) json.onError = serializeCallbacks(this.opts.onError)
    return json
  }
}

// ── OpenFilePicker ───────────────────────────────────────────────────────────

export interface OpenFilePickerOpts {
  accept?: string
  multiple?: boolean
  resultKey?: string
  onSuccess?: Action | Action[]
}

export class OpenFilePicker implements Action {
  constructor(private readonly opts?: OpenFilePickerOpts) {}

  toJSON(): ActionJSON {
    const json: ActionJSON = { action: 'openFilePicker' }
    if (this.opts?.accept) json.accept = this.opts.accept
    if (this.opts?.multiple) json.multiple = true
    if (this.opts?.resultKey) json.resultKey = this.opts.resultKey
    if (this.opts?.onSuccess) json.onSuccess = serializeCallbacks(this.opts.onSuccess)
    return json
  }
}

// ── CallHandler ──────────────────────────────────────────────────────────────

export interface CallHandlerOpts {
  arguments?: Record<string, unknown>
  resultKey?: string
  onSuccess?: Action | Action[]
  onError?: Action | Action[]
}

export class CallHandler implements Action {
  constructor(
    readonly handler: string,
    private readonly opts?: CallHandlerOpts,
  ) {}

  toJSON(): ActionJSON {
    const json: ActionJSON = { action: 'callHandler', handler: this.handler }
    if (this.opts?.arguments) json.arguments = serializeValue(this.opts.arguments)
    if (this.opts?.resultKey) json.resultKey = this.opts.resultKey
    if (this.opts?.onSuccess) json.onSuccess = serializeCallbacks(this.opts.onSuccess)
    if (this.opts?.onError) json.onError = serializeCallbacks(this.opts.onError)
    return json
  }
}

