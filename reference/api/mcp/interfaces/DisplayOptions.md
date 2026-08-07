---
url: /prefab/reference/api/mcp/interfaces/DisplayOptions.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / DisplayOptions

# Interface: DisplayOptions

Defined in: [mcp/display.ts:36](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/mcp/display.ts#L36)

## Extended by

* [`DisplayFormOptions`](DisplayFormOptions.md)

## Properties

### title?

```ts
optional title?: string;
```

Defined in: [mcp/display.ts:38](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/mcp/display.ts#L38)

Page / app title.

***

### state?

```ts
optional state?: Record<string, unknown>;
```

Defined in: [mcp/display.ts:40](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/mcp/display.ts#L40)

Initial reactive state.

***

### theme?

```ts
optional theme?: Theme;
```

Defined in: [mcp/display.ts:42](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/mcp/display.ts#L42)

Light/dark theme overrides.

***

### defs?

```ts
optional defs?: Record<string, Component>;
```

Defined in: [mcp/display.ts:44](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/mcp/display.ts#L44)

Reusable component definitions.

***

### onMount?

```ts
optional onMount?: 
  | Action
  | Action[];
```

Defined in: [mcp/display.ts:46](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/mcp/display.ts#L46)

Action(s) to run when the UI mounts.

***

### keyBindings?

```ts
optional keyBindings?: Record<string, 
  | Action
| Action[]>;
```

Defined in: [mcp/display.ts:48](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/mcp/display.ts#L48)

Keyboard shortcuts.

***

### cssClass?

```ts
optional cssClass?: string;
```

Defined in: [mcp/display.ts:50](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/mcp/display.ts#L50)

Extra CSS class on root element.

***

### layout?

```ts
optional layout?: LayoutHints;
```

Defined in: [mcp/display.ts:52](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/mcp/display.ts#L52)

Size hints for the host container (iframe, panel, etc.).

***

### css?

```ts
optional css?: string[];
```

Defined in: [mcp/display.ts:54](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/mcp/display.ts#L54)

Inline CSS blocks injected as `<style>` (merged after the compiled theme).

***

### stylesheets?

```ts
optional stylesheets?: string[];
```

Defined in: [mcp/display.ts:56](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/mcp/display.ts#L56)

External CSS URLs loaded as `<link rel="stylesheet">`.

***

### mode?

```ts
optional mode?: ColorMode;
```

Defined in: [mcp/display.ts:58](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/mcp/display.ts#L58)

Force a color scheme regardless of OS preference.

***

### pipes?

```ts
optional pipes?: Record<string, PipeFn>;
```

Defined in: [mcp/display.ts:60](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/mcp/display.ts#L60)

Custom pipe functions for reactive expressions.
