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
import { stringifyValue } from '../core/stringify.js'
import { log } from '../core/logger.js'
import { isRecord, optionalNumber, optionalRecord, optionalString, recordList, recordOrList, scalarStringRecord } from '../core/guards.js'

/**
 * Recursively normalise action JSON keys from snake_case to camelCase.
 * Keys starting with '$' are left unchanged.
 */
function normalizeAction(action: ActionJSON): ActionJSON {
  const result: ActionJSON = {}
  for (const [k, v] of Object.entries(action)) {
    const key = k.startsWith('$') ? k : toCamelCase(k)
    if (Array.isArray(v)) {
      result[key] = v.map((item: unknown) => isRecord(item) ? normalizeAction(item) : item)
    } else if (isRecord(v)) {
      result[key] = normalizeAction(v)
    } else {
      result[key] = v
    }
  }
  return result
}

/** MCP transport interface — injected at mount time */
/** What the host adds to the model's context for its next turn (MCP Apps `ui/update-model-context`). */
export interface ModelContextUpdate {
  /** Text the model reads. */
  content?: { type: 'text'; text: string }[]
  /** Machine-readable data for the host. */
  structuredContent?: Record<string, unknown>
}

export interface McpTransport {
  callTool(name: string, args: Record<string, unknown>): Promise<unknown>
  sendMessage(message: string): Promise<void>
  /** Replace what this view has told the model, without starting a turn. */
  updateModelContext?(update: ModelContextUpdate): Promise<void>
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
 * Dispatch one or more serialized actions from their raw wire value.
 */
export async function dispatchActions(
  actions: unknown,
  ctx: DispatchContext,
): Promise<void> {
  for (const action of recordOrList(actions)) {
    await dispatchOne(action, ctx)
  }
}

/**
 * Run a promise fire-and-forget, but route any rejection to the logger instead
 * of swallowing it. Use for event handlers (onClick, onMount, intervals) that
 * have no caller to await — a throwing action must not vanish silently.
 */
export function fireAndForget(promise: Promise<unknown>, label: string): void {
  void promise.catch((err: unknown) => log.error(`${label} failed:`, err))
}

/**
 * Report an async action failure. If the author wired an `onError`, run it and
 * log at debug (traceable when debugging); otherwise surface at warn so an
 * unhandled failure is never fully silent.
 */
async function reportActionError(
  label: string,
  err: unknown,
  onError: unknown,
  ctx: DispatchContext,
): Promise<void> {
  if (onError != null) {
    log.debug(`${label} failed:`, err)
    await runCallbacks(onError, ctx, { $error: err })
  } else {
    log.warn(`${label} failed:`, err)
  }
}

async function dispatchOne(raw: ActionJSON, ctx: DispatchContext): Promise<void> {
  const action = normalizeAction(raw)
  switch (optionalString(action.action)) {
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
      log.warn(`Unknown action: ${stringifyValue(action.action)}`)
  }
}

// ── Client Actions ───────────────────────────────────────────────────────────

function stateKey(action: ActionJSON, name: string): string | undefined {
  const key = optionalString(action.key)
  if (key === undefined) log.warn(`${name}: missing key`)
  return key
}

function handleSetState(action: ActionJSON, ctx: DispatchContext): void {
  const key = stateKey(action, 'setState')
  if (key === undefined) return
  let value = action.value
  if (isRxExpression(value)) {
    value = evaluateTemplate(value, ctx.store, ctx.scope)
  }
  ctx.store.set(key, value)
  ctx.rerender()
  void runCallbacks(action.onSuccess, ctx)
}

function handleToggleState(action: ActionJSON, ctx: DispatchContext): void {
  const key = stateKey(action, 'toggleState')
  if (key === undefined) return
  ctx.store.toggle(key)
  ctx.rerender()
}

function handleAppendState(action: ActionJSON, ctx: DispatchContext): void {
  const key = stateKey(action, 'appendState')
  if (key === undefined) return
  let value = action.value ?? action.item
  if (isRxExpression(value)) {
    value = evaluateTemplate(value, ctx.store, ctx.scope)
  }
  ctx.store.append(key, value, optionalNumber(action.index))
  ctx.rerender()
}

function handlePopState(action: ActionJSON, ctx: DispatchContext): void {
  const key = stateKey(action, 'popState')
  if (key === undefined) return
  const index = action.index
  if (typeof index !== 'number' && typeof index !== 'string') {
    log.warn('popState: missing index')
    return
  }
  ctx.store.pop(key, index)
  ctx.rerender()
}

function handleShowToast(action: ActionJSON, ctx: DispatchContext): void {
  ctx.onToast?.({
    message: resolveStr(action.message, ctx),
    description: action.description != null ? resolveStr(action.description, ctx) : undefined,
    variant: optionalString(action.variant),
    duration: optionalNumber(action.duration),
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
    const url = optionalString(action.url)
    if (!url) {
      log.warn('openLink: missing url')
      return
    }
    if (!isSafeUrl(url)) {
      log.warn(`Blocked unsafe URL scheme: ${url}`)
      return
    }
    window.open(url, optionalString(action.target) ?? '_blank')
  }
}

/** Active interval IDs for cleanup. */
const activeIntervals = new Set<ReturnType<typeof setInterval>>()
const MAX_INTERVALS = 20
const MIN_INTERVAL_MS = 100

function handleSetInterval(action: ActionJSON, ctx: DispatchContext): void {
  const ms = Math.max(optionalNumber(action.intervalMs) ?? MIN_INTERVAL_MS, MIN_INTERVAL_MS)
  const onTick = recordOrList(action.onTick)
  if (typeof globalThis.setInterval !== 'function') return
  if (onTick.length === 0) {
    log.warn('setInterval: missing onTick')
    return
  }
  if (activeIntervals.size >= MAX_INTERVALS) {
    log.warn('Max intervals reached, ignoring new setInterval')
    return
  }
  const id = globalThis.setInterval(() => fireAndForget(dispatchActions(onTick, ctx), 'interval action'), ms)
  activeIntervals.add(id)
}

/** Clear all active intervals (called on destroy). */
export function clearAllIntervals(): void {
  for (const id of activeIntervals) globalThis.clearInterval(id)
  activeIntervals.clear()
}

// ── MCP Actions ──────────────────────────────────────────────────────────────

async function applyCallResult(action: ActionJSON, result: unknown, ctx: DispatchContext): Promise<void> {
  const resultKey = optionalString(action.resultKey)
  if (resultKey !== undefined) {
    ctx.store.set(resultKey, result)
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
}

async function callTransportTool(
  label: string,
  name: string | undefined,
  action: ActionJSON,
  ctx: DispatchContext,
  transport: McpTransport,
): Promise<void> {
  const args = resolveArgs(optionalRecord(action.arguments), ctx)
  try {
    if (name === undefined) throw new Error(`${label}: missing tool name`)
    const result = await transport.callTool(name, args)
    await applyCallResult(action, result, ctx)
  } catch (err) {
    await reportActionError(label, err, action.onError, ctx)
  }
}

async function handleToolCall(action: ActionJSON, ctx: DispatchContext): Promise<void> {
  if (!ctx.transport) {
    log.warn('No MCP transport configured for toolCall')
    return
  }
  await callTransportTool('toolCall', optionalString(action.tool), action, ctx, ctx.transport)
}

async function handleSendMessage(action: ActionJSON, ctx: DispatchContext): Promise<void> {
  if (!ctx.transport) {
    log.warn('No MCP transport configured for sendMessage')
    return
  }
  await ctx.transport.sendMessage(resolveStr(action.message, ctx))
}

function handleUpdateContext(action: ActionJSON, ctx: DispatchContext): void {
  const context = optionalRecord(action.context)
  if (context != null) {
    ctx.store.merge(context)
    ctx.rerender()
  }
}

async function handleFetch(action: ActionJSON, ctx: DispatchContext): Promise<void> {
  const url = resolveStr(action.url, ctx)
  if (!isSafeUrl(url)) {
    log.warn(`Blocked unsafe URL in fetch: ${url}`)
    return
  }

  const method = optionalString(action.method) ?? 'GET'
  const headers = scalarStringRecord(action.headers)
  const body = action.body !== undefined ? JSON.stringify(action.body) : undefined

  try {
    const resp = await globalThis.fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', ...headers },
      ...(body && { body }),
    })
    const result: unknown = await resp.json().catch(() => resp.text())
    await applyCallResult(action, result, ctx)
  } catch (err) {
    await reportActionError('fetch', err, action.onError, ctx)
  }
}

function handleOpenFilePicker(action: ActionJSON, ctx: DispatchContext): void {
  if (typeof document === 'undefined') return

  const input = document.createElement('input')
  input.type = 'file'
  const accept = optionalString(action.accept)
  if (accept !== undefined) input.accept = accept
  if (action.multiple === true) input.multiple = true

  input.addEventListener('change', () => {
    const files = Array.from(input.files ?? [])
    const resultKey = optionalString(action.resultKey)
    if (resultKey !== undefined) {
      ctx.store.set(resultKey, files)
    }
    ctx.rerender()
    void runCallbacks(action.onSuccess, ctx, { $result: files })
  })
  input.click()
}

async function handleCallHandler(action: ActionJSON, ctx: DispatchContext): Promise<void> {
  const handler = optionalString(action.handler)

  // callHandler delegates to the transport like toolCall
  if (!ctx.transport) {
    log.warn(`No transport configured for callHandler: ${handler ?? ''}`)
    return
  }
  await callTransportTool('callHandler', handler, action, ctx, ctx.transport)
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
  const uri = optionalString(action.uri)
  const targetKey = optionalString(action.stateKey)

  if (!uri || !targetKey) {
    log.warn('subscribe: missing uri or stateKey')
    return
  }

  // Prevent duplicate subscriptions to the same URI
  if (activeSubscriptions.has(uri)) {
    return
  }

  if (activeSubscriptions.size >= MAX_SUBSCRIPTIONS) {
    log.warn('Max subscriptions reached, ignoring new subscribe')
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
      if (!merged) ctx.store.set(targetKey, data)
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
  const fallbackTool = optionalString(action.fallbackTool)
  const fallbackInterval = optionalNumber(action.fallbackInterval) ?? DEFAULT_FALLBACK_INTERVAL

  if (!fallbackTool) {
    log.warn('subscribe: host lacks subscriptions and no fallbackTool specified')
    return
  }

  if (!ctx.transport) {
    log.warn('No MCP transport configured for subscribe fallback')
    return
  }

  const rawFallbackArgs = optionalRecord(action.fallbackArgs) ?? {}
  const ms = Math.max(fallbackInterval, MIN_INTERVAL_MS)
  const transport = ctx.transport

  const id = globalThis.setInterval(() => {
    void (async () => {
      try {
        const resolvedArgs = resolveArgs(rawFallbackArgs, ctx)
        const result = await transport.callTool(fallbackTool, resolvedArgs)
        onDataCallback(result)
      } catch (err) {
        void reportActionError('subscribe', err, action.onError, ctx)
      }
    })()
  }, ms)

  activeSubscriptions.set(uri, () => globalThis.clearInterval(id))
}

function handleUnsubscribe(action: ActionJSON): void {
  const uri = optionalString(action.uri)
  if (!uri) {
    log.warn('unsubscribe: missing uri')
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
      log.warn(`Error cleaning up subscription '${uri}':`, err)
    }
  }
  activeSubscriptions.clear()
}

// ── Helpers ──────────────────────────────────────────────────────────────────

type PrefabEnvelope = Record<string, unknown> & { $prefab: unknown }

interface PrefabUpdateEnvelope extends PrefabEnvelope {
  update: Record<string, unknown> & { state: unknown }
}

function parseJsonText(text: string): unknown {
  try {
    const parsed: unknown = JSON.parse(text)
    return parsed
  } catch {
    return undefined
  }
}

function findPrefabEnvelope<T extends Record<string, unknown>>(
  result: unknown,
  match: (value: Record<string, unknown>) => value is T,
): T | null {
  if (!isRecord(result)) return null
  if (match(result)) return result

  const sc = result.structuredContent
  if (isRecord(sc) && match(sc)) return sc

  for (const block of recordList(result.content)) {
    if (block.type !== 'text' || typeof block.text !== 'string') continue
    const parsed = parseJsonText(block.text)
    if (isRecord(parsed) && match(parsed)) return parsed
  }
  return null
}

function isPrefabView(value: Record<string, unknown>): value is PrefabEnvelope {
  return '$prefab' in value && 'view' in value
}

/** Check if an object is a prefab state-update payload (`{ $prefab, update: { state } }`). */
function isPrefabUpdate(value: Record<string, unknown>): value is PrefabUpdateEnvelope {
  return '$prefab' in value && isRecord(value.update) && 'state' in value.update
}

/**
 * Extract a prefab wire payload from a tool call result.
 *
 * Checks both the result itself and `structuredContent` for a `$prefab` marker.
 * Also inspects MCP content arrays for JSON text blocks containing `$prefab`.
 */
export function extractPrefabPayload(result: unknown): Record<string, unknown> | null {
  return findPrefabEnvelope(result, isPrefabView)
}

/**
 * Extract a prefab state-update payload from a tool call result.
 *
 * Mirrors extractPrefabPayload but matches `{ $prefab, update: { state } }`
 * (the shape produced by `display_update()`).
 */
export function extractPrefabUpdate(result: unknown): Record<string, unknown> | null {
  return findPrefabEnvelope(result, isPrefabUpdate)
}

/** If a result contains a display_update() payload, merge its state into the store and fire actions. Returns true if a state delta was applied. */
function applyPrefabUpdate(result: unknown, ctx: DispatchContext): boolean {
  const updateData = findPrefabEnvelope(result, isPrefabUpdate)
  if (!updateData) return false
  const { update } = updateData
  const state = optionalRecord(update.state)
  if (state) ctx.store.merge(state)
  if (update.actions != null) {
    fireAndForget(dispatchActions(update.actions, ctx), 'update action')
  }
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
    return stringifyValue(result)
  }
  return stringifyValue(val)
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
  await dispatchActions(callbacks, { ...ctx, scope: merged })
}
