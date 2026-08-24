/**
 * MCP display helpers — return prefab UIs as MCP tool results.
 */

export { display, display_form, display_update, display_error, display_success, displayForm, displayUpdate, displayError, displaySuccess } from './display.js'
export type {
  DisplayOptions,
  DisplayFormOptions,
  DisplayUpdateOptions,
  DisplayErrorOptions,
  DisplaySuccessOptions,
  StateUpdate,
  PrefabUpdateWire,
} from './display.js'

export { toolResult } from './result.js'
export type { ToolResultOptions } from './result.js'

export { formSchema, formInputRequest, acceptedFormInput, inputResponse } from './input-required.js'
export type { FormInputRequestOptions, FormValue } from './input-required.js'

export { display_a2ui, displayA2ui, registerA2uiResource, a2uiPayload, A2UI_RESOURCE_URI } from './a2ui.js'
export type { DisplayA2uiOptions, A2uiResourceOptions } from './a2ui.js'

export { themeBridgeCss, VSCODE_BRIDGE } from './theme-bridge.js'
export type { ThemeBridge, VsCodeTokenSource } from './theme-bridge.js'

export {
  resourceMeta,
  registerViewerResource,
  rendererHtml,
  resolveCache,
  PREFAB_CDN_META,
  PREFAB_RESOURCE_URI,
  MCP_APP_MIME,
  APPS_EXTENSION,
  DEFAULT_VIEWER_CACHE,
} from './resource.js'
export type {
  McpAppCsp,
  McpAppPermissions,
  ResourceMetaOptions,
  RendererHtmlOptions,
  ViewerResourceOptions,
  McpServerLike,
  ResourceConfig,
  ResourceReadHandler,
} from './resource.js'

export type { McpToolResult, McpDisplayResult, McpContent, McpTextContent, McpImageContent, McpResourceContent, McpTextResourceContents, McpBlobResourceContents, McpCacheScope, McpCacheHint, McpResourceReadResult } from './types.js'

export type {
  McpStringSchema,
  McpNumberSchema,
  McpBooleanSchema,
  McpEnumSchema,
  McpMultiEnumSchema,
  McpPrimitiveSchema,
  McpRestrictedSchema,
  McpElicitFormRequest,
  McpElicitUrlRequest,
  McpElicitRequest,
  McpElicitResult,
  McpInputRequests,
  McpInputResponses,
  McpInputRequiredResult,
} from './types.js'
