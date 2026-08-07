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

Defined in: [auto/form.ts:59](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/auto/form.ts#L59)

Auto-generate a Form that calls an MCP tool on submit.

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
