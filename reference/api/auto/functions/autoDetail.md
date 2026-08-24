---
url: /prefab/reference/api/auto/functions/autoDetail.md
---
[@maxhealth.tech/prefab](../../index.md) / [auto](../index.md) / autoDetail

# Function: autoDetail()

```ts
function autoDetail(data, options?): ContainerComponent;
```

Defined in: [auto/index.ts:145](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/auto/index.ts#L145)

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
