---
url: /prefab/reference/api/auto/interfaces/AutoFormOptions.md
---
[@maxhealth.tech/prefab](../../index.md) / [auto](../index.md) / AutoFormOptions

# Interface: AutoFormOptions

Defined in: [auto/form.ts:56](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/auto/form.ts#L56)

## Extended by

* [`DisplayFormOptions`](../../mcp/interfaces/DisplayFormOptions.md)

## Properties

### title?

```ts
optional title?: string;
```

Defined in: [auto/form.ts:58](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/auto/form.ts#L58)

Form heading.

***

### subtitle?

```ts
optional subtitle?: string;
```

Defined in: [auto/form.ts:60](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/auto/form.ts#L60)

Optional subtitle.

***

### submitLabel?

```ts
optional submitLabel?: string;
```

Defined in: [auto/form.ts:62](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/auto/form.ts#L62)

Submit button text. Default 'Submit'.

***

### onSubmit?

```ts
optional onSubmit?: 
  | Action
  | Action[];
```

Defined in: [auto/form.ts:64](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/auto/form.ts#L64)

Custom onSubmit action. Overrides submitTool.

***

### successMessage?

```ts
optional successMessage?: string;
```

Defined in: [auto/form.ts:66](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/auto/form.ts#L66)

Success toast message.

***

### errorMessage?

```ts
optional errorMessage?: string;
```

Defined in: [auto/form.ts:68](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/auto/form.ts#L68)

Error toast message.
