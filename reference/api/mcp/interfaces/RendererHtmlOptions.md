---
url: /prefab/reference/api/mcp/interfaces/RendererHtmlOptions.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / RendererHtmlOptions

# Interface: RendererHtmlOptions

Defined in: [mcp/display.ts:449](https://github.com/Max-Health-Inc/prefab/blob/0b875c7d37ce621a7701a86ade4497710f4b2a08/src/mcp/display.ts#L449)

## Properties

### title?

```ts
optional title?: string;
```

Defined in: [mcp/display.ts:451](https://github.com/Max-Health-Inc/prefab/blob/0b875c7d37ce621a7701a86ade4497710f4b2a08/src/mcp/display.ts#L451)

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

Defined in: [mcp/display.ts:453](https://github.com/Max-Health-Inc/prefab/blob/0b875c7d37ce621a7701a86ade4497710f4b2a08/src/mcp/display.ts#L453)

Additional `<script>` URLs to load after the renderer.

***

### stylesheets?

```ts
optional stylesheets?: string[];
```

Defined in: [mcp/display.ts:455](https://github.com/Max-Health-Inc/prefab/blob/0b875c7d37ce621a7701a86ade4497710f4b2a08/src/mcp/display.ts#L455)

Additional `<link rel="stylesheet">` URLs.

***

### cdnBase?

```ts
optional cdnBase?: string;
```

Defined in: [mcp/display.ts:457](https://github.com/Max-Health-Inc/prefab/blob/0b875c7d37ce621a7701a86ade4497710f4b2a08/src/mcp/display.ts#L457)

Override CDN base URL (no trailing slash).

#### Default

```ts
jsdelivr CDN
```
