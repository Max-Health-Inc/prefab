---
url: /prefab/reference/api/auto/functions/autoTimeline.md
---
[@maxhealth.tech/prefab](../../index.md) / [auto](../index.md) / autoTimeline

# Function: autoTimeline()

```ts
function autoTimeline(events, options?): ContainerComponent;
```

Defined in: [auto/timeline.ts:60](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/auto/timeline.ts#L60)

Auto-generate a chronological timeline.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `events` | [`AutoTimelineEvent`](../interfaces/AutoTimelineEvent.md)\[] |
| `options?` | [`AutoTimelineOptions`](../interfaces/AutoTimelineOptions.md) |

## Returns

`ContainerComponent`

## Example

```ts
autoTimeline([
  { title: 'Order placed', timestamp: '2026-04-20 10:30', status: 'completed', badge: 'Done', badgeVariant: 'success' },
  { title: 'Processing', timestamp: '2026-04-20 11:00', status: 'active' },
  { title: 'Shipped', timestamp: '', status: 'pending' },
], { title: 'Order Timeline' })
```
