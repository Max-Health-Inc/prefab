---
url: /prefab/reference/api/auto/interfaces/AutoMetricDef.md
---
[@maxhealth.tech/prefab](../../index.md) / [auto](../index.md) / AutoMetricDef

# Interface: AutoMetricDef

Defined in: [auto/metrics.ts:14](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/auto/metrics.ts#L14)

## Properties

### label

```ts
label: string;
```

Defined in: [auto/metrics.ts:16](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/auto/metrics.ts#L16)

Metric label (e.g. 'Revenue').

***

### value

```ts
value: string;
```

Defined in: [auto/metrics.ts:18](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/auto/metrics.ts#L18)

Metric value (e.g. '$42K').

***

### delta?

```ts
optional delta?: string;
```

Defined in: [auto/metrics.ts:20](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/auto/metrics.ts#L20)

Delta string (e.g. '+12%').

***

### trend?

```ts
optional trend?: "flat" | "up" | "down";
```

Defined in: [auto/metrics.ts:22](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/auto/metrics.ts#L22)

Trend direction.

***

### trendSentiment?

```ts
optional trendSentiment?: "positive" | "negative" | "neutral";
```

Defined in: [auto/metrics.ts:24](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/auto/metrics.ts#L24)

Trend sentiment (positive = green, negative = red).

***

### description?

```ts
optional description?: string;
```

Defined in: [auto/metrics.ts:26](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/auto/metrics.ts#L26)

Description text below the metric.

***

### sparkline?

```ts
optional sparkline?: number[];
```

Defined in: [auto/metrics.ts:28](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/auto/metrics.ts#L28)

Sparkline data points.
