/**
 * TDD bug-hunting tests for Subscribe action.
 *
 * Written BEFORE fixes — each test targets a suspected bug.
 *
 * @happy-dom
 */

import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import { Store } from '../src/renderer/state'
import { dispatchActions, clearAllSubscriptions } from '../src/renderer/actions'
import type { DispatchContext, ToastEvent, McpTransport } from '../src/renderer/actions'

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
} {
  const t = {
    calls: [] as { name: string; args: Record<string, unknown> }[],
    callTool: (name: string, args: Record<string, unknown>) => {
      t.calls.push({ name, args })
      return Promise.resolve(result)
    },
    sendMessage: () => Promise.resolve(),
  }
  return t
}

function mockSubscriptionTransport(): McpTransport & {
  subscriptions: Map<string, (data: unknown) => void>
  unsubscribedUris: string[]
} {
  const t = {
    subscriptions: new Map<string, (data: unknown) => void>(),
    unsubscribedUris: [] as string[],
    callTool: () => Promise.resolve(null),
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

// ═════════════════════════════════════════════════════════════════════════════
// BUG 1: fallbackArgs with reactive expressions are never resolved
//
// handleToolCall resolves args via resolveArgs() on every call.
// handleSubscribe's fallback captures fallbackArgs raw and passes them
// directly to transport.callTool() — reactive {{ }} expressions are
// never evaluated.
// ═════════════════════════════════════════════════════════════════════════════

describe('BUG: fallbackArgs reactive expressions must be resolved on each poll tick', () => {
  beforeEach(() => clearAllSubscriptions())
  afterEach(() => clearAllSubscriptions())

  it('resolves {{ }} expressions in fallbackArgs at poll time', async () => {
    const transport = mockTransport({ data: 'refreshed' })
    const ctx = makeCtx({ page: 3 }, transport)

    await dispatchActions({
      action: 'subscribe',
      uri: 'data://stream',
      stateKey: '$result',
      fallbackInterval: 100,
      fallbackTool: '_action',
      fallbackArgs: { page: '{{ page }}' },
    }, ctx)

    await new Promise(r => setTimeout(r, 150))
    clearAllSubscriptions()

    // The tool should have been called with resolved page=3, not raw '{{ page }}'
    expect(transport.calls.length).toBeGreaterThan(0)
    expect(transport.calls[0].args.page).toBe(3)
  })

  it('picks up state changes on subsequent ticks', async () => {
    const transport = mockTransport({ ok: true })
    const ctx = makeCtx({ cursor: 'abc' }, transport)

    await dispatchActions({
      action: 'subscribe',
      uri: 'data://paginated',
      stateKey: '$items',
      fallbackInterval: 100,
      fallbackTool: 'fetch_page',
      fallbackArgs: { cursor: '{{ cursor }}' },
    }, ctx)

    // Wait for first tick
    await new Promise(r => setTimeout(r, 150))
    expect(transport.calls[0].args.cursor).toBe('abc')

    // Mutate state between ticks
    ctx.store.set('cursor', 'def')

    // Wait for second tick
    await new Promise(r => setTimeout(r, 150))
    clearAllSubscriptions()

    // Second tick should use updated cursor
    const lastCall = transport.calls[transport.calls.length - 1]
    expect(lastCall.args.cursor).toBe('def')
  })
})

// ═════════════════════════════════════════════════════════════════════════════
// BUG 2: clearAllSubscriptions is not resilient to cleanup errors
//
// If one cleanup function throws, the for...of loop breaks and remaining
// subscriptions are leaked. clearInterval never throws, but custom
// unsubscribe functions (from transport.subscribe) can.
// ═════════════════════════════════════════════════════════════════════════════

describe('BUG: clearAllSubscriptions must be resilient to cleanup errors', () => {
  beforeEach(() => clearAllSubscriptions())
  afterEach(() => clearAllSubscriptions())

  it('cleans up remaining subscriptions even when one cleanup throws', async () => {
    let secondCleaned = false
    const transport: McpTransport = {
      callTool: () => Promise.resolve(null),
      sendMessage: () => Promise.resolve(),
      subscribe: (uri: string, _onData: (data: unknown) => void): (() => void) => {
        if (uri === 'error://will-throw') {
          return () => { throw new Error('cleanup explosion') }
        }
        return () => { secondCleaned = true }
      },
      capabilities: { subscriptions: true },
    }

    const ctx = makeCtx({}, transport)

    // Subscribe to two URIs — first one's cleanup will throw
    await dispatchActions({
      action: 'subscribe',
      uri: 'error://will-throw',
      stateKey: '$a',
    }, ctx)

    await dispatchActions({
      action: 'subscribe',
      uri: 'safe://resource',
      stateKey: '$b',
    }, ctx)

    // clearAllSubscriptions should not throw and should clean up both
    expect(() => clearAllSubscriptions()).not.toThrow()
    expect(secondCleaned).toBe(true)
  })
})

// ═════════════════════════════════════════════════════════════════════════════
// BUG 3: Resubscribe after unsubscribe must work
//
// After unsubscribing from a URI, subscribing to the same URI again
// should create a new subscription. Verify the Map entry is properly
// removed so the duplicate check doesn't block re-subscription.
// ═════════════════════════════════════════════════════════════════════════════

describe('BUG: resubscribe after unsubscribe must create new subscription', () => {
  beforeEach(() => clearAllSubscriptions())
  afterEach(() => clearAllSubscriptions())

  it('push: allows re-subscribing after unsubscribe', async () => {
    const transport = mockSubscriptionTransport()
    const ctx = makeCtx({}, transport)

    // Subscribe
    await dispatchActions({
      action: 'subscribe',
      uri: 'chess://game/abc',
      stateKey: '$game',
    }, ctx)
    expect(transport.subscriptions.has('chess://game/abc')).toBe(true)

    // Unsubscribe
    await dispatchActions({
      action: 'unsubscribe',
      uri: 'chess://game/abc',
    }, ctx)
    expect(transport.unsubscribedUris).toContain('chess://game/abc')

    // Resubscribe — must NOT be blocked by duplicate check
    await dispatchActions({
      action: 'subscribe',
      uri: 'chess://game/abc',
      stateKey: '$game',
    }, ctx)
    expect(transport.subscriptions.has('chess://game/abc')).toBe(true)
  })

  it('poll: allows re-subscribing after unsubscribe', async () => {
    const transport = mockTransport({ fen: 'pos1' })
    const ctx = makeCtx({}, transport)

    // Subscribe (polling)
    await dispatchActions({
      action: 'subscribe',
      uri: 'chess://game/abc',
      stateKey: '$game',
      fallbackInterval: 100,
      fallbackTool: '_action',
    }, ctx)

    await new Promise(r => setTimeout(r, 150))
    const callsAfterFirst = transport.calls.length

    // Unsubscribe
    await dispatchActions({
      action: 'unsubscribe',
      uri: 'chess://game/abc',
    }, ctx)

    await new Promise(r => setTimeout(r, 200))
    // No more polls after unsubscribe
    expect(transport.calls.length).toBe(callsAfterFirst)

    // Resubscribe
    await dispatchActions({
      action: 'subscribe',
      uri: 'chess://game/abc',
      stateKey: '$game',
      fallbackInterval: 100,
      fallbackTool: '_action',
    }, ctx)

    await new Promise(r => setTimeout(r, 150))
    clearAllSubscriptions()

    // New polls should have fired
    expect(transport.calls.length).toBeGreaterThan(callsAfterFirst)
  })
})

// ═════════════════════════════════════════════════════════════════════════════
// BUG 4: Edge-case transports — subscribe method vs capabilities mismatch
//
// The renderer checks: ctx.transport?.subscribe && ctx.transport.capabilities?.subscriptions
// These tests verify correct fallback behaviour when one is present but not the other.
// ═════════════════════════════════════════════════════════════════════════════

describe('BUG: edge-case transport capability mismatches', () => {
  beforeEach(() => clearAllSubscriptions())
  afterEach(() => clearAllSubscriptions())

  it('falls back to polling when transport has subscribe but capabilities.subscriptions is false', async () => {
    const transport: McpTransport & { calls: { name: string; args: Record<string, unknown> }[] } = {
      calls: [],
      callTool: function (name: string, args: Record<string, unknown>) {
        this.calls.push({ name, args })
        return Promise.resolve({ ok: true })
      },
      sendMessage: () => Promise.resolve(),
      subscribe: () => () => { /* no-op */ },
      capabilities: { subscriptions: false },
    }
    const ctx = makeCtx({}, transport)

    await dispatchActions({
      action: 'subscribe',
      uri: 'data://stream',
      stateKey: '$data',
      fallbackInterval: 100,
      fallbackTool: '_poll',
    }, ctx)

    await new Promise(r => setTimeout(r, 150))
    clearAllSubscriptions()

    // Should have used polling, not push
    expect(transport.calls.length).toBeGreaterThan(0)
    expect(transport.calls[0].name).toBe('_poll')
  })

  it('falls back to polling when transport has capabilities but no subscribe method', async () => {
    const transport: McpTransport & { calls: { name: string; args: Record<string, unknown> }[] } = {
      calls: [],
      callTool: function (name: string, args: Record<string, unknown>) {
        this.calls.push({ name, args })
        return Promise.resolve({ ok: true })
      },
      sendMessage: () => Promise.resolve(),
      capabilities: { subscriptions: true },
      // NOTE: no subscribe method
    }
    const ctx = makeCtx({}, transport)

    await dispatchActions({
      action: 'subscribe',
      uri: 'data://stream',
      stateKey: '$data',
      fallbackInterval: 100,
      fallbackTool: '_poll',
    }, ctx)

    await new Promise(r => setTimeout(r, 150))
    clearAllSubscriptions()

    // Should have used polling since subscribe method is missing
    expect(transport.calls.length).toBeGreaterThan(0)
    expect(transport.calls[0].name).toBe('_poll')
  })
})

// ═════════════════════════════════════════════════════════════════════════════
// BUG 5: Push path onData with null/undefined data
//
// If the push notification delivers null or undefined data, the renderer
// should still store it and re-render without crashing.
// ═════════════════════════════════════════════════════════════════════════════

describe('BUG: push path handles null/undefined data gracefully', () => {
  beforeEach(() => clearAllSubscriptions())
  afterEach(() => clearAllSubscriptions())

  it('stores null data without crashing', async () => {
    const transport = mockSubscriptionTransport()
    const ctx = makeCtx({ $game: { fen: 'initial' } }, transport)

    await dispatchActions({
      action: 'subscribe',
      uri: 'chess://game/abc',
      stateKey: '$game',
    }, ctx)

    const onData = transport.subscriptions.get('chess://game/abc')!
    onData(null)

    expect(ctx.store.get('$game')).toBeNull()
    expect(ctx.rerendered).toBe(1)
  })

  it('stores undefined data without crashing', async () => {
    const transport = mockSubscriptionTransport()
    const ctx = makeCtx({ $game: { fen: 'initial' } }, transport)

    await dispatchActions({
      action: 'subscribe',
      uri: 'chess://game/abc',
      stateKey: '$game',
    }, ctx)

    const onData = transport.subscriptions.get('chess://game/abc')!
    onData(undefined)

    expect(ctx.store.get('$game')).toBeUndefined()
    expect(ctx.rerendered).toBe(1)
  })
})

// ═════════════════════════════════════════════════════════════════════════════
// BUG 6: Max subscriptions cap
//
// After hitting the cap, no more subscriptions should be created.
// After clearing, new subscriptions should be allowed again.
// ═════════════════════════════════════════════════════════════════════════════

describe('BUG: max subscriptions cap and recovery', () => {
  beforeEach(() => clearAllSubscriptions())
  afterEach(() => clearAllSubscriptions())

  it('allows new subscriptions after clearAll when cap was reached', async () => {
    const transport = mockSubscriptionTransport()
    const ctx = makeCtx({}, transport)

    // Fill to cap (50)
    for (let i = 0; i < 50; i++) {
      await dispatchActions({
        action: 'subscribe',
        uri: `data://stream/${i}`,
        stateKey: `$s${i}`,
      }, ctx)
    }

    // 51st should be rejected
    const warns: string[] = []
    const origWarn = console.warn
    console.warn = (msg: string) => warns.push(msg)

    await dispatchActions({
      action: 'subscribe',
      uri: 'data://stream/50',
      stateKey: '$s50',
    }, ctx)

    console.warn = origWarn
    expect(warns.some(w => w.includes('Max subscriptions'))).toBe(true)
    expect(transport.subscriptions.has('data://stream/50')).toBe(false)

    // Clear all
    clearAllSubscriptions()

    // Should be able to subscribe again
    await dispatchActions({
      action: 'subscribe',
      uri: 'data://stream/new',
      stateKey: '$new',
    }, ctx)

    expect(transport.subscriptions.has('data://stream/new')).toBe(true)
  })
})

// ═════════════════════════════════════════════════════════════════════════════
// BUG 7: Polling fallback — onData callbacks should fire with $data scope
//
// When polling produces a result, the onData callbacks should receive
// the result in $data scope (matching push path behavior).
// ═════════════════════════════════════════════════════════════════════════════

describe('BUG: polling onData callbacks receive $data scope', () => {
  beforeEach(() => clearAllSubscriptions())
  afterEach(() => clearAllSubscriptions())

  it('runs onData with poll result in scope', async () => {
    const transport = mockTransport({ count: 42 })
    const ctx = makeCtx({}, transport)

    await dispatchActions({
      action: 'subscribe',
      uri: 'data://counter',
      stateKey: '$counter',
      fallbackInterval: 100,
      fallbackTool: '_poll',
      onData: { action: 'showToast', message: 'Got data' },
    }, ctx)

    await new Promise(r => setTimeout(r, 150))
    clearAllSubscriptions()

    expect(ctx.toasts.length).toBeGreaterThan(0)
    expect(ctx.toasts[0].message).toBe('Got data')
  })
})
