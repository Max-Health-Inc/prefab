/**
 * Subscribe action — declarative real-time resource subscriptions with polling fallback.
 *
 * Enables server→client push via MCP resource subscriptions when the host supports it.
 * Automatically falls back to SetInterval + CallTool polling otherwise.
 */

import type { Action, ActionJSON } from './types.js'
import { serializeCallbacks } from './types.js'
import { serializeValue } from '../core/component.js'

export interface SubscribeOpts {
  /** Reactive store key where incoming data is written. */
  stateKey: string
  /** Poll interval (ms) when the host does not support push subscriptions. Defaults to 2000. */
  fallbackInterval?: number
  /** Tool to call when polling in fallback mode. */
  fallbackTool?: string
  /** Arguments passed to the fallback tool call. */
  fallbackArgs?: Record<string, unknown>
  /** Action(s) executed whenever new data arrives (push or poll). */
  onData?: Action | Action[]
  /** Action(s) executed on subscription or poll error. */
  onError?: Action | Action[]
}

/**
 * Subscribe to a resource URI for real-time updates.
 *
 * When the host supports MCP resource subscriptions (`capabilities.subscriptions`),
 * the renderer uses push notifications via the bridge. Otherwise it falls back to
 * periodic polling using `SetInterval` + `CallTool`.
 *
 * @example
 * ```ts
 * new Subscribe('chess://game/abc123', {
 *   stateKey: '$game',
 *   fallbackInterval: 2000,
 *   fallbackTool: '_action',
 *   fallbackArgs: { action: 'refresh' },
 *   onData: new ShowToast('Game updated', { variant: 'info' }),
 * })
 * ```
 */
export class Subscribe implements Action {
  constructor(
    readonly uri: string,
    private readonly opts: SubscribeOpts,
  ) {}

  toJSON(): ActionJSON {
    const json: ActionJSON = {
      action: 'subscribe',
      uri: this.uri,
      state_key: this.opts.stateKey,
    }
    if (this.opts.fallbackInterval != null) json.fallback_interval = this.opts.fallbackInterval
    if (this.opts.fallbackTool) json.fallback_tool = this.opts.fallbackTool
    if (this.opts.fallbackArgs) json.fallback_args = serializeValue(this.opts.fallbackArgs)
    if (this.opts.onData) json.on_data = serializeCallbacks(this.opts.onData)
    if (this.opts.onError) json.on_error = serializeCallbacks(this.opts.onError)
    return json
  }
}

/**
 * Unsubscribe from a previously subscribed resource URI.
 *
 * Typically used in cleanup or when navigating away from a view.
 * The renderer also automatically unsubscribes on destroy.
 */
export class Unsubscribe implements Action {
  constructor(readonly uri: string) {}

  toJSON(): ActionJSON {
    return { action: 'unsubscribe', uri: this.uri }
  }
}
