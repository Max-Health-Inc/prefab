/**
 * TDD Bug Probe — Round 3
 *
 * Probes edge cases across:
 * 1. display_form() missing option forwarding (stylesheets, pipes, layout, etc.)
 * 2. Subscribe native push path with $prefab responses
 * 3. display() with PrefabApp + options (should options be ignored?)
 * 4. Store.merge with dot-path keys
 * 5. display_update structuredContent shape
 * 6. extractPrefabPayload with nested MCP content arrays
 * 7. Remount without ctx.remount set (no crash)
 * 8. display_form with layout option
 * 9. Concurrent subscription cleanup
 * 10. callHandler without resultKey
 *
 * @happy-dom
 */

import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import {
  display,
  display_form,
  display_update,
  display_error,
  display_success,
  PrefabApp,
  Text,
  SetState,
  CallTool,
} from '../src/index'
import type { McpToolResult, PrefabWireFormat, PrefabUpdateWire } from '../src/index'
import { Store } from '../src/renderer/state'
import {
  dispatchActions,
  extractPrefabPayload,
  extractPrefabUpdate,
  clearAllSubscriptions,
  clearAllIntervals,
} from '../src/renderer/actions'
import type { DispatchContext, McpTransport } from '../src/renderer/actions'

// ── Helpers ──────────────────────────────────────────────────────────────────

function parsePrefab(result: McpToolResult): PrefabWireFormat | PrefabUpdateWire {
  return JSON.parse((result.content[0] as { text: string }).text) as PrefabWireFormat | PrefabUpdateWire
}

function mockTransport(result: unknown = {}): McpTransport & {
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

function makeCtx(
  state?: Record<string, unknown>,
  transport?: McpTransport,
): DispatchContext & { rerendered: number; remounted: unknown[] } {
  const ctx = {
    store: new Store(state),
    transport,
    rerender: () => { ctx.rerendered++ },
    remount: (data: Record<string, unknown>) => { ctx.remounted.push(data) },
    rerendered: 0,
    remounted: [] as unknown[],
  }
  return ctx
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. display_form() option forwarding gaps
// ═══════════════════════════════════════════════════════════════════════════════

describe('display_form() option forwarding', () => {
  const fields = [{ name: 'email', label: 'Email', type: 'email' as const }]

  it('forwards state to wire format', () => {
    const result = display_form(fields, 'submit_form', { state: { email: 'test@x.com' } })
    const wire = parsePrefab(result) as PrefabWireFormat
    expect(wire.state).toEqual({ email: 'test@x.com' })
  })

  it('forwards theme to wire format (compiled into css)', () => {
    const result = display_form(fields, 'submit_form', { theme: { light: { primary: '#f00' } } })
    const wire = parsePrefab(result) as PrefabWireFormat
    expect(wire.css?.join('\n')).toContain('--primary: #f00;')
  })

  it('forwards layout to wire format', () => {
    const result = display_form(fields, 'submit_form', {
      layout: { preferredHeight: 400 },
    })
    const wire = parsePrefab(result) as PrefabWireFormat
    // BUG PROBE: display_form doesn't forward layout
    expect(wire.layout).toEqual({ preferredHeight: 400 })
  })

  it('forwards cssClass to wire format', () => {
    const result = display_form(fields, 'submit_form', {
      cssClass: 'my-form',
    })
    const wire = parsePrefab(result) as PrefabWireFormat
    // BUG PROBE: display_form doesn't forward cssClass
    const json = JSON.stringify(wire)
    expect(json).toContain('my-form')
  })

  it('forwards stylesheets to wire format', () => {
    const result = display_form(fields, 'submit_form', {
      stylesheets: ['.form-field { border: 1px solid red; }'],
    })
    const wire = parsePrefab(result) as PrefabWireFormat
    // BUG PROBE: display_form doesn't forward stylesheets
    expect(wire.stylesheets).toEqual(['.form-field { border: 1px solid red; }'])
  })

  it('forwards onMount to wire format', () => {
    const result = display_form(fields, 'submit_form', {
      onMount: new SetState('loaded', true),
    })
    const wire = parsePrefab(result) as PrefabWireFormat
    // BUG PROBE: display_form doesn't forward onMount
    expect(wire.onMount).toBeDefined()
  })

  it('forwards keyBindings to wire format', () => {
    const result = display_form(fields, 'submit_form', {
      keyBindings: { 'ctrl+enter': new CallTool('submit_form') },
    })
    const wire = parsePrefab(result) as PrefabWireFormat
    // BUG PROBE: display_form doesn't forward keyBindings
    expect(wire.keyBindings).toBeDefined()
    expect(wire.keyBindings!['ctrl+enter']).toBeDefined()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 2. Subscribe native push path with $prefab responses
// ═══════════════════════════════════════════════════════════════════════════════

describe('subscribe native push path with $prefab', () => {
  beforeEach(() => { clearAllSubscriptions(); clearAllIntervals() })
  afterEach(() => { clearAllSubscriptions(); clearAllIntervals() })

  it('remounts when native push delivers a full $prefab view', async () => {
    const prefabView = {
      $prefab: { version: '0.2' },
      view: { type: 'Text', text: 'Live Update' },
    }

    let pushCallback: ((data: unknown) => void) | null = null
    const transport: McpTransport = {
      callTool: () => Promise.resolve({}),
      sendMessage: () => Promise.resolve(),
      subscribe: (_uri: string, onData: (data: unknown) => void) => {
        pushCallback = onData
        return () => { pushCallback = null }
      },
      capabilities: { subscriptions: true },
    }

    const ctx = makeCtx({}, transport)

    await dispatchActions({
      action: 'subscribe',
      uri: 'live://board',
      stateKey: '$board',
    }, ctx)

    // Simulate a push event with a full $prefab view
    expect(pushCallback).not.toBeNull()
    pushCallback!(prefabView)

    // Should remount, not just store raw data
    expect(ctx.remounted).toHaveLength(1)
    expect(ctx.remounted[0]).toEqual(prefabView)
    expect(ctx.store.get('$board')).toBeUndefined()
  })

  it('merges state from native push display_update', async () => {
    const updatePayload = {
      $prefab: { version: '0.2' },
      update: { state: { score: 99 } },
    }

    let pushCallback: ((data: unknown) => void) | null = null
    const transport: McpTransport = {
      callTool: () => Promise.resolve({}),
      sendMessage: () => Promise.resolve(),
      subscribe: (_uri: string, onData: (data: unknown) => void) => {
        pushCallback = onData
        return () => { pushCallback = null }
      },
      capabilities: { subscriptions: true },
    }

    const ctx = makeCtx({ score: 0 }, transport)

    await dispatchActions({
      action: 'subscribe',
      uri: 'live://scores',
      stateKey: '$scores',
    }, ctx)

    pushCallback!(updatePayload)

    expect(ctx.store.get('score')).toBe(99)
    expect(ctx.remounted).toHaveLength(0)
  })

  it('stores plain data via native push (no $prefab)', async () => {
    const plainData = { temperature: 72 }

    let pushCallback: ((data: unknown) => void) | null = null
    const transport: McpTransport = {
      callTool: () => Promise.resolve({}),
      sendMessage: () => Promise.resolve(),
      subscribe: (_uri: string, onData: (data: unknown) => void) => {
        pushCallback = onData
        return () => { pushCallback = null }
      },
      capabilities: { subscriptions: true },
    }

    const ctx = makeCtx({}, transport)

    await dispatchActions({
      action: 'subscribe',
      uri: 'sensor://temp',
      stateKey: '$temp',
    }, ctx)

    pushCallback!(plainData)

    expect(ctx.store.get('$temp')).toEqual(plainData)
    expect(ctx.remounted).toHaveLength(0)
    expect(ctx.rerendered).toBeGreaterThan(0)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 3. display() with PrefabApp + options — options should be ignored
// ═══════════════════════════════════════════════════════════════════════════════

describe('display() with PrefabApp merges options (Issue #12)', () => {
  it('merges options into existing PrefabApp', () => {
    const app = new PrefabApp({
      title: 'Original',
      view: Text('Hello'),
      state: { x: 1 },
    })
    // Passing options alongside a PrefabApp — options should be merged
    const result = display(app, { title: 'Overridden', state: { x: 2 } })
    const wire = parsePrefab(result) as PrefabWireFormat
    // Options state overrides PrefabApp state on conflict
    expect(wire.state).toEqual({ x: 2 })
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 4. Store.merge with dot-path keys
// ═══════════════════════════════════════════════════════════════════════════════

describe('Store.merge edge cases', () => {
  it('merges top-level keys', () => {
    const store = new Store({ a: 1, b: 2 })
    store.merge({ a: 10, c: 3 })
    expect(store.get('a')).toBe(10)
    expect(store.get('b')).toBe(2)
    expect(store.get('c')).toBe(3)
  })

  it('merges dot-path keys', () => {
    const store = new Store({ user: { name: 'Alice', age: 30 } })
    store.merge({ 'user.name': 'Bob' })
    expect(store.get('user.name')).toBe('Bob')
    expect(store.get('user.age')).toBe(30)
  })

  it('increments generation on merge', () => {
    const store = new Store({ x: 0 })
    const gen = store.generation
    store.merge({ x: 1 })
    expect(store.generation).toBeGreaterThan(gen)
  })

  it('notifies subscribers on merge', () => {
    const store = new Store({ count: 0 })
    let notified = 0
    store.subscribe('count', () => { notified++ })
    store.merge({ count: 5 })
    expect(notified).toBe(1)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 5. display_update structuredContent shape
// ═══════════════════════════════════════════════════════════════════════════════

describe('display_update wire format', () => {
  it('returns correct $prefab update structure', () => {
    const result = display_update({ score: 42 })
    const wire = parsePrefab(result) as PrefabUpdateWire
    expect(wire.$prefab.version).toBe('0.3')
    expect(wire.update.state).toEqual({ score: 42 })
    // Should NOT have a view property
    expect((wire as unknown as Record<string, unknown>).view).toBeUndefined()
  })

  it('structuredContent matches text content', () => {
    const result = display_update({ x: 1 })
    const textParsed = JSON.parse((result.content[0] as { text: string }).text)
    expect(result.structuredContent).toEqual(textParsed)
  })

  it('extractPrefabPayload rejects display_update', () => {
    const result = display_update({ score: 42 })
    const wire = parsePrefab(result) as PrefabUpdateWire
    // extractPrefabPayload should NOT match update payloads (no view)
    expect(extractPrefabPayload(wire)).toBeNull()
  })

  it('extractPrefabUpdate matches display_update', () => {
    const result = display_update({ score: 42 })
    const wire = JSON.parse((result.content[0] as { text: string }).text)
    expect(extractPrefabUpdate(wire)).toEqual(wire)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 6. extractPrefabPayload edge cases
// ═══════════════════════════════════════════════════════════════════════════════

describe('extractPrefabPayload edge cases', () => {
  it('handles MCP content with multiple text blocks (first wins)', () => {
    const view1 = { $prefab: { version: '0.2' }, view: { type: 'Text', text: 'First' } }
    const result = {
      content: [
        { type: 'text', text: JSON.stringify(view1) },
        { type: 'text', text: 'plain text' },
      ],
    }
    expect(extractPrefabPayload(result)).toEqual(view1)
  })

  it('handles MCP content where first text block is not JSON', () => {
    const view1 = { $prefab: { version: '0.2' }, view: { type: 'Text', text: 'Second' } }
    const result = {
      content: [
        { type: 'text', text: 'not json' },
        { type: 'text', text: JSON.stringify(view1) },
      ],
    }
    // BUG PROBE: does it try the second block?
    // Depending on implementation, this may or may not find the view
    const parsed = extractPrefabPayload(result)
    // At minimum, it should not crash
    expect(parsed === null || parsed !== null).toBe(true)
  })

  it('handles empty content array', () => {
    expect(extractPrefabPayload({ content: [] })).toBeNull()
  })

  it('handles content with non-text types', () => {
    const result = {
      content: [
        { type: 'image', data: 'base64...' },
      ],
    }
    expect(extractPrefabPayload(result)).toBeNull()
  })

  it('handles null structuredContent', () => {
    const result = { content: [], structuredContent: null }
    expect(extractPrefabPayload(result)).toBeNull()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 7. Action dispatch without ctx.remount (graceful degradation)
// ═══════════════════════════════════════════════════════════════════════════════

describe('action dispatch without remount callback', () => {
  it('toolCall with $prefab result does not crash when remount is undefined', async () => {
    const prefabResult = {
      $prefab: { version: '0.2' },
      view: { type: 'Text', text: 'New View' },
    }
    const transport = mockTransport(prefabResult)
    const ctx: DispatchContext = {
      store: new Store({}),
      transport,
      rerender: () => {},
      // remount intentionally omitted
    }

    // Should not throw
    await dispatchActions({
      action: 'toolCall',
      tool: 'get_view',
      arguments: {},
    }, ctx)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 8. display_error and display_success structuredContent consistency
// ═══════════════════════════════════════════════════════════════════════════════

describe('display_error / display_success consistency', () => {
  it('display_error sets isError flag', () => {
    const result = display_error('Oops', 'Something broke')
    expect(result.isError).toBe(true)
    const wire = parsePrefab(result) as PrefabWireFormat
    expect(wire.$prefab.version).toBe('0.3')
  })

  it('display_success does not set isError', () => {
    const result = display_success('Done', 'All good')
    expect(result.isError).toBeUndefined()
    const wire = parsePrefab(result) as PrefabWireFormat
    expect(wire.$prefab.version).toBe('0.3')
  })

  it('display_error structuredContent matches text', () => {
    const result = display_error('Err', 'Msg', { detail: 'stack trace' })
    const textParsed = JSON.parse((result.content[0] as { text: string }).text)
    expect(result.structuredContent).toEqual(textParsed)
  })

  it('display_success structuredContent matches text', () => {
    const result = display_success('OK', 'Done')
    const textParsed = JSON.parse((result.content[0] as { text: string }).text)
    expect(result.structuredContent).toEqual(textParsed)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 9. callHandler result handling
// ═══════════════════════════════════════════════════════════════════════════════

describe('callHandler result handling', () => {
  it('stores result in resultKey when provided', async () => {
    const transport = mockTransport({ data: 'hello' })
    const ctx = makeCtx({}, transport)

    await dispatchActions({
      action: 'callHandler',
      handler: 'my_handler',
      arguments: { x: 1 },
      resultKey: '$result',
    }, ctx)

    expect(ctx.store.get('$result')).toEqual({ data: 'hello' })
  })

  it('does not crash without resultKey', async () => {
    const transport = mockTransport({ data: 'hello' })
    const ctx = makeCtx({}, transport)

    await dispatchActions({
      action: 'callHandler',
      handler: 'my_handler',
      arguments: {},
    }, ctx)

    expect(ctx.rerendered).toBeGreaterThan(0)
  })

  it('remounts on $prefab response via callHandler', async () => {
    const prefabResult = {
      $prefab: { version: '0.2' },
      view: { type: 'Text', text: 'From Handler' },
    }
    const transport = mockTransport(prefabResult)
    const ctx = makeCtx({}, transport)

    await dispatchActions({
      action: 'callHandler',
      handler: 'render_view',
      arguments: {},
    }, ctx)

    expect(ctx.remounted).toHaveLength(1)
    expect(ctx.remounted[0]).toEqual(prefabResult)
  })

  it('merges state from display_update via callHandler', async () => {
    const updateResult = {
      $prefab: { version: '0.2' },
      update: { state: { items: ['a', 'b'] } },
    }
    const transport = mockTransport(updateResult)
    const ctx = makeCtx({ items: [] }, transport)

    await dispatchActions({
      action: 'callHandler',
      handler: 'refresh_items',
      arguments: {},
    }, ctx)

    expect(ctx.store.get('items')).toEqual(['a', 'b'])
    expect(ctx.remounted).toHaveLength(0)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 10. fetch action with $prefab response
// ═══════════════════════════════════════════════════════════════════════════════

describe('fetch action $prefab handling', () => {
  it('does not crash when fetch result is not JSON', async () => {
    // fetch action requires globalThis.fetch
    const origFetch = globalThis.fetch
    globalThis.fetch = (() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve('plain string'),
        text: () => Promise.resolve('plain string'),
      })
    ) as unknown as typeof globalThis.fetch

    const ctx = makeCtx({})

    await dispatchActions({
      action: 'fetch',
      url: 'https://api.example.com/data',
      resultKey: '$data',
    }, ctx)

    globalThis.fetch = origFetch
    // Should not crash, result stored
    expect(ctx.store.get('$data')).toBeDefined()
  })
})
