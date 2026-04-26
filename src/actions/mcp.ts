/**
 * MCP transport actions — require server roundtrip via MCP protocol.
 */

import type { Action, ActionJSON } from './types.js'
import { serializeCallbacks } from './types.js'
import { serializeValue } from '../core/component.js'

// ── CallTool ─────────────────────────────────────────────────────────────────

export interface CallToolOpts {
  arguments?: Record<string, unknown>
  resultKey?: string
  onSuccess?: Action | Action[]
  onError?: Action | Action[]
}

/**
 * Invoke an MCP tool from the UI.
 * Used in Form.onSubmit or Button.onClick to call backend tools.
 */
export class CallTool implements Action {
  constructor(
    readonly tool: string,
    private readonly opts?: CallToolOpts,
  ) {}

  toJSON(): ActionJSON {
    const json: ActionJSON = { action: 'toolCall', tool: this.tool }
    if (this.opts?.arguments) json.arguments = serializeValue(this.opts.arguments)
    if (this.opts?.resultKey) json.resultKey = this.opts.resultKey
    if (this.opts?.onSuccess) json.onSuccess = serializeCallbacks(this.opts.onSuccess)
    if (this.opts?.onError) json.onError = serializeCallbacks(this.opts.onError)
    return json
  }
}

// ── SendMessage ──────────────────────────────────────────────────────────────

export class SendMessage implements Action {
  constructor(readonly message: string) {}

  toJSON(): ActionJSON {
    return { action: 'sendMessage', message: this.message }
  }
}

// ── UpdateContext ─────────────────────────────────────────────────────────────

export class UpdateContext implements Action {
  constructor(readonly context: Record<string, unknown>) {}

  toJSON(): ActionJSON {
    return { action: 'updateContext', context: serializeValue(this.context) as Record<string, unknown> }
  }
}

// ── RequestDisplayMode ───────────────────────────────────────────────────────

export type DisplayMode = 'inline' | 'fullscreen' | 'pip'

export class RequestDisplayMode implements Action {
  constructor(readonly mode: DisplayMode) {}

  toJSON(): ActionJSON {
    return { action: 'requestDisplayMode', mode: this.mode }
  }
}
