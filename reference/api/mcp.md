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
| [McpServerLike](interfaces/McpServerLike.md) | The server shape registerViewerResource needs, structural so any SDK fits; `resource` is the v1 fallback. |
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
| [McpBlobResourceContents](type-aliases/McpBlobResourceContents.md) | Blob resource contents (has `blob`, never `text`). |
| [McpResourceContent](type-aliases/McpResourceContent.md) | MCP embedded resource content block (compatible with SDK's EmbeddedResource) |
| [McpContent](type-aliases/McpContent.md) | Any MCP content block |
| [McpToolResult](type-aliases/McpToolResult.md) | A tool result assignable to the SDK's `CallToolResult`; `structuredContent` keeps its payload type (any JSON since SEP-2106). |
| [McpDisplayResult](type-aliases/McpDisplayResult.md) | A tool result whose `structuredContent` is always present, as every prefab display helper returns. |
| [McpCacheScope](type-aliases/McpCacheScope.md) | `public`: shared caches may store the result; `private`: only the requesting client may. |
| [McpCacheHint](type-aliases/McpCacheHint.md) | Cache fields of cacheable results (SEP-2549). The result's own values beat a server hint; with neither, nothing is cached. |
| [McpResourceReadResult](type-aliases/McpResourceReadResult.md) | A `resources/read` result with its required cache fields, generic over the contents kind. |
| [McpStringSchema](type-aliases/McpStringSchema.md) | A flat elicitation property schema, for [McpInputRequiredResult](type-aliases/McpInputRequiredResult.md) (Multi Round-Trip, revision 2026-07-28). |
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
| [McpInputRequiredResult](type-aliases/McpInputRequiredResult.md) | A result asking for input before the call completes; carries `inputRequests`, `requestState` or both. |

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
| [APPS\_EXTENSION](variables/APPS_EXTENSION.md) | The MCP Apps extension id, `…/ui` per the spec and ext-apps (`…/apps` in some SDK doc examples is only illustrative). |
| [DEFAULT\_VIEWER\_CACHE](variables/DEFAULT_VIEWER_CACHE.md) | Viewer cache hint: the HTML is a pure function of `VERSION`, so it is shared-cacheable for a day. |
| [VSCODE\_BRIDGE](variables/VSCODE_BRIDGE.md) | prefab tokens VS Code can supply, with `prefab.css`'s own fallbacks; tokens it cannot supply are absent. |

## Functions

| Function | Description |
| ------ | ------ |
| [a2uiPayload](functions/a2uiPayload.md) | Wrap messages in the list envelope A2UI defines for non-streaming transports. |
| [display\_a2ui](functions/display_a2ui.md) | A view as an A2UI tool result: an `EmbeddedResource` in `content`, and the same payload as `structuredContent`. |
| [registerA2uiResource](functions/registerA2uiResource.md) | Register an A2UI surface that does not depend on the conversation as an `a2ui://` resource; `builder` runs on every read. Per-call views belong in [display\_a2ui](functions/display_a2ui.md). |
| [display](functions/display.md) | MCP display helpers — return prefab UIs as MCP tool results. |
| [display\_form](functions/display_form.md) | MCP display helpers — return prefab UIs as MCP tool results. |
| [display\_update](functions/display_update.md) | MCP display helpers — return prefab UIs as MCP tool results. |
| [display\_error](functions/display_error.md) | MCP display helpers — return prefab UIs as MCP tool results. |
| [display\_success](functions/display_success.md) | MCP display helpers — return prefab UIs as MCP tool results. |
| [formSchema](functions/formSchema.md) | Derive the restricted elicitation schema from form fields. |
| [formInputRequest](functions/formInputRequest.md) | Ask the client to collect these fields, then retry the call. |
| [inputResponse](functions/inputResponse.md) | A client's answer for one key, or `undefined` when it has not arrived yet. |
| [acceptedFormInput](functions/acceptedFormInput.md) | Read and check an accepted form answer. |
| [resourceMeta](functions/resourceMeta.md) | The `_meta` (CSP, permissions) for a `ui://` resource. Put it on the listing and the content item: VS Code reads only the latter. |
| [rendererHtml](functions/rendererHtml.md) | The viewer HTML: `prefab.css` and `renderer.auto.min.js` from the CDN, plus your scripts and stylesheets. |
| [resolveCache](functions/resolveCache.md) | Fill in and validate `CacheableResult` fields, throwing on values the SDK would silently replace with `ttlMs: 0`. |
| [registerViewerResource](functions/registerViewerResource.md) | Register the prefab viewer as a `ui://` resource. The CSP admits jsDelivr and every origin the page loads from. |
| [toolResult](functions/toolResult.md) | Wrap a JSON payload as an MCP tool result: serialized into `content[0].text` and passed through as `structuredContent`. |
| [themeBridgeCss](functions/themeBridgeCss.md) | The theme-bridge CSS, matching `prefab.css`'s host-driven selectors in both schemes. `[data-theme="dark"]` is left alone, so an app that pins it keeps its own palette. |
