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

Defined in: [auto/chart.ts:43](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/auto/chart.ts#L43)

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
