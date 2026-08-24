/**
 * A2UI emitter — the second output target alongside the `$prefab` wire format.
 *
 * `$prefab` payloads render through prefab's own renderer, in an MCP Apps
 * iframe or any web app. A2UI payloads render natively in the A2UI renderers
 * (React, Angular, Lit, Flutter, Swift, Compose) with no iframe involved. Both
 * come from the same server-side component tree.
 *
 * @example
 * ```ts
 * import { Column, H1, autoTable } from '@maxhealth.tech/prefab'
 * import { PrefabApp } from '@maxhealth.tech/prefab'
 *
 * const app = new PrefabApp({ view: Column({ children: [H1('Users'), autoTable(rows)] }) })
 * const { messages, diagnostics } = app.toA2UI()
 * ```
 */

export { emitA2UI } from './emit.js'
export type { A2uiEmitOptions, A2uiEmitResult } from './emit.js'

export { mappedTypes } from './catalog.js'
export { a2uiIconName, A2UI_ICONS } from './icons.js'
export type { A2uiProps, EmitContext, Mapper } from './catalog.js'

export { toBinding, toJsonPointer, escapePointerToken, dynamicString } from './expr.js'
export type { BindingResult } from './expr.js'

export {
  A2UI_VERSION,
  A2UI_BASIC_CATALOG,
  A2UI_MIME,
  A2UI_SCHEME,
  A2UI_ROOT_ID,
} from './types.js'
export type {
  A2uiAccessibility,
  A2uiAction,
  A2uiChildList,
  A2uiChildTemplate,
  A2uiComponent,
  A2uiCreateSurface,
  A2uiDataBinding,
  A2uiDeleteSurface,
  A2uiDiagnostic,
  A2uiDiagnosticKind,
  A2uiDynamicBoolean,
  A2uiDynamicNumber,
  A2uiDynamicString,
  A2uiDynamicValue,
  A2uiEventAction,
  A2uiFunctionAction,
  A2uiFunctionCall,
  A2uiMessage,
  A2uiMessageList,
  A2uiUpdateComponents,
  A2uiUpdateDataModel,
} from './types.js'
