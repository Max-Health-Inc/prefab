---
url: /prefab/reference/api/renderer/interfaces/MountHandle.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / MountHandle

# Interface: MountHandle

Defined in: [renderer/app.ts:104](https://github.com/Max-Health-Inc/prefab/blob/4e102b3517c5a62f380fd91b75fb8c49a1f96cec/src/renderer/app.ts#L104)

## Properties

### rerender

```ts
rerender: () => void;
```

Defined in: [renderer/app.ts:106](https://github.com/Max-Health-Inc/prefab/blob/4e102b3517c5a62f380fd91b75fb8c49a1f96cec/src/renderer/app.ts#L106)

Re-render the current component tree.

#### Returns

`void`

***

### store

```ts
store: Store;
```

Defined in: [renderer/app.ts:108](https://github.com/Max-Health-Inc/prefab/blob/4e102b3517c5a62f380fd91b75fb8c49a1f96cec/src/renderer/app.ts#L108)

Access the reactive store.

***

### destroy

```ts
destroy: () => void;
```

Defined in: [renderer/app.ts:110](https://github.com/Max-Health-Inc/prefab/blob/4e102b3517c5a62f380fd91b75fb8c49a1f96cec/src/renderer/app.ts#L110)

Unmount.

#### Returns

`void`
