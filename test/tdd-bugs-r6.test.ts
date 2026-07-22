/**
 * TDD R6 — close the action-side silent-failure gaps.
 *
 * Two classes of error currently bypass the logger:
 *  A. Fire-and-forget dispatches (`void dispatchActions(...)`) swallow any
 *     rejection — a throwing onClick/onMount/interval action vanishes.
 *  B. toolCall/fetch/callHandler/subscribe failures route to `onError` but log
 *     nothing, so a failure with no onError handler disappears silently.
 *
 * @happy-dom
 */

import { describe, it, expect, beforeEach, afterEach, spyOn } from 'bun:test'
import { dispatchActions, fireAndForget } from '../src/renderer/actions'
import type { DispatchContext } from '../src/renderer/actions'
import { Store } from '../src/renderer/state'
import { setLogLevel } from '../src/core/logger'

let errorSpy: ReturnType<typeof spyOn>
let warnSpy: ReturnType<typeof spyOn>
let debugSpy: ReturnType<typeof spyOn>

beforeEach(() => {
  errorSpy = spyOn(console, 'error').mockImplementation(() => { /* silence */ })
  warnSpy = spyOn(console, 'warn').mockImplementation(() => { /* silence */ })
  debugSpy = spyOn(console, 'debug').mockImplementation(() => { /* silence */ })
  setLogLevel('debug') // see everything unless a test narrows it
})
afterEach(() => {
  errorSpy.mockRestore(); warnSpy.mockRestore(); debugSpy.mockRestore()
  setLogLevel('warn')
})

const tick = () => new Promise(r => setTimeout(r, 5))

function ctxWith(transport: unknown): DispatchContext {
  const store = new Store()
  return { store, scope: {}, transport, rerender: () => { /* noop */ } } as unknown as DispatchContext
}

const rejectingTransport = {
  callTool: () => Promise.reject(new Error('net down')),
  sendMessage: () => Promise.resolve(),
}

// ── A: fire-and-forget rejections reach the logger ───────────────────────────

describe('A — fireAndForget', () => {
  it('logs a rejected promise via log.error', async () => {
    fireAndForget(Promise.reject(new Error('boom')), 'action dispatch')
    await tick()
    expect(errorSpy).toHaveBeenCalled()
    expect(String(errorSpy.mock.calls[0][0])).toContain('action dispatch')
  })

  it('stays silent when the promise resolves', async () => {
    fireAndForget(Promise.resolve('ok'), 'action dispatch')
    await tick()
    expect(errorSpy).not.toHaveBeenCalled()
  })
})

// ── B: async action failures are logged (and still routed to onError) ────────

describe('B — action failures surface through the logger', () => {
  it('toolCall failure WITH onError runs onError and logs at debug', async () => {
    setLogLevel('debug')
    const ctx = ctxWith(rejectingTransport)
    await dispatchActions(
      { action: 'toolCall', tool: 't', onError: { action: 'setState', key: 'failed', value: true } },
      ctx,
    )
    expect(ctx.store.get('failed')).toBe(true) // onError still ran
    expect(debugSpy).toHaveBeenCalled()
  })

  it('toolCall failure WITHOUT onError surfaces at warn (unhandled)', async () => {
    setLogLevel('warn')
    const ctx = ctxWith(rejectingTransport)
    await dispatchActions({ action: 'toolCall', tool: 't' }, ctx)
    expect(warnSpy).toHaveBeenCalled()
    expect(String(warnSpy.mock.calls.at(-1)?.[0])).toContain('toolCall')
  })

  it('fetch failure WITHOUT onError surfaces at warn', async () => {
    setLogLevel('warn')
    const fetchSpy = spyOn(globalThis, 'fetch').mockImplementation(
      (() => Promise.reject(new Error('offline'))) as unknown as typeof globalThis.fetch,
    )
    const ctx = ctxWith(rejectingTransport)
    await dispatchActions({ action: 'fetch', url: 'https://example.com/x' }, ctx)
    expect(warnSpy).toHaveBeenCalled()
    expect(String(warnSpy.mock.calls.at(-1)?.[0])).toContain('fetch')
    fetchSpy.mockRestore()
  })
})
