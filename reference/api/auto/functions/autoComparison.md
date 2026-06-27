---
url: /prefab/reference/api/auto/functions/autoComparison.md
---
[@maxhealth.tech/prefab](../../index.md) / [auto](../index.md) / autoComparison

# Function: autoComparison()

```ts
function autoComparison(items, options?): ContainerComponent;
```

Defined in: [auto/comparison.ts:38](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/auto/comparison.ts#L38)

Auto-generate a side-by-side comparison of items.

Uses the first key of each item as the card heading.
Remaining keys are shown as labeled rows.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `items` | `Record`<`string`, `unknown`>\[] |
| `options?` | [`AutoComparisonOptions`](../interfaces/AutoComparisonOptions.md) |

## Returns

`ContainerComponent`

## Example

```ts
autoComparison([
  { name: 'Plan A', price: '$10/mo', storage: '5GB' },
  { name: 'Plan B', price: '$20/mo', storage: '50GB' },
], { title: 'Plan Comparison', highlightKey: 'price' })
```
