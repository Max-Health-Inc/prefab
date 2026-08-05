---
url: /prefab/reference/api/renderer/interfaces/MountHandle.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / MountHandle

# Interface: MountHandle

Defined in: [renderer/app.ts:103](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/renderer/app.ts#L103)

## Properties

### rerender

```ts
rerender: () => void;
```

Defined in: [renderer/app.ts:105](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/renderer/app.ts#L105)

Re-render the current component tree.

#### Returns

`void`

***

### store

```ts
store: Store;
```

Defined in: [renderer/app.ts:107](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/renderer/app.ts#L107)

Access the reactive store.

***

### destroy

```ts
destroy: () => void;
```

Defined in: [renderer/app.ts:109](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/renderer/app.ts#L109)

Unmount.

#### Returns

`void`
