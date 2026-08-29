---
url: /prefab/reference/api/auto/functions/autoDetail.md
---
[@maxhealth.tech/prefab](../../index.md) / [auto](../index.md) / autoDetail

# Function: autoDetail()

```ts
function autoDetail(data, options?): ContainerComponent;
```

Defined in: [auto/index.ts:139](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/auto/index.ts#L139)

Auto-generate a detail Card from a data object.

Inspects value types and renders:

* Booleans → Badge (Yes/No)
* Status-like strings → Badge with variant
* Dates → Text with tabular-nums class
* Nested objects → sub-section
* Everything else → Text

## Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | `Record`<`string`, `unknown`> |
| `options?` | [`AutoDetailOptions`](../interfaces/AutoDetailOptions.md) |

## Returns

`ContainerComponent`

## Example

```ts
autoDetail({ name: 'John', status: 'active', createdAt: '2024-01-01' })
```
