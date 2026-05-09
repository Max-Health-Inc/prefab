/**
 * TDD tests for issue #4 — camelCase vs snake_case wire format.
 *
 * Tests that:
 *   1. TS serializer outputs snake_case field names (matching Python)
 *   2. Renderer accepts both snake_case and camelCase input
 *   3. Actions serialize with snake_case field names
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

describe('Serializer outputs snake_case field names', () => {

  it('Button: onClick → on_click', () => {
    const btn = Button('Refresh', {
      onClick: new CallTool('_action', { arguments: { action: 'refresh' } }),
    })
    const json = btn.toJSON()
    expect(json.on_click).toBeDefined()
    expect(json.onClick).toBeUndefined()
  })

  it('Form: onSubmit → on_submit', () => {
    const form = Form({
      onSubmit: new CallTool('submit'),
      children: [],
    })
    const json = form.toJSON()
    expect(json.on_submit).toBeDefined()
    expect(json.onSubmit).toBeUndefined()
  })

  it('Component: cssClass → css_class', () => {
    const col = Column({ cssClass: 'my-class', children: [] })
    const json = col.toJSON()
    expect(json.css_class).toBe('my-class')
    expect(json.cssClass).toBeUndefined()
  })

  it('Component: onMount → on_mount', () => {
    const col = Column({
      onMount: new SetState('x', 1),
      children: [],
    })
    const json = col.toJSON()
    expect(json.on_mount).toBeDefined()
    expect(json.onMount).toBeUndefined()
  })

  it('Input: inputType → input_type, readOnly → read_only', () => {
    const input = Input({ name: 'email', inputType: 'email' })
    const json = input.toJSON()
    expect(json.input_type).toBe('email')
    expect(json.inputType).toBeUndefined()
    expect(json.read_only).toBe(false)
    expect(json.readOnly).toBeUndefined()
  })

  it('StatefulComponent: onChange → on_change', () => {
    const sel = Select({
      name: 'choice',
      onChange: new SetState('x', 1),
      children: [SelectOption('a')],
    })
    const json = sel.toJSON()
    expect(json.on_change).toBeDefined()
    expect(json.onChange).toBeUndefined()
  })

  it('Metric: trendSentiment → trend_sentiment', () => {
    const m = Metric({ label: 'Users', value: '100', trendSentiment: 'positive' })
    const json = m.toJSON()
    expect(json.trend_sentiment).toBe('positive')
    expect(json.trendSentiment).toBeUndefined()
  })

  it('GridItem: colSpan → col_span, rowSpan → row_span', () => {
    const gi = GridItem({ colSpan: 2, rowSpan: 3, children: [] })
    const json = gi.toJSON()
    expect(json.col_span).toBe(2)
    expect(json.colSpan).toBeUndefined()
    expect(json.row_span).toBe(3)
    expect(json.rowSpan).toBeUndefined()
  })
})

describe('Action serialization outputs snake_case', () => {

  it('SetInterval: intervalMs → interval_ms, onTick → on_tick', () => {
    const action = new SetInterval(1000, new SetState('x', 1))
    const json = action.toJSON()
    expect(json.interval_ms).toBe(1000)
    expect(json.intervalMs).toBeUndefined()
    expect(json.on_tick).toBeDefined()
    expect(json.onTick).toBeUndefined()
  })

  it('CallTool: resultKey → result_key, onSuccess/onError → on_success/on_error', () => {
    const action = new CallTool('get_data', {
      resultKey: '$data',
      onSuccess: new ShowToast('Done'),
      onError: new ShowToast('Failed'),
    })
    const json = action.toJSON()
    expect(json.result_key).toBe('$data')
    expect(json.resultKey).toBeUndefined()
    expect(json.on_success).toBeDefined()
    expect(json.onSuccess).toBeUndefined()
    expect(json.on_error).toBeDefined()
    expect(json.onError).toBeUndefined()
  })

  it('SetState: onSuccess/onError → on_success/on_error', () => {
    const action = new SetState('x', 1, {
      onSuccess: new ShowToast('OK'),
      onError: new ShowToast('Err'),
    })
    const json = action.toJSON()
    expect(json.on_success).toBeDefined()
    expect(json.onSuccess).toBeUndefined()
    expect(json.on_error).toBeDefined()
    expect(json.onError).toBeUndefined()
  })

  it('Fetch: resultKey → result_key', () => {
    const action = new Fetch('https://api.example.com', {
      resultKey: '$data',
      onSuccess: new ShowToast('OK'),
    })
    const json = action.toJSON()
    expect(json.result_key).toBe('$data')
    expect(json.resultKey).toBeUndefined()
    expect(json.on_success).toBeDefined()
    expect(json.onSuccess).toBeUndefined()
  })

  it('OpenFilePicker: resultKey → result_key, onSuccess → on_success', () => {
    const action = new OpenFilePicker({
      resultKey: '$files',
      onSuccess: new ShowToast('Uploaded'),
    })
    const json = action.toJSON()
    expect(json.result_key).toBe('$files')
    expect(json.on_success).toBeDefined()
  })

  it('CallHandler: resultKey → result_key, onSuccess/onError → on_success/on_error', () => {
    const action = new CallHandler('handler', {
      resultKey: '$result',
      onSuccess: new ShowToast('OK'),
      onError: new ShowToast('Err'),
    })
    const json = action.toJSON()
    expect(json.result_key).toBe('$result')
    expect(json.on_success).toBeDefined()
    expect(json.on_error).toBeDefined()
  })

  it('Subscribe: stateKey → state_key, fallbackInterval → fallback_interval, etc.', () => {
    const action = new Subscribe('chess://game', {
      stateKey: '$game',
      fallbackInterval: 2000,
      fallbackTool: '_action',
      fallbackArgs: { action: 'refresh' },
      onData: new ShowToast('Updated'),
      onError: new ShowToast('Error'),
    })
    const json = action.toJSON()
    expect(json.state_key).toBe('$game')
    expect(json.stateKey).toBeUndefined()
    expect(json.fallback_interval).toBe(2000)
    expect(json.fallbackInterval).toBeUndefined()
    expect(json.fallback_tool).toBe('_action')
    expect(json.fallbackTool).toBeUndefined()
    expect(json.fallback_args).toBeDefined()
    expect(json.fallbackArgs).toBeUndefined()
    expect(json.on_data).toBeDefined()
    expect(json.onData).toBeUndefined()
    expect(json.on_error).toBeDefined()
    expect(json.onError).toBeUndefined()
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
