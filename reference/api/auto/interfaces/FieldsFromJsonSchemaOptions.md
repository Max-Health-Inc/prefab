---
url: /prefab/reference/api/auto/interfaces/FieldsFromJsonSchemaOptions.md
---
[@maxhealth.tech/prefab](../../index.md) / [auto](../index.md) / FieldsFromJsonSchemaOptions

# Interface: FieldsFromJsonSchemaOptions

Defined in: [auto/schema.ts:67](https://github.com/Max-Health-Inc/prefab/blob/605eb676dc900a2603365e87c9dd47f400d7af46/src/auto/schema.ts#L67)

## Properties

### exclude?

```ts
optional exclude?: string[];
```

Defined in: [auto/schema.ts:69](https://github.com/Max-Health-Inc/prefab/blob/605eb676dc900a2603365e87c9dd47f400d7af46/src/auto/schema.ts#L69)

Property names to leave out (server-managed keys, path params already known).

***

### include?

```ts
optional include?: string[];
```

Defined in: [auto/schema.ts:74](https://github.com/Max-Health-Inc/prefab/blob/605eb676dc900a2603365e87c9dd47f400d7af46/src/auto/schema.ts#L74)

Property names to keep, in this order. Anything else is dropped, and a name
the schema does not declare is ignored rather than invented.

***

### includeReadOnly?

```ts
optional includeReadOnly?: boolean;
```

Defined in: [auto/schema.ts:79](https://github.com/Max-Health-Inc/prefab/blob/605eb676dc900a2603365e87c9dd47f400d7af46/src/auto/schema.ts#L79)

Emit a field for every property, including ones already marked
`readOnly: true` in the schema.

#### Default

```ts
false
```
