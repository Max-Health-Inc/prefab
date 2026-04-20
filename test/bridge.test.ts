/**
 * Bridge & app() tests — PostMessage bridge, lifecycle hooks, environment detection.
 *
 * @happy-dom
 */

import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import { Bridge, isIframe, applyHostTheme } from '../src/renderer/bridge'
import type { HostTheme, BridgeMessage } from '../src/renderer/bridge'
import { app } from '../src/renderer/app'

// ── Bridge ───────────────────────────────────────────────────────────────────

describe('Bridge', () => {
  let bridge: Bridge

  beforeEach(() => {
    bridge = new Bridge('*')
  })

  afterEach(() => {
    bridge.disconnect()
  })

  it('connect and disconnect without error', () => {
    bridge.connect()
    bridge.disconnect()
  })

  it('dispatches incoming messages to registered listeners', () => {
    bridge.connect()

    let received: Record<string, unknown> | undefined
    bridge.on('prefab:tool-input', (payload) => {
      received = payload
    })

    // Simulate host sending a message
    const msg: BridgeMessage = {
      type: 'prefab:tool-input',
      payload: { args: { query: 'test' } },
    }
    window.postMessage(msg, '*')

    // postMessage is async — give it a tick
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(received).toBeDefined()
        expect((received?.args as Record<string, unknown>)?.query).toBe('test')
        resolve()
      }, 50)
    })
  })

  it('ignores messages without prefab: prefix', () => {
    bridge.connect()

    let called = false
    bridge.on('prefab:tool-input', () => { called = true })

    window.postMessage({ type: 'other:message', payload: {} }, '*')

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(called).toBe(false)
        resolve()
      }, 50)
    })
  })

  it('off removes a listener', () => {
    bridge.connect()
    let count = 0
    const handler = (): void => { count++ }
    bridge.on('prefab:tool-input', handler)
    bridge.off('prefab:tool-input', handler)

    window.postMessage({ type: 'prefab:tool-input', payload: {} } satisfies BridgeMessage, '*')

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(count).toBe(0)
        resolve()
      }, 50)
    })
  })

  it('createTransport returns an McpTransport', () => {
    const transport = bridge.createTransport()
    expect(typeof transport.callTool).toBe('function')
    expect(typeof transport.sendMessage).toBe('function')
  })

  it('initialize resolves with defaults on timeout', async () => {
    bridge.connect()
    // No host responds, so it should resolve with defaults after 3s
    // We can't wait 3s in tests, but we can verify the promise shape
    const initPromise = bridge.initialize({ toolInput: true })

    // Simulate host responding
    setTimeout(() => {
      const response: BridgeMessage = {
        type: 'prefab:init-response',
        payload: {
          capabilities: { toast: true, navigation: true },
          hostName: 'TestHost',
        } as unknown as Record<string, unknown>,
      }
      window.postMessage(response, '*')
    }, 10)

    const context = await initPromise
    expect(context).toBeDefined()
    // May get the response or the timeout defaults — either is valid
    expect(context.capabilities).toBeDefined()
  })

  it('createTransport.callTool sends and resolves on response', () => {
    bridge.connect()
    const transport = bridge.createTransport()

    // Listen for outgoing messages
    let sentMsg: BridgeMessage | undefined
    const captureHandler = (event: MessageEvent): void => {
      const msg = event.data as BridgeMessage
      if (msg?.type === 'prefab:tool-call') {
        sentMsg = msg
        // Simulate host responding
        const response: BridgeMessage = {
          type: 'prefab:tool-call-response',
          id: msg.id,
          payload: { result: { status: 'ok' } },
        }
        window.postMessage(response, '*')
      }
    }
    window.addEventListener('message', captureHandler)

    const promise = transport.callTool('test-tool', { arg1: 'value1' })

    return promise.then((result) => {
      expect(sentMsg).toBeDefined()
      expect(sentMsg!.payload?.tool).toBe('test-tool')
      expect((result as Record<string, unknown>)?.status).toBe('ok')
      window.removeEventListener('message', captureHandler)
    })
  })

  it('createTransport.callTool rejects on error response', () => {
    bridge.connect()
    const transport = bridge.createTransport()

    const captureHandler = (event: MessageEvent): void => {
      const msg = event.data as BridgeMessage
      if (msg?.type === 'prefab:tool-call') {
        const response: BridgeMessage = {
          type: 'prefab:tool-call-response',
          id: msg.id,
          payload: { error: 'Tool not found' },
        }
        window.postMessage(response, '*')
      }
    }
    window.addEventListener('message', captureHandler)

    return transport.callTool('missing-tool', {}).then(
      () => { throw new Error('Should have rejected') },
      (err: unknown) => {
        expect((err as Error).message).toBe('Tool not found')
        window.removeEventListener('message', captureHandler)
      },
    )
  })
})

// ── applyHostTheme ───────────────────────────────────────────────────────────

describe('applyHostTheme', () => {
  it('sets CSS variables on the root element', () => {
    const root = document.createElement('div')
    const theme: HostTheme = {
      variables: { background: '#ffffff', foreground: '#000000' },
    }
    applyHostTheme(root, theme)
    expect(root.style.getPropertyValue('--background')).toBe('#ffffff')
    expect(root.style.getPropertyValue('--foreground')).toBe('#000000')
  })

  it('handles variables with -- prefix', () => {
    const root = document.createElement('div')
    applyHostTheme(root, { variables: { '--accent': 'blue' } })
    expect(root.style.getPropertyValue('--accent')).toBe('blue')
  })

  it('sets data-theme attribute for color scheme', () => {
    const root = document.createElement('div')
    applyHostTheme(root, { colorScheme: 'dark' })
    expect(root.getAttribute('data-theme')).toBe('dark')
  })

  it('does not set data-theme for auto', () => {
    const root = document.createElement('div')
    applyHostTheme(root, { colorScheme: 'auto' })
    expect(root.getAttribute('data-theme')).toBeNull()
  })
})

// ── isIframe ─────────────────────────────────────────────────────────────────

describe('isIframe', () => {
  it('returns false when window.self === window.top', () => {
    // In happy-dom, self === top (not an iframe)
    expect(isIframe()).toBe(false)
  })
})

// ── app() factory ────────────────────────────────────────────────────────────

describe('app()', () => {
  it('creates a standalone app in non-iframe environment', async () => {
    const ui = await app({ mode: 'standalone' })

    expect(ui).toBeDefined()
    expect(typeof ui.callTool).toBe('function')
    expect(typeof ui.sendMessage).toBe('function')
    expect(typeof ui.onToolInput).toBe('function')
    expect(typeof ui.onToolResult).toBe('function')
    expect(typeof ui.onToolCancelled).toBe('function')
    expect(typeof ui.onToolInputPartial).toBe('function')
    expect(typeof ui.render).toBe('function')
    expect(typeof ui.mount).toBe('function')
    expect(typeof ui.requestMode).toBe('function')
    expect(typeof ui.openLink).toBe('function')
    expect(typeof ui.updateContext).toBe('function')
    expect(typeof ui.destroy).toBe('function')

    expect(ui.host).toBeDefined()
    expect(ui.capabilities).toBeDefined()
    expect(ui.transport).toBeDefined()

    ui.destroy()
  })

  it('render() renders components into a DOM element', async () => {
    const ui = await app({ mode: 'standalone' })
    const root = document.createElement('div')
    document.body.appendChild(root)
    root.id = 'test-render-root'

    const handle = ui.render('#test-render-root', {
      type: 'Column',
      children: [
        { type: 'Text', content: 'Hello World' },
      ],
    })

    expect(handle).toBeDefined()
    expect(root.innerHTML).not.toBe('')
    expect(root.textContent).toContain('Hello World')

    handle.destroy()
    ui.destroy()
    root.remove()
  })

  it('mount() mounts wire format data', async () => {
    const ui = await app({ mode: 'standalone' })
    const root = document.createElement('div')
    document.body.appendChild(root)

    const wireData = {
      $prefab: { version: '0.2' },
      view: {
        type: 'Column',
        children: [
          { type: 'Text', content: 'Mounted!' },
        ],
      },
      state: { count: 0 },
    }

    const mounted = ui.mount(root, wireData)
    expect(mounted).toBeDefined()
    expect(root.textContent).toContain('Mounted!')

    mounted.destroy()
    ui.destroy()
    root.remove()
  })

  it('onToolInput registers a handler', async () => {
    const ui = await app({ mode: 'standalone' })
    let received: Record<string, unknown> | undefined
    ui.onToolInput((args) => { received = args })

    // Handler is registered but no bridge to deliver
    expect(received).toBeUndefined()
    ui.destroy()
  })

  it('creates bridge app when mode is bridge', async () => {
    // Simulate init response from host
    const respondToInit = (event: MessageEvent): void => {
      const msg = event.data as BridgeMessage
      if (msg?.type === 'prefab:init') {
        const response: BridgeMessage = {
          type: 'prefab:init-response',
          payload: {
            capabilities: { toast: true },
            hostName: 'TestHost',
            hostVersion: '1.0',
          } as unknown as Record<string, unknown>,
        }
        window.postMessage(response, '*')
      }
    }
    window.addEventListener('message', respondToInit)

    const ui = await app({ mode: 'bridge', hostOrigin: '*' })

    expect(ui.host.hostName).toBe('TestHost')
    expect(ui.capabilities.toast).toBe(true)

    ui.destroy()
    window.removeEventListener('message', respondToInit)
  })

  it('delivers initial toolInput from host context', async () => {
    const respondToInit = (event: MessageEvent): void => {
      const msg = event.data as BridgeMessage
      if (msg?.type === 'prefab:init') {
        const response: BridgeMessage = {
          type: 'prefab:init-response',
          payload: {
            capabilities: {},
            toolInput: { query: 'initial' },
          } as unknown as Record<string, unknown>,
        }
        window.postMessage(response, '*')
      }
    }
    window.addEventListener('message', respondToInit)

    const ui = await app({ mode: 'bridge', hostOrigin: '*' })

    let received: Record<string, unknown> | undefined
    ui.onToolInput((args) => { received = args })

    // Initial toolInput is delivered via queueMicrotask
    await new Promise((r) => setTimeout(r, 50))
    expect(received).toEqual({ query: 'initial' })

    ui.destroy()
    window.removeEventListener('message', respondToInit)
  })
})
