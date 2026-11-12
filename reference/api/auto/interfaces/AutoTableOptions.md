---
url: /prefab/reference/api/auto/interfaces/AutoTableOptions.md
---
[@maxhealth.tech/prefab](../../index.md) / [auto](../index.md) / AutoTableOptions

# Interface: AutoTableOptions

Defined in: [auto/index.ts:235](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/auto/index.ts#L235)

## Properties

### title?

```ts
optional title?: string;
```

Defined in: [auto/index.ts:237](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/auto/index.ts#L237)

Title shown above the table.

***

### columns?

```ts
optional columns?: DataTableColumnDef[];
```

Defined in: [auto/index.ts:239](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/auto/index.ts#L239)

Override column definitions. If not set, auto-inferred from first row.

***

### exclude?

```ts
optional exclude?: string[];
```

Defined in: [auto/index.ts:241](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/auto/index.ts#L241)

Fields to exclude from auto-generated columns.

***

### search?

```ts
optional search?: boolean;
```

Defined in: [auto/index.ts:243](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/auto/index.ts#L243)

Enable search. Default true.

***

### sortable?

```ts
optional sortable?: boolean;
```

Defined in: [auto/index.ts:245](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/auto/index.ts#L245)

Make all columns sortable. Default true.
