/**
 * TDD tests for issue #4 — camelCase vs snake_case wire format.
 *
 * Tests that:
 *   1. TS serializer outputs camelCase field names (matching PrefectHQ/prefab by_alias=True)
 *   2. Renderer accepts both snake_case and camelCase input
 *   3. Actions serialize with camelCase field names
 *
 * @happy-dom
 */

import { describe, it, expect, beforeAll } from 'bun:test'

// ── Builder imports ──────────────────────────────────────────────────────────
import {
  Button, Column, Input, Form, Select, SelectOption,
  Metric, GridItem,
  SetState, SetInterval, CallTool, CallHandler, Fetch, OpenFilePicker,
  Subscribe, ShowToast,
} from '../src/index'

// ── Renderer imports ─────────────────────────────────────────────────────────
import { registerAllComponents } from '../src/renderer/components/index'
import { renderNode } from '../src/renderer/engine'
import type { ComponentNode, RenderContext } from '../src/renderer/engine'
import { Store } from '../src/renderer/state'
import { dispatchActions, clearAllIntervals, clearAllSubscriptions } from '../src/renderer/actions'
import type { DispatchContext, ToastEvent, McpTransport } from '../src/renderer/actions'
import { createNoopTransport } from '../src/renderer/transport'

beforeAll(() => registerAllComponents())

function renderCtx(state?: Record<string, unknown>): RenderContext {
  return {
    store: new Store(state),
    scope: {},
    transport: createNoopTransport(),
    rerender: () => { /* noop */ },
  }
}

function makeCtx(
  state?: Record<string, unknown>,
  transport?: McpTransport,
): DispatchContext & { rerendered: number; toasts: ToastEvent[] } {
  const ctx = {
    store: new Store(state),
    transport: transport ?? createNoopTransport(),
    rerender: () => { ctx.rerendered++ },
    onToast: (t: ToastEvent) => ctx.toasts.push(t),
    rerendered: 0,
    toasts: [] as ToastEvent[],
  }
  return ctx
}

// ═════════════════════════════════════════════════════════════════════════════
// PART 1: Serializer should output snake_case
// ═════════════════════════════════════════════════════════════════════════════

describe('Serializer outputs camelCase field names', () => {

  it('Button: onClick stays camelCase', () => {
    const btn = Button('Refresh', {
      onClick: new CallTool('_action', { arguments: { action: 'refresh' } }),
    })
    const json = btn.toJSON()
    expect(json.onClick).toBeDefined()
    expect(json.on_click).toBeUndefined()
  })

  it('Form: onSubmit stays camelCase', () => {
    const form = Form({
      onSubmit: new CallTool('submit'),
      children: [],
    })
    const json = form.toJSON()
    expect(json.onSubmit).toBeDefined()
    expect(json.on_submit).toBeUndefined()
  })

  it('Component: cssClass stays camelCase', () => {
    const col = Column({ cssClass: 'my-class', children: [] })
    const json = col.toJSON()
    expect(json.cssClass).toBe('my-class')
    expect(json.css_class).toBeUndefined()
  })

  it('Component: onMount stays camelCase', () => {
    const col = Column({
      onMount: new SetState('x', 1),
      children: [],
    })
    const json = col.toJSON()
    expect(json.onMount).toBeDefined()
    expect(json.on_mount).toBeUndefined()
  })

  it('Input: inputType stays camelCase', () => {
    const input = Input({ name: 'email', inputType: 'email' })
    const json = input.toJSON()
    expect(json.inputType).toBe('email')
    expect(json.input_type).toBeUndefined()
  })

  it('StatefulComponent: onChange stays camelCase', () => {
    const sel = Select({
      name: 'choice',
      onChange: new SetState('x', 1),
      children: [SelectOption('a')],
    })
    const json = sel.toJSON()
    expect(json.onChange).toBeDefined()
    expect(json.on_change).toBeUndefined()
  })

  it('Metric: trendSentiment stays camelCase', () => {
    const m = Metric({ label: 'Users', value: '100', trendSentiment: 'positive' })
    const json = m.toJSON()
    expect(json.trendSentiment).toBe('positive')
    expect(json.trend_sentiment).toBeUndefined()
  })

  it('GridItem: colSpan/rowSpan stay camelCase', () => {
    const gi = GridItem({ colSpan: 2, rowSpan: 3, children: [] })
    const json = gi.toJSON()
    expect(json.colSpan).toBe(2)
    expect(json.col_span).toBeUndefined()
    expect(json.rowSpan).toBe(3)
    expect(json.row_span).toBeUndefined()
  })
})

describe('Action serialization outputs camelCase', () => {

  it('SetInterval: intervalMs/onTick stay camelCase', () => {
    const action = new SetInterval(1000, new SetState('x', 1))
    const json = action.toJSON()
    expect(json.intervalMs).toBe(1000)
    expect(json.interval_ms).toBeUndefined()
    expect(json.onTick).toBeDefined()
    expect(json.on_tick).toBeUndefined()
  })

  it('CallTool: resultKey/onSuccess/onError stay camelCase', () => {
    const action = new CallTool('get_data', {
      resultKey: '$data',
      onSuccess: new ShowToast('Done'),
      onError: new ShowToast('Failed'),
    })
    const json = action.toJSON()
    expect(json.resultKey).toBe('$data')
    expect(json.result_key).toBeUndefined()
    expect(json.onSuccess).toBeDefined()
    expect(json.on_success).toBeUndefined()
    expect(json.onError).toBeDefined()
    expect(json.on_error).toBeUndefined()
  })

  it('SetState: onSuccess/onError stay camelCase', () => {
    const action = new SetState('x', 1, {
      onSuccess: new ShowToast('OK'),
      onError: new ShowToast('Err'),
    })
    const json = action.toJSON()
    expect(json.onSuccess).toBeDefined()
    expect(json.on_success).toBeUndefined()
    expect(json.onError).toBeDefined()
    expect(json.on_error).toBeUndefined()
  })

  it('Fetch: resultKey stays camelCase', () => {
    const action = new Fetch('https://api.example.com', {
      resultKey: '$data',
      onSuccess: new ShowToast('OK'),
    })
    const json = action.toJSON()
    expect(json.resultKey).toBe('$data')
    expect(json.result_key).toBeUndefined()
    expect(json.onSuccess).toBeDefined()
    expect(json.on_success).toBeUndefined()
  })

  it('OpenFilePicker: resultKey/onSuccess stay camelCase', () => {
    const action = new OpenFilePicker({
      resultKey: '$files',
      onSuccess: new ShowToast('Uploaded'),
    })
    const json = action.toJSON()
    expect(json.resultKey).toBe('$files')
    expect(json.onSuccess).toBeDefined()
  })

  it('CallHandler: resultKey/onSuccess/onError stay camelCase', () => {
    const action = new CallHandler('handler', {
      resultKey: '$result',
      onSuccess: new ShowToast('OK'),
      onError: new ShowToast('Err'),
    })
    const json = action.toJSON()
    expect(json.resultKey).toBe('$result')
    expect(json.onSuccess).toBeDefined()
    expect(json.onError).toBeDefined()
  })

  it('Subscribe: stateKey/fallbackInterval/etc. stay camelCase', () => {
    const action = new Subscribe('chess://game', {
      stateKey: '$game',
      fallbackInterval: 2000,
      fallbackTool: '_action',
      fallbackArgs: { action: 'refresh' },
      onData: new ShowToast('Updated'),
      onError: new ShowToast('Error'),
    })
    const json = action.toJSON()
    expect(json.stateKey).toBe('$game')
    expect(json.state_key).toBeUndefined()
    expect(json.fallbackInterval).toBe(2000)
    expect(json.fallback_interval).toBeUndefined()
    expect(json.fallbackTool).toBe('_action')
    expect(json.fallback_tool).toBeUndefined()
    expect(json.fallbackArgs).toBeDefined()
    expect(json.fallback_args).toBeUndefined()
    expect(json.onData).toBeDefined()
    expect(json.on_data).toBeUndefined()
    expect(json.onError).toBeDefined()
    expect(json.on_error).toBeUndefined()
  })
})

// ═════════════════════════════════════════════════════════════════════════════
// PART 2: Renderer accepts both snake_case and camelCase input
// ═════════════════════════════════════════════════════════════════════════════

describe('Renderer accepts snake_case component input', () => {

  it('renders css_class as className', () => {
    const node: ComponentNode = {
      type: 'Column',
      css_class: 'gap-4 my-custom',
      children: [{ type: 'Text', content: 'hello' }],
    }
    const el = renderNode(node, renderCtx()) as HTMLElement
    expect(el.className).toContain('my-custom')
  })

  it('runs on_mount actions', async () => {
    const ctx = makeCtx()
    await dispatchActions({
      action: 'setState',
      key: 'x',
      value: 42,
    }, ctx)
    expect(ctx.store.get('x')).toBe(42)

    // Now test snake_case on_mount through renderer
    const node: ComponentNode = {
      type: 'Div',
      on_mount: { action: 'setState', key: 'mounted', value: true },
      children: [],
    }
    const dispCtx = renderCtx({ mounted: false })
    renderNode(node, dispCtx)
    // Wait for microtask
    await new Promise(r => setTimeout(r, 10))
    expect(dispCtx.store.get('mounted')).toBe(true)
  })

  it('renders input_type attribute correctly', () => {
    const node: ComponentNode = {
      type: 'Input',
      name: 'email',
      input_type: 'email',
    }
    const el = renderNode(node, renderCtx()) as HTMLElement
    const input = el.querySelector('input') ?? el
    expect((input as HTMLInputElement).type).toBe('email')
  })

  it('handles on_click from snake_case Button', () => {
    const node: ComponentNode = {
      type: 'Button',
      label: 'Click',
      on_click: { action: 'setState', key: 'clicked', value: true },
    }
    const ctx = renderCtx({ clicked: false })
    const el = renderNode(node, ctx) as HTMLElement
    const button = el.querySelector('button') ?? el
    button.click()
  })
})

describe('Action dispatcher accepts snake_case action fields', () => {

  it('handles interval_ms and on_tick (snake_case)', async () => {
    const ctx = makeCtx({ tick: 0 })

    await dispatchActions({
      action: 'setInterval',
      interval_ms: 100,
      on_tick: { action: 'setState', key: 'tick', value: 1 },
    }, ctx)

    await new Promise(r => setTimeout(r, 150))
    clearAllIntervals()
    expect(ctx.store.get('tick')).toBe(1)
  })

  it('handles result_key and on_success (snake_case)', async () => {
    const transport: McpTransport = {
      callTool: () => Promise.resolve({ data: 42 }),
      sendMessage: () => Promise.resolve(),
    }
    const ctx = makeCtx({}, transport)

    await dispatchActions({
      action: 'toolCall',
      tool: 'get_data',
      result_key: '$data',
      on_success: { action: 'showToast', message: 'Done' },
    }, ctx)

    expect(ctx.store.get('$data')).toEqual({ data: 42 })
    expect(ctx.toasts).toHaveLength(1)
  })

  it('handles state_key, fallback_interval, fallback_tool (snake_case subscribe)', async () => {
    const transport: McpTransport = {
      callTool: () => Promise.resolve({ fen: 'new' }),
      sendMessage: () => Promise.resolve(),
    }
    const ctx = makeCtx({}, transport)

    await dispatchActions({
      action: 'subscribe',
      uri: 'chess://game',
      state_key: '$game',
      fallback_interval: 100,
      fallback_tool: '_refresh',
    }, ctx)

    await new Promise(r => setTimeout(r, 150))
    clearAllSubscriptions()
    expect(ctx.store.get('$game')).toEqual({ fen: 'new' })
  })
})
