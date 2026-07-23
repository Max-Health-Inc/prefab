---
url: /prefab/reference/api/auto/interfaces/AutoFormField.md
---
[@maxhealth.tech/prefab](../../index.md) / [auto](../index.md) / AutoFormField

# Interface: AutoFormField

Defined in: [auto/form.ts:16](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/auto/form.ts#L16)

## Properties

### name

```ts
name: string;
```

Defined in: [auto/form.ts:18](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/auto/form.ts#L18)

Field name (used as the key in submitted data).

***

### label?

```ts
optional label?: string;
```

Defined in: [auto/form.ts:20](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/auto/form.ts#L20)

Display label. Defaults to humanized name.

***

### type?

```ts
optional type?: string;
```

Defined in: [auto/form.ts:22](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/auto/form.ts#L22)

Input type: 'text', 'email', 'number', 'password', 'url', etc.

***

### placeholder?

```ts
optional placeholder?: string;
```

Defined in: [auto/form.ts:24](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/auto/form.ts#L24)

Placeholder text.

***

### required?

```ts
optional required?: boolean;
```

Defined in: [auto/form.ts:26](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/auto/form.ts#L26)

Whether the field is required.
