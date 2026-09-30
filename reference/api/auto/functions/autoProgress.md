---
url: /prefab/reference/api/auto/functions/autoProgress.md
---
[@maxhealth.tech/prefab](../../index.md) / [auto](../index.md) / autoProgress

# Function: autoProgress()

```ts
function autoProgress(steps, options?): ContainerComponent;
```

Defined in: [auto/progress.ts:52](https://github.com/Max-Health-Inc/prefab/blob/605eb676dc900a2603365e87c9dd47f400d7af46/src/auto/progress.ts#L52)

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
