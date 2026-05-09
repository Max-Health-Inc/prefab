/**
 * Subscribe action tests — covers Subscribe/Unsubscribe action classes,
 * renderer dispatch (push + polling fallback), and cleanup.
 *
 * @happy-dom
 */

import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import { Store } from '../src/renderer/state'
import { dispatchActions, clearAllIntervals, clearAllSubscriptions } from '../src/renderer/actions'
import type { DispatchContext, ToastEvent, McpTransport } from '../src/renderer/actions'
import { Subscribe, Unsubscribe } from '../src/actions/subscribe'

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeCtx(
  state?: Record<string, unknown>,
  transport?: McpTransport,
): DispatchContext & { rerendered: number; toasts: ToastEvent[] } {
  const ctx = {
    store: new Store(state),
    transport,
    rerender: () => { ctx.rerendered++ },
    onToast: (t: ToastEvent) => ctx.toasts.push(t),
    rerendered: 0,
    toasts: [] as ToastEvent[],
  }
  return ctx
}

function mockTransport(result: unknown = { ok: true }): McpTransport & {
  calls: { name: string; args: Record<string, unknown> }[]
  messages: string[]
} {
  const t = {
    calls: [] as { name: string; args: Record<string, unknown> }[],
    messages: [] as string[],
    callTool: (name: string, args: Record<string, unknown>) => {
      t.calls.push({ name, args })
      return Promise.resolve(result)
    },
    sendMessage: (msg: string) => {
      t.messages.push(msg)
      return Promise.resolve()
    },
  }
  return t
}

function mockSubscriptionTransport(): McpTransport & {
  calls: { name: string; args: Record<string, unknown> }[]
  subscriptions: Map<string, (data: unknown) => void>
  unsubscribedUris: string[]
} {
  const t = {
    calls: [] as { name: string; args: Record<string, unknown> }[],
    subscriptions: new Map<string, (data: unknown) => void>(),
    unsubscribedUris: [] as string[],
    callTool: (name: string, args: Record<string, unknown>) => {
      t.calls.push({ name, args })
      return Promise.resolve({ ok: true })
    },
    sendMessage: () => Promise.resolve(),
    subscribe: (uri: string, onData: (data: unknown) => void): (() => void) => {
      t.subscriptions.set(uri, onData)
      return () => {
        t.subscriptions.delete(uri)
        t.unsubscribedUris.push(uri)
      }
    },
    capabilities: { subscriptions: true },
  }
  return t
}

// ── Subscribe action class ───────────────────────────────────────────────────

describe('Subscribe action class', () => {
  it('serializes with required fields', () => {
    const action = new Subscribe('chess://game/abc', { stateKey: '$game' })
    expect(action.toJSON()).toEqual({
      action: 'subscribe',
      uri: 'chess://game/abc',
      state_key: '$game',
    })
  })

  it('serializes with all optional fields', () => {
    const action = new Subscribe('chess://game/abc', {
      stateKey: '$game',
      fallbackInterval: 2000,
      fallbackTool: '_action',
      fallbackArgs: { action: 'refresh' },
    })
    const json = action.toJSON()
    expect(json.action).toBe('subscribe')
    expect(json.uri).toBe('chess://game/abc')
    expect(json.state_key).toBe('$game')
    expect(json.fallback_interval).toBe(2000)
    expect(json.fallback_tool).toBe('_action')
    expect(json.fallback_args).toEqual({ action: 'refresh' })
  })

  it('serializes onData callback', () => {
    const { ShowToast } = require('../src/actions/client')
    const action = new Subscribe('data://stream', {
      stateKey: '$data',
      onData: new ShowToast('Updated'),
    })
    const json = action.toJSON()
    expect(json.on_data).toEqual({ action: 'showToast', message: 'Updated' })
  })

  it('serializes onError callback', () => {
    const { ShowToast } = require('../src/actions/client')
    const action = new Subscribe('data://stream', {
      stateKey: '$data',
      onError: new ShowToast('Error', { variant: 'error' }),
    })
    const json = action.toJSON()
    expect(json.on_error).toEqual({ action: 'showToast', message: 'Error', variant: 'error' })
  })
})

// ── Unsubscribe action class ─────────────────────────────────────────────────

describe('Unsubscribe action class', () => {
  it('serializes correctly', () => {
    const action = new Unsubscribe('chess://game/abc')
    expect(action.toJSON()).toEqual({
      action: 'unsubscribe',
      uri: 'chess://game/abc',
    })
  })
})

// ── Subscribe dispatch — push path ───────────────────────────────────────────

describe('subscribe action dispatch — push path', () => {
  beforeEach(() => { clearAllSubscriptions() })
  afterEach(() => { clearAllSubscriptions() })

  it('uses transport.subscribe when host supports subscriptions', async () => {
    const transport = mockSubscriptionTransport()
    const ctx = makeCtx({}, transport)

    await dispatchActions({
      action: 'subscribe',
      uri: 'chess://game/abc',
      stateKey: '$game',
    }, ctx)

    expect(transport.subscriptions.has('chess://game/abc')).toBe(true)
  })

  it('stores push data in the state store and re-renders', async () => {
    const transport = mockSubscriptionTransport()
    const ctx = makeCtx({}, transport)

    await dispatchActions({
      action: 'subscribe',
      uri: 'chess://game/abc',
      stateKey: '$game',
    }, ctx)

    // Simulate push notification
    const onData = transport.subscriptions.get('chess://game/abc')!
    onData({ fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR', turn: 'white' })

    expect(ctx.store.get('$game')).toEqual({
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
      turn: 'white',
    })
    expect(ctx.rerendered).toBe(1)
  })

  it('runs onData callbacks on push', async () => {
    const transport = mockSubscriptionTransport()
    const ctx = makeCtx({}, transport)

    await dispatchActions({
      action: 'subscribe',
      uri: 'chess://game/abc',
      stateKey: '$game',
      onData: { action: 'showToast', message: 'Updated!' },
    }, ctx)

    const onData = transport.subscriptions.get('chess://game/abc')!
    onData({ fen: 'new-fen' })

    // Wait for async callbacks
    await new Promise(r => setTimeout(r, 10))
    expect(ctx.toasts).toHaveLength(1)
    expect(ctx.toasts[0].message).toBe('Updated!')
  })

  it('prevents duplicate subscriptions to the same URI', async () => {
    const transport = mockSubscriptionTransport()
    const ctx = makeCtx({}, transport)

    await dispatchActions({
      action: 'subscribe',
      uri: 'chess://game/abc',
      stateKey: '$game',
    }, ctx)

    await dispatchActions({
      action: 'subscribe',
      uri: 'chess://game/abc',
      stateKey: '$game2',
    }, ctx)

    // Should still have only one subscription
    expect(transport.subscriptions.size).toBe(1)
  })

  it('allows different URIs', async () => {
    const transport = mockSubscriptionTransport()
    const ctx = makeCtx({}, transport)

    await dispatchActions({
      action: 'subscribe',
      uri: 'chess://game/abc',
      stateKey: '$game1',
    }, ctx)

    await dispatchActions({
      action: 'subscribe',
      uri: 'chess://game/xyz',
      stateKey: '$game2',
    }, ctx)

    expect(transport.subscriptions.size).toBe(2)
  })
})

// ── Subscribe dispatch — polling fallback path ───────────────────────────────

describe('subscribe action dispatch — polling fallback', () => {
  beforeEach(() => { clearAllSubscriptions(); clearAllIntervals() })
  afterEach(() => { clearAllSubscriptions(); clearAllIntervals() })

  it('falls back to polling when transport lacks subscription support', async () => {
    const transport = mockTransport({ fen: 'new-position', turn: 'black' })
    const ctx = makeCtx({}, transport)

    await dispatchActions({
      action: 'subscribe',
      uri: 'chess://game/abc',
      stateKey: '$game',
      fallbackInterval: 100,
      fallbackTool: '_action',
      fallbackArgs: { action: 'refresh' },
    }, ctx)

    // Wait for at least one poll cycle
    await new Promise(r => setTimeout(r, 150))
    clearAllSubscriptions()

    expect(transport.calls.length).toBeGreaterThan(0)
    expect(transport.calls[0].name).toBe('_action')
    expect(transport.calls[0].args).toEqual({ action: 'refresh' })
    expect(ctx.store.get('$game')).toEqual({ fen: 'new-position', turn: 'black' })
    expect(ctx.rerendered).toBeGreaterThan(0)
  })

  it('enforces minimum interval of 100ms for fallback polling', async () => {
    const transport = mockTransport({ ok: true })
    const ctx = makeCtx({}, transport)

    await dispatchActions({
      action: 'subscribe',
      uri: 'chess://game/abc',
      stateKey: '$game',
      fallbackInterval: 10,  // Below minimum
      fallbackTool: '_action',
      fallbackArgs: {},
    }, ctx)

    // Wait 50ms — should NOT have fired if minimum is 100ms
    await new Promise(r => setTimeout(r, 50))
    clearAllSubscriptions()
    expect(transport.calls.length).toBe(0)
  })

  it('defaults fallback interval to 2000ms', async () => {
    const transport = mockTransport({ ok: true })
    const ctx = makeCtx({}, transport)

    await dispatchActions({
      action: 'subscribe',
      uri: 'chess://game/abc',
      stateKey: '$game',
      fallbackTool: '_action',
    }, ctx)

    // After 100ms there should be no calls (default is 2000ms)
    await new Promise(r => setTimeout(r, 100))
    clearAllSubscriptions()
    expect(transport.calls.length).toBe(0)
  })

  it('warns when no fallbackTool and host lacks subscriptions', async () => {
    const transport = mockTransport()
    const ctx = makeCtx({}, transport)
    const warns: string[] = []
    const origWarn = console.warn
    console.warn = (msg: string) => warns.push(msg)

    await dispatchActions({
      action: 'subscribe',
      uri: 'chess://game/abc',
      stateKey: '$game',
    }, ctx)

    console.warn = origWarn
    expect(warns.some(w => w.includes('fallbackTool'))).toBe(true)
  })

  it('warns when no transport available', async () => {
    const ctx = makeCtx({})
    const warns: string[] = []
    const origWarn = console.warn
    console.warn = (msg: string) => warns.push(msg)

    await dispatchActions({
      action: 'subscribe',
      uri: 'chess://game/abc',
      stateKey: '$game',
      fallbackTool: '_action',
    }, ctx)

    console.warn = origWarn
    expect(warns.some(w => w.includes('No MCP transport'))).toBe(true)
  })

  it('runs onError callbacks on poll failure', async () => {
    const transport = {
      ...mockTransport(),
      callTool: () => Promise.reject(new Error('Network error')),
    }
    const ctx = makeCtx({}, transport)

    await dispatchActions({
      action: 'subscribe',
      uri: 'chess://game/abc',
      stateKey: '$game',
      fallbackInterval: 100,
      fallbackTool: '_action',
      onError: { action: 'showToast', message: 'Poll failed', variant: 'error' },
    }, ctx)

    await new Promise(r => setTimeout(r, 150))
    clearAllSubscriptions()
    expect(ctx.toasts.length).toBeGreaterThan(0)
    expect(ctx.toasts[0].message).toBe('Poll failed')
  })
})

// ── Unsubscribe dispatch ─────────────────────────────────────────────────────

describe('unsubscribe action dispatch', () => {
  beforeEach(() => { clearAllSubscriptions() })
  afterEach(() => { clearAllSubscriptions() })

  it('cleans up push subscription', async () => {
    const transport = mockSubscriptionTransport()
    const ctx = makeCtx({}, transport)

    await dispatchActions({
      action: 'subscribe',
      uri: 'chess://game/abc',
      stateKey: '$game',
    }, ctx)

    expect(transport.subscriptions.has('chess://game/abc')).toBe(true)

    await dispatchActions({
      action: 'unsubscribe',
      uri: 'chess://game/abc',
    }, ctx)

    expect(transport.unsubscribedUris).toContain('chess://game/abc')
  })

  it('cleans up polling fallback', async () => {
    const transport = mockTransport({ ok: true })
    const ctx = makeCtx({}, transport)

    await dispatchActions({
      action: 'subscribe',
      uri: 'chess://game/abc',
      stateKey: '$game',
      fallbackInterval: 100,
      fallbackTool: '_action',
    }, ctx)

    // Wait for at least one poll
    await new Promise(r => setTimeout(r, 150))
    const callsBefore = transport.calls.length

    await dispatchActions({
      action: 'unsubscribe',
      uri: 'chess://game/abc',
    }, ctx)

    // Wait and verify no more polling
    await new Promise(r => setTimeout(r, 200))
    expect(transport.calls.length).toBe(callsBefore)
  })

  it('is idempotent for unknown URI', async () => {
    const ctx = makeCtx({})
    // Should not throw
    await dispatchActions({
      action: 'unsubscribe',
      uri: 'unknown://resource',
    }, ctx)
  })
})

// ── clearAllSubscriptions ────────────────────────────────────────────────────

describe('clearAllSubscriptions', () => {
  beforeEach(() => { clearAllSubscriptions() })
  afterEach(() => { clearAllSubscriptions() })

  it('cleans up all active subscriptions', async () => {
    const transport = mockSubscriptionTransport()
    const ctx = makeCtx({}, transport)

    await dispatchActions({
      action: 'subscribe',
      uri: 'chess://game/1',
      stateKey: '$g1',
    }, ctx)

    await dispatchActions({
      action: 'subscribe',
      uri: 'chess://game/2',
      stateKey: '$g2',
    }, ctx)

    expect(transport.subscriptions.size).toBe(2)
    clearAllSubscriptions()
    expect(transport.unsubscribedUris).toContain('chess://game/1')
    expect(transport.unsubscribedUris).toContain('chess://game/2')
  })

  it('cleans up mixed push and polling subscriptions', async () => {
    const pushTransport = mockSubscriptionTransport()
    const pollTransport = mockTransport()

    const pushCtx = makeCtx({}, pushTransport)
    await dispatchActions({
      action: 'subscribe',
      uri: 'push://resource',
      stateKey: '$push',
    }, pushCtx)

    // Clear the push subscription, then set up a polling one
    clearAllSubscriptions()

    const pollCtx = makeCtx({}, pollTransport)
    await dispatchActions({
      action: 'subscribe',
      uri: 'poll://resource',
      stateKey: '$poll',
      fallbackInterval: 100,
      fallbackTool: '_refresh',
    }, pollCtx)

    await new Promise(r => setTimeout(r, 150))
    const callsBefore = pollTransport.calls.length

    clearAllSubscriptions()

    await new Promise(r => setTimeout(r, 200))
    // No more polling after clear
    expect(pollTransport.calls.length).toBe(callsBefore)
  })
})

// ── Validation ───────────────────────────────────────────────────────────────

describe('subscribe validation', () => {
  beforeEach(() => { clearAllSubscriptions() })
  afterEach(() => { clearAllSubscriptions() })

  it('warns and skips when uri is missing', async () => {
    const ctx = makeCtx({})
    const warns: string[] = []
    const origWarn = console.warn
    console.warn = (msg: string) => warns.push(msg)

    await dispatchActions({
      action: 'subscribe',
      stateKey: '$game',
    }, ctx)

    console.warn = origWarn
    expect(warns.some(w => w.includes('missing uri or stateKey'))).toBe(true)
  })

  it('warns and skips when stateKey is missing', async () => {
    const ctx = makeCtx({})
    const warns: string[] = []
    const origWarn = console.warn
    console.warn = (msg: string) => warns.push(msg)

    await dispatchActions({
      action: 'subscribe',
      uri: 'chess://game/abc',
    }, ctx)

    console.warn = origWarn
    expect(warns.some(w => w.includes('missing uri or stateKey'))).toBe(true)
  })

  it('warns when unsubscribe uri is missing', async () => {
    const ctx = makeCtx({})
    const warns: string[] = []
    const origWarn = console.warn
    console.warn = (msg: string) => warns.push(msg)

    await dispatchActions({ action: 'unsubscribe' }, ctx)

    console.warn = origWarn
    expect(warns.some(w => w.includes('missing uri'))).toBe(true)
  })
})
