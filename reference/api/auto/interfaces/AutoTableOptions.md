---
url: /prefab/reference/api/auto/interfaces/AutoTableOptions.md
---
[@maxhealth.tech/prefab](../../index.md) / [auto](../index.md) / AutoTableOptions

# Interface: AutoTableOptions

Defined in: [auto/index.ts:246](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/auto/index.ts#L246)

## Properties

### title?

```ts
optional title?: string;
```

Defined in: [auto/index.ts:248](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/auto/index.ts#L248)

Title shown above the table.

***

### columns?

```ts
optional columns?: DataTableColumnDef[];
```

Defined in: [auto/index.ts:250](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/auto/index.ts#L250)

Override column definitions. If not set, auto-inferred from first row.

***

### exclude?

```ts
optional exclude?: string[];
```

Defined in: [auto/index.ts:252](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/auto/index.ts#L252)

Fields to exclude from auto-generated columns.

***

### search?

```ts
optional search?: boolean;
```

Defined in: [auto/index.ts:254](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/auto/index.ts#L254)

Enable search. Default true.

***

### sortable?

```ts
optional sortable?: boolean;
```

Defined in: [auto/index.ts:256](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/auto/index.ts#L256)

Make all columns sortable. Default true.
