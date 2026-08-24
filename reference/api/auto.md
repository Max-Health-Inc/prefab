---
url: /prefab/reference/api/auto.md
---
[@maxhealth.tech/prefab](../index.md) / auto

# auto

## Classes

| Class | Description |
| ------ | ------ |
| [QuickFormBuilder](classes/QuickFormBuilder.md) | Chainable form builder for rapid MCP tool UI generation. |

## Interfaces

| Interface | Description |
| ------ | ------ |
| [AutoChartOptions](interfaces/AutoChartOptions.md) | - |
| [AutoComparisonOptions](interfaces/AutoComparisonOptions.md) | - |
| [AutoFormField](interfaces/AutoFormField.md) | One field in an auto-generated form. |
| [AutoFormOptions](interfaces/AutoFormOptions.md) | - |
| [AutoDetailOptions](interfaces/AutoDetailOptions.md) | - |
| [AutoTableOptions](interfaces/AutoTableOptions.md) | - |
| [AutoMetricDef](interfaces/AutoMetricDef.md) | - |
| [AutoMetricsOptions](interfaces/AutoMetricsOptions.md) | - |
| [AutoProgressStep](interfaces/AutoProgressStep.md) | - |
| [AutoProgressOptions](interfaces/AutoProgressOptions.md) | - |
| [AutoTimelineEvent](interfaces/AutoTimelineEvent.md) | - |
| [AutoTimelineOptions](interfaces/AutoTimelineOptions.md) | - |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [ChartType](type-aliases/ChartType.md) | - |

## Functions

| Function | Description |
| ------ | ------ |
| [autoChart](functions/autoChart.md) | Auto-generate a chart Card from data and series definitions. |
| [autoComparison](functions/autoComparison.md) | Auto-generate a side-by-side comparison of items. |
| [autoForm](functions/autoForm.md) | Auto-generate a Form that calls an MCP tool on submit. |
| [QuickForm](functions/QuickForm.md) | Factory function for the chainable QuickForm builder. |
| [statusVariant](functions/statusVariant.md) | Get a Badge variant for a status string. Falls back to 'outline' for unknown statuses. |
| [registerStatusVariants](functions/registerStatusVariants.md) | Register additional status→variant mappings. |
| [autoDetail](functions/autoDetail.md) | Auto-generate a detail Card from a data object. |
| [autoTable](functions/autoTable.md) | Auto-generate a DataTable from an array of objects. |
| [autoMetrics](functions/autoMetrics.md) | Auto-generate a KPI dashboard grid. |
| [autoProgress](functions/autoProgress.md) | Auto-generate a multi-step progress tracker. |
| [autoTimeline](functions/autoTimeline.md) | Auto-generate a chronological timeline. |
