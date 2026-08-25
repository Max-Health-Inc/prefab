---
url: /prefab/reference/api/mcp/interfaces/DisplayA2uiOptions.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / DisplayA2uiOptions

# Interface: DisplayA2uiOptions

Defined in: [mcp/a2ui.ts:55](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/a2ui.ts#L55)

## Extends

* `A2uiEmitOptions`

## Properties

### surfaceId?

```ts
optional surfaceId?: string;
```

Defined in: [a2ui/emit.ts:45](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/a2ui/emit.ts#L45)

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

Defined in: [a2ui/emit.ts:50](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/a2ui/emit.ts#L50)

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

Defined in: [a2ui/emit.ts:57](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/a2ui/emit.ts#L57)

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

Defined in: [a2ui/emit.ts:59](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/a2ui/emit.ts#L59)

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

Defined in: [a2ui/emit.ts:61](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/a2ui/emit.ts#L61)

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

Defined in: [mcp/a2ui.ts:57](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/a2ui.ts#L57)

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

Defined in: [mcp/a2ui.ts:63](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/a2ui.ts#L63)

Called with anything lost in translation. Without it, a `degraded` or
`unsupported` diagnostic is logged at warn level, because silently shipping
a lesser UI is the failure mode worth making noisy.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `diagnostics` | `A2uiDiagnostic`\[] |

#### Returns

`void`
