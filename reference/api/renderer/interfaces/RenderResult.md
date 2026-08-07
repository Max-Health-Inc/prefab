---
url: /prefab/reference/api/renderer/interfaces/RenderResult.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / RenderResult

# Interface: RenderResult

Defined in: [renderer/engine.ts:70](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/renderer/engine.ts#L70)

Result of a render function that includes a cleanup callback.

## Properties

### element

```ts
element: HTMLElement | DocumentFragment;
```

Defined in: [renderer/engine.ts:71](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/renderer/engine.ts#L71)

***

### destroy

```ts
destroy: () => void;
```

Defined in: [renderer/engine.ts:72](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/renderer/engine.ts#L72)

#### Returns

`void`
