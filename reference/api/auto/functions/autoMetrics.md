---
url: /prefab/reference/api/auto/functions/autoMetrics.md
---
[@maxhealth.tech/prefab](../../index.md) / [auto](../index.md) / autoMetrics

# Function: autoMetrics()

```ts
function autoMetrics(metrics, options?): ContainerComponent;
```

Defined in: [auto/metrics.ts:52](https://github.com/Max-Health-Inc/prefab/blob/1890bd36e825570eeb35b14d1f5a0235caa2c0fb/src/auto/metrics.ts#L52)

Auto-generate a KPI dashboard grid.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `metrics` | [`AutoMetricDef`](../interfaces/AutoMetricDef.md)\[] |
| `options?` | [`AutoMetricsOptions`](../interfaces/AutoMetricsOptions.md) |

## Returns

`ContainerComponent`

## Example

```ts
autoMetrics([
  { label: 'Revenue', value: '$42K', delta: '+12%', trend: 'up', trendSentiment: 'positive', sparkline: [10, 25, 18, 30, 42] },
  { label: 'Users', value: '1,234', delta: '+5%', trend: 'up', trendSentiment: 'positive' },
  { label: 'Errors', value: '3', delta: '-80%', trend: 'down', trendSentiment: 'positive' },
], { title: 'Dashboard', columns: 3 })
```
