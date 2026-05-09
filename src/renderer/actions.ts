/**
 * Action dispatcher — executes serialized actions at runtime.
 *
 * Client actions (setState, showToast, etc.) run locally.
 * MCP actions (toolCall, sendMessage) delegate to the transport layer.
 */

import type { Store } from './state.js'
import type { EvalScope } from './rx.js'
import { evaluateTemplate, isRxExpression } from './rx.js'
import { toCamelCase } from '../core/component.js'

/**
 * Recursively normalise action JSON keys from snake_case to camelCase.
 * Keys starting with '$' are left unchanged.
 */
function normalizeAction(action: ActionJSON): ActionJSON {
  const result: ActionJSON = {}
  for (const [k, v] of Object.entries(action)) {
    const key = k.startsWith('$') ? k : toCamelCase(k)
    if (Array.isArray(v)) {
      result[key] = v.map((item: unknown) =>
        item != null && typeof item === 'object' && !Array.isArray(item)
          ? normalizeAction(item as ActionJSON)
          : item,
      )
    } else if (v != null && typeof v === 'object' && !Array.isArray(v)) {
      result[key] = normalizeAction(v as ActionJSON)
    } else {
      result[key] = v
    }
  }
  return result
}

/** MCP transport interface — injected at mount time */
export interface McpTransport {
  callTool(name: string, args: Record<string, unknown>): Promise<unknown>
  sendMessage(message: string): Promise<void>
  /** Subscribe to a resource URI for push updates. Returns an unsubscribe function. */
  subscribe?(uri: string, onData: (data: unknown) => void): () => void
  /** Transport capabilities discovered during handshake. */
  readonly capabilities?: { subscriptions?: boolean }
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
  /** Replace the current view with a new prefab wire payload (server-rendered pattern). */
  remount?: (data: Record<string, unknown>) => void
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

async function dispatchOne(raw: ActionJSON, ctx: DispatchContext): Promise<void> {
  const action = normalizeAction(raw)
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
    case 'callTool':
      return handleToolCall(action, ctx)
    case 'sendMessage':
      return handleSendMessage(action, ctx)
    case 'updateContext':
      { handleUpdateContext(action, ctx); return; }
    case 'fetch':
      return handleFetch(action, ctx)
    case 'openFilePicker':
      { handleOpenFilePicker(action, ctx); return; }
    case 'callHandler':
      return handleCallHandler(action, ctx)
    case 'requestDisplayMode':
      { handleRequestDisplayMode(action, ctx); return; }
    case 'subscribe':
      { handleSubscribe(action, ctx); return; }
    case 'unsubscribe':
      { handleUnsubscribe(action); return; }
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
  let value = action.value ?? action.item
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
    const url = action.url as string | undefined
    if (!url) {
      console.warn('[prefab] openLink: missing url')
      return
    }
    if (!isSafeUrl(url)) {
      console.warn(`[prefab] Blocked unsafe URL scheme: ${url}`)
      return
    }
    window.open(url, (action.target as string | undefined) ?? '_blank')
  }
}

/** Active interval IDs for cleanup. */
const activeIntervals = new Set<ReturnType<typeof setInterval>>()
const MAX_INTERVALS = 20
const MIN_INTERVAL_MS = 100

function handleSetInterval(action: ActionJSON, ctx: DispatchContext): void {
  const ms = Math.max(action.intervalMs as number, MIN_INTERVAL_MS)
  const onTick = action.onTick as ActionJSON | ActionJSON[]
  if (typeof globalThis.setInterval !== 'function') return
  if (activeIntervals.size >= MAX_INTERVALS) {
    console.warn('[prefab] Max intervals reached, ignoring new setInterval')
    return
  }
  const id = globalThis.setInterval(() => void dispatchActions(onTick, ctx), ms)
  activeIntervals.add(id)
}

/** Clear all active intervals (called on destroy). */
export function clearAllIntervals(): void {
  for (const id of activeIntervals) globalThis.clearInterval(id)
  activeIntervals.clear()
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

    // Server-rendered pattern: if the result contains a new prefab view, remount it
    const wireData = extractPrefabPayload(result)
    if (wireData && ctx.remount) {
      ctx.remount(wireData)
    } else {
      // State delta pattern: if the result is a display_update(), merge state
      applyPrefabUpdate(result, ctx)
      ctx.rerender()
    }

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

async function handleFetch(action: ActionJSON, ctx: DispatchContext): Promise<void> {
  const url = resolveStr(action.url, ctx)
  if (!isSafeUrl(url)) {
    console.warn(`[prefab] Blocked unsafe URL in fetch: ${url}`)
    return
  }

  const method = (action.method as string | undefined) ?? 'GET'
  const headers = action.headers as Record<string, string> | undefined
  const body = action.body !== undefined ? JSON.stringify(action.body) : undefined

  try {
    const resp = await globalThis.fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', ...headers },
      ...(body && { body }),
    })
    const result: unknown = await resp.json().catch(() => resp.text())
    if (action.resultKey != null) {
      ctx.store.set(action.resultKey as string, result)
    }

    // Server-rendered pattern: if the response contains a new prefab view, remount it
    const wireData = extractPrefabPayload(result)
    if (wireData && ctx.remount) {
      ctx.remount(wireData)
    } else {
      // State delta pattern: if the result is a display_update(), merge state
      applyPrefabUpdate(result, ctx)
      ctx.rerender()
    }

    await runCallbacks(action.onSuccess, ctx, { $result: result })
  } catch (err) {
    await runCallbacks(action.onError, ctx, { $error: err })
  }
}

function handleOpenFilePicker(action: ActionJSON, ctx: DispatchContext): void {
  if (typeof document === 'undefined') return

  const input = document.createElement('input')
  input.type = 'file'
  if (action.accept != null) input.accept = action.accept as string
  if (action.multiple === true) input.multiple = true

  input.addEventListener('change', () => {
    const files = Array.from(input.files ?? [])
    if (action.resultKey != null) {
      ctx.store.set(action.resultKey as string, files)
    }
    ctx.rerender()
    void runCallbacks(action.onSuccess, ctx, { $result: files })
  })
  input.click()
}

async function handleCallHandler(action: ActionJSON, ctx: DispatchContext): Promise<void> {
  const handler = action.handler as string
  const args = resolveArgs(action.arguments as Record<string, unknown> | undefined, ctx)

  // callHandler delegates to the transport like toolCall
  if (!ctx.transport) {
    console.warn(`[prefab] No transport configured for callHandler: ${handler}`)
    return
  }

  try {
    const result = await ctx.transport.callTool(handler, args)
    if (action.resultKey != null) {
      ctx.store.set(action.resultKey as string, result)
    }

    // Server-rendered pattern: if the result contains a new prefab view, remount it
    const wireData = extractPrefabPayload(result)
    if (wireData && ctx.remount) {
      ctx.remount(wireData)
    } else {
      // State delta pattern: if the result is a display_update(), merge state
      applyPrefabUpdate(result, ctx)
      ctx.rerender()
    }

    await runCallbacks(action.onSuccess, ctx, { $result: result })
  } catch (err) {
    await runCallbacks(action.onError, ctx, { $error: err })
  }
}

function handleRequestDisplayMode(action: ActionJSON, _ctx: DispatchContext): void {
  if (typeof document !== 'undefined') {
    document.dispatchEvent(new CustomEvent('prefab:request-display-mode', {
      detail: { mode: action.mode },
    }))
  }
}

// ── Subscriptions ────────────────────────────────────────────────────────────

/** Active subscription cleanups keyed by resource URI. */
const activeSubscriptions = new Map<string, () => void>()
const MAX_SUBSCRIPTIONS = 50
const DEFAULT_FALLBACK_INTERVAL = 2000

function handleSubscribe(action: ActionJSON, ctx: DispatchContext): void {
  const uri = action.uri as string
  const stateKey = action.stateKey as string

  if (!uri || !stateKey) {
    console.warn('[prefab] subscribe: missing uri or stateKey')
    return
  }

  // Prevent duplicate subscriptions to the same URI
  if (activeSubscriptions.has(uri)) {
    return
  }

  if (activeSubscriptions.size >= MAX_SUBSCRIPTIONS) {
    console.warn('[prefab] Max subscriptions reached, ignoring new subscribe')
    return
  }

  const onDataCallback = (data: unknown): void => {
    // Full view replacement: $prefab + view
    const wireData = extractPrefabPayload(data)
    if (wireData && ctx.remount) {
      ctx.remount(wireData)
    } else {
      // State delta: $prefab + update.state — skip raw store.set when delta was merged
      const merged = applyPrefabUpdate(data, ctx)
      if (!merged) ctx.store.set(stateKey, data)
      ctx.rerender()
    }
    void runCallbacks(action.onData, ctx, { $data: data })
  }

  // Push path: transport supports native subscriptions
  if (ctx.transport?.subscribe && ctx.transport.capabilities?.subscriptions) {
    const unsubscribe = ctx.transport.subscribe(uri, onDataCallback)
    activeSubscriptions.set(uri, unsubscribe)
    return
  }

  // Fallback path: poll via SetInterval + CallTool
  const fallbackTool = action.fallbackTool as string | undefined
  const fallbackInterval = (action.fallbackInterval as number | undefined) ?? DEFAULT_FALLBACK_INTERVAL

  if (!fallbackTool) {
    console.warn('[prefab] subscribe: host lacks subscriptions and no fallbackTool specified')
    return
  }

  if (!ctx.transport) {
    console.warn('[prefab] No MCP transport configured for subscribe fallback')
    return
  }

  const rawFallbackArgs = (action.fallbackArgs as Record<string, unknown> | undefined) ?? {}
  const ms = Math.max(fallbackInterval, MIN_INTERVAL_MS)
  const transport = ctx.transport

  const id = globalThis.setInterval(() => {
    void (async () => {
      try {
        const resolvedArgs = resolveArgs(rawFallbackArgs, ctx)
        const result = await transport.callTool(fallbackTool, resolvedArgs)
        onDataCallback(result)
      } catch (err) {
        void runCallbacks(action.onError, ctx, { $error: err })
      }
    })()
  }, ms)

  activeSubscriptions.set(uri, () => globalThis.clearInterval(id))
}

function handleUnsubscribe(action: ActionJSON): void {
  const uri = action.uri as string
  if (!uri) {
    console.warn('[prefab] unsubscribe: missing uri')
    return
  }
  const cleanup = activeSubscriptions.get(uri)
  if (cleanup) {
    cleanup()
    activeSubscriptions.delete(uri)
  }
}

/** Clear all active subscriptions (called on destroy). */
export function clearAllSubscriptions(): void {
  for (const [uri, cleanup] of activeSubscriptions) {
    try {
      cleanup()
    } catch (err) {
      console.warn(`[prefab] Error cleaning up subscription '${uri}':`, err)
    }
  }
  activeSubscriptions.clear()
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Extract a prefab wire payload from a tool call result.
 *
 * Checks both the result itself and `structuredContent` for a `$prefab` marker.
 * Also inspects MCP content arrays for JSON text blocks containing `$prefab`.
 */
export function extractPrefabPayload(result: unknown): Record<string, unknown> | null {
  if (result == null || typeof result !== 'object') return null
  const obj = result as Record<string, unknown>

  // Direct prefab payload (e.g. HTTP transport already parsed it)
  if ('$prefab' in obj && 'view' in obj) return obj

  // structuredContent wrapper (MCP tool result envelope)
  if ('structuredContent' in obj) {
    const sc = obj.structuredContent
    if (sc != null && typeof sc === 'object') {
      const sco = sc as Record<string, unknown>
      if ('$prefab' in sco && 'view' in sco) return sco
    }
  }

  // MCP content array — scan text blocks for JSON with $prefab + view
  if ('content' in obj && Array.isArray(obj.content)) {
    for (const block of obj.content as Record<string, unknown>[]) {
      if (block.type === 'text' && typeof block.text === 'string') {
        try {
          const parsed = JSON.parse(block.text) as unknown
          if (parsed != null && typeof parsed === 'object') {
            const po = parsed as Record<string, unknown>
            if ('$prefab' in po && 'view' in po) return po
          }
        } catch { /* not JSON */ }
      }
    }
  }

  return null
}

/**
 * Extract a prefab state-update payload from a tool call result.
 *
 * Mirrors extractPrefabPayload but matches `{ $prefab, update: { state } }`
 * (the shape produced by `display_update()`).
 */
export function extractPrefabUpdate(result: unknown): Record<string, unknown> | null {
  if (result == null || typeof result !== 'object') return null
  const obj = result as Record<string, unknown>

  if (isPrefabUpdate(obj)) return obj

  // structuredContent wrapper
  if ('structuredContent' in obj) {
    const sc = obj.structuredContent
    if (sc != null && typeof sc === 'object' && isPrefabUpdate(sc as Record<string, unknown>)) {
      return sc as Record<string, unknown>
    }
  }

  // MCP content array
  if ('content' in obj && Array.isArray(obj.content)) {
    for (const block of obj.content as Record<string, unknown>[]) {
      if (block.type === 'text' && typeof block.text === 'string') {
        try {
          const parsed = JSON.parse(block.text) as unknown
          if (parsed != null && typeof parsed === 'object' && isPrefabUpdate(parsed as Record<string, unknown>)) {
            return parsed as Record<string, unknown>
          }
        } catch { /* not JSON */ }
      }
    }
  }

  return null
}

/** Check if an object is a prefab state-update payload (`{ $prefab, update: { state } }`). */
function isPrefabUpdate(obj: Record<string, unknown>): boolean {
  if (!('$prefab' in obj) || !('update' in obj)) return false
  const update = obj.update
  return update != null && typeof update === 'object' && 'state' in (update as Record<string, unknown>)
}

/** If a result contains a display_update() payload, merge its state into the store. Returns true if a state delta was applied. */
function applyPrefabUpdate(result: unknown, ctx: DispatchContext): boolean {
  const updateData = extractPrefabUpdate(result)
  if (!updateData) return false
  const update = (updateData as { update: { state: Record<string, unknown> } }).update
  ctx.store.merge(update.state)
  return true
}

/** Blocked URL schemes that can execute code. */
const UNSAFE_SCHEME_RE = /^\s*(javascript|vbscript|data):/i

function isSafeUrl(url: string): boolean {
  return !UNSAFE_SCHEME_RE.test(url)
}

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
