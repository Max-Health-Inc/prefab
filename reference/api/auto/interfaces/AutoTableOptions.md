---
url: /prefab/reference/api/auto/interfaces/AutoTableOptions.md
---
[@maxhealth.tech/prefab](../../index.md) / [auto](../index.md) / AutoTableOptions

# Interface: AutoTableOptions

Defined in: [auto/index.ts:240](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/auto/index.ts#L240)

## Properties

### title?

```ts
optional title?: string;
```

Defined in: [auto/index.ts:242](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/auto/index.ts#L242)

Title shown above the table.

***

### columns?

```ts
optional columns?: DataTableColumnDef[];
```

Defined in: [auto/index.ts:244](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/auto/index.ts#L244)

Override column definitions. If not set, auto-inferred from first row.

***

### exclude?

```ts
optional exclude?: string[];
```

Defined in: [auto/index.ts:246](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/auto/index.ts#L246)

Fields to exclude from auto-generated columns.

***

### search?

```ts
optional search?: boolean;
```

Defined in: [auto/index.ts:248](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/auto/index.ts#L248)

Enable search. Default true.

***

### sortable?

```ts
optional sortable?: boolean;
```

Defined in: [auto/index.ts:250](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/auto/index.ts#L250)

Make all columns sortable. Default true.
