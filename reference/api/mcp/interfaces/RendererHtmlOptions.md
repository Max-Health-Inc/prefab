---
url: /prefab/reference/api/mcp/interfaces/RendererHtmlOptions.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / RendererHtmlOptions

# Interface: RendererHtmlOptions

Defined in: [mcp/resource.ts:180](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/mcp/resource.ts#L180)

## Properties

### title?

```ts
optional title?: string;
```

Defined in: [mcp/resource.ts:182](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/mcp/resource.ts#L182)

Page title.

#### Default

```ts
'Prefab'
```

***

### scripts?

```ts
optional scripts?: string[];
```

Defined in: [mcp/resource.ts:184](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/mcp/resource.ts#L184)

Additional `<script>` URLs to load after the renderer.

***

### stylesheets?

```ts
optional stylesheets?: string[];
```

Defined in: [mcp/resource.ts:186](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/mcp/resource.ts#L186)

Additional `<link rel="stylesheet">` URLs.

***

### cdnBase?

```ts
optional cdnBase?: string;
```

Defined in: [mcp/resource.ts:188](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/mcp/resource.ts#L188)

Override CDN base URL (no trailing slash).

#### Default

```ts
jsdelivr CDN
```

***

### themeBridge?

```ts
optional themeBridge?: "vscode";
```

Defined in: [mcp/resource.ts:197](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/mcp/resource.ts#L197)

Inject a theme bridge stylesheet after `prefab.css`.

`'vscode'` re-declares the tokens VS Code can supply with the
`--vscode-*` variable first, dropping the MCP Apps `--color-*` layer that
would otherwise shadow it, so the viewer follows the user's editor theme.
Emitted before `stylesheets`, which stay the outermost override.
