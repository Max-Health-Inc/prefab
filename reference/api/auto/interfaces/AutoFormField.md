---
url: /prefab/reference/api/auto/interfaces/AutoFormField.md
---
[@maxhealth.tech/prefab](../../index.md) / [auto](../index.md) / AutoFormField

# Interface: AutoFormField

Defined in: [auto/form.ts:30](https://github.com/Max-Health-Inc/prefab/blob/dc9055d700a7e96734dfd959d1cb775e88a3b293/src/auto/form.ts#L30)

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

Defined in: [auto/form.ts:32](https://github.com/Max-Health-Inc/prefab/blob/dc9055d700a7e96734dfd959d1cb775e88a3b293/src/auto/form.ts#L32)

Field name (used as the key in submitted data).

***

### label?

```ts
optional label?: string;
```

Defined in: [auto/form.ts:34](https://github.com/Max-Health-Inc/prefab/blob/dc9055d700a7e96734dfd959d1cb775e88a3b293/src/auto/form.ts#L34)

Display label. Defaults to humanized name.

***

### type?

```ts
optional type?: string;
```

Defined in: [auto/form.ts:36](https://github.com/Max-Health-Inc/prefab/blob/dc9055d700a7e96734dfd959d1cb775e88a3b293/src/auto/form.ts#L36)

Input type: 'text', 'email', 'number', 'password', 'url', etc.

***

### placeholder?

```ts
optional placeholder?: string;
```

Defined in: [auto/form.ts:38](https://github.com/Max-Health-Inc/prefab/blob/dc9055d700a7e96734dfd959d1cb775e88a3b293/src/auto/form.ts#L38)

Placeholder text.

***

### required?

```ts
optional required?: boolean;
```

Defined in: [auto/form.ts:40](https://github.com/Max-Health-Inc/prefab/blob/dc9055d700a7e96734dfd959d1cb775e88a3b293/src/auto/form.ts#L40)

Whether the field is required.

***

### description?

```ts
optional description?: string;
```

Defined in: [auto/form.ts:42](https://github.com/Max-Health-Inc/prefab/blob/dc9055d700a7e96734dfd959d1cb775e88a3b293/src/auto/form.ts#L42)

Longer help text. Becomes the schema `description` on the elicitation path.

***

### options?

```ts
optional options?: AutoFormOption[];
```

Defined in: [auto/form.ts:44](https://github.com/Max-Health-Inc/prefab/blob/dc9055d700a7e96734dfd959d1cb775e88a3b293/src/auto/form.ts#L44)

Fixed set of choices. Renders as a Select and becomes an enum on the wire.

***

### multiple?

```ts
optional multiple?: boolean;
```

Defined in: [auto/form.ts:46](https://github.com/Max-Health-Inc/prefab/blob/dc9055d700a7e96734dfd959d1cb775e88a3b293/src/auto/form.ts#L46)

Allow several choices. Only meaningful alongside `options`.

***

### min?

```ts
optional min?: number;
```

Defined in: [auto/form.ts:48](https://github.com/Max-Health-Inc/prefab/blob/dc9055d700a7e96734dfd959d1cb775e88a3b293/src/auto/form.ts#L48)

Inclusive lower bound for a numeric field, or minimum length for a string.

***

### max?

```ts
optional max?: number;
```

Defined in: [auto/form.ts:50](https://github.com/Max-Health-Inc/prefab/blob/dc9055d700a7e96734dfd959d1cb775e88a3b293/src/auto/form.ts#L50)

Inclusive upper bound for a numeric field, or maximum length for a string.

***

### default?

```ts
optional default?: string | number | boolean | string[];
```

Defined in: [auto/form.ts:52](https://github.com/Max-Health-Inc/prefab/blob/dc9055d700a7e96734dfd959d1cb775e88a3b293/src/auto/form.ts#L52)

Pre-filled value.
