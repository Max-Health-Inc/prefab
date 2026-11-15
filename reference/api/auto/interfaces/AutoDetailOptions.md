---
url: /prefab/reference/api/auto/interfaces/AutoDetailOptions.md
---
[@maxhealth.tech/prefab](../../index.md) / [auto](../index.md) / AutoDetailOptions

# Interface: AutoDetailOptions

Defined in: [auto/index.ts:53](https://github.com/Max-Health-Inc/prefab/blob/4e102b3517c5a62f380fd91b75fb8c49a1f96cec/src/auto/index.ts#L53)

## Properties

### title?

```ts
optional title?: string;
```

Defined in: [auto/index.ts:55](https://github.com/Max-Health-Inc/prefab/blob/4e102b3517c5a62f380fd91b75fb8c49a1f96cec/src/auto/index.ts#L55)

Title shown at the top of the card. Defaults to auto-detect from data.

***

### exclude?

```ts
optional exclude?: string[];
```

Defined in: [auto/index.ts:57](https://github.com/Max-Health-Inc/prefab/blob/4e102b3517c5a62f380fd91b75fb8c49a1f96cec/src/auto/index.ts#L57)

Fields to exclude from the detail view.

***

### include?

```ts
optional include?: string[];
```

Defined in: [auto/index.ts:59](https://github.com/Max-Health-Inc/prefab/blob/4e102b3517c5a62f380fd91b75fb8c49a1f96cec/src/auto/index.ts#L59)

Fields to include (if set, only these are shown).

***

### maxDepth?

```ts
optional maxDepth?: number;
```

Defined in: [auto/index.ts:61](https://github.com/Max-Health-Inc/prefab/blob/4e102b3517c5a62f380fd91b75fb8c49a1f96cec/src/auto/index.ts#L61)

Max nested depth to render (default 1).
