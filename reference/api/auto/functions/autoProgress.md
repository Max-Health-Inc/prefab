---
url: /prefab/reference/api/auto/functions/autoProgress.md
---
[@maxhealth.tech/prefab](../../index.md) / [auto](../index.md) / autoProgress

# Function: autoProgress()

```ts
function autoProgress(steps, options?): ContainerComponent;
```

Defined in: [auto/progress.ts:53](https://github.com/Max-Health-Inc/prefab/blob/4e102b3517c5a62f380fd91b75fb8c49a1f96cec/src/auto/progress.ts#L53)

Auto-generate a multi-step progress tracker.

Calculates overall completion percentage and renders a Progress bar
followed by step cards with status indicators.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `steps` | [`AutoProgressStep`](../interfaces/AutoProgressStep.md)\[] |
| `options?` | [`AutoProgressOptions`](../interfaces/AutoProgressOptions.md) |

## Returns

`ContainerComponent`

## Example

```ts
autoProgress([
  { label: 'Order Placed', status: 'completed' },
  { label: 'Processing', status: 'active', description: 'Preparing shipment' },
  { label: 'Shipped', status: 'pending' },
  { label: 'Delivered', status: 'pending' },
], { title: 'Order Status' })
```
