---
url: /prefab/reference/api/auto/functions/autoChart.md
---
[@maxhealth.tech/prefab](../../index.md) / [auto](../index.md) / autoChart

# Function: autoChart()

```ts
function autoChart(
   data, 
   series, 
   options?): ContainerComponent;
```

Defined in: [auto/chart.ts:43](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/auto/chart.ts#L43)

Auto-generate a chart Card from data and series definitions.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | `Record`<`string`, `unknown`>\[] |
| `series` | `ChartSeries`\[] |
| `options?` | [`AutoChartOptions`](../interfaces/AutoChartOptions.md) |

## Returns

`ContainerComponent`

## Example

```ts
autoChart(
  [{ month: 'Jan', revenue: 42000, cost: 31000 }],
  [{ dataKey: 'revenue', label: 'Revenue' }, { dataKey: 'cost', label: 'Cost' }],
  { title: 'Monthly Revenue', xAxis: 'month', chartType: 'bar' },
)
```
