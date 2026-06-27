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
| [McpTextContent](interfaces/McpTextContent.md) | MCP text content block (compatible with SDK's TextContent) |
| [McpImageContent](interfaces/McpImageContent.md) | MCP image content block (compatible with SDK's ImageContent) |
| [McpTextResourceContents](interfaces/McpTextResourceContents.md) | Text resource contents (has `text`, never `blob`). |
| [McpBlobResourceContents](interfaces/McpBlobResourceContents.md) | Blob resource contents (has `blob`, never `text`). |
| [McpResourceContent](interfaces/McpResourceContent.md) | MCP embedded resource content block (compatible with SDK's EmbeddedResource) |
| [McpToolResult](interfaces/McpToolResult.md) | MCP tool result — returned from tool handlers. |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [McpContent](type-aliases/McpContent.md) | Any MCP content block |

## Variables

| Variable | Description |
| ------ | ------ |
| [displayForm](variables/displayForm.md) | MCP display helpers — return prefab UIs as MCP tool results. |
| [displayUpdate](variables/displayUpdate.md) | MCP display helpers — return prefab UIs as MCP tool results. |
| [displayError](variables/displayError.md) | MCP display helpers — return prefab UIs as MCP tool results. |
| [displaySuccess](variables/displaySuccess.md) | MCP display helpers — return prefab UIs as MCP tool results. |
| [PREFAB\_CDN\_META](variables/PREFAB_CDN_META.md) | Default CSP meta for prefab apps using jsDelivr CDN. |
| [PREFAB\_RESOURCE\_URI](variables/PREFAB_RESOURCE_URI.md) | Default URI for the prefab viewer resource. |

## Functions

| Function | Description |
| ------ | ------ |
| [display](functions/display.md) | MCP display helpers — return prefab UIs as MCP tool results. |
| [display\_form](functions/display_form.md) | MCP display helpers — return prefab UIs as MCP tool results. |
| [display\_update](functions/display_update.md) | MCP display helpers — return prefab UIs as MCP tool results. |
| [display\_error](functions/display_error.md) | MCP display helpers — return prefab UIs as MCP tool results. |
| [display\_success](functions/display_success.md) | MCP display helpers — return prefab UIs as MCP tool results. |
| [resourceMeta](functions/resourceMeta.md) | MCP display helpers — return prefab UIs as MCP tool results. |
| [rendererHtml](functions/rendererHtml.md) | MCP display helpers — return prefab UIs as MCP tool results. |
| [registerViewerResource](functions/registerViewerResource.md) | MCP display helpers — return prefab UIs as MCP tool results. |
