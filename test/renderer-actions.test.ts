/**
 * Renderer tests — Advanced actions (toolCall, fetch, setInterval, callHandler, updateContext).
 *
 * @happy-dom
 */

import { describe, it, expect, beforeEach } from 'bun:test'
import { Store } from '../src/renderer/state'
import { dispatchActions, clearAllIntervals } from '../src/renderer/actions'
import type { DispatchContext, ToastEvent, McpTransport } from '../src/renderer/actions'
import { extractPrefabPayload, extractPrefabUpdate } from '../src/renderer/actions'
import { createNoopTransport } from '../src/renderer/transport'

function makeCtx(state?: Record<string, unknown>, transport?: McpTransport): DispatchContext & { rerendered: number; toasts: ToastEvent[]; remounted: Record<string, unknown>[] } {
  const ctx = {
    store: new Store(state),
    transport: transport ?? createNoopTransport(),
    rerender: () => { ctx.rerendered++ },
    remount: (data: Record<string, unknown>) => { ctx.remounted.push(data) },
    onToast: (t: ToastEvent) => ctx.toasts.push(t),
    rerendered: 0,
    toasts: [] as ToastEvent[],
    remounted: [] as Record<string, unknown>[],
  }
  return ctx
}

function mockTransport(result: unknown = { ok: true }): McpTransport & { calls: { name: string; args: Record<string, unknown> }[]; messages: string[] } {
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

// ── toolCall action ──────────────────────────────────────────────────────────

describe('toolCall action', () => {
  it('calls transport.callTool with resolved args', async () => {
    const transport = mockTransport({ data: 42 })
    const ctx = makeCtx({ username: 'Alice' }, transport)

    await dispatchActions({
      action: 'toolCall',
      tool: 'get_user',
      arguments: { name: '{{ username }}' },
      resultKey: 'result',
    }, ctx)

    expect(transport.calls).toHaveLength(1)
    expect(transport.calls[0].name).toBe('get_user')
    expect(transport.calls[0].args.name).toBe('Alice')
    expect(ctx.store.get('result')).toEqual({ data: 42 })
  })

  it('stores result in resultKey', async () => {
    const transport = mockTransport([1, 2, 3])
    const ctx = makeCtx({}, transport)

    await dispatchActions({
      action: 'toolCall',
      tool: 'list_items',
      arguments: {},
      resultKey: 'items',
    }, ctx)

    expect(ctx.store.get('items')).toEqual([1, 2, 3])
  })

  it('triggers onSuccess callback after successful call', async () => {
    const transport = mockTransport('done')
    const ctx = makeCtx({ status: '' }, transport)

    await dispatchActions({
      action: 'toolCall',
      tool: 'my_tool',
      arguments: {},
      onSuccess: { action: 'setState', key: 'status', value: 'success' },
    }, ctx)

    expect(ctx.store.get('status')).toBe('success')
  })

  it('triggers onError callback on failure', async () => {
    const transport: McpTransport = {
      callTool: () => { throw new Error('Network error') },
      sendMessage: () => Promise.resolve(),
    }
    const ctx = makeCtx({ status: '' }, transport)

    await dispatchActions({
      action: 'toolCall',
      tool: 'broken_tool',
      arguments: {},
      onError: { action: 'setState', key: 'status', value: 'failed' },
    }, ctx)

    expect(ctx.store.get('status')).toBe('failed')
  })

  it('warns when no transport is configured', async () => {
    const ctx = makeCtx({})
    ctx.transport = undefined

    // Should not throw
    await dispatchActions({
      action: 'toolCall',
      tool: 'test',
      arguments: {},
    }, ctx)
  })

  it('triggers rerender after tool call', async () => {
    const transport = mockTransport('ok')
    const ctx = makeCtx({}, transport)

    await dispatchActions({
      action: 'toolCall',
      tool: 'test',
      arguments: {},
      resultKey: 'r',
    }, ctx)

    expect(ctx.rerendered).toBeGreaterThan(0)
  })
})

// ── sendMessage action ───────────────────────────────────────────────────────

describe('sendMessage action', () => {
  it('sends message via transport', async () => {
    const transport = mockTransport()
    const ctx = makeCtx({}, transport)

    await dispatchActions({
      action: 'sendMessage',
      message: 'Hello from prefab',
    }, ctx)

    expect(transport.messages).toEqual(['Hello from prefab'])
  })

  it('resolves Rx expressions in message', async () => {
    const transport = mockTransport()
    const ctx = makeCtx({ user: 'Bob' }, transport)

    await dispatchActions({
      action: 'sendMessage',
      message: 'Hello {{ user }}',
    }, ctx)

    expect(transport.messages).toEqual(['Hello Bob'])
  })
})

// ── callHandler action ───────────────────────────────────────────────────────

describe('callHandler action', () => {
  it('delegates to transport.callTool', async () => {
    const transport = mockTransport({ status: 'ok' })
    const ctx = makeCtx({}, transport)

    await dispatchActions({
      action: 'callHandler',
      handler: 'my_handler',
      arguments: { key: 'value' },
      resultKey: 'handlerResult',
    }, ctx)

    expect(transport.calls).toHaveLength(1)
    expect(transport.calls[0].name).toBe('my_handler')
    expect(transport.calls[0].args).toEqual({ key: 'value' })
    expect(ctx.store.get('handlerResult')).toEqual({ status: 'ok' })
  })

  it('calls onError on failure', async () => {
    const transport: McpTransport = {
      callTool: () => { throw new Error('fail') },
      sendMessage: () => Promise.resolve(),
    }
    const ctx = makeCtx({ err: '' }, transport)

    await dispatchActions({
      action: 'callHandler',
      handler: 'bad_handler',
      arguments: {},
      onError: { action: 'setState', key: 'err', value: 'handler failed' },
    }, ctx)

    expect(ctx.store.get('err')).toBe('handler failed')
  })
})

// ── updateContext action ─────────────────────────────────────────────────────

describe('updateContext action', () => {
  it('merges context into state', async () => {
    const ctx = makeCtx({ existing: 'keep' })

    await dispatchActions({
      action: 'updateContext',
      context: { newKey: 'hello', another: 42 },
    }, ctx)

    expect(ctx.store.get('newKey')).toBe('hello')
    expect(ctx.store.get('another')).toBe(42)
    expect(ctx.store.get('existing')).toBe('keep')
  })

  it('triggers rerender', async () => {
    const ctx = makeCtx({})

    await dispatchActions({
      action: 'updateContext',
      context: { x: 1 },
    }, ctx)

    expect(ctx.rerendered).toBe(1)
  })
})

// ── setInterval action ───────────────────────────────────────────────────────

describe('setInterval action', () => {
  beforeEach(() => { clearAllIntervals() })

  it('dispatches onTick action periodically', async () => {
    const ctx = makeCtx({ tick: 0 })

    await dispatchActions({
      action: 'setInterval',
      intervalMs: 100,
      onTick: { action: 'setState', key: 'tick', value: '{{ tick }}' },
    }, ctx)

    // Give time for at least one tick
    await new Promise(r => setTimeout(r, 150))
    clearAllIntervals()
    // At least one tick should have fired
    expect(ctx.rerendered).toBeGreaterThan(0)
  })

  it('enforces minimum interval of 100ms', async () => {
    const ctx = makeCtx({ count: 0 })

    // Request 10ms, should be clamped to 100ms
    await dispatchActions({
      action: 'setInterval',
      intervalMs: 10,
      onTick: { action: 'setState', key: 'count', value: 1 },
    }, ctx)

    // Wait 50ms — should NOT have fired if minimum is 100ms
    await new Promise(r => setTimeout(r, 50))
    clearAllIntervals()
    // Should either not have fired or fired once at 100ms
    expect(ctx.store.get('count')).toBe(0)
  })

  it('clearAllIntervals stops all intervals', async () => {
    const ctx = makeCtx({ x: 0 })

    await dispatchActions({
      action: 'setInterval',
      intervalMs: 100,
      onTick: { action: 'setState', key: 'x', value: 1 },
    }, ctx)

    clearAllIntervals()
    await new Promise(r => setTimeout(r, 150))
    expect(ctx.store.get('x')).toBe(0)
  })
})

// ── showToast variants ───────────────────────────────────────────────────────

describe('showToast action', () => {
  it('emits toast with all fields', async () => {
    const ctx = makeCtx({})

    await dispatchActions({
      action: 'showToast',
      message: 'Saved!',
      description: 'Your changes have been saved.',
      variant: 'success',
      duration: 3000,
    }, ctx)

    expect(ctx.toasts).toHaveLength(1)
    expect(ctx.toasts[0]).toEqual({
      message: 'Saved!',
      description: 'Your changes have been saved.',
      variant: 'success',
      duration: 3000,
    })
  })

  it('resolves Rx in toast message', async () => {
    const ctx = makeCtx({ name: 'Doc' })

    await dispatchActions({
      action: 'showToast',
      message: 'Hello {{ name }}',
    }, ctx)

    expect(ctx.toasts[0].message).toBe('Hello Doc')
  })
})

// ── Unknown action ───────────────────────────────────────────────────────────

describe('Unknown action', () => {
  it('does not throw on unknown action type', async () => {
    const ctx = makeCtx({})
    await dispatchActions({ action: 'nonExistentAction' }, ctx)
    // No throw = pass
  })
})

// ── callTool alias (Prefect compat) ──────────────────────────────────────────

describe('callTool alias (Prefect compat)', () => {
  it('callTool dispatches same as toolCall', async () => {
    const transport = mockTransport({ value: 99 })
    const ctx = makeCtx({}, transport)

    await dispatchActions({
      action: 'callTool',
      tool: 'my_tool',
      arguments: { x: 1 },
      resultKey: 'out',
    }, ctx)

    expect(transport.calls).toHaveLength(1)
    expect(transport.calls[0].name).toBe('my_tool')
    expect(ctx.store.get('out')).toEqual({ value: 99 })
  })
})

// ── extractPrefabPayload ─────────────────────────────────────────────────────

describe('extractPrefabPayload', () => {
  it('returns null for non-object values', () => {
    expect(extractPrefabPayload(null)).toBeNull()
    expect(extractPrefabPayload(undefined)).toBeNull()
    expect(extractPrefabPayload('hello')).toBeNull()
    expect(extractPrefabPayload(42)).toBeNull()
  })

  it('returns null for plain objects without $prefab', () => {
    expect(extractPrefabPayload({ data: 42 })).toBeNull()
    expect(extractPrefabPayload({ ok: true })).toBeNull()
  })

  it('detects direct prefab wire payload', () => {
    const payload = { $prefab: { version: '0.2' }, view: { type: 'Text', text: 'hi' } }
    expect(extractPrefabPayload(payload)).toBe(payload)
  })

  it('extracts from structuredContent wrapper', () => {
    const inner = { $prefab: { version: '0.2' }, view: { type: 'Text', text: 'hi' } }
    const result = { content: [{ type: 'text', text: 'ok' }], structuredContent: inner }
    expect(extractPrefabPayload(result)).toBe(inner)
  })

  it('extracts from MCP content array text block', () => {
    const inner = { $prefab: { version: '0.2' }, view: { type: 'Text', text: 'hi' } }
    const result = { content: [{ type: 'text', text: JSON.stringify(inner) }] }
    expect(extractPrefabPayload(result)).toEqual(inner)
  })

  it('ignores content blocks that are not JSON', () => {
    const result = { content: [{ type: 'text', text: 'not json' }] }
    expect(extractPrefabPayload(result)).toBeNull()
  })

  it('ignores structuredContent without $prefab', () => {
    const result = { structuredContent: { data: 42 } }
    expect(extractPrefabPayload(result)).toBeNull()
  })

  it('ignores display_update payloads (has $prefab but no view)', () => {
    // display_update() returns { $prefab, update: { state } } — no view
    const updatePayload = { $prefab: { version: '0.2' }, update: { state: { count: 5 } } }
    expect(extractPrefabPayload(updatePayload)).toBeNull()
  })

  it('ignores display_update in structuredContent wrapper', () => {
    const updatePayload = { $prefab: { version: '0.2' }, update: { state: { count: 5 } } }
    const result = { content: [], structuredContent: updatePayload }
    expect(extractPrefabPayload(result)).toBeNull()
  })

  it('ignores display_update in MCP content text block', () => {
    const updatePayload = { $prefab: { version: '0.2' }, update: { state: { count: 5 } } }
    const result = { content: [{ type: 'text', text: JSON.stringify(updatePayload) }] }
    expect(extractPrefabPayload(result)).toBeNull()
  })
})

// ── extractPrefabUpdate ──────────────────────────────────────────────────────

describe('extractPrefabUpdate', () => {
  it('returns null for non-object values', () => {
    expect(extractPrefabUpdate(null)).toBeNull()
    expect(extractPrefabUpdate('hello')).toBeNull()
    expect(extractPrefabUpdate(42)).toBeNull()
  })

  it('returns null for plain objects', () => {
    expect(extractPrefabUpdate({ data: 42 })).toBeNull()
  })

  it('returns null for view payloads (not updates)', () => {
    const payload = { $prefab: { version: '0.2' }, view: { type: 'Text', text: 'hi' } }
    expect(extractPrefabUpdate(payload)).toBeNull()
  })

  it('detects direct display_update payload', () => {
    const payload = { $prefab: { version: '0.2' }, update: { state: { count: 5 } } }
    expect(extractPrefabUpdate(payload)).toBe(payload)
  })

  it('extracts from structuredContent wrapper', () => {
    const inner = { $prefab: { version: '0.2' }, update: { state: { x: 1 } } }
    const result = { content: [], structuredContent: inner }
    expect(extractPrefabUpdate(result)).toBe(inner)
  })

  it('extracts from MCP content text block', () => {
    const inner = { $prefab: { version: '0.2' }, update: { state: { y: 2 } } }
    const result = { content: [{ type: 'text', text: JSON.stringify(inner) }] }
    expect(extractPrefabUpdate(result)).toEqual(inner)
  })

  it('ignores malformed update (missing state)', () => {
    const payload = { $prefab: { version: '0.2' }, update: {} }
    expect(extractPrefabUpdate(payload)).toBeNull()
  })
})

// ── toolCall remount (server-rendered pattern) ───────────────────────────────

describe('toolCall remount', () => {
  it('calls remount when tool returns a prefab wire payload', async () => {
    const newView = { $prefab: { version: '0.2' }, view: { type: 'Text', text: 'new' } }
    const transport = mockTransport(newView)
    const ctx = makeCtx({}, transport)

    await dispatchActions({
      action: 'toolCall',
      tool: 'next_view',
      arguments: {},
    }, ctx)

    expect(ctx.remounted).toHaveLength(1)
    expect(ctx.remounted[0]).toBe(newView)
    expect(ctx.rerendered).toBe(0) // remount, not rerender
  })

  it('calls remount when tool returns structuredContent with $prefab', async () => {
    const inner = { $prefab: { version: '0.2' }, view: { type: 'Text', text: 'updated' } }
    const transport = mockTransport({ content: [], structuredContent: inner })
    const ctx = makeCtx({}, transport)

    await dispatchActions({
      action: 'toolCall',
      tool: 'next_view',
      arguments: {},
    }, ctx)

    expect(ctx.remounted).toHaveLength(1)
    expect(ctx.remounted[0]).toBe(inner)
    expect(ctx.rerendered).toBe(0)
  })

  it('falls back to rerender when tool returns non-prefab result', async () => {
    const transport = mockTransport({ data: 42 })
    const ctx = makeCtx({}, transport)

    await dispatchActions({
      action: 'toolCall',
      tool: 'regular_tool',
      arguments: {},
    }, ctx)

    expect(ctx.remounted).toHaveLength(0)
    expect(ctx.rerendered).toBeGreaterThan(0)
  })

  it('still stores result in resultKey when remounting', async () => {
    const newView = { $prefab: { version: '0.2' }, view: { type: 'Text', text: 'new' } }
    const transport = mockTransport(newView)
    const ctx = makeCtx({}, transport)

    await dispatchActions({
      action: 'toolCall',
      tool: 'next_view',
      arguments: {},
      resultKey: 'last_result',
    }, ctx)

    expect(ctx.store.get('last_result')).toBe(newView)
    expect(ctx.remounted).toHaveLength(1)
  })

  it('fires onSuccess after remount', async () => {
    const newView = { $prefab: { version: '0.2' }, view: { type: 'Text', text: 'x' } }
    const transport = mockTransport(newView)
    const ctx = makeCtx({ done: false }, transport)

    await dispatchActions({
      action: 'toolCall',
      tool: 'next_view',
      arguments: {},
      onSuccess: { action: 'setState', key: 'done', value: true },
    }, ctx)

    expect(ctx.store.get('done')).toBe(true)
    expect(ctx.remounted).toHaveLength(1)
  })
})
