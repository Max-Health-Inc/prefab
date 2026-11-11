---
url: /prefab/reference/api/mcp/interfaces/RendererHtmlOptions.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / RendererHtmlOptions

# Interface: RendererHtmlOptions

Defined in: [mcp/resource.ts:136](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/mcp/resource.ts#L136)

## Properties

### title?

```ts
optional title?: string;
```

Defined in: [mcp/resource.ts:138](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/mcp/resource.ts#L138)

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

Defined in: [mcp/resource.ts:140](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/mcp/resource.ts#L140)

Additional `<script>` URLs to load after the renderer.

***

### stylesheets?

```ts
optional stylesheets?: string[];
```

Defined in: [mcp/resource.ts:142](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/mcp/resource.ts#L142)

Additional `<link rel="stylesheet">` URLs.

***

### cdnBase?

```ts
optional cdnBase?: string;
```

Defined in: [mcp/resource.ts:144](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/mcp/resource.ts#L144)

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

Defined in: [mcp/resource.ts:146](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/mcp/resource.ts#L146)

Theme bridge stylesheet after `prefab.css` (before `stylesheets`); `'vscode'` follows the editor theme.
