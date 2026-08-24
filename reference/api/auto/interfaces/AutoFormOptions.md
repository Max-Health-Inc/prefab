---
url: /prefab/reference/api/auto/interfaces/AutoFormOptions.md
---
[@maxhealth.tech/prefab](../../index.md) / [auto](../index.md) / AutoFormOptions

# Interface: AutoFormOptions

Defined in: [auto/form.ts:55](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/auto/form.ts#L55)

## Extended by

* [`DisplayFormOptions`](../../mcp/interfaces/DisplayFormOptions.md)

## Properties

### title?

```ts
optional title?: string;
```

Defined in: [auto/form.ts:57](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/auto/form.ts#L57)

Form heading.

***

### subtitle?

```ts
optional subtitle?: string;
```

Defined in: [auto/form.ts:59](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/auto/form.ts#L59)

Optional subtitle.

***

### submitLabel?

```ts
optional submitLabel?: string;
```

Defined in: [auto/form.ts:61](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/auto/form.ts#L61)

Submit button text. Default 'Submit'.

***

### onSubmit?

```ts
optional onSubmit?: 
  | Action
  | Action[];
```

Defined in: [auto/form.ts:63](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/auto/form.ts#L63)

Custom onSubmit action. Overrides submitTool.

***

### successMessage?

```ts
optional successMessage?: string;
```

Defined in: [auto/form.ts:65](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/auto/form.ts#L65)

Success toast message.

***

### errorMessage?

```ts
optional errorMessage?: string;
```

Defined in: [auto/form.ts:67](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/auto/form.ts#L67)

Error toast message.
