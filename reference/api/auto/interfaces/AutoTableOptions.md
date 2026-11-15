---
url: /prefab/reference/api/auto/interfaces/AutoTableOptions.md
---
[@maxhealth.tech/prefab](../../index.md) / [auto](../index.md) / AutoTableOptions

# Interface: AutoTableOptions

Defined in: [auto/index.ts:176](https://github.com/Max-Health-Inc/prefab/blob/4e102b3517c5a62f380fd91b75fb8c49a1f96cec/src/auto/index.ts#L176)

## Properties

### title?

```ts
optional title?: string;
```

Defined in: [auto/index.ts:178](https://github.com/Max-Health-Inc/prefab/blob/4e102b3517c5a62f380fd91b75fb8c49a1f96cec/src/auto/index.ts#L178)

Title shown above the table.

***

### columns?

```ts
optional columns?: DataTableColumnDef[];
```

Defined in: [auto/index.ts:180](https://github.com/Max-Health-Inc/prefab/blob/4e102b3517c5a62f380fd91b75fb8c49a1f96cec/src/auto/index.ts#L180)

Override column definitions. If not set, auto-inferred from first row.

***

### exclude?

```ts
optional exclude?: string[];
```

Defined in: [auto/index.ts:182](https://github.com/Max-Health-Inc/prefab/blob/4e102b3517c5a62f380fd91b75fb8c49a1f96cec/src/auto/index.ts#L182)

Fields to exclude from auto-generated columns.

***

### search?

```ts
optional search?: boolean;
```

Defined in: [auto/index.ts:184](https://github.com/Max-Health-Inc/prefab/blob/4e102b3517c5a62f380fd91b75fb8c49a1f96cec/src/auto/index.ts#L184)

Enable search. Default true.

***

### sortable?

```ts
optional sortable?: boolean;
```

Defined in: [auto/index.ts:186](https://github.com/Max-Health-Inc/prefab/blob/4e102b3517c5a62f380fd91b75fb8c49a1f96cec/src/auto/index.ts#L186)

Make all columns sortable. Default true.
