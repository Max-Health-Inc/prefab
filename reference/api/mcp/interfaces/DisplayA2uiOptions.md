---
url: /prefab/reference/api/mcp/interfaces/DisplayA2uiOptions.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / DisplayA2uiOptions

# Interface: DisplayA2uiOptions

Defined in: [mcp/a2ui.ts:35](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/a2ui.ts#L35)

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

Defined in: [mcp/a2ui.ts:37](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/a2ui.ts#L37)

URI stamped on the embedded resource.

#### Default

```ts
'a2ui://prefab/surface'
```

***

### onDiagnostics?

```ts
optional onDiagnostics?: (diagnostics) => void;
```

Defined in: [mcp/a2ui.ts:39](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/a2ui.ts#L39)

Called with anything lost in translation; without it, `degraded` and `unsupported` diagnostics are logged as warnings.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `diagnostics` | `A2uiDiagnostic`\[] |

#### Returns

`void`
