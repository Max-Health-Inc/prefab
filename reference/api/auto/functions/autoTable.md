---
url: /prefab/reference/api/auto/functions/autoTable.md
---
[@maxhealth.tech/prefab](../../index.md) / [auto](../index.md) / autoTable

# Function: autoTable()

```ts
function autoTable(rows, options?): ContainerComponent;
```

Defined in: [auto/index.ts:273](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/auto/index.ts#L273)

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
