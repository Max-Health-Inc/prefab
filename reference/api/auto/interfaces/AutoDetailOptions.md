---
url: /prefab/reference/api/auto/interfaces/AutoDetailOptions.md
---
[@maxhealth.tech/prefab](../../index.md) / [auto](../index.md) / AutoDetailOptions

# Interface: AutoDetailOptions

Defined in: [auto/index.ts:113](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/auto/index.ts#L113)

## Properties

### title?

```ts
optional title?: string;
```

Defined in: [auto/index.ts:115](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/auto/index.ts#L115)

Title shown at the top of the card. Defaults to auto-detect from data.

***

### exclude?

```ts
optional exclude?: string[];
```

Defined in: [auto/index.ts:117](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/auto/index.ts#L117)

Fields to exclude from the detail view.

***

### include?

```ts
optional include?: string[];
```

Defined in: [auto/index.ts:119](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/auto/index.ts#L119)

Fields to include (if set, only these are shown).

***

### maxDepth?

```ts
optional maxDepth?: number;
```

Defined in: [auto/index.ts:121](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/auto/index.ts#L121)

Max nested depth to render (default 1).
