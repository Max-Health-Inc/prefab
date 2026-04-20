/**
 * Action dispatcher — executes serialized actions at runtime.
 *
 * Client actions (setState, showToast, etc.) run locally.
 * MCP actions (toolCall, sendMessage) delegate to the transport layer.
 */

import type { Store } from './state.js'
import type { EvalScope } from './rx.js'
import { evaluateTemplate, isRxExpression } from './rx.js'

/** MCP transport interface — injected at mount time */
export interface McpTransport {
  callTool(name: string, args: Record<string, unknown>): Promise<unknown>
  sendMessage(message: string): Promise<void>
}

/** Toast event — emitted for showToast actions */
export interface ToastEvent {
  message: string
  description?: string
  variant?: string
  duration?: number
}

/** Action dispatcher context */
export interface DispatchContext {
  store: Store
  transport?: McpTransport
  scope?: EvalScope
  rerender: () => void
  onToast?: (toast: ToastEvent) => void
}

export type ActionJSON = Record<string, unknown>

/**
 * Dispatch one or more serialized actions.
 */
export async function dispatchActions(
  actions: ActionJSON | ActionJSON[],
  ctx: DispatchContext,
): Promise<void> {
  const list = Array.isArray(actions) ? actions : [actions]
  for (const action of list) {
    await dispatchOne(action, ctx)
  }
}

async function dispatchOne(action: ActionJSON, ctx: DispatchContext): Promise<void> {
  const type = action.action as string
  switch (type) {
    case 'setState':
      { handleSetState(action, ctx); return; }
    case 'toggleState':
      { handleToggleState(action, ctx); return; }
    case 'appendState':
      { handleAppendState(action, ctx); return; }
    case 'popState':
      { handlePopState(action, ctx); return; }
    case 'showToast':
      { handleShowToast(action, ctx); return; }
    case 'closeOverlay':
      { handleCloseOverlay(action, ctx); return; }
    case 'openLink':
      { handleOpenLink(action); return; }
    case 'setInterval':
      { handleSetInterval(action, ctx); return; }
    case 'toolCall':
      return handleToolCall(action, ctx)
    case 'sendMessage':
      return handleSendMessage(action, ctx)
    case 'updateContext':
      { handleUpdateContext(action, ctx); return; }
    default:
      console.warn(`[prefab] Unknown action: ${type}`)
  }
}

// ── Client Actions ───────────────────────────────────────────────────────────

function handleSetState(action: ActionJSON, ctx: DispatchContext): void {
  const key = action.key as string
  let value = action.value
  if (isRxExpression(value)) {
    value = evaluateTemplate(value, ctx.store, ctx.scope)
  }
  ctx.store.set(key, value)
  ctx.rerender()
  void runCallbacks(action.onSuccess, ctx)
}

function handleToggleState(action: ActionJSON, ctx: DispatchContext): void {
  ctx.store.toggle(action.key as string)
  ctx.rerender()
}

function handleAppendState(action: ActionJSON, ctx: DispatchContext): void {
  let value = action.value
  if (isRxExpression(value)) {
    value = evaluateTemplate(value, ctx.store, ctx.scope)
  }
  ctx.store.append(action.key as string, value, action.index as number | undefined)
  ctx.rerender()
}

function handlePopState(action: ActionJSON, ctx: DispatchContext): void {
  ctx.store.pop(action.key as string, action.index as number | string)
  ctx.rerender()
}

function handleShowToast(action: ActionJSON, ctx: DispatchContext): void {
  ctx.onToast?.({
    message: resolveStr(action.message, ctx),
    description: action.description != null ? resolveStr(action.description, ctx) : undefined,
    variant: action.variant as string | undefined,
    duration: action.duration as number | undefined,
  })
}

function handleCloseOverlay(_action: ActionJSON, _ctx: DispatchContext): void {
  // Close any open dialog/popover — dispatched as custom event
  if (typeof document !== 'undefined') {
    document.dispatchEvent(new CustomEvent('prefab:close-overlay'))
  }
}

function handleOpenLink(action: ActionJSON): void {
  if (typeof window !== 'undefined') {
    window.open(action.url as string, (action.target as string | undefined) ?? '_blank')
  }
}

function handleSetInterval(action: ActionJSON, ctx: DispatchContext): void {
  const ms = action.intervalMs as number
  const onTick = action.onTick as ActionJSON | ActionJSON[]
  if (typeof globalThis.setInterval === 'function') {
    globalThis.setInterval(() => void dispatchActions(onTick, ctx), ms)
  }
}

// ── MCP Actions ──────────────────────────────────────────────────────────────

async function handleToolCall(action: ActionJSON, ctx: DispatchContext): Promise<void> {
  if (!ctx.transport) {
    console.warn('[prefab] No MCP transport configured for toolCall')
    return
  }

  const tool = action.tool as string
  const args = resolveArgs(action.arguments as Record<string, unknown> | undefined, ctx)

  try {
    const result = await ctx.transport.callTool(tool, args)
    if (action.resultKey != null) {
      ctx.store.set(action.resultKey as string, result)
    }
    ctx.rerender()
    await runCallbacks(action.onSuccess, ctx, { $result: result })
  } catch (err) {
    await runCallbacks(action.onError, ctx, { $error: err })
  }
}

async function handleSendMessage(action: ActionJSON, ctx: DispatchContext): Promise<void> {
  if (!ctx.transport) {
    console.warn('[prefab] No MCP transport configured for sendMessage')
    return
  }
  await ctx.transport.sendMessage(resolveStr(action.message, ctx))
}

function handleUpdateContext(action: ActionJSON, ctx: DispatchContext): void {
  const context = action.context as Record<string, unknown> | undefined
  if (context != null) {
    ctx.store.merge(context)
    ctx.rerender()
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function resolveStr(val: unknown, ctx: DispatchContext): string {
  if (isRxExpression(val)) {
    const result = evaluateTemplate(val, ctx.store, ctx.scope)
    return result == null ? '' : String(result as string | number | boolean)
  }
  return val == null ? '' : String(val as string | number | boolean)
}

function resolveArgs(
  args: Record<string, unknown> | undefined,
  ctx: DispatchContext,
): Record<string, unknown> {
  if (!args) return {}
  const resolved: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(args)) {
    resolved[key] = isRxExpression(value)
      ? evaluateTemplate(value, ctx.store, ctx.scope)
      : value
  }
  return resolved
}

async function runCallbacks(
  callbacks: unknown,
  ctx: DispatchContext,
  extraScope?: EvalScope,
): Promise<void> {
  if (callbacks == null) return
  const merged = { ...ctx.scope, ...extraScope }
  await dispatchActions(
    callbacks as ActionJSON | ActionJSON[],
    { ...ctx, scope: merged },
  )
}
