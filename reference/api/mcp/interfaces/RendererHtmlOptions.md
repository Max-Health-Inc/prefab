---
url: /prefab/reference/api/mcp/interfaces/RendererHtmlOptions.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / RendererHtmlOptions

# Interface: RendererHtmlOptions

Defined in: [mcp/resource.ts:141](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/resource.ts#L141)

## Properties

### title?

```ts
optional title?: string;
```

Defined in: [mcp/resource.ts:143](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/resource.ts#L143)

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

Defined in: [mcp/resource.ts:145](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/resource.ts#L145)

Additional `<script>` URLs to load after the renderer.

***

### stylesheets?

```ts
optional stylesheets?: string[];
```

Defined in: [mcp/resource.ts:147](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/resource.ts#L147)

Additional `<link rel="stylesheet">` URLs.

***

### cdnBase?

```ts
optional cdnBase?: string;
```

Defined in: [mcp/resource.ts:149](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/resource.ts#L149)

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

Defined in: [mcp/resource.ts:151](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/resource.ts#L151)

Theme bridge stylesheet after `prefab.css` (before `stylesheets`); `'vscode'` follows the editor theme.
