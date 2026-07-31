---
url: /prefab/reference/api/auto/interfaces/AutoDetailOptions.md
---
[@maxhealth.tech/prefab](../../index.md) / [auto](../index.md) / AutoDetailOptions

# Interface: AutoDetailOptions

Defined in: [auto/index.ts:118](https://github.com/Max-Health-Inc/prefab/blob/a35624be6562c3c7b129e80c58368ed6939e09e3/src/auto/index.ts#L118)

## Properties

### title?

```ts
optional title?: string;
```

Defined in: [auto/index.ts:120](https://github.com/Max-Health-Inc/prefab/blob/a35624be6562c3c7b129e80c58368ed6939e09e3/src/auto/index.ts#L120)

Title shown at the top of the card. Defaults to auto-detect from data.

***

### exclude?

```ts
optional exclude?: string[];
```

Defined in: [auto/index.ts:122](https://github.com/Max-Health-Inc/prefab/blob/a35624be6562c3c7b129e80c58368ed6939e09e3/src/auto/index.ts#L122)

Fields to exclude from the detail view.

***

### include?

```ts
optional include?: string[];
```

Defined in: [auto/index.ts:124](https://github.com/Max-Health-Inc/prefab/blob/a35624be6562c3c7b129e80c58368ed6939e09e3/src/auto/index.ts#L124)

Fields to include (if set, only these are shown).

***

### maxDepth?

```ts
optional maxDepth?: number;
```

Defined in: [auto/index.ts:126](https://github.com/Max-Health-Inc/prefab/blob/a35624be6562c3c7b129e80c58368ed6939e09e3/src/auto/index.ts#L126)

Max nested depth to render (default 1).
