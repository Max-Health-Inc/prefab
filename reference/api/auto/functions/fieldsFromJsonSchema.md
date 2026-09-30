---
url: /prefab/reference/api/auto/functions/fieldsFromJsonSchema.md
---
[@maxhealth.tech/prefab](../../index.md) / [auto](../index.md) / fieldsFromJsonSchema

# Function: fieldsFromJsonSchema()

```ts
function fieldsFromJsonSchema(schema, options?): AutoFormField[];
```

Defined in: [auto/schema.ts:265](https://github.com/Max-Health-Inc/prefab/blob/605eb676dc900a2603365e87c9dd47f400d7af46/src/auto/schema.ts#L265)

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
