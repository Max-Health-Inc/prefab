---
url: /prefab/reference/api/renderer/interfaces/MountedApp.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / MountedApp

# Interface: MountedApp

Defined in: [renderer/index.ts:110](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/renderer/index.ts#L110)

## Properties

### rerender

```ts
rerender: () => void;
```

Defined in: [renderer/index.ts:112](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/renderer/index.ts#L112)

Re-render the entire UI from current state.

#### Returns

`void`

***

### update

```ts
update: (data) => void;
```

Defined in: [renderer/index.ts:114](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/renderer/index.ts#L114)

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

Defined in: [renderer/index.ts:116](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/renderer/index.ts#L116)

Get the reactive store.

***

### destroy

```ts
destroy: () => void;
```

Defined in: [renderer/index.ts:118](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/renderer/index.ts#L118)

Unmount and clean up.

#### Returns

`void`
