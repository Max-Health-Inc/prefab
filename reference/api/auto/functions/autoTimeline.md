---
url: /prefab/reference/api/auto/functions/autoTimeline.md
---
[@maxhealth.tech/prefab](../../index.md) / [auto](../index.md) / autoTimeline

# Function: autoTimeline()

```ts
function autoTimeline(events, options?): ContainerComponent;
```

Defined in: [auto/timeline.ts:60](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/auto/timeline.ts#L60)

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
