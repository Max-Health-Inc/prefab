---
url: /prefab/reference/api/mcp/interfaces/A2uiResourceOptions.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / A2uiResourceOptions

# Interface: A2uiResourceOptions

Defined in: [mcp/a2ui.ts:113](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/a2ui.ts#L113)

## Extends

* `A2uiEmitOptions`

## Properties

### surfaceId?

```ts
optional surfaceId?: string;
```

Defined in: [a2ui/emit.ts:45](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/a2ui/emit.ts#L45)

Surface id. Must be unique for the renderer's lifetime.

#### Default

```ts
'prefab'
```

#### Inherited from

```ts
A2uiEmitOptions.surfaceId
```

***

### catalogId?

```ts
optional catalogId?: string;
```

Defined in: [a2ui/emit.ts:50](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/a2ui/emit.ts#L50)

Catalog the surface's components are drawn from.

#### Default

```ts
the A2UI Basic catalog
```

#### Inherited from

```ts
A2uiEmitOptions.catalogId
```

***

### stream?

```ts
optional stream?: boolean;
```

Defined in: [a2ui/emit.ts:57](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/a2ui/emit.ts#L57)

Split the output into `createSurface` + `updateComponents` +
`updateDataModel` instead of inlining everything into `createSurface`.
Streaming transports want the split so the renderer can paint early; a
single stored payload does not.

#### Default

```ts
false
```

#### Inherited from

```ts
A2uiEmitOptions.stream
```

***

### sendDataModel?

```ts
optional sendDataModel?: boolean;
```

Defined in: [a2ui/emit.ts:59](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/a2ui/emit.ts#L59)

Ask the renderer to echo the data model back on every event.

#### Default

```ts
false
```

#### Inherited from

```ts
A2uiEmitOptions.sendDataModel
```

***

### warn?

```ts
optional warn?: boolean;
```

Defined in: [a2ui/emit.ts:61](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/a2ui/emit.ts#L61)

Log degradations and dropped nodes at warn level.

#### Default

```ts
false
```

#### Inherited from

```ts
A2uiEmitOptions.warn
```

***

### uri?

```ts
optional uri?: string;
```

Defined in: [mcp/a2ui.ts:115](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/a2ui.ts#L115)

Resource URI. Must start with `a2ui://`.

#### Default

```ts
'a2ui://prefab/surface'
```

***

### title?

```ts
optional title?: string;
```

Defined in: [mcp/a2ui.ts:117](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/a2ui.ts#L117)

Resource title shown in listings.

#### Default

```ts
'Prefab Surface'
```

***

### description?

```ts
optional description?: string;
```

Defined in: [mcp/a2ui.ts:119](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/a2ui.ts#L119)

Human-readable description for the listing.

***

### cache?

```ts
optional cache?: McpCacheHint;
```

Defined in: [mcp/a2ui.ts:121](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/a2ui.ts#L121)

Cache fields for the `resources/read` result (SEP-2549).

***

### onDiagnostics?

```ts
optional onDiagnostics?: (diagnostics) => void;
```

Defined in: [mcp/a2ui.ts:123](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/a2ui.ts#L123)

See [DisplayA2uiOptions.onDiagnostics](DisplayA2uiOptions.md#ondiagnostics).

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `diagnostics` | `A2uiDiagnostic`\[] |

#### Returns

`void`
