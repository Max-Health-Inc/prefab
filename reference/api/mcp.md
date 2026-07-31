---
url: /prefab/reference/api/mcp.md
---
[@maxhealth.tech/prefab](../index.md) / mcp

# mcp

## Interfaces

| Interface | Description |
| ------ | ------ |
| [DisplayOptions](interfaces/DisplayOptions.md) | - |
| [DisplayFormOptions](interfaces/DisplayFormOptions.md) | - |
| [StateUpdate](interfaces/StateUpdate.md) | - |
| [PrefabUpdateWire](interfaces/PrefabUpdateWire.md) | - |
| [DisplayUpdateOptions](interfaces/DisplayUpdateOptions.md) | - |
| [DisplayErrorOptions](interfaces/DisplayErrorOptions.md) | - |
| [DisplaySuccessOptions](interfaces/DisplaySuccessOptions.md) | - |
| [McpAppCsp](interfaces/McpAppCsp.md) | CSP configuration for MCP Apps resources. |
| [McpAppPermissions](interfaces/McpAppPermissions.md) | Permission Policy requests for MCP Apps resources. |
| [ResourceMetaOptions](interfaces/ResourceMetaOptions.md) | - |
| [RendererHtmlOptions](interfaces/RendererHtmlOptions.md) | - |
| [ViewerResourceOptions](interfaces/ViewerResourceOptions.md) | - |
| [ResourceConfig](interfaces/ResourceConfig.md) | Registration config accepted by both SDK generations. |
| [McpServerLike](interfaces/McpServerLike.md) | MCP server interface expected by registerViewerResource. |
| [ToolResultOptions](interfaces/ToolResultOptions.md) | - |
| [VsCodeTokenSource](interfaces/VsCodeTokenSource.md) | How one prefab token is sourced from the VS Code webview. |
| [McpTextContent](interfaces/McpTextContent.md) | MCP text content block (compatible with SDK's TextContent) |
| [McpImageContent](interfaces/McpImageContent.md) | MCP image content block (compatible with SDK's ImageContent) |
| [McpTextResourceContents](interfaces/McpTextResourceContents.md) | Text resource contents (has `text`, never `blob`). |
| [McpBlobResourceContents](interfaces/McpBlobResourceContents.md) | Blob resource contents (has `blob`, never `text`). |
| [McpResourceContent](interfaces/McpResourceContent.md) | MCP embedded resource content block (compatible with SDK's EmbeddedResource) |
| [McpToolResult](interfaces/McpToolResult.md) | MCP tool result — returned from tool handlers. |
| [McpCacheHint](interfaces/McpCacheHint.md) | Cache fields required on results from the cacheable operations (`tools/list`, `prompts/list`, `resources/list`, `resources/templates/list`, `resources/read`, `server/discover`). |
| [McpResourceReadResult](interfaces/McpResourceReadResult.md) | A `resources/read` result carrying the required cache fields. |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [ResourceReadHandler](type-aliases/ResourceReadHandler.md) | `resources/read` handler shape passed to the server — the viewer is always HTML text. |
| [ThemeBridge](type-aliases/ThemeBridge.md) | Supported theme bridges. |
| [McpContent](type-aliases/McpContent.md) | Any MCP content block |
| [McpCacheScope](type-aliases/McpCacheScope.md) | Cache scopes defined for cacheable results. |

## Variables

| Variable | Description |
| ------ | ------ |
| [displayForm](variables/displayForm.md) | MCP display helpers — return prefab UIs as MCP tool results. |
| [displayUpdate](variables/displayUpdate.md) | MCP display helpers — return prefab UIs as MCP tool results. |
| [displayError](variables/displayError.md) | MCP display helpers — return prefab UIs as MCP tool results. |
| [displaySuccess](variables/displaySuccess.md) | MCP display helpers — return prefab UIs as MCP tool results. |
| [PREFAB\_CDN\_META](variables/PREFAB_CDN_META.md) | Default CSP meta for prefab apps using jsDelivr CDN. |
| [PREFAB\_RESOURCE\_URI](variables/PREFAB_RESOURCE_URI.md) | Default URI for the prefab viewer resource. |
| [MCP\_APP\_MIME](variables/MCP_APP_MIME.md) | MIME type required by MCP Apps hosts. |
| [APPS\_EXTENSION](variables/APPS_EXTENSION.md) | Capability key for the MCP Apps extension (versioned independently of core). |
| [DEFAULT\_VIEWER\_CACHE](variables/DEFAULT_VIEWER_CACHE.md) | Default cache hint for the viewer resource. |
| [VSCODE\_BRIDGE](variables/VSCODE_BRIDGE.md) | prefab tokens that VS Code can supply, with the same variables and static fallbacks `prefab.css` uses. Tokens VS Code has no equivalent for (`--success`, `--warning`, shadows, radii) are deliberately absent: the bridge only overrides what the editor can actually provide. |

## Functions

| Function | Description |
| ------ | ------ |
| [display](functions/display.md) | MCP display helpers — return prefab UIs as MCP tool results. |
| [display\_form](functions/display_form.md) | MCP display helpers — return prefab UIs as MCP tool results. |
| [display\_update](functions/display_update.md) | MCP display helpers — return prefab UIs as MCP tool results. |
| [display\_error](functions/display_error.md) | MCP display helpers — return prefab UIs as MCP tool results. |
| [display\_success](functions/display_success.md) | MCP display helpers — return prefab UIs as MCP tool results. |
| [resourceMeta](functions/resourceMeta.md) | Generate the `_meta` object for MCP Apps `ui://` resource registration. |
| [rendererHtml](functions/rendererHtml.md) | Generate the HTML page for a prefab MCP Apps viewer resource. |
| [registerViewerResource](functions/registerViewerResource.md) | Register the prefab viewer as a `ui://` resource on an MCP server. |
| [toolResult](functions/toolResult.md) | Wrap a JSON payload as an MCP tool result. |
| [themeBridgeCss](functions/themeBridgeCss.md) | Generate the theme-bridge CSS (the contents of a `<style>` element). |
