/**
 * Bridge protocol — PostMessage-based communication between a prefab app
 * (running in an iframe) and its host (the parent window).
 *
 * Protocol messages use a `prefab:` namespace prefix.
 * The bridge auto-detects whether it's running inside an iframe.
 *
 * Message flow:
 *   App  → Host: prefab:init, prefab:tool-call, prefab:send-message,
 *                 prefab:request-mode, prefab:open-link
 *   Host → App:  prefab:init-response, prefab:tool-input, prefab:tool-result,
 *                 prefab:tool-cancelled, prefab:theme-update, prefab:state-update
 */

import type { McpTransport } from './actions.js'

// ── Protocol Types ───────────────────────────────────────────────────────────

/** All message types the app can send to the host. */
export type AppMessageType =
  | 'prefab:init'
  | 'prefab:tool-call'
  | 'prefab:tool-call-result'
  | 'prefab:send-message'
  | 'prefab:request-mode'
  | 'prefab:open-link'
  | 'prefab:update-context'

/** All message types the host can send to the app. */
export type HostMessageType =
  | 'prefab:init-response'
  | 'prefab:tool-input'
  | 'prefab:tool-input-partial'
  | 'prefab:tool-result'
  | 'prefab:tool-cancelled'
  | 'prefab:theme-update'
  | 'prefab:state-update'

/** Base message shape for all bridge messages. */
export interface BridgeMessage<T extends string = string> {
  type: T
  id?: string
  payload?: Record<string, unknown>
}

/** Capabilities the app advertises during init. */
export interface AppCapabilities {
  /** Whether the app supports receiving tool input. */
  toolInput?: boolean
  /** Whether the app supports partial/streaming input. */
  partialInput?: boolean
  /** Display modes the app supports. */
  displayModes?: DisplayMode[]
  /** Wire format version. */
  version?: string
}

/** Capabilities the host advertises in its init response. */
export interface HostCapabilities {
  /** Whether the host supports toast notifications. */
  toast?: boolean
  /** Whether the host supports clipboard operations. */
  clipboard?: boolean
  /** Whether the host supports navigation / link opening. */
  navigation?: boolean
  /** Whether the host supports display mode changes. */
  displayModes?: DisplayMode[]
  /** Whether the host supports sending messages. */
  messaging?: boolean
}

/** Display mode options. */
export type DisplayMode = 'inline' | 'fullscreen' | 'pip'

/** Host context received during initialization. */
export interface HostContext {
  /** Host application name. */
  hostName?: string
  /** Host application version. */
  hostVersion?: string
  /** Negotiated capabilities. */
  capabilities: HostCapabilities
  /** Theme CSS variables from the host. */
  theme?: HostTheme
  /** Initial tool input args (if the host triggers tool execution). */
  toolInput?: Record<string, unknown>
  /** Arbitrary host metadata. */
  meta?: Record<string, unknown>
}

/** Theme from the host — CSS custom property map. */
export interface HostTheme {
  /** CSS variables as key-value pairs (without `--` prefix). */
  variables?: Record<string, string>
  /** Color scheme hint. */
  colorScheme?: 'light' | 'dark' | 'auto'
}

// ── Pending call tracking ────────────────────────────────────────────────────

interface PendingCall {
  resolve: (value: unknown) => void
  reject: (error: Error) => void
}

// ── Bridge Class ─────────────────────────────────────────────────────────────

export class Bridge {
  private hostOrigin: string
  private pending = new Map<string, PendingCall>()
  private listeners = new Map<string, Set<(payload: Record<string, unknown>) => void>>()
  private callIdCounter = 0
  private cleanup: (() => void) | undefined

  constructor(
    /** Allowed origin for postMessage. Use '*' only in dev. */
    hostOrigin = '*',
  ) {
    this.hostOrigin = hostOrigin
  }

  /** Start listening for messages from the host. */
  connect(): void {
    if (typeof window === 'undefined') return

    const handler = (event: MessageEvent): void => {
      if (this.hostOrigin !== '*' && event.origin !== this.hostOrigin) return
      const msg = event.data as BridgeMessage | undefined
      if (!msg?.type.startsWith('prefab:')) return

      // Resolve pending tool-call promises
      if (msg.type === 'prefab:tool-call-response' && msg.id) {
        const pending = this.pending.get(msg.id)
        if (pending) {
          this.pending.delete(msg.id)
          if (msg.payload?.error != null) {
            pending.reject(new Error(msg.payload.error as string))
          } else {
            pending.resolve(msg.payload?.result)
          }
          return
        }
      }

      // Dispatch to registered listeners
      const handlers = this.listeners.get(msg.type)
      if (handlers) {
        for (const fn of handlers) fn(msg.payload ?? {})
      }
    }

    window.addEventListener('message', handler)
    this.cleanup = () => window.removeEventListener('message', handler)
  }

  /** Send the init handshake to the host. Returns host context. */
  async initialize(appCapabilities: AppCapabilities): Promise<HostContext> {
    return new Promise<HostContext>((resolve) => {
      // Listen for init response (one-shot)
      const onResponse = (payload: Record<string, unknown>): void => {
        this.off('prefab:init-response', onResponse)
        resolve(payload as unknown as HostContext)
      }
      this.on('prefab:init-response', onResponse)

      // Send init
      this.send('prefab:init', { capabilities: appCapabilities })

      // Timeout: resolve with defaults if host doesn't respond
      setTimeout(() => {
        this.off('prefab:init-response', onResponse)
        resolve({ capabilities: {} })
      }, 3000)
    })
  }

  /** Create an McpTransport that routes through the bridge. */
  createTransport(): McpTransport {
    return {
      callTool: (name: string, args: Record<string, unknown>): Promise<unknown> => {
        const id = `tc-${++this.callIdCounter}`
        return new Promise((resolve, reject) => {
          this.pending.set(id, { resolve, reject })
          this.send('prefab:tool-call', { tool: name, arguments: args }, id)

          // Timeout after 30s
          setTimeout(() => {
            if (this.pending.has(id)) {
              this.pending.delete(id)
              reject(new Error(`Tool call '${name}' timed out`))
            }
          }, 30000)
        })
      },
      sendMessage: (message: string): Promise<void> => {
        this.send('prefab:send-message', { message })
        return Promise.resolve()
      },
    }
  }

  /** Request a display mode change from the host. */
  requestMode(mode: DisplayMode): void {
    this.send('prefab:request-mode', { mode })
  }

  /** Request the host to open a URL. */
  openLink(url: string, target?: string): void {
    this.send('prefab:open-link', { url, target })
  }

  /** Send context updates to the host. */
  updateContext(context: Record<string, unknown>): void {
    this.send('prefab:update-context', { context })
  }

  /** Register a handler for a host message type. */
  on(type: string, handler: (payload: Record<string, unknown>) => void): void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set())
    }
    const set = this.listeners.get(type)
    if (set != null) {
      set.add(handler)
    }
  }

  /** Remove a handler. */
  off(type: string, handler: (payload: Record<string, unknown>) => void): void {
    this.listeners.get(type)?.delete(handler)
  }

  /** Disconnect and clean up all listeners. */
  disconnect(): void {
    this.cleanup?.()
    this.listeners.clear()
    for (const [, pending] of this.pending) {
      pending.reject(new Error('Bridge disconnected'))
    }
    this.pending.clear()
  }

  /** Send a message to the host (parent window). */
  private send(type: string, payload?: Record<string, unknown>, id?: string): void {
    if (typeof window === 'undefined') return
    const target = window.parent !== window ? window.parent : window
    const msg: BridgeMessage = { type, payload, id }
    target.postMessage(msg, this.hostOrigin)
  }
}

// ── Host Theme → CSS Variables ───────────────────────────────────────────────

/**
 * Apply host theme CSS variables to a root element.
 * Host variables are set as `--{key}: value` on the element.
 */
export function applyHostTheme(root: HTMLElement, hostTheme: HostTheme): void {
  if (hostTheme.variables) {
    for (const [key, value] of Object.entries(hostTheme.variables)) {
      root.style.setProperty(key.startsWith('--') ? key : `--${key}`, value)
    }
  }

  if (hostTheme.colorScheme && hostTheme.colorScheme !== 'auto') {
    root.setAttribute('data-theme', hostTheme.colorScheme)
  }
}

// ── Environment Detection ────────────────────────────────────────────────────

/** Check if we're running inside an iframe. */
export function isIframe(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return window.self !== window.top
  } catch {
    // Cross-origin: we're definitely in an iframe
    return true
  }
}
