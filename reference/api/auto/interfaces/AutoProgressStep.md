---
url: /prefab/reference/api/auto/interfaces/AutoProgressStep.md
---
[@maxhealth.tech/prefab](../../index.md) / [auto](../index.md) / AutoProgressStep

# Interface: AutoProgressStep

Defined in: [auto/progress.ts:21](https://github.com/Max-Health-Inc/prefab/blob/4e102b3517c5a62f380fd91b75fb8c49a1f96cec/src/auto/progress.ts#L21)

## Properties

### label

```ts
label: string;
```

Defined in: [auto/progress.ts:23](https://github.com/Max-Health-Inc/prefab/blob/4e102b3517c5a62f380fd91b75fb8c49a1f96cec/src/auto/progress.ts#L23)

Step label.

***

### status

```ts
status: "active" | "completed" | "pending";
```

Defined in: [auto/progress.ts:25](https://github.com/Max-Health-Inc/prefab/blob/4e102b3517c5a62f380fd91b75fb8c49a1f96cec/src/auto/progress.ts#L25)

Step status: 'completed', 'active', or 'pending'.

***

### description?

```ts
optional description?: string;
```

Defined in: [auto/progress.ts:27](https://github.com/Max-Health-Inc/prefab/blob/4e102b3517c5a62f380fd91b75fb8c49a1f96cec/src/auto/progress.ts#L27)

Optional description.
