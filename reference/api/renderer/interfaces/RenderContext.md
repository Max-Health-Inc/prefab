---
url: /prefab/reference/api/renderer/interfaces/RenderContext.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / RenderContext

# Interface: RenderContext

Defined in: [renderer/engine.ts:65](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/renderer/engine.ts#L65)

## Properties

### store

```ts
store: Store;
```

Defined in: [renderer/engine.ts:66](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/renderer/engine.ts#L66)

***

### scope

```ts
scope: EvalScope;
```

Defined in: [renderer/engine.ts:67](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/renderer/engine.ts#L67)

***

### transport?

```ts
optional transport?: McpTransport;
```

Defined in: [renderer/engine.ts:68](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/renderer/engine.ts#L68)

***

### rerender

```ts
rerender: () => void;
```

Defined in: [renderer/engine.ts:69](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/renderer/engine.ts#L69)

#### Returns

`void`

***

### onToast?

```ts
optional onToast?: (toast) => void;
```

Defined in: [renderer/engine.ts:70](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/renderer/engine.ts#L70)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `toast` | `ToastEvent` |

#### Returns

`void`

***

### remount?

```ts
optional remount?: (data) => void;
```

Defined in: [renderer/engine.ts:72](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/renderer/engine.ts#L72)

Replace the current view with a new prefab wire payload (server-rendered pattern).

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | `Record`<`string`, `unknown`> |

#### Returns

`void`

***

### defs?

```ts
optional defs?: Record<string, ComponentNode>;
```

Defined in: [renderer/engine.ts:73](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/renderer/engine.ts#L73)

***

### templates?

```ts
optional templates?: Record<string, ComponentNode[]>;
```

Defined in: [renderer/engine.ts:74](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/renderer/engine.ts#L74)

***

### slots?

```ts
optional slots?: Record<string, ComponentNode[]>;
```

Defined in: [renderer/engine.ts:75](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/renderer/engine.ts#L75)

***

### destroyRegistry?

```ts
optional destroyRegistry?: DestroyRegistry;
```

Defined in: [renderer/engine.ts:76](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/renderer/engine.ts#L76)
