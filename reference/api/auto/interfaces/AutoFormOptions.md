---
url: /prefab/reference/api/auto/interfaces/AutoFormOptions.md
---
[@maxhealth.tech/prefab](../../index.md) / [auto](../index.md) / AutoFormOptions

# Interface: AutoFormOptions

Defined in: [auto/form.ts:29](https://github.com/Max-Health-Inc/prefab/blob/0b875c7d37ce621a7701a86ade4497710f4b2a08/src/auto/form.ts#L29)

## Extended by

* [`DisplayFormOptions`](../../mcp/interfaces/DisplayFormOptions.md)

## Properties

### title?

```ts
optional title?: string;
```

Defined in: [auto/form.ts:31](https://github.com/Max-Health-Inc/prefab/blob/0b875c7d37ce621a7701a86ade4497710f4b2a08/src/auto/form.ts#L31)

Form heading.

***

### subtitle?

```ts
optional subtitle?: string;
```

Defined in: [auto/form.ts:33](https://github.com/Max-Health-Inc/prefab/blob/0b875c7d37ce621a7701a86ade4497710f4b2a08/src/auto/form.ts#L33)

Optional subtitle.

***

### submitLabel?

```ts
optional submitLabel?: string;
```

Defined in: [auto/form.ts:35](https://github.com/Max-Health-Inc/prefab/blob/0b875c7d37ce621a7701a86ade4497710f4b2a08/src/auto/form.ts#L35)

Submit button text. Default 'Submit'.

***

### onSubmit?

```ts
optional onSubmit?: 
  | Action
  | Action[];
```

Defined in: [auto/form.ts:37](https://github.com/Max-Health-Inc/prefab/blob/0b875c7d37ce621a7701a86ade4497710f4b2a08/src/auto/form.ts#L37)

Custom onSubmit action. Overrides submitTool.

***

### successMessage?

```ts
optional successMessage?: string;
```

Defined in: [auto/form.ts:39](https://github.com/Max-Health-Inc/prefab/blob/0b875c7d37ce621a7701a86ade4497710f4b2a08/src/auto/form.ts#L39)

Success toast message.

***

### errorMessage?

```ts
optional errorMessage?: string;
```

Defined in: [auto/form.ts:41](https://github.com/Max-Health-Inc/prefab/blob/0b875c7d37ce621a7701a86ade4497710f4b2a08/src/auto/form.ts#L41)

Error toast message.
