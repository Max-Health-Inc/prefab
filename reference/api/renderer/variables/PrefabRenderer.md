---
url: /prefab/reference/api/renderer/variables/PrefabRenderer.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / PrefabRenderer

# Variable: PrefabRenderer

```ts
const PrefabRenderer: object;
```

Defined in: [renderer/index.ts:123](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/renderer/index.ts#L123)

## Type Declaration

### mount()

```ts
mount(
   root, 
   initialData, 
   options?): MountedApp;
```

Mount a prefab UI into a DOM element.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `root` | `HTMLElement` | The DOM element to render into. |
| `initialData` | [`PrefabWireData`](../interfaces/PrefabWireData.md) | - |
| `options?` | [`MountOptions`](../interfaces/MountOptions.md) | Optional transport and toast handler. |

#### Returns

[`MountedApp`](../interfaces/MountedApp.md)

A MountedApp handle for updates and cleanup.

### isPrefabData()

```ts
isPrefabData(data): data is PrefabWireData;
```

Check if data is a prefab wire format.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | `unknown` |

#### Returns

`data is PrefabWireData`

### isPrefabUpdate()

```ts
isPrefabUpdate(data): data is PrefabUpdateData;
```

Check if data is a prefab state update.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | `unknown` |

#### Returns

`data is PrefabUpdateData`
