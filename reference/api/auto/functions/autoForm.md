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

Defined in: [auto/form.ts:86](https://github.com/Max-Health-Inc/prefab/blob/c0556f0632cf75f3e410fd7efc1a25abaf224e54/src/auto/form.ts#L86)

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
