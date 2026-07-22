---
url: /prefab/reference/api/auto/interfaces/AutoProgressStep.md
---
[@maxhealth.tech/prefab](../../index.md) / [auto](../index.md) / AutoProgressStep

# Interface: AutoProgressStep

Defined in: [auto/progress.ts:20](https://github.com/Max-Health-Inc/prefab/blob/de93a446678c2f2b8a07006b7acfdb8a5f593717/src/auto/progress.ts#L20)

## Properties

### label

```ts
label: string;
```

Defined in: [auto/progress.ts:22](https://github.com/Max-Health-Inc/prefab/blob/de93a446678c2f2b8a07006b7acfdb8a5f593717/src/auto/progress.ts#L22)

Step label.

***

### status

```ts
status: "completed" | "active" | "pending";
```

Defined in: [auto/progress.ts:24](https://github.com/Max-Health-Inc/prefab/blob/de93a446678c2f2b8a07006b7acfdb8a5f593717/src/auto/progress.ts#L24)

Step status: 'completed', 'active', or 'pending'.

***

### description?

```ts
optional description?: string;
```

Defined in: [auto/progress.ts:26](https://github.com/Max-Health-Inc/prefab/blob/de93a446678c2f2b8a07006b7acfdb8a5f593717/src/auto/progress.ts#L26)

Optional description.
