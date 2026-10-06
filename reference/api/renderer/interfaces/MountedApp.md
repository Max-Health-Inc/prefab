---
url: /prefab/reference/api/renderer/interfaces/MountedApp.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / MountedApp

# Interface: MountedApp

Defined in: [renderer/index.ts:111](https://github.com/Max-Health-Inc/prefab/blob/c0556f0632cf75f3e410fd7efc1a25abaf224e54/src/renderer/index.ts#L111)

## Properties

### rerender

```ts
rerender: () => void;
```

Defined in: [renderer/index.ts:113](https://github.com/Max-Health-Inc/prefab/blob/c0556f0632cf75f3e410fd7efc1a25abaf224e54/src/renderer/index.ts#L113)

Re-render the entire UI from current state.

#### Returns

`void`

***

### update

```ts
update: (data) => void;
```

Defined in: [renderer/index.ts:115](https://github.com/Max-Health-Inc/prefab/blob/c0556f0632cf75f3e410fd7efc1a25abaf224e54/src/renderer/index.ts#L115)

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

Defined in: [renderer/index.ts:117](https://github.com/Max-Health-Inc/prefab/blob/c0556f0632cf75f3e410fd7efc1a25abaf224e54/src/renderer/index.ts#L117)

Get the reactive store.

***

### destroy

```ts
destroy: () => void;
```

Defined in: [renderer/index.ts:119](https://github.com/Max-Health-Inc/prefab/blob/c0556f0632cf75f3e410fd7efc1a25abaf224e54/src/renderer/index.ts#L119)

Unmount and clean up.

#### Returns

`void`
