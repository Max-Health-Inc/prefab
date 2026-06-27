/**
 * TDD tests for remount bugs in PrefabRenderer.mount().
 *
 * These tests are written RED-first: they expose bugs in the current
 * remount() implementation, then the code is fixed to make them GREEN.
 *
 * @happy-dom
 */

import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import { PrefabRenderer } from '../src/renderer/index'
import type { PrefabWireData, MountedApp } from '../src/renderer/index'
import { dispatchActions } from '../src/renderer/actions'
import type { McpTransport, DispatchContext } from '../src/renderer/actions'
import { Store } from '../src/renderer/state'
import { listPipes, unregisterPipe } from '../src/rx/pipes'

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeWire(view: Record<string, unknown>, extras?: Partial<PrefabWireData>): PrefabWireData {
  return { $prefab: { version: '0.2' }, view: view as PrefabWireData['view'], ...extras }
}

function mockTransport(result: unknown): McpTransport {
  return {
    callTool: () => Promise.resolve(result),
    sendMessage: () => Promise.resolve(),
  }
}

// ── Bug #1: Pipes not hydrated on remount ────────────────────────────────────

describe('remount: pipe hydration', () => {
  let root: HTMLElement
  let mounted: MountedApp

  afterEach(() => {
    mounted?.destroy()
    // Clean up any test pipes
    try { unregisterPipe('greet') } catch { /* noop */ }
  })

  it('hydrates pipes from the new wire data on remount via toolCall', async () => {
    // Initial mount: button that calls a tool
    const initialWire = makeWire({
      type: 'Column',
      children: [
        { type: 'Text', content: 'initial' },
        { type: 'Button', label: 'Go', onClick: { action: 'toolCall', tool: 'next', arguments: {} } },
      ],
    })

    // Tool returns new wire data with a pipe
    const newWire = makeWire(
      { type: 'Text', content: '{{ name | greet }}' },
      {
        state: { name: 'Alice' },
        pipes: { greet: '(v) => `Hello ${v}!`' },
      },
    )

    root = document.createElement('div')
    const transport = mockTransport(newWire)
    mounted = PrefabRenderer.mount(root, initialWire, { transport, themeToggle: false })

    expect(root.textContent).toContain('initial')

    // Click button → toolCall → remount
    root.querySelector('button')!.click()
    await new Promise(r => setTimeout(r, 50))

    // The pipe should be registered and used in the new view
    expect(listPipes()).toContain('greet')
    expect(root.textContent).toContain('Hello Alice!')
  })
})

// ── Bug #2: Stylesheets not swapped on remount ──────────────────────────────

describe('remount: stylesheet swap', () => {
  let root: HTMLElement
  let mounted: MountedApp

  beforeEach(() => {
    // Clean up any injected styles from previous tests
    document.querySelectorAll('style[data-prefab="injected"]').forEach(s => s.remove())
  })
  afterEach(() => { mounted?.destroy() })

  it('swaps stylesheets on remount via toolCall', async () => {
    const initialWire = makeWire(
      {
        type: 'Column',
        children: [
          { type: 'Text', content: 'v1' },
          { type: 'Button', label: 'Go', onClick: { action: 'toolCall', tool: 'next', arguments: {} } },
        ],
      },
      { stylesheets: ['.v1 { color: red; }'] },
    )

    const newWire = makeWire(
      { type: 'Text', content: 'v2' },
      { stylesheets: ['.v2 { color: blue; }'] },
    )

    root = document.createElement('div')
    const transport = mockTransport(newWire)
    mounted = PrefabRenderer.mount(root, initialWire, { transport, themeToggle: false })

    // Verify initial stylesheet
    let styles = document.querySelectorAll('style[data-prefab="injected"]')
    expect(styles.length).toBe(1)
    expect(styles[0].textContent).toContain('.v1')

    // Click button → toolCall → remount
    root.querySelector('button')!.click()
    await new Promise(r => setTimeout(r, 50))

    // Only new stylesheet should remain
    styles = document.querySelectorAll('style[data-prefab="injected"]')
    expect(styles.length).toBe(1)
    expect(styles[0].textContent).toContain('.v2')
    expect(styles[0].textContent).not.toContain('.v1')
  })
})

// ── Bug #3: Layout hints not updated on remount ─────────────────────────────

describe('remount: layout hints', () => {
  let root: HTMLElement
  let mounted: MountedApp

  afterEach(() => { mounted?.destroy() })

  it('applies initial layout hints', () => {
    const wire = makeWire(
      { type: 'Text', content: 'sized' },
      { layout: { preferredHeight: 400, minHeight: 200 } },
    )

    root = document.createElement('div')
    mounted = PrefabRenderer.mount(root, wire, { themeToggle: false })

    expect(root.style.height).toBe('400px')
    expect(root.style.minHeight).toBe('200px')
  })

  it('updates layout hints on remount via toolCall', async () => {
    const initialWire = makeWire(
      {
        type: 'Column',
        children: [
          { type: 'Text', content: 'small' },
          { type: 'Button', label: 'Resize', onClick: { action: 'toolCall', tool: 'resize', arguments: {} } },
        ],
      },
      { layout: { preferredHeight: 200 } },
    )

    const newWire = makeWire(
      { type: 'Text', content: 'large' },
      { layout: { preferredHeight: 600, maxHeight: 800 } },
    )

    root = document.createElement('div')
    const transport = mockTransport(newWire)
    mounted = PrefabRenderer.mount(root, initialWire, { transport, themeToggle: false })
    expect(root.style.height).toBe('200px')

    // Click button → toolCall → remount
    root.querySelector('button')!.click()
    await new Promise(r => setTimeout(r, 50))

    expect(root.style.height).toBe('600px')
    expect(root.style.maxHeight).toBe('800px')
    // Old minHeight should be cleared
    expect(root.style.minHeight).toBe('')
  })

  it('clears layout hints when new view has none', async () => {
    const initialWire = makeWire(
      {
        type: 'Column',
        children: [
          { type: 'Text', content: 'constrained' },
          { type: 'Button', label: 'Free', onClick: { action: 'toolCall', tool: 'free', arguments: {} } },
        ],
      },
      { layout: { preferredHeight: 300, maxHeight: 500 } },
    )

    const newWire = makeWire(
      { type: 'Text', content: 'unconstrained' },
      // No layout
    )

    root = document.createElement('div')
    const transport = mockTransport(newWire)
    mounted = PrefabRenderer.mount(root, initialWire, { transport, themeToggle: false })
    expect(root.style.height).toBe('300px')
    expect(root.style.maxHeight).toBe('500px')

    root.querySelector('button')!.click()
    await new Promise(r => setTimeout(r, 50))

    // Layout should be cleared
    expect(root.style.height).toBe('')
    expect(root.style.maxHeight).toBe('')
  })
})

// ── Bug #4: callHandler should also remount ─────────────────────────────────

describe('callHandler remount', () => {
  it('calls remount when callHandler returns a prefab wire payload', async () => {
    const newView = { $prefab: { version: '0.2' }, view: { type: 'Text', text: 'handler-view' } }
    const transport = mockTransport(newView)
    const remounted: Record<string, unknown>[] = []

    const ctx: DispatchContext = {
      store: new Store(),
      transport,
      rerender: () => {},
      remount: (data) => remounted.push(data),
    }

    await dispatchActions({
      action: 'callHandler',
      handler: 'my_handler',
      arguments: { x: 1 },
    }, ctx)

    expect(remounted).toHaveLength(1)
    expect(remounted[0]).toBe(newView)
  })
})

// ── Bug #5: fetch action should also check for prefab payloads ──────────────

describe('fetch remount', () => {
  it('calls remount when fetch returns a prefab wire payload', async () => {
    const newView = { $prefab: { version: '0.2' }, view: { type: 'Text', text: 'fetched-view' } }
    const remounted: Record<string, unknown>[] = []
    let rerendered = 0

    // Mock fetch
    const originalFetch = globalThis.fetch
    globalThis.fetch = (() => Promise.resolve(new Response(JSON.stringify(newView), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }))) as unknown as typeof globalThis.fetch

    try {
      const ctx: DispatchContext = {
        store: new Store(),
        rerender: () => { rerendered++ },
        remount: (data) => remounted.push(data),
      }

      await dispatchActions({
        action: 'fetch',
        url: 'https://example.com/api/view',
        resultKey: 'result',
      }, ctx)

      // fetch should detect the prefab payload and call remount
      expect(remounted).toHaveLength(1)
      expect(rerendered).toBe(0)
    } finally {
      globalThis.fetch = originalFetch
    }
  })

  it('falls back to rerender when fetch returns non-prefab data', async () => {
    let rerendered = 0
    const remounted: Record<string, unknown>[] = []

    const originalFetch = globalThis.fetch
    globalThis.fetch = (() => Promise.resolve(new Response(JSON.stringify({ data: 42 }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }))) as unknown as typeof globalThis.fetch

    try {
      const ctx: DispatchContext = {
        store: new Store(),
        rerender: () => { rerendered++ },
        remount: (data) => remounted.push(data),
      }

      await dispatchActions({
        action: 'fetch',
        url: 'https://example.com/api/data',
        resultKey: 'result',
      }, ctx)

      expect(remounted).toHaveLength(0)
      expect(rerendered).toBeGreaterThan(0)
    } finally {
      globalThis.fetch = originalFetch
    }
  })
})

// ── Bug #6: MCP content array with $prefab in text block ─────────────────────

describe('toolCall: MCP content text block extraction', () => {
  it('remounts when callTool returns MCP content array with prefab JSON', async () => {
    const prefabPayload = { $prefab: { version: '0.2' }, view: { type: 'Text', content: 'from-content' } }
    const mcpResult = {
      content: [{ type: 'text', text: JSON.stringify(prefabPayload) }],
    }
    const transport = mockTransport(mcpResult)
    const remounted: Record<string, unknown>[] = []

    const ctx: DispatchContext = {
      store: new Store(),
      transport,
      rerender: () => {},
      remount: (data) => remounted.push(data),
    }

    await dispatchActions({
      action: 'toolCall',
      tool: 'get_view',
      arguments: {},
    }, ctx)

    expect(remounted).toHaveLength(1)
    expect((remounted[0] as { view: { type: string } }).view.type).toBe('Text')
  })
})

// ── E2E: Full mount → toolCall → remount cycle ──────────────────────────────

describe('mount → toolCall → remount (E2E)', () => {
  let root: HTMLElement
  let mounted: MountedApp

  afterEach(() => { mounted?.destroy() })

  it('button click triggers toolCall that replaces the entire view', async () => {
    // Initial view: a button that calls a tool
    const initialWire = makeWire(
      {
        type: 'Column',
        children: [
          { type: 'Text', content: 'Page 1' },
          {
            type: 'Button',
            label: 'Next',
            onClick: { action: 'toolCall', tool: 'next_page', arguments: {} },
          },
        ],
      },
    )

    // Tool returns a completely new view
    const newView = makeWire(
      { type: 'Text', content: 'Page 2' },
    )

    root = document.createElement('div')
    const transport = mockTransport(newView)
    mounted = PrefabRenderer.mount(root, initialWire, { transport, themeToggle: false })

    expect(root.textContent).toContain('Page 1')

    // Click the button
    const button = root.querySelector('button')
    expect(button).not.toBeNull()
    button!.click()

    // Wait for async toolCall to complete
    await new Promise(r => setTimeout(r, 50))

    // The view should now show Page 2
    expect(root.textContent).toContain('Page 2')
    expect(root.textContent).not.toContain('Page 1')
  })

  it('preserves store values set before remount', async () => {
    const initialWire = makeWire(
      {
        type: 'Column',
        children: [
          { type: 'Text', content: 'Count: {{ count }}' },
          {
            type: 'Button',
            label: 'Go',
            onClick: [
              { action: 'setState', key: 'count', value: 42 },
              { action: 'toolCall', tool: 'next_view', arguments: {} },
            ],
          },
        ],
      },
      { state: { count: 0 } },
    )

    // Tool returns a new view that also reads `count`
    const newView = makeWire(
      { type: 'Text', content: 'Final count: {{ count }}' },
      { state: { extra: 'data' } }, // merges, should not overwrite count
    )

    root = document.createElement('div')
    const transport = mockTransport(newView)
    mounted = PrefabRenderer.mount(root, initialWire, { transport, themeToggle: false })

    const button = root.querySelector('button')
    button!.click()
    await new Promise(r => setTimeout(r, 50))

    // count was set to 42 by setState before the toolCall
    // remount merges state — count should still be 42
    expect(root.textContent).toContain('Final count: 42')
    expect(mounted.store.get('extra')).toBe('data')
  })
})

// ── display_update: state merge via toolCall ─────────────────────────────────

describe('display_update via toolCall', () => {
  it('merges state from direct display_update payload', async () => {
    const updatePayload = { $prefab: { version: '0.2' }, update: { state: { count: 99 } } }
    const transport = mockTransport(updatePayload)
    const remounted: Record<string, unknown>[] = []
    let rerendered = 0

    const ctx: DispatchContext = {
      store: new Store({ count: 0, other: 'keep' }),
      transport,
      rerender: () => { rerendered++ },
      remount: (data) => remounted.push(data),
    }

    await dispatchActions({
      action: 'toolCall',
      tool: 'update_count',
      arguments: {},
      resultKey: 'result',
    }, ctx)

    // Should NOT remount
    expect(remounted).toHaveLength(0)
    // Should rerender
    expect(rerendered).toBeGreaterThan(0)
    // State should be merged
    expect(ctx.store.get('count')).toBe(99)
    // Other keys should be preserved
    expect(ctx.store.get('other')).toBe('keep')
    // Raw result still stored in resultKey
    expect(ctx.store.get('result')).toEqual(updatePayload)
  })

  it('merges state from structuredContent wrapper', async () => {
    const updatePayload = { $prefab: { version: '0.2' }, update: { state: { x: 42 } } }
    const mcpResult = { content: [], structuredContent: updatePayload }
    const transport = mockTransport(mcpResult)

    const ctx: DispatchContext = {
      store: new Store({ x: 0 }),
      transport,
      rerender: () => {},
      remount: () => {},
    }

    await dispatchActions({
      action: 'toolCall',
      tool: 'update_state',
      arguments: {},
    }, ctx)

    expect(ctx.store.get('x')).toBe(42)
  })

  it('merges state from MCP content text block', async () => {
    const updatePayload = { $prefab: { version: '0.2' }, update: { state: { y: 'hello' } } }
    const mcpResult = { content: [{ type: 'text', text: JSON.stringify(updatePayload) }] }
    const transport = mockTransport(mcpResult)

    const ctx: DispatchContext = {
      store: new Store({}),
      transport,
      rerender: () => {},
      remount: () => {},
    }

    await dispatchActions({
      action: 'toolCall',
      tool: 'update_state',
      arguments: {},
    }, ctx)

    expect(ctx.store.get('y')).toBe('hello')
  })
})

// ── E2E: mount → toolCall → display_update ───────────────────────────────────

describe('mount → toolCall → display_update (E2E)', () => {
  let root: HTMLElement
  let mounted: MountedApp

  afterEach(() => { mounted?.destroy() })

  it('button click triggers toolCall that merges state update into view', async () => {
    const initialWire = makeWire(
      {
        type: 'Column',
        children: [
          { type: 'Text', content: 'Score: {{ score }}' },
          {
            type: 'Button',
            label: 'Refresh',
            onClick: { action: 'toolCall', tool: 'get_score', arguments: {} },
          },
        ],
      },
      { state: { score: 0 } },
    )

    // Tool returns a display_update (state delta, not a new view)
    const updateResult = { $prefab: { version: '0.2' }, update: { state: { score: 100 } } }

    root = document.createElement('div')
    const transport = mockTransport(updateResult)
    mounted = PrefabRenderer.mount(root, initialWire, { transport, themeToggle: false })

    expect(root.textContent).toContain('Score: 0')

    // Click button → toolCall → display_update → state merge → rerender
    root.querySelector('button')!.click()
    await new Promise(r => setTimeout(r, 50))

    // View stays the same, but state is updated
    expect(root.textContent).toContain('Score: 100')
    expect(root.querySelector('button')).not.toBeNull() // view preserved
  })
})
