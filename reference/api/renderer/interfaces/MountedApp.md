---
url: /prefab/reference/api/renderer/interfaces/MountedApp.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / MountedApp

# Interface: MountedApp

Defined in: [renderer/index.ts:113](https://github.com/Max-Health-Inc/prefab/blob/7a2e43417fa83301b42abd7447c199249e6c40f6/src/renderer/index.ts#L113)

## Properties

### rerender

```ts
rerender: () => void;
```

Defined in: [renderer/index.ts:115](https://github.com/Max-Health-Inc/prefab/blob/7a2e43417fa83301b42abd7447c199249e6c40f6/src/renderer/index.ts#L115)

Re-render the entire UI from current state.

#### Returns

`void`

***

### update

```ts
update: (data) => void;
```

Defined in: [renderer/index.ts:117](https://github.com/Max-Health-Inc/prefab/blob/7a2e43417fa83301b42abd7447c199249e6c40f6/src/renderer/index.ts#L117)

Apply a state update (from display\_update).

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | [`PrefabUpdateData`](PrefabUpdateData.md) |

#### Returns

`void`

***

### store

```ts
store: Store;
```

Defined in: [renderer/index.ts:119](https://github.com/Max-Health-Inc/prefab/blob/7a2e43417fa83301b42abd7447c199249e6c40f6/src/renderer/index.ts#L119)

Get the reactive store.

***

### destroy

```ts
destroy: () => void;
```

Defined in: [renderer/index.ts:121](https://github.com/Max-Health-Inc/prefab/blob/7a2e43417fa83301b42abd7447c199249e6c40f6/src/renderer/index.ts#L121)

Unmount and clean up.

#### Returns

`void`
