---
url: /prefab/reference/api/renderer/interfaces/RenderResult.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / RenderResult

# Interface: RenderResult

Defined in: [renderer/engine.ts:68](https://github.com/Max-Health-Inc/prefab/blob/c512f3bb2fb808f4335797b98c7b93774e2b1b30/src/renderer/engine.ts#L68)

Result of a render function that includes a cleanup callback.

## Properties

### element

```ts
element: HTMLElement | DocumentFragment;
```

Defined in: [renderer/engine.ts:69](https://github.com/Max-Health-Inc/prefab/blob/c512f3bb2fb808f4335797b98c7b93774e2b1b30/src/renderer/engine.ts#L69)

***

### destroy

```ts
destroy: () => void;
```

Defined in: [renderer/engine.ts:70](https://github.com/Max-Health-Inc/prefab/blob/c512f3bb2fb808f4335797b98c7b93774e2b1b30/src/renderer/engine.ts#L70)

#### Returns

`void`
