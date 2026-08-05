---
url: /prefab/reference/api/renderer/interfaces/PrefabWireData.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / PrefabWireData

# Interface: PrefabWireData

Defined in: [renderer/index.ts:74](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/renderer/index.ts#L74)

## Properties

### $prefab

```ts
$prefab: object;
```

Defined in: [renderer/index.ts:75](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/renderer/index.ts#L75)

#### version

```ts
version: string;
```

***

### view

```ts
view: ComponentNode;
```

Defined in: [renderer/index.ts:76](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/renderer/index.ts#L76)

***

### state?

```ts
optional state?: Record<string, unknown>;
```

Defined in: [renderer/index.ts:77](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/renderer/index.ts#L77)

***

### theme?

```ts
optional theme?: object;
```

Defined in: [renderer/index.ts:79](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/renderer/index.ts#L79)

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

Defined in: [renderer/index.ts:80](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/renderer/index.ts#L80)

***

### keyBindings?

```ts
optional keyBindings?: Record<string, ActionJSON | ActionJSON[]>;
```

Defined in: [renderer/index.ts:81](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/renderer/index.ts#L81)

***

### css?

```ts
optional css?: string[];
```

Defined in: [renderer/index.ts:83](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/renderer/index.ts#L83)

Inline CSS blocks injected as `<style>` (protocol 0.3).

***

### stylesheets?

```ts
optional stylesheets?: string[];
```

Defined in: [renderer/index.ts:85](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/renderer/index.ts#L85)

External CSS URLs loaded as `<link rel="stylesheet">` (protocol 0.3).

***

### mode?

```ts
optional mode?: "light" | "dark";
```

Defined in: [renderer/index.ts:87](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/renderer/index.ts#L87)

Forced color scheme, independent of OS preference (protocol 0.3).

***

### pipes?

```ts
optional pipes?: Record<string, string>;
```

Defined in: [renderer/index.ts:89](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/renderer/index.ts#L89)

Custom pipe source code strings — hydrated by the renderer on mount.

***

### layout?

```ts
optional layout?: object;
```

Defined in: [renderer/index.ts:91](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/renderer/index.ts#L91)

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
