---
url: /prefab/reference/api/renderer/interfaces/PrefabWireData.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / PrefabWireData

# Interface: PrefabWireData

Defined in: [renderer/index.ts:75](https://github.com/Max-Health-Inc/prefab/blob/c0556f0632cf75f3e410fd7efc1a25abaf224e54/src/renderer/index.ts#L75)

## Properties

### $prefab

```ts
$prefab: object;
```

Defined in: [renderer/index.ts:76](https://github.com/Max-Health-Inc/prefab/blob/c0556f0632cf75f3e410fd7efc1a25abaf224e54/src/renderer/index.ts#L76)

#### version

```ts
version: string;
```

***

### view

```ts
view: ComponentNode;
```

Defined in: [renderer/index.ts:77](https://github.com/Max-Health-Inc/prefab/blob/c0556f0632cf75f3e410fd7efc1a25abaf224e54/src/renderer/index.ts#L77)

***

### state?

```ts
optional state?: Record<string, unknown>;
```

Defined in: [renderer/index.ts:78](https://github.com/Max-Health-Inc/prefab/blob/c0556f0632cf75f3e410fd7efc1a25abaf224e54/src/renderer/index.ts#L78)

***

### theme?

```ts
optional theme?: object;
```

Defined in: [renderer/index.ts:80](https://github.com/Max-Health-Inc/prefab/blob/c0556f0632cf75f3e410fd7efc1a25abaf224e54/src/renderer/index.ts#L80)

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

Defined in: [renderer/index.ts:81](https://github.com/Max-Health-Inc/prefab/blob/c0556f0632cf75f3e410fd7efc1a25abaf224e54/src/renderer/index.ts#L81)

***

### keyBindings?

```ts
optional keyBindings?: Record<string, ActionJSON | ActionJSON[]>;
```

Defined in: [renderer/index.ts:82](https://github.com/Max-Health-Inc/prefab/blob/c0556f0632cf75f3e410fd7efc1a25abaf224e54/src/renderer/index.ts#L82)

***

### css?

```ts
optional css?: string[];
```

Defined in: [renderer/index.ts:84](https://github.com/Max-Health-Inc/prefab/blob/c0556f0632cf75f3e410fd7efc1a25abaf224e54/src/renderer/index.ts#L84)

Inline CSS blocks injected as `<style>` (protocol 0.3).

***

### stylesheets?

```ts
optional stylesheets?: string[];
```

Defined in: [renderer/index.ts:86](https://github.com/Max-Health-Inc/prefab/blob/c0556f0632cf75f3e410fd7efc1a25abaf224e54/src/renderer/index.ts#L86)

External CSS URLs loaded as `<link rel="stylesheet">` (protocol 0.3).

***

### mode?

```ts
optional mode?: "light" | "dark";
```

Defined in: [renderer/index.ts:88](https://github.com/Max-Health-Inc/prefab/blob/c0556f0632cf75f3e410fd7efc1a25abaf224e54/src/renderer/index.ts#L88)

Forced color scheme, independent of OS preference (protocol 0.3).

***

### pipes?

```ts
optional pipes?: Record<string, string>;
```

Defined in: [renderer/index.ts:90](https://github.com/Max-Health-Inc/prefab/blob/c0556f0632cf75f3e410fd7efc1a25abaf224e54/src/renderer/index.ts#L90)

Custom pipe source code strings — hydrated by the renderer on mount.

***

### layout?

```ts
optional layout?: object;
```

Defined in: [renderer/index.ts:92](https://github.com/Max-Health-Inc/prefab/blob/c0556f0632cf75f3e410fd7efc1a25abaf224e54/src/renderer/index.ts#L92)

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
