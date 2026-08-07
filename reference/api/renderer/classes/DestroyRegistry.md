---
url: /prefab/reference/api/renderer/classes/DestroyRegistry.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / DestroyRegistry

# Class: DestroyRegistry

Defined in: [renderer/engine.ts:82](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/renderer/engine.ts#L82)

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

Defined in: [renderer/engine.ts:99](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/renderer/engine.ts#L99)

Number of registered callbacks (for testing).

##### Returns

`number`

## Methods

### track()

```ts
track(cb): void;
```

Defined in: [renderer/engine.ts:86](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/renderer/engine.ts#L86)

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

Defined in: [renderer/engine.ts:91](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/renderer/engine.ts#L91)

Call all registered destroy callbacks and clear the list.

#### Returns

`void`
