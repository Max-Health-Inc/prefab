/**
 * Browser entry for the A2UI emitter — `dist/a2ui.min.js`.
 *
 * Bundled separately from `renderer.min.js` on purpose. The renderer is what
 * every `$prefab` page loads, and emitting A2UI is something almost none of
 * them do, so folding the emitter in would tax every consumer for a feature
 * they do not use. Keeping it apart also means the two can be loaded
 * independently: a tool that only translates payloads needs no renderer at all.
 *
 * The emitter takes wire JSON and returns wire JSON, so nothing here needs the
 * component API. That is what keeps the bundle small.
 *
 * ```html
 * <script src="https://cdn.jsdelivr.net/npm/@maxhealth.tech/prefab/dist/a2ui.min.js"></script>
 * <script>
 *   const { messages, diagnostics } = PrefabA2UI.emit(wireJson)
 * </script>
 * ```
 */

import { emitA2UI, type A2uiEmitOptions, type A2uiEmitResult } from './emit.js'
import { mappedTypes } from './catalog.js'
import { VERSION } from '../core/version.js'
import type { PrefabWireFormat } from '../app.js'
import {
  A2UI_BASIC_CATALOG,
  A2UI_MIME,
  A2UI_SCHEME,
  A2UI_VERSION,
  type A2uiMessage,
  type A2uiMessageList,
} from './types.js'

/**
 * Emit A2UI from a `$prefab` payload.
 *
 * Accepts `unknown` because the caller is usually handing over parsed editor
 * text or a tool result, neither of which is typed. A payload without a `view`
 * is rejected here rather than producing an empty surface further downstream.
 */
function emit(wire: unknown, options?: A2uiEmitOptions): A2uiEmitResult {
  if (wire == null || typeof wire !== 'object' || !('view' in wire)) {
    throw new TypeError('PrefabA2UI.emit: expected a $prefab payload with a "view"')
  }
  return emitA2UI(wire as PrefabWireFormat, options)
}

/** Wrap messages in the list envelope, for transports needing a JSON object. */
function envelope(messages: A2uiMessage[]): A2uiMessageList {
  return { messages }
}

const PrefabA2UI = {
  emit,
  envelope,
  /** Every prefab component type with a first-class A2UI mapping. */
  mappedTypes,
  VERSION,
  A2UI_VERSION,
  A2UI_BASIC_CATALOG,
  A2UI_MIME,
  A2UI_SCHEME,
}

export default PrefabA2UI
export { emit, envelope }

if (typeof window !== 'undefined') {
  ;(window as unknown as Record<string, unknown>).PrefabA2UI = PrefabA2UI
}
