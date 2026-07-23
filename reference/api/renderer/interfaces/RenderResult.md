---
url: /prefab/reference/api/renderer/interfaces/RenderResult.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / RenderResult

# Interface: RenderResult

Defined in: [renderer/engine.ts:69](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/renderer/engine.ts#L69)

Result of a render function that includes a cleanup callback.

## Properties

### element

```ts
element: HTMLElement | DocumentFragment;
```

Defined in: [renderer/engine.ts:70](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/renderer/engine.ts#L70)

***

### destroy

```ts
destroy: () => void;
```

Defined in: [renderer/engine.ts:71](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/renderer/engine.ts#L71)

#### Returns

`void`
