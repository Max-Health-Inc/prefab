import { Store } from '../../src/renderer/state'
import { renderNode } from '../../src/renderer/engine'
import type { ComponentNode, RenderContext } from '../../src/renderer/engine'
import { isComponentNode } from '../../src/renderer/node-guard'
import type { DispatchContext, McpTransport, ToastEvent } from '../../src/renderer/actions'
import { createNoopTransport } from '../../src/renderer/transport'
import { isRecord, recordList } from '../../src/core/guards'

type Constructor<T> = abstract new (...args: never[]) => T

export interface ToolCall {
  name: string
  args: Record<string, unknown>
}

export function makeRenderCtx(state?: Record<string, unknown>): RenderContext & { rerendered: number } {
  const ctx = {
    store: new Store(state),
    scope: {},
    transport: createNoopTransport(),
    rerender: () => { ctx.rerendered++ },
    rerendered: 0,
  }
  return ctx
}

export function makeDispatchCtx(
  state?: Record<string, unknown>,
  transport?: McpTransport,
): DispatchContext & { rerendered: number; toasts: ToastEvent[]; remounted: Record<string, unknown>[] } {
  const toasts: ToastEvent[] = []
  const remounted: Record<string, unknown>[] = []
  const ctx = {
    store: new Store(state),
    transport,
    rerender: () => { ctx.rerendered++ },
    remount: (data: Record<string, unknown>) => { remounted.push(data) },
    onToast: (t: ToastEvent) => { toasts.push(t) },
    rerendered: 0,
    toasts,
    remounted,
  }
  return ctx
}

export function mockTransport(result: unknown = { ok: true }): McpTransport & { calls: ToolCall[]; messages: string[] } {
  const calls: ToolCall[] = []
  const messages: string[] = []
  return {
    calls,
    messages,
    callTool: (name: string, args: Record<string, unknown>) => {
      calls.push({ name, args })
      return Promise.resolve(result)
    },
    sendMessage: (msg: string) => {
      messages.push(msg)
      return Promise.resolve()
    },
  }
}

export function mockSubscriptionTransport(result: unknown = { ok: true }): McpTransport & {
  calls: ToolCall[]
  subscriptions: Map<string, (data: unknown) => void>
  unsubscribedUris: string[]
} {
  const calls: ToolCall[] = []
  const subscriptions = new Map<string, (data: unknown) => void>()
  const unsubscribedUris: string[] = []
  return {
    calls,
    subscriptions,
    unsubscribedUris,
    callTool: (name: string, args: Record<string, unknown>) => {
      calls.push({ name, args })
      return Promise.resolve(result)
    },
    sendMessage: () => Promise.resolve(),
    subscribe: (uri: string, onData: (data: unknown) => void): (() => void) => {
      subscriptions.set(uri, onData)
      return () => {
        subscriptions.delete(uri)
        unsubscribedUris.push(uri)
      }
    },
    capabilities: { subscriptions: true },
  }
}

export function expectInstance<T>(value: unknown, ctor: Constructor<T>): T {
  if (!(value instanceof ctor)) {
    const actual = value === null ? 'null' : typeof value === 'object' ? value.constructor.name : typeof value
    throw new TypeError(`expected ${ctor.name}, got ${actual}`)
  }
  return value
}

export function renderEl(node: ComponentNode, ctx: RenderContext): HTMLElement
export function renderEl<T extends Element>(node: ComponentNode, ctx: RenderContext, ctor: Constructor<T>): T
export function renderEl(node: ComponentNode, ctx: RenderContext, ctor: Constructor<Element> = HTMLElement): Element {
  return expectInstance(renderNode(node, ctx), ctor)
}

export function query(root: ParentNode, selector: string): HTMLElement
export function query<T extends Element>(root: ParentNode, selector: string, ctor: Constructor<T>): T
export function query(root: ParentNode, selector: string, ctor: Constructor<Element> = HTMLElement): Element {
  const found = root.querySelector(selector)
  if (found === null) throw new TypeError(`no element matches ${selector}`)
  return expectInstance(found, ctor)
}

export function queryAll(root: ParentNode, selector: string): HTMLElement[]
export function queryAll<T extends Element>(root: ParentNode, selector: string, ctor: Constructor<T>): T[]
export function queryAll(root: ParentNode, selector: string, ctor: Constructor<Element> = HTMLElement): Element[] {
  return Array.from(root.querySelectorAll(selector), el => expectInstance(el, ctor))
}

export function expectRecord(value: unknown): Record<string, unknown> {
  if (!isRecord(value)) throw new TypeError(`expected an object, got ${typeof value}`)
  return value
}

export function childNodes(node: unknown): Record<string, unknown>[] {
  return recordList(expectRecord(node).children)
}

export function childAt(node: unknown, ...path: number[]): Record<string, unknown> {
  let current = expectRecord(node)
  for (const index of path) current = expectRecord(childNodes(current)[index])
  return current
}

export function fieldRecord(node: unknown, key: string): Record<string, unknown> {
  return expectRecord(expectRecord(node)[key])
}

export function expectArray(value: unknown): unknown[] {
  if (!Array.isArray(value)) throw new TypeError(`expected an array, got ${typeof value}`)
  return value
}

export function expectNode(value: unknown): ComponentNode {
  if (!isComponentNode(value)) throw new TypeError('expected a component node')
  return value
}

export function nodeDefs(value: unknown): Record<string, ComponentNode> | undefined {
  if (!isRecord(value)) return undefined
  return Object.fromEntries(Object.entries(value).map(([name, node]) => [name, expectNode(node)]))
}
