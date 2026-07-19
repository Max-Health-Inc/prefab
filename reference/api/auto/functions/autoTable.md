---
url: /prefab/reference/api/auto/functions/autoTable.md
---
[@maxhealth.tech/prefab](../../index.md) / [auto](../index.md) / autoTable

# Function: autoTable()

```ts
function autoTable(rows, options?): ContainerComponent;
```

Defined in: [auto/index.ts:272](https://github.com/Max-Health-Inc/prefab/blob/c512f3bb2fb808f4335797b98c7b93774e2b1b30/src/auto/index.ts#L272)

Auto-generate a DataTable from an array of objects.

Infers columns from the first row's keys, skipping nested objects/arrays.
Wraps in a Column with a title and record count badge.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `rows` | `Record`<`string`, `unknown`>\[] |
| `options?` | [`AutoTableOptions`](../interfaces/AutoTableOptions.md) |

## Returns

`ContainerComponent`

## Example

```ts
autoTable([
  { name: 'John', email: 'john@example.com', age: 30 },
  { name: 'Jane', email: 'jane@example.com', age: 25 },
], { title: 'Users' })
```
