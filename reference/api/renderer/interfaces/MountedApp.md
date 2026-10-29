---
url: /prefab/reference/api/renderer/interfaces/MountedApp.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / MountedApp

# Interface: MountedApp

Defined in: [renderer/index.ts:114](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/renderer/index.ts#L114)

## Properties

### rerender

```ts
rerender: () => void;
```

Defined in: [renderer/index.ts:116](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/renderer/index.ts#L116)

Re-render the entire UI from current state.

#### Returns

`void`

***

### update

```ts
update: (data) => void;
```

Defined in: [renderer/index.ts:118](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/renderer/index.ts#L118)

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

Defined in: [renderer/index.ts:120](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/renderer/index.ts#L120)

Get the reactive store.

***

### destroy

```ts
destroy: () => void;
```

Defined in: [renderer/index.ts:122](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/renderer/index.ts#L122)

Unmount and clean up.

#### Returns

`void`
