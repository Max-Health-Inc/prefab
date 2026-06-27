---
url: /prefab/reference/api/renderer/interfaces/RenderResult.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / RenderResult

# Interface: RenderResult

Defined in: [renderer/engine.ts:68](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/renderer/engine.ts#L68)

Result of a render function that includes a cleanup callback.

## Properties

### element

```ts
element: HTMLElement | DocumentFragment;
```

Defined in: [renderer/engine.ts:69](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/renderer/engine.ts#L69)

***

### destroy

```ts
destroy: () => void;
```

Defined in: [renderer/engine.ts:70](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/renderer/engine.ts#L70)

#### Returns

`void`
