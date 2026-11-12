---
url: /prefab/reference/api/renderer/interfaces/RenderResult.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / RenderResult

# Interface: RenderResult

Defined in: [renderer/engine.ts:80](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/renderer/engine.ts#L80)

Result of a render function that includes a cleanup callback.

## Properties

### element

```ts
element: HTMLElement | DocumentFragment;
```

Defined in: [renderer/engine.ts:81](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/renderer/engine.ts#L81)

***

### destroy

```ts
destroy: () => void;
```

Defined in: [renderer/engine.ts:82](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/renderer/engine.ts#L82)

#### Returns

`void`
