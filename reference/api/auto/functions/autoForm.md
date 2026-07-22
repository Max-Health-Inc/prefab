---
url: /prefab/reference/api/auto/functions/autoForm.md
---
[@maxhealth.tech/prefab](../../index.md) / [auto](../index.md) / autoForm

# Function: autoForm()

```ts
function autoForm(
   fields, 
   submitTool, 
   options?): ContainerComponent;
```

Defined in: [auto/form.ts:59](https://github.com/Max-Health-Inc/prefab/blob/de93a446678c2f2b8a07006b7acfdb8a5f593717/src/auto/form.ts#L59)

Auto-generate a Form that submits to an MCP tool.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `fields` | [`AutoFormField`](../interfaces/AutoFormField.md)\[] |
| `submitTool` | `string` |
| `options?` | [`AutoFormOptions`](../interfaces/AutoFormOptions.md) |

## Returns

`ContainerComponent`

## Example

```ts
autoForm(
  [
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'name', label: 'Full Name', required: true },
  ],
  'create_user',
  { title: 'Create User', submitLabel: 'Create' },
)
```
