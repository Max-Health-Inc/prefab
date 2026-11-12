---
url: /prefab/reference/api/mcp/interfaces/A2uiResourceOptions.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / A2uiResourceOptions

# Interface: A2uiResourceOptions

Defined in: [mcp/a2ui.ts:85](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/a2ui.ts#L85)

## Extends

* `A2uiEmitOptions`

## Properties

### surfaceId?

```ts
optional surfaceId?: string;
```

Defined in: [a2ui/emit.ts:46](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/a2ui/emit.ts#L46)

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

Defined in: [a2ui/emit.ts:51](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/a2ui/emit.ts#L51)

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

Defined in: [a2ui/emit.ts:58](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/a2ui/emit.ts#L58)

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

Defined in: [a2ui/emit.ts:60](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/a2ui/emit.ts#L60)

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

Defined in: [a2ui/emit.ts:62](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/a2ui/emit.ts#L62)

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

Defined in: [mcp/a2ui.ts:87](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/a2ui.ts#L87)

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

Defined in: [mcp/a2ui.ts:89](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/a2ui.ts#L89)

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

Defined in: [mcp/a2ui.ts:91](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/a2ui.ts#L91)

Human-readable description for the listing.

***

### cache?

```ts
optional cache?: McpCacheHint;
```

Defined in: [mcp/a2ui.ts:93](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/a2ui.ts#L93)

Cache fields for the `resources/read` result (SEP-2549).

***

### onDiagnostics?

```ts
optional onDiagnostics?: (diagnostics) => void;
```

Defined in: [mcp/a2ui.ts:95](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/a2ui.ts#L95)

See [DisplayA2uiOptions.onDiagnostics](DisplayA2uiOptions.md#ondiagnostics).

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `diagnostics` | `A2uiDiagnostic`\[] |

#### Returns

`void`
