---
url: /prefab/reference/api/auto/functions/autoTable.md
---
[@maxhealth.tech/prefab](../../index.md) / [auto](../index.md) / autoTable

# Function: autoTable()

```ts
function autoTable(rows, options?): ContainerComponent;
```

Defined in: [auto/index.ts:267](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/auto/index.ts#L267)

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
