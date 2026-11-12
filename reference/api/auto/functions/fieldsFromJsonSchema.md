---
url: /prefab/reference/api/auto/functions/fieldsFromJsonSchema.md
---
[@maxhealth.tech/prefab](../../index.md) / [auto](../index.md) / fieldsFromJsonSchema

# Function: fieldsFromJsonSchema()

```ts
function fieldsFromJsonSchema(schema, options?): AutoFormField[];
```

Defined in: [auto/schema.ts:260](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/auto/schema.ts#L260)

Derive `autoForm` fields from a JSON Schema object.

Returns an empty list for anything that is not an object schema with
properties, so a caller can hand over whatever a route declared and branch on
the result rather than pre-checking the shape.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `schema` | `unknown` |
| `options?` | [`FieldsFromJsonSchemaOptions`](../interfaces/FieldsFromJsonSchemaOptions.md) |

## Returns

[`AutoFormField`](../interfaces/AutoFormField.md)\[]
