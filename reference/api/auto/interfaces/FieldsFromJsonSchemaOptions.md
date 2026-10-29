---
url: /prefab/reference/api/auto/interfaces/FieldsFromJsonSchemaOptions.md
---
[@maxhealth.tech/prefab](../../index.md) / [auto](../index.md) / FieldsFromJsonSchemaOptions

# Interface: FieldsFromJsonSchemaOptions

Defined in: [auto/schema.ts:68](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/auto/schema.ts#L68)

## Properties

### exclude?

```ts
optional exclude?: string[];
```

Defined in: [auto/schema.ts:70](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/auto/schema.ts#L70)

Property names to leave out (server-managed keys, path params already known).

***

### include?

```ts
optional include?: string[];
```

Defined in: [auto/schema.ts:75](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/auto/schema.ts#L75)

Property names to keep, in this order. Anything else is dropped, and a name
the schema does not declare is ignored rather than invented.

***

### includeReadOnly?

```ts
optional includeReadOnly?: boolean;
```

Defined in: [auto/schema.ts:80](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/auto/schema.ts#L80)

Emit a field for every property, including ones already marked
`readOnly: true` in the schema.

#### Default

```ts
false
```
