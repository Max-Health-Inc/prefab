---
url: /prefab/reference/api/mcp/interfaces/RendererHtmlOptions.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / RendererHtmlOptions

# Interface: RendererHtmlOptions

Defined in: [mcp/resource.ts:179](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/resource.ts#L179)

## Properties

### title?

```ts
optional title?: string;
```

Defined in: [mcp/resource.ts:181](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/resource.ts#L181)

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

Defined in: [mcp/resource.ts:183](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/resource.ts#L183)

Additional `<script>` URLs to load after the renderer.

***

### stylesheets?

```ts
optional stylesheets?: string[];
```

Defined in: [mcp/resource.ts:185](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/resource.ts#L185)

Additional `<link rel="stylesheet">` URLs.

***

### cdnBase?

```ts
optional cdnBase?: string;
```

Defined in: [mcp/resource.ts:187](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/resource.ts#L187)

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

Defined in: [mcp/resource.ts:196](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/resource.ts#L196)

Inject a theme bridge stylesheet after `prefab.css`.

`'vscode'` re-declares the tokens VS Code can supply with the
`--vscode-*` variable first, dropping the MCP Apps `--color-*` layer that
would otherwise shadow it, so the viewer follows the user's editor theme.
Emitted before `stylesheets`, which stay the outermost override.
