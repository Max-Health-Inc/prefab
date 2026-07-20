---
url: /prefab/reference/api/renderer/interfaces/RenderContext.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / RenderContext

# Interface: RenderContext

Defined in: [renderer/engine.ts:53](https://github.com/Max-Health-Inc/prefab/blob/88d9aa00d6a50ef0286767079c6345c808f6a0a9/src/renderer/engine.ts#L53)

## Properties

### store

```ts
store: Store;
```

Defined in: [renderer/engine.ts:54](https://github.com/Max-Health-Inc/prefab/blob/88d9aa00d6a50ef0286767079c6345c808f6a0a9/src/renderer/engine.ts#L54)

***

### scope

```ts
scope: EvalScope;
```

Defined in: [renderer/engine.ts:55](https://github.com/Max-Health-Inc/prefab/blob/88d9aa00d6a50ef0286767079c6345c808f6a0a9/src/renderer/engine.ts#L55)

***

### transport?

```ts
optional transport?: McpTransport;
```

Defined in: [renderer/engine.ts:56](https://github.com/Max-Health-Inc/prefab/blob/88d9aa00d6a50ef0286767079c6345c808f6a0a9/src/renderer/engine.ts#L56)

***

### rerender

```ts
rerender: () => void;
```

Defined in: [renderer/engine.ts:57](https://github.com/Max-Health-Inc/prefab/blob/88d9aa00d6a50ef0286767079c6345c808f6a0a9/src/renderer/engine.ts#L57)

#### Returns

`void`

***

### onToast?

```ts
optional onToast?: (toast) => void;
```

Defined in: [renderer/engine.ts:58](https://github.com/Max-Health-Inc/prefab/blob/88d9aa00d6a50ef0286767079c6345c808f6a0a9/src/renderer/engine.ts#L58)

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

Defined in: [renderer/engine.ts:60](https://github.com/Max-Health-Inc/prefab/blob/88d9aa00d6a50ef0286767079c6345c808f6a0a9/src/renderer/engine.ts#L60)

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

Defined in: [renderer/engine.ts:61](https://github.com/Max-Health-Inc/prefab/blob/88d9aa00d6a50ef0286767079c6345c808f6a0a9/src/renderer/engine.ts#L61)

***

### templates?

```ts
optional templates?: Record<string, ComponentNode[]>;
```

Defined in: [renderer/engine.ts:62](https://github.com/Max-Health-Inc/prefab/blob/88d9aa00d6a50ef0286767079c6345c808f6a0a9/src/renderer/engine.ts#L62)

***

### slots?

```ts
optional slots?: Record<string, ComponentNode[]>;
```

Defined in: [renderer/engine.ts:63](https://github.com/Max-Health-Inc/prefab/blob/88d9aa00d6a50ef0286767079c6345c808f6a0a9/src/renderer/engine.ts#L63)

***

### destroyRegistry?

```ts
optional destroyRegistry?: DestroyRegistry;
```

Defined in: [renderer/engine.ts:64](https://github.com/Max-Health-Inc/prefab/blob/88d9aa00d6a50ef0286767079c6345c808f6a0a9/src/renderer/engine.ts#L64)
