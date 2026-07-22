---
url: /prefab/reference/api/renderer/interfaces/RenderContext.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / RenderContext

# Interface: RenderContext

Defined in: [renderer/engine.ts:54](https://github.com/Max-Health-Inc/prefab/blob/de93a446678c2f2b8a07006b7acfdb8a5f593717/src/renderer/engine.ts#L54)

## Properties

### store

```ts
store: Store;
```

Defined in: [renderer/engine.ts:55](https://github.com/Max-Health-Inc/prefab/blob/de93a446678c2f2b8a07006b7acfdb8a5f593717/src/renderer/engine.ts#L55)

***

### scope

```ts
scope: EvalScope;
```

Defined in: [renderer/engine.ts:56](https://github.com/Max-Health-Inc/prefab/blob/de93a446678c2f2b8a07006b7acfdb8a5f593717/src/renderer/engine.ts#L56)

***

### transport?

```ts
optional transport?: McpTransport;
```

Defined in: [renderer/engine.ts:57](https://github.com/Max-Health-Inc/prefab/blob/de93a446678c2f2b8a07006b7acfdb8a5f593717/src/renderer/engine.ts#L57)

***

### rerender

```ts
rerender: () => void;
```

Defined in: [renderer/engine.ts:58](https://github.com/Max-Health-Inc/prefab/blob/de93a446678c2f2b8a07006b7acfdb8a5f593717/src/renderer/engine.ts#L58)

#### Returns

`void`

***

### onToast?

```ts
optional onToast?: (toast) => void;
```

Defined in: [renderer/engine.ts:59](https://github.com/Max-Health-Inc/prefab/blob/de93a446678c2f2b8a07006b7acfdb8a5f593717/src/renderer/engine.ts#L59)

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

Defined in: [renderer/engine.ts:61](https://github.com/Max-Health-Inc/prefab/blob/de93a446678c2f2b8a07006b7acfdb8a5f593717/src/renderer/engine.ts#L61)

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

Defined in: [renderer/engine.ts:62](https://github.com/Max-Health-Inc/prefab/blob/de93a446678c2f2b8a07006b7acfdb8a5f593717/src/renderer/engine.ts#L62)

***

### templates?

```ts
optional templates?: Record<string, ComponentNode[]>;
```

Defined in: [renderer/engine.ts:63](https://github.com/Max-Health-Inc/prefab/blob/de93a446678c2f2b8a07006b7acfdb8a5f593717/src/renderer/engine.ts#L63)

***

### slots?

```ts
optional slots?: Record<string, ComponentNode[]>;
```

Defined in: [renderer/engine.ts:64](https://github.com/Max-Health-Inc/prefab/blob/de93a446678c2f2b8a07006b7acfdb8a5f593717/src/renderer/engine.ts#L64)

***

### destroyRegistry?

```ts
optional destroyRegistry?: DestroyRegistry;
```

Defined in: [renderer/engine.ts:65](https://github.com/Max-Health-Inc/prefab/blob/de93a446678c2f2b8a07006b7acfdb8a5f593717/src/renderer/engine.ts#L65)
