---
url: /prefab/reference/api/mcp/interfaces/DisplayFormOptions.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / DisplayFormOptions

# Interface: DisplayFormOptions

Defined in: [mcp/display.ts:133](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/mcp/display.ts#L133)

## Extends

* [`AutoFormOptions`](../../auto/interfaces/AutoFormOptions.md).[`DisplayOptions`](DisplayOptions.md)

## Properties

### title?

```ts
optional title?: string;
```

Defined in: [auto/form.ts:31](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/auto/form.ts#L31)

Form heading.

#### Inherited from

[`AutoFormOptions`](../../auto/interfaces/AutoFormOptions.md).[`title`](../../auto/interfaces/AutoFormOptions.md#title)

***

### subtitle?

```ts
optional subtitle?: string;
```

Defined in: [auto/form.ts:33](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/auto/form.ts#L33)

Optional subtitle.

#### Inherited from

[`AutoFormOptions`](../../auto/interfaces/AutoFormOptions.md).[`subtitle`](../../auto/interfaces/AutoFormOptions.md#subtitle)

***

### submitLabel?

```ts
optional submitLabel?: string;
```

Defined in: [auto/form.ts:35](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/auto/form.ts#L35)

Submit button text. Default 'Submit'.

#### Inherited from

[`AutoFormOptions`](../../auto/interfaces/AutoFormOptions.md).[`submitLabel`](../../auto/interfaces/AutoFormOptions.md#submitlabel)

***

### onSubmit?

```ts
optional onSubmit?: 
  | Action
  | Action[];
```

Defined in: [auto/form.ts:37](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/auto/form.ts#L37)

Custom onSubmit action. Overrides submitTool.

#### Inherited from

[`AutoFormOptions`](../../auto/interfaces/AutoFormOptions.md).[`onSubmit`](../../auto/interfaces/AutoFormOptions.md#onsubmit)

***

### successMessage?

```ts
optional successMessage?: string;
```

Defined in: [auto/form.ts:39](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/auto/form.ts#L39)

Success toast message.

#### Inherited from

[`AutoFormOptions`](../../auto/interfaces/AutoFormOptions.md).[`successMessage`](../../auto/interfaces/AutoFormOptions.md#successmessage)

***

### errorMessage?

```ts
optional errorMessage?: string;
```

Defined in: [auto/form.ts:41](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/auto/form.ts#L41)

Error toast message.

#### Inherited from

[`AutoFormOptions`](../../auto/interfaces/AutoFormOptions.md).[`errorMessage`](../../auto/interfaces/AutoFormOptions.md#errormessage)

***

### state?

```ts
optional state?: Record<string, unknown>;
```

Defined in: [mcp/display.ts:40](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/mcp/display.ts#L40)

Initial reactive state.

#### Inherited from

[`DisplayOptions`](DisplayOptions.md).[`state`](DisplayOptions.md#state)

***

### theme?

```ts
optional theme?: Theme;
```

Defined in: [mcp/display.ts:42](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/mcp/display.ts#L42)

Light/dark theme overrides.

#### Inherited from

[`DisplayOptions`](DisplayOptions.md).[`theme`](DisplayOptions.md#theme)

***

### defs?

```ts
optional defs?: Record<string, Component>;
```

Defined in: [mcp/display.ts:44](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/mcp/display.ts#L44)

Reusable component definitions.

#### Inherited from

[`DisplayOptions`](DisplayOptions.md).[`defs`](DisplayOptions.md#defs)

***

### onMount?

```ts
optional onMount?: 
  | Action
  | Action[];
```

Defined in: [mcp/display.ts:46](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/mcp/display.ts#L46)

Action(s) to run when the UI mounts.

#### Inherited from

[`DisplayOptions`](DisplayOptions.md).[`onMount`](DisplayOptions.md#onmount)

***

### keyBindings?

```ts
optional keyBindings?: Record<string, 
  | Action
| Action[]>;
```

Defined in: [mcp/display.ts:48](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/mcp/display.ts#L48)

Keyboard shortcuts.

#### Inherited from

[`DisplayOptions`](DisplayOptions.md).[`keyBindings`](DisplayOptions.md#keybindings)

***

### cssClass?

```ts
optional cssClass?: string;
```

Defined in: [mcp/display.ts:50](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/mcp/display.ts#L50)

Extra CSS class on root element.

#### Inherited from

[`DisplayOptions`](DisplayOptions.md).[`cssClass`](DisplayOptions.md#cssclass)

***

### layout?

```ts
optional layout?: LayoutHints;
```

Defined in: [mcp/display.ts:52](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/mcp/display.ts#L52)

Size hints for the host container (iframe, panel, etc.).

#### Inherited from

[`DisplayOptions`](DisplayOptions.md).[`layout`](DisplayOptions.md#layout)

***

### css?

```ts
optional css?: string[];
```

Defined in: [mcp/display.ts:54](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/mcp/display.ts#L54)

Inline CSS blocks injected as `<style>` (merged after the compiled theme).

#### Inherited from

[`DisplayOptions`](DisplayOptions.md).[`css`](DisplayOptions.md#css)

***

### stylesheets?

```ts
optional stylesheets?: string[];
```

Defined in: [mcp/display.ts:56](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/mcp/display.ts#L56)

External CSS URLs loaded as `<link rel="stylesheet">`.

#### Inherited from

[`DisplayOptions`](DisplayOptions.md).[`stylesheets`](DisplayOptions.md#stylesheets)

***

### mode?

```ts
optional mode?: ColorMode;
```

Defined in: [mcp/display.ts:58](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/mcp/display.ts#L58)

Force a color scheme regardless of OS preference.

#### Inherited from

[`DisplayOptions`](DisplayOptions.md).[`mode`](DisplayOptions.md#mode)

***

### pipes?

```ts
optional pipes?: Record<string, PipeFn>;
```

Defined in: [mcp/display.ts:60](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/mcp/display.ts#L60)

Custom pipe functions for reactive expressions.

#### Inherited from

[`DisplayOptions`](DisplayOptions.md).[`pipes`](DisplayOptions.md#pipes)
