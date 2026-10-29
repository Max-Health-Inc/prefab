---
url: /prefab/reference/api/renderer/interfaces/PrefabWireData.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / PrefabWireData

# Interface: PrefabWireData

Defined in: [renderer/index.ts:76](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/renderer/index.ts#L76)

## Properties

### $prefab

```ts
$prefab: object;
```

Defined in: [renderer/index.ts:77](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/renderer/index.ts#L77)

#### version

```ts
version: string;
```

***

### view

```ts
view: ComponentNode;
```

Defined in: [renderer/index.ts:78](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/renderer/index.ts#L78)

***

### state?

```ts
optional state?: Record<string, unknown>;
```

Defined in: [renderer/index.ts:79](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/renderer/index.ts#L79)

***

### theme?

```ts
optional theme?: object;
```

Defined in: [renderer/index.ts:81](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/renderer/index.ts#L81)

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

Defined in: [renderer/index.ts:82](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/renderer/index.ts#L82)

***

### keyBindings?

```ts
optional keyBindings?: Record<string, ActionJSON | ActionJSON[]>;
```

Defined in: [renderer/index.ts:83](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/renderer/index.ts#L83)

***

### css?

```ts
optional css?: string[];
```

Defined in: [renderer/index.ts:85](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/renderer/index.ts#L85)

Inline CSS blocks injected as `<style>` (protocol 0.3).

***

### stylesheets?

```ts
optional stylesheets?: string[];
```

Defined in: [renderer/index.ts:87](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/renderer/index.ts#L87)

External CSS URLs loaded as `<link rel="stylesheet">` (protocol 0.3).

***

### mode?

```ts
optional mode?: "light" | "dark";
```

Defined in: [renderer/index.ts:89](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/renderer/index.ts#L89)

Forced color scheme, independent of OS preference (protocol 0.3).

***

### pipes?

```ts
optional pipes?: Record<string, string>;
```

Defined in: [renderer/index.ts:91](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/renderer/index.ts#L91)

Custom pipe source code strings — hydrated by the renderer on mount.

***

### layout?

```ts
optional layout?: object;
```

Defined in: [renderer/index.ts:93](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/renderer/index.ts#L93)

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

***

### onMount?

```ts
optional onMount?: ActionJSON | ActionJSON[];
```

Defined in: [renderer/index.ts:95](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/renderer/index.ts#L95)

Runs once when this payload mounts or a tool result remounts it; never on a re-render.
