---
url: /prefab/reference/api/mcp.md
---
[@maxhealth.tech/prefab](../index.md) / mcp

# mcp

## Interfaces

| Interface | Description |
| ------ | ------ |
| [DisplayA2uiOptions](interfaces/DisplayA2uiOptions.md) | - |
| [A2uiResourceOptions](interfaces/A2uiResourceOptions.md) | - |
| [DisplayOptions](interfaces/DisplayOptions.md) | - |
| [DisplayFormOptions](interfaces/DisplayFormOptions.md) | - |
| [StateUpdate](interfaces/StateUpdate.md) | - |
| [DisplayUpdateOptions](interfaces/DisplayUpdateOptions.md) | - |
| [DisplayErrorOptions](interfaces/DisplayErrorOptions.md) | - |
| [DisplaySuccessOptions](interfaces/DisplaySuccessOptions.md) | - |
| [FormInputRequestOptions](interfaces/FormInputRequestOptions.md) | - |
| [McpAppCsp](interfaces/McpAppCsp.md) | CSP configuration for MCP Apps resources. |
| [McpAppPermissions](interfaces/McpAppPermissions.md) | Permission Policy requests for MCP Apps resources. |
| [ResourceMetaOptions](interfaces/ResourceMetaOptions.md) | - |
| [RendererHtmlOptions](interfaces/RendererHtmlOptions.md) | - |
| [ViewerResourceOptions](interfaces/ViewerResourceOptions.md) | - |
| [ResourceConfig](interfaces/ResourceConfig.md) | Registration config accepted by both SDK generations. |
| [McpServerLike](interfaces/McpServerLike.md) | MCP server interface expected by registerViewerResource. |
| [ToolResultOptions](interfaces/ToolResultOptions.md) | - |
| [VsCodeTokenSource](interfaces/VsCodeTokenSource.md) | How one prefab token is sourced from the VS Code webview. |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [PrefabUpdateWire](type-aliases/PrefabUpdateWire.md) | The `$prefab` state-delta payload, sent as `structuredContent`. |
| [FormValue](type-aliases/FormValue.md) | Values a client may return for one field. |
| [ResourceReadHandler](type-aliases/ResourceReadHandler.md) | `resources/read` handler shape passed to the server — the viewer is always HTML text. |
| [ThemeBridge](type-aliases/ThemeBridge.md) | Supported theme bridges. |
| [McpTextContent](type-aliases/McpTextContent.md) | MCP text content block (compatible with SDK's TextContent) |
| [McpImageContent](type-aliases/McpImageContent.md) | MCP image content block (compatible with SDK's ImageContent) |
| [McpTextResourceContents](type-aliases/McpTextResourceContents.md) | Text resource contents (has `text`, never `blob`). |
| [McpBlobResourceContents](type-aliases/McpBlobResourceContents.md) | Blob resource contents (has `blob`, never `text`). See [McpTextResourceContents](type-aliases/McpTextResourceContents.md) on the alias. |
| [McpResourceContent](type-aliases/McpResourceContent.md) | MCP embedded resource content block (compatible with SDK's EmbeddedResource) |
| [McpContent](type-aliases/McpContent.md) | Any MCP content block |
| [McpToolResult](type-aliases/McpToolResult.md) | MCP tool result — returned from tool handlers. |
| [McpDisplayResult](type-aliases/McpDisplayResult.md) | A tool result whose `structuredContent` is guaranteed present. |
| [McpCacheScope](type-aliases/McpCacheScope.md) | Cache scopes defined for cacheable results. |
| [McpCacheHint](type-aliases/McpCacheHint.md) | Cache fields required on results from the cacheable operations (`tools/list`, `prompts/list`, `resources/list`, `resources/templates/list`, `resources/read`, `server/discover`). |
| [McpResourceReadResult](type-aliases/McpResourceReadResult.md) | A `resources/read` result carrying the required cache fields. |
| [McpStringSchema](type-aliases/McpStringSchema.md) | The restricted JSON Schema an elicitation may request. |
| [McpNumberSchema](type-aliases/McpNumberSchema.md) | - |
| [McpBooleanSchema](type-aliases/McpBooleanSchema.md) | - |
| [McpEnumSchema](type-aliases/McpEnumSchema.md) | Single selection: a string constrained to a fixed set of values. |
| [McpMultiEnumSchema](type-aliases/McpMultiEnumSchema.md) | Multiple selection: an array of values drawn from a fixed set. |
| [McpPrimitiveSchema](type-aliases/McpPrimitiveSchema.md) | - |
| [McpRestrictedSchema](type-aliases/McpRestrictedSchema.md) | The flat object schema an `elicitation/create` request asks the client to fill. |
| [McpElicitFormRequest](type-aliases/McpElicitFormRequest.md) | Form-mode elicitation: the client renders the schema and returns the values. |
| [McpElicitUrlRequest](type-aliases/McpElicitUrlRequest.md) | URL-mode elicitation: the client sends the user out of band and reports back. |
| [McpElicitRequest](type-aliases/McpElicitRequest.md) | - |
| [McpInputRequests](type-aliases/McpInputRequests.md) | Server-issued requests the client must fulfil before retrying the call. |
| [McpElicitResult](type-aliases/McpElicitResult.md) | What the client sends back for one request, keyed the same way. |
| [McpInputResponses](type-aliases/McpInputResponses.md) | - |
| [McpInputRequiredResult](type-aliases/McpInputRequiredResult.md) | A result asking the client for input before the call can complete. |

## Variables

| Variable | Description |
| ------ | ------ |
| [A2UI\_RESOURCE\_URI](variables/A2UI_RESOURCE_URI.md) | Default URI for a server that serves a single A2UI surface. |
| [displayA2ui](variables/displayA2ui.md) | camelCase alias, matching the other display helpers. |
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
| [a2uiPayload](functions/a2uiPayload.md) | Wrap messages in the list envelope A2UI defines for non-streaming transports. |
| [display\_a2ui](functions/display_a2ui.md) | Return a view as an A2UI tool result. |
| [registerA2uiResource](functions/registerA2uiResource.md) | Register a static A2UI surface as an `a2ui://` resource. |
| [display](functions/display.md) | MCP display helpers — return prefab UIs as MCP tool results. |
| [display\_form](functions/display_form.md) | MCP display helpers — return prefab UIs as MCP tool results. |
| [display\_update](functions/display_update.md) | MCP display helpers — return prefab UIs as MCP tool results. |
| [display\_error](functions/display_error.md) | MCP display helpers — return prefab UIs as MCP tool results. |
| [display\_success](functions/display_success.md) | MCP display helpers — return prefab UIs as MCP tool results. |
| [formSchema](functions/formSchema.md) | Derive the restricted elicitation schema from form fields. |
| [formInputRequest](functions/formInputRequest.md) | Ask the client to collect these fields, then retry the call. |
| [inputResponse](functions/inputResponse.md) | A client's answer for one key, or `undefined` when it has not arrived yet. |
| [acceptedFormInput](functions/acceptedFormInput.md) | Read and check an accepted form answer. |
| [resourceMeta](functions/resourceMeta.md) | Generate the `_meta` object for MCP Apps `ui://` resource registration. |
| [rendererHtml](functions/rendererHtml.md) | Generate the HTML page for a prefab MCP Apps viewer resource. |
| [resolveCache](functions/resolveCache.md) | Fill in and validate the `CacheableResult` fields, rejecting values the SDK would silently discard in favour of `ttlMs: 0`. |
| [registerViewerResource](functions/registerViewerResource.md) | Register the prefab viewer as a `ui://` resource on an MCP server. |
| [toolResult](functions/toolResult.md) | Wrap a JSON payload as an MCP tool result. |
| [themeBridgeCss](functions/themeBridgeCss.md) | Generate the theme-bridge CSS (the contents of a `<style>` element). |
