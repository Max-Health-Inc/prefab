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

export {
  resourceMeta,
  registerViewerResource,
  rendererHtml,
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

export type { McpToolResult, McpContent, McpTextContent, McpImageContent, McpResourceContent, McpTextResourceContents, McpBlobResourceContents, McpCacheScope, McpCacheHint, McpResourceReadResult } from './types.js'
