---
url: /prefab/reference/api/renderer/classes/DestroyRegistry.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / DestroyRegistry

# Class: DestroyRegistry

Defined in: [renderer/engine.ts:80](https://github.com/Max-Health-Inc/prefab/blob/89a71686ef8a402c953104a66e893262cc245e62/src/renderer/engine.ts#L80)

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

Defined in: [renderer/engine.ts:97](https://github.com/Max-Health-Inc/prefab/blob/89a71686ef8a402c953104a66e893262cc245e62/src/renderer/engine.ts#L97)

Number of registered callbacks (for testing).

##### Returns

`number`

## Methods

### track()

```ts
track(cb): void;
```

Defined in: [renderer/engine.ts:84](https://github.com/Max-Health-Inc/prefab/blob/89a71686ef8a402c953104a66e893262cc245e62/src/renderer/engine.ts#L84)

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

Defined in: [renderer/engine.ts:89](https://github.com/Max-Health-Inc/prefab/blob/89a71686ef8a402c953104a66e893262cc245e62/src/renderer/engine.ts#L89)

Call all registered destroy callbacks and clear the list.

#### Returns

`void`
