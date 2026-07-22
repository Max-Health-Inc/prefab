---
url: /prefab/reference/api/renderer/classes/DestroyRegistry.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / DestroyRegistry

# Class: DestroyRegistry

Defined in: [renderer/engine.ts:81](https://github.com/Max-Health-Inc/prefab/blob/de93a446678c2f2b8a07006b7acfdb8a5f593717/src/renderer/engine.ts#L81)

Tracks destroy callbacks for mounted components within a render cycle.

## Constructors

### Constructor

```ts
new DestroyRegistry(): DestroyRegistry;
```

#### Returns

`DestroyRegistry`

## Accessors

### size

#### Get Signature

```ts
get size(): number;
```

Defined in: [renderer/engine.ts:98](https://github.com/Max-Health-Inc/prefab/blob/de93a446678c2f2b8a07006b7acfdb8a5f593717/src/renderer/engine.ts#L98)

Number of registered callbacks (for testing).

##### Returns

`number`

## Methods

### track()

```ts
track(cb): void;
```

Defined in: [renderer/engine.ts:85](https://github.com/Max-Health-Inc/prefab/blob/de93a446678c2f2b8a07006b7acfdb8a5f593717/src/renderer/engine.ts#L85)

Register a destroy callback.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `cb` | () => `void` |

#### Returns

`void`

***

### flush()

```ts
flush(): void;
```

Defined in: [renderer/engine.ts:90](https://github.com/Max-Health-Inc/prefab/blob/de93a446678c2f2b8a07006b7acfdb8a5f593717/src/renderer/engine.ts#L90)

Call all registered destroy callbacks and clear the list.

#### Returns

`void`
