---
url: /prefab/reference/api/mcp/functions/formSchema.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / formSchema

# Function: formSchema()

```ts
function formSchema(fields): McpRestrictedSchema;
```

Defined in: [mcp/input-required.ts:135](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/input-required.ts#L135)

Derive the restricted elicitation schema from form fields.

This is the same field list `autoForm` renders, so the elicitation and the
prefab form always ask for the same thing.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `fields` | [`AutoFormField`](../../auto/interfaces/AutoFormField.md)\[] |

## Returns

[`McpRestrictedSchema`](../type-aliases/McpRestrictedSchema.md)
