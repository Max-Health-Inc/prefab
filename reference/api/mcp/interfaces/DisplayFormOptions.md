---
url: /prefab/reference/api/mcp/interfaces/DisplayFormOptions.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / DisplayFormOptions

# Interface: DisplayFormOptions

Defined in: [mcp/display.ts:134](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/display.ts#L134)

## Extends

* [`AutoFormOptions`](../../auto/interfaces/AutoFormOptions.md).[`DisplayOptions`](DisplayOptions.md)

## Properties

### title?

```ts
optional title?: string;
```

Defined in: [auto/form.ts:57](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/auto/form.ts#L57)

Form heading.

#### Inherited from

[`AutoFormOptions`](../../auto/interfaces/AutoFormOptions.md).[`title`](../../auto/interfaces/AutoFormOptions.md#title)

***

### subtitle?

```ts
optional subtitle?: string;
```

Defined in: [auto/form.ts:59](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/auto/form.ts#L59)

Optional subtitle.

#### Inherited from

[`AutoFormOptions`](../../auto/interfaces/AutoFormOptions.md).[`subtitle`](../../auto/interfaces/AutoFormOptions.md#subtitle)

***

### submitLabel?

```ts
optional submitLabel?: string;
```

Defined in: [auto/form.ts:61](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/auto/form.ts#L61)

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

Defined in: [auto/form.ts:63](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/auto/form.ts#L63)

Custom onSubmit action. Overrides submitTool.

#### Inherited from

[`AutoFormOptions`](../../auto/interfaces/AutoFormOptions.md).[`onSubmit`](../../auto/interfaces/AutoFormOptions.md#onsubmit)

***

### successMessage?

```ts
optional successMessage?: string;
```

Defined in: [auto/form.ts:65](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/auto/form.ts#L65)

Success toast message.

#### Inherited from

[`AutoFormOptions`](../../auto/interfaces/AutoFormOptions.md).[`successMessage`](../../auto/interfaces/AutoFormOptions.md#successmessage)

***

### errorMessage?

```ts
optional errorMessage?: string;
```

Defined in: [auto/form.ts:67](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/auto/form.ts#L67)

Error toast message.

#### Inherited from

[`AutoFormOptions`](../../auto/interfaces/AutoFormOptions.md).[`errorMessage`](../../auto/interfaces/AutoFormOptions.md#errormessage)

***

### state?

```ts
optional state?: Record<string, unknown>;
```

Defined in: [mcp/display.ts:41](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/display.ts#L41)

Initial reactive state.

#### Inherited from

[`DisplayOptions`](DisplayOptions.md).[`state`](DisplayOptions.md#state)

***

### theme?

```ts
optional theme?: Theme;
```

Defined in: [mcp/display.ts:43](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/display.ts#L43)

Light/dark theme overrides.

#### Inherited from

[`DisplayOptions`](DisplayOptions.md).[`theme`](DisplayOptions.md#theme)

***

### defs?

```ts
optional defs?: Record<string, Component>;
```

Defined in: [mcp/display.ts:45](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/display.ts#L45)

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

Defined in: [mcp/display.ts:47](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/display.ts#L47)

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

Defined in: [mcp/display.ts:49](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/display.ts#L49)

Keyboard shortcuts.

#### Inherited from

[`DisplayOptions`](DisplayOptions.md).[`keyBindings`](DisplayOptions.md#keybindings)

***

### cssClass?

```ts
optional cssClass?: string;
```

Defined in: [mcp/display.ts:51](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/display.ts#L51)

Extra CSS class on root element.

#### Inherited from

[`DisplayOptions`](DisplayOptions.md).[`cssClass`](DisplayOptions.md#cssclass)

***

### layout?

```ts
optional layout?: LayoutHints;
```

Defined in: [mcp/display.ts:53](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/display.ts#L53)

Size hints for the host container (iframe, panel, etc.).

#### Inherited from

[`DisplayOptions`](DisplayOptions.md).[`layout`](DisplayOptions.md#layout)

***

### css?

```ts
optional css?: string[];
```

Defined in: [mcp/display.ts:55](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/display.ts#L55)

Inline CSS blocks injected as `<style>` (merged after the compiled theme).

#### Inherited from

[`DisplayOptions`](DisplayOptions.md).[`css`](DisplayOptions.md#css)

***

### stylesheets?

```ts
optional stylesheets?: string[];
```

Defined in: [mcp/display.ts:57](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/display.ts#L57)

External CSS URLs loaded as `<link rel="stylesheet">`.

#### Inherited from

[`DisplayOptions`](DisplayOptions.md).[`stylesheets`](DisplayOptions.md#stylesheets)

***

### mode?

```ts
optional mode?: ColorMode;
```

Defined in: [mcp/display.ts:59](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/display.ts#L59)

Force a color scheme regardless of OS preference.

#### Inherited from

[`DisplayOptions`](DisplayOptions.md).[`mode`](DisplayOptions.md#mode)

***

### pipes?

```ts
optional pipes?: Record<string, PipeFn>;
```

Defined in: [mcp/display.ts:61](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/display.ts#L61)

Custom pipe functions for reactive expressions.

#### Inherited from

[`DisplayOptions`](DisplayOptions.md).[`pipes`](DisplayOptions.md#pipes)

***

### elicit?

```ts
optional elicit?: boolean | FormInputRequestOptions;
```

Defined in: [mcp/display.ts:147](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/display.ts#L147)

Ask the client to collect the fields instead of rendering them.

A prefab form only exists on a host that renders UI. Protocol revision
2026-07-28 gives every other host a native path: return an
`input_required` result, the client shows its own form and retries the
call. Pass `true` for the defaults, or an options object to set the
response key, the prompt, or a signed `requestState`.

The answer comes back through `acceptedFormInput`, which checks it against
the same field list. See `./input-required.ts` for the full handler shape.
