---
url: /prefab/reference/api/mcp/interfaces/DisplayOptions.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / DisplayOptions

# Interface: DisplayOptions

Defined in: [mcp/display.ts:35](https://github.com/Max-Health-Inc/prefab/blob/0b875c7d37ce621a7701a86ade4497710f4b2a08/src/mcp/display.ts#L35)

## Extended by

* [`DisplayFormOptions`](DisplayFormOptions.md)

## Properties

### title?

```ts
optional title?: string;
```

Defined in: [mcp/display.ts:37](https://github.com/Max-Health-Inc/prefab/blob/0b875c7d37ce621a7701a86ade4497710f4b2a08/src/mcp/display.ts#L37)

Page / app title.

***

### state?

```ts
optional state?: Record<string, unknown>;
```

Defined in: [mcp/display.ts:39](https://github.com/Max-Health-Inc/prefab/blob/0b875c7d37ce621a7701a86ade4497710f4b2a08/src/mcp/display.ts#L39)

Initial reactive state.

***

### theme?

```ts
optional theme?: Theme;
```

Defined in: [mcp/display.ts:41](https://github.com/Max-Health-Inc/prefab/blob/0b875c7d37ce621a7701a86ade4497710f4b2a08/src/mcp/display.ts#L41)

Light/dark theme overrides.

***

### defs?

```ts
optional defs?: Record<string, Component>;
```

Defined in: [mcp/display.ts:43](https://github.com/Max-Health-Inc/prefab/blob/0b875c7d37ce621a7701a86ade4497710f4b2a08/src/mcp/display.ts#L43)

Reusable component definitions.

***

### onMount?

```ts
optional onMount?: 
  | Action
  | Action[];
```

Defined in: [mcp/display.ts:45](https://github.com/Max-Health-Inc/prefab/blob/0b875c7d37ce621a7701a86ade4497710f4b2a08/src/mcp/display.ts#L45)

Action(s) to run when the UI mounts.

***

### keyBindings?

```ts
optional keyBindings?: Record<string, 
  | Action
| Action[]>;
```

Defined in: [mcp/display.ts:47](https://github.com/Max-Health-Inc/prefab/blob/0b875c7d37ce621a7701a86ade4497710f4b2a08/src/mcp/display.ts#L47)

Keyboard shortcuts.

***

### cssClass?

```ts
optional cssClass?: string;
```

Defined in: [mcp/display.ts:49](https://github.com/Max-Health-Inc/prefab/blob/0b875c7d37ce621a7701a86ade4497710f4b2a08/src/mcp/display.ts#L49)

Extra CSS class on root element.

***

### layout?

```ts
optional layout?: LayoutHints;
```

Defined in: [mcp/display.ts:51](https://github.com/Max-Health-Inc/prefab/blob/0b875c7d37ce621a7701a86ade4497710f4b2a08/src/mcp/display.ts#L51)

Size hints for the host container (iframe, panel, etc.).

***

### css?

```ts
optional css?: string[];
```

Defined in: [mcp/display.ts:53](https://github.com/Max-Health-Inc/prefab/blob/0b875c7d37ce621a7701a86ade4497710f4b2a08/src/mcp/display.ts#L53)

Inline CSS blocks injected as `<style>` (merged after the compiled theme).

***

### stylesheets?

```ts
optional stylesheets?: string[];
```

Defined in: [mcp/display.ts:55](https://github.com/Max-Health-Inc/prefab/blob/0b875c7d37ce621a7701a86ade4497710f4b2a08/src/mcp/display.ts#L55)

External CSS URLs loaded as `<link rel="stylesheet">`.

***

### mode?

```ts
optional mode?: ColorMode;
```

Defined in: [mcp/display.ts:57](https://github.com/Max-Health-Inc/prefab/blob/0b875c7d37ce621a7701a86ade4497710f4b2a08/src/mcp/display.ts#L57)

Force a color scheme regardless of OS preference.

***

### pipes?

```ts
optional pipes?: Record<string, PipeFn>;
```

Defined in: [mcp/display.ts:59](https://github.com/Max-Health-Inc/prefab/blob/0b875c7d37ce621a7701a86ade4497710f4b2a08/src/mcp/display.ts#L59)

Custom pipe functions for reactive expressions.
