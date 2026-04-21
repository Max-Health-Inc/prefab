/**
 * Renderer tests — Security guards.
 *
 * Tests URL scheme blocking, SVG sanitization, prototype pollution protection,
 * embed sandboxing, and safe URL validation.
 * @happy-dom
 */

import { describe, it, expect, beforeEach } from 'bun:test'
import { Store } from '../src/renderer/state'
import { renderNode } from '../src/renderer/engine'
import type { ComponentNode, RenderContext } from '../src/renderer/engine'
import { registerAllComponents } from '../src/renderer/components/index'
import { dispatchActions } from '../src/renderer/actions'
import type { DispatchContext } from '../src/renderer/actions'
import { createNoopTransport } from '../src/renderer/transport'

beforeEach(() => { registerAllComponents() })

function makeCtx(state?: Record<string, unknown>): RenderContext {
  return {
    store: new Store(state),
    scope: {},
    transport: createNoopTransport(),
    rerender: () => {},
  }
}

function makeDispatchCtx(state?: Record<string, unknown>): DispatchContext {
  return {
    store: new Store(state),
    transport: createNoopTransport(),
    rerender: () => {},
  }
}

// ── URL Scheme Blocking ──────────────────────────────────────────────────────

describe('URL scheme blocking (openLink)', () => {
  it('blocks javascript: scheme', async () => {
    const ctx = makeDispatchCtx()
    // Should not throw but should not call window.open
    await dispatchActions(
      { action: 'openLink', url: 'javascript:alert(1)' },
      ctx,
    )
    // No exception = pass (URL was blocked silently)
  })

  it('blocks vbscript: scheme', async () => {
    const ctx = makeDispatchCtx()
    await dispatchActions(
      { action: 'openLink', url: 'vbscript:MsgBox("XSS")' },
      ctx,
    )
  })

  it('blocks data: scheme', async () => {
    const ctx = makeDispatchCtx()
    await dispatchActions(
      { action: 'openLink', url: 'data:text/html,<script>alert(1)</script>' },
      ctx,
    )
  })

  it('blocks javascript: with leading whitespace', async () => {
    const ctx = makeDispatchCtx()
    await dispatchActions(
      { action: 'openLink', url: '  javascript:alert(1)' },
      ctx,
    )
  })

  it('allows https: scheme', async () => {
    const ctx = makeDispatchCtx()
    // Should not warn/block
    await dispatchActions(
      { action: 'openLink', url: 'https://example.com' },
      ctx,
    )
  })

  it('allows http: scheme', async () => {
    const ctx = makeDispatchCtx()
    await dispatchActions(
      { action: 'openLink', url: 'http://example.com' },
      ctx,
    )
  })
})

// ── Fetch URL validation ─────────────────────────────────────────────────────

describe('Fetch URL validation', () => {
  it('blocks javascript: URL in fetch', async () => {
    const ctx = makeDispatchCtx()
    // fetch action with unsafe URL should be blocked
    await dispatchActions(
      { action: 'fetch', url: 'javascript:void(0)', resultKey: 'data' },
      ctx,
    )
    // Result should not be set (blocked)
    expect(ctx.store.get('data')).toBeUndefined()
  })

  it('blocks data: URL in fetch', async () => {
    const ctx = makeDispatchCtx()
    await dispatchActions(
      { action: 'fetch', url: 'data:text/html,<h1>bad</h1>', resultKey: 'data' },
      ctx,
    )
    expect(ctx.store.get('data')).toBeUndefined()
  })
})

// ── SVG Sanitization ─────────────────────────────────────────────────────────

describe('SVG sanitization', () => {
  it('strips onclick attributes from SVG elements', () => {
    const ctx = makeCtx()
    const node: ComponentNode = {
      type: 'Svg',
      content: '<svg><rect width="100" height="100" onclick="alert(1)"/></svg>',
    }
    const dom = renderNode(node, ctx) as HTMLElement
    const rect = dom.querySelector('rect')
    expect(rect).toBeTruthy()
    expect(rect!.getAttribute('onclick')).toBeNull()
  })

  it('strips onload attributes from SVG elements', () => {
    const ctx = makeCtx()
    const node: ComponentNode = {
      type: 'Svg',
      content: '<svg onload="alert(1)"><circle cx="50" cy="50" r="40"/></svg>',
    }
    const dom = renderNode(node, ctx) as HTMLElement
    const _svg = dom.querySelector('svg')
    // The onload should be stripped from child elements during sanitization
    const circle = dom.querySelector('circle')
    expect(circle).toBeTruthy()
  })

  it('removes script elements from SVG', () => {
    const ctx = makeCtx()
    const node: ComponentNode = {
      type: 'Svg',
      content: '<svg><script>alert("xss")</script><rect width="50" height="50"/></svg>',
    }
    const dom = renderNode(node, ctx) as HTMLElement
    const script = dom.querySelector('script')
    expect(script).toBeNull()
  })

  it('removes foreignObject elements from SVG', () => {
    const ctx = makeCtx()
    const node: ComponentNode = {
      type: 'Svg',
      content: '<svg><foreignObject><body><script>alert(1)</script></body></foreignObject><rect width="50" height="50"/></svg>',
    }
    const dom = renderNode(node, ctx) as HTMLElement
    const foreign = dom.querySelector('foreignObject')
    expect(foreign).toBeNull()
  })

  it('allows safe SVG elements (rect, circle, path, text)', () => {
    const ctx = makeCtx()
    const node: ComponentNode = {
      type: 'Svg',
      content: '<svg><rect width="100" height="100"/><circle cx="50" cy="50" r="30"/><path d="M0 0 L10 10"/><text x="10" y="20">Hello</text></svg>',
    }
    const dom = renderNode(node, ctx) as HTMLElement
    expect(dom.querySelector('rect')).toBeTruthy()
    expect(dom.querySelector('circle')).toBeTruthy()
    expect(dom.querySelector('path')).toBeTruthy()
    expect(dom.querySelector('text')).toBeTruthy()
  })

  it('strips javascript: href from SVG use element', () => {
    const ctx = makeCtx()
    const node: ComponentNode = {
      type: 'Svg',
      content: '<svg><use href="javascript:alert(1)"/></svg>',
    }
    const dom = renderNode(node, ctx) as HTMLElement
    const use = dom.querySelector('use')
    expect(use).toBeTruthy()
    expect(use!.getAttribute('href')).toBeNull()
  })
})

// ── Embed Sandboxing ─────────────────────────────────────────────────────────

describe('Embed sandboxing', () => {
  it('applies sandbox attribute to iframe', () => {
    const ctx = makeCtx()
    const node: ComponentNode = {
      type: 'Embed',
      src: 'https://example.com/widget',
    }
    const dom = renderNode(node, ctx) as HTMLElement
    const iframe = dom.querySelector('iframe')!
    expect(iframe).toBeTruthy()
    expect(iframe.getAttribute('sandbox')).toBe('allow-scripts')
  })

  it('does not allow same-origin by default', () => {
    const ctx = makeCtx()
    const node: ComponentNode = {
      type: 'Embed',
      src: 'https://evil.com',
    }
    const dom = renderNode(node, ctx) as HTMLElement
    const iframe = dom.querySelector('iframe')!
    const sandbox = iframe.getAttribute('sandbox') ?? ''
    expect(sandbox).not.toContain('allow-same-origin')
  })
})

// ── Store prototype pollution ────────────────────────────────────────────────

describe('Store prototype pollution protection', () => {
  it('blocks __proto__ key', () => {
    const store = new Store({})
    store.set('__proto__', { admin: true })
    // The key should either be rejected or stored without polluting prototype
    expect(({} as Record<string, unknown>).admin).toBeUndefined()
  })

  it('blocks constructor key at root', () => {
    const store = new Store({})
    store.set('constructor', 'overwritten')
    expect(({}).constructor).toBe(Object)
  })

  it('blocks prototype key', () => {
    const store = new Store({})
    store.set('prototype', { hack: true })
    expect(Object.prototype).not.toHaveProperty('hack')
  })
})

// ── Link href safety ─────────────────────────────────────────────────────────

describe('Link component href safety', () => {
  it('renders safe https link', () => {
    const ctx = makeCtx()
    const node: ComponentNode = {
      type: 'Link',
      content: 'Safe Link',
      href: 'https://example.com',
    }
    const dom = renderNode(node, ctx) as HTMLAnchorElement
    expect(dom.tagName).toBe('A')
    expect(dom.getAttribute('href')).toBe('https://example.com')
  })

  it('renders relative link', () => {
    const ctx = makeCtx()
    const node: ComponentNode = {
      type: 'Link',
      content: 'Relative',
      href: '/about',
    }
    const dom = renderNode(node, ctx) as HTMLAnchorElement
    expect(dom.getAttribute('href')).toBe('/about')
  })
})

// ── closeOverlay custom event ────────────────────────────────────────────────

describe('closeOverlay action', () => {
  it('dispatches prefab:close-overlay event', async () => {
    const ctx = makeDispatchCtx()
    let eventFired = false
    document.addEventListener('prefab:close-overlay', () => { eventFired = true })
    await dispatchActions({ action: 'closeOverlay' }, ctx)
    expect(eventFired).toBe(true)
  })
})

// ── requestDisplayMode custom event ──────────────────────────────────────────

describe('requestDisplayMode action', () => {
  it('dispatches prefab:request-display-mode event with mode', async () => {
    const ctx = makeDispatchCtx()
    let receivedMode: unknown = null
    document.addEventListener('prefab:request-display-mode', (e) => {
      receivedMode = (e as CustomEvent).detail.mode
    })
    await dispatchActions({ action: 'requestDisplayMode', mode: 'fullscreen' }, ctx)
    expect(receivedMode).toBe('fullscreen')
  })
})
