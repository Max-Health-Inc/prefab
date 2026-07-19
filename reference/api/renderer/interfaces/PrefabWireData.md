---
url: /prefab/reference/api/renderer/interfaces/PrefabWireData.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / PrefabWireData

# Interface: PrefabWireData

Defined in: [renderer/index.ts:69](https://github.com/Max-Health-Inc/prefab/blob/c512f3bb2fb808f4335797b98c7b93774e2b1b30/src/renderer/index.ts#L69)

## Properties

### $prefab

```ts
$prefab: object;
```

Defined in: [renderer/index.ts:70](https://github.com/Max-Health-Inc/prefab/blob/c512f3bb2fb808f4335797b98c7b93774e2b1b30/src/renderer/index.ts#L70)

#### version

```ts
version: string;
```

***

### view

```ts
view: ComponentNode;
```

Defined in: [renderer/index.ts:71](https://github.com/Max-Health-Inc/prefab/blob/c512f3bb2fb808f4335797b98c7b93774e2b1b30/src/renderer/index.ts#L71)

***

### state?

```ts
optional state?: Record<string, unknown>;
```

Defined in: [renderer/index.ts:72](https://github.com/Max-Health-Inc/prefab/blob/c512f3bb2fb808f4335797b98c7b93774e2b1b30/src/renderer/index.ts#L72)

***

### theme?

```ts
optional theme?: object;
```

Defined in: [renderer/index.ts:74](https://github.com/Max-Health-Inc/prefab/blob/c512f3bb2fb808f4335797b98c7b93774e2b1b30/src/renderer/index.ts#L74)

Legacy structured theme (protocol 0.2). Protocol 0.3 ships the theme in `css`.

#### light?

```ts
optional light?: Record<string, string>;
```

#### dark?

```ts
optional dark?: Record<string, string>;
```

***

### defs?

```ts
optional defs?: Record<string, ComponentNode>;
```

Defined in: [renderer/index.ts:75](https://github.com/Max-Health-Inc/prefab/blob/c512f3bb2fb808f4335797b98c7b93774e2b1b30/src/renderer/index.ts#L75)

***

### keyBindings?

```ts
optional keyBindings?: Record<string, ActionJSON | ActionJSON[]>;
```

Defined in: [renderer/index.ts:76](https://github.com/Max-Health-Inc/prefab/blob/c512f3bb2fb808f4335797b98c7b93774e2b1b30/src/renderer/index.ts#L76)

***

### css?

```ts
optional css?: string[];
```

Defined in: [renderer/index.ts:78](https://github.com/Max-Health-Inc/prefab/blob/c512f3bb2fb808f4335797b98c7b93774e2b1b30/src/renderer/index.ts#L78)

Inline CSS blocks injected as `<style>` (protocol 0.3).

***

### stylesheets?

```ts
optional stylesheets?: string[];
```

Defined in: [renderer/index.ts:80](https://github.com/Max-Health-Inc/prefab/blob/c512f3bb2fb808f4335797b98c7b93774e2b1b30/src/renderer/index.ts#L80)

External CSS URLs loaded as `<link rel="stylesheet">` (protocol 0.3).

***

### mode?

```ts
optional mode?: "light" | "dark";
```

Defined in: [renderer/index.ts:82](https://github.com/Max-Health-Inc/prefab/blob/c512f3bb2fb808f4335797b98c7b93774e2b1b30/src/renderer/index.ts#L82)

Forced color scheme, independent of OS preference (protocol 0.3).

***

### pipes?

```ts
optional pipes?: Record<string, string>;
```

Defined in: [renderer/index.ts:84](https://github.com/Max-Health-Inc/prefab/blob/c512f3bb2fb808f4335797b98c7b93774e2b1b30/src/renderer/index.ts#L84)

Custom pipe source code strings — hydrated by the renderer on mount.

***

### layout?

```ts
optional layout?: object;
```

Defined in: [renderer/index.ts:86](https://github.com/Max-Health-Inc/prefab/blob/c512f3bb2fb808f4335797b98c7b93774e2b1b30/src/renderer/index.ts#L86)

Size hints for the host container.

#### preferredHeight?

```ts
optional preferredHeight?: number;
```

#### minHeight?

```ts
optional minHeight?: number;
```

#### maxHeight?

```ts
optional maxHeight?: number;
```
