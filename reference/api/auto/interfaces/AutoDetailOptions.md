---
url: /prefab/reference/api/auto/interfaces/AutoDetailOptions.md
---
[@maxhealth.tech/prefab](../../index.md) / [auto](../index.md) / AutoDetailOptions

# Interface: AutoDetailOptions

Defined in: [auto/index.ts:119](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/auto/index.ts#L119)

## Properties

### title?

```ts
optional title?: string;
```

Defined in: [auto/index.ts:121](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/auto/index.ts#L121)

Title shown at the top of the card. Defaults to auto-detect from data.

***

### exclude?

```ts
optional exclude?: string[];
```

Defined in: [auto/index.ts:123](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/auto/index.ts#L123)

Fields to exclude from the detail view.

***

### include?

```ts
optional include?: string[];
```

Defined in: [auto/index.ts:125](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/auto/index.ts#L125)

Fields to include (if set, only these are shown).

***

### maxDepth?

```ts
optional maxDepth?: number;
```

Defined in: [auto/index.ts:127](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/auto/index.ts#L127)

Max nested depth to render (default 1).
