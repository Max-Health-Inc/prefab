---
url: /prefab/reference/api/auto/interfaces/AutoFormField.md
---
[@maxhealth.tech/prefab](../../index.md) / [auto](../index.md) / AutoFormField

# Interface: AutoFormField

Defined in: [auto/form.ts:31](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/auto/form.ts#L31)

One field in an auto-generated form.

The same definition drives both delivery paths: [autoForm](../functions/autoForm.md) renders it as
prefab components, and `formSchema` in `src/mcp/input-required.ts` derives the
restricted elicitation JSON Schema from it for hosts with no UI surface. Keep
anything added here expressible in both.

## Properties

### name

```ts
name: string;
```

Defined in: [auto/form.ts:33](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/auto/form.ts#L33)

Field name (used as the key in submitted data).

***

### label?

```ts
optional label?: string;
```

Defined in: [auto/form.ts:35](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/auto/form.ts#L35)

Display label. Defaults to humanized name.

***

### type?

```ts
optional type?: string;
```

Defined in: [auto/form.ts:37](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/auto/form.ts#L37)

Input type: 'text', 'email', 'number', 'password', 'url', etc.

***

### placeholder?

```ts
optional placeholder?: string;
```

Defined in: [auto/form.ts:39](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/auto/form.ts#L39)

Placeholder text.

***

### required?

```ts
optional required?: boolean;
```

Defined in: [auto/form.ts:41](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/auto/form.ts#L41)

Whether the field is required.

***

### description?

```ts
optional description?: string;
```

Defined in: [auto/form.ts:43](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/auto/form.ts#L43)

Longer help text. Becomes the schema `description` on the elicitation path.

***

### options?

```ts
optional options?: AutoFormOption[];
```

Defined in: [auto/form.ts:45](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/auto/form.ts#L45)

Fixed set of choices. Renders as a Select and becomes an enum on the wire.

***

### multiple?

```ts
optional multiple?: boolean;
```

Defined in: [auto/form.ts:47](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/auto/form.ts#L47)

Allow several choices. Only meaningful alongside `options`.

***

### min?

```ts
optional min?: number;
```

Defined in: [auto/form.ts:49](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/auto/form.ts#L49)

Inclusive lower bound for a numeric field, or minimum length for a string.

***

### max?

```ts
optional max?: number;
```

Defined in: [auto/form.ts:51](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/auto/form.ts#L51)

Inclusive upper bound for a numeric field, or maximum length for a string.

***

### default?

```ts
optional default?: string | number | boolean | string[];
```

Defined in: [auto/form.ts:53](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/auto/form.ts#L53)

Pre-filled value.
