---
url: /prefab/reference/api/auto/interfaces/AutoTableOptions.md
---
[@maxhealth.tech/prefab](../../index.md) / [auto](../index.md) / AutoTableOptions

# Interface: AutoTableOptions

Defined in: [auto/index.ts:245](https://github.com/Max-Health-Inc/prefab/blob/88d9aa00d6a50ef0286767079c6345c808f6a0a9/src/auto/index.ts#L245)

## Properties

### title?

```ts
optional title?: string;
```

Defined in: [auto/index.ts:247](https://github.com/Max-Health-Inc/prefab/blob/88d9aa00d6a50ef0286767079c6345c808f6a0a9/src/auto/index.ts#L247)

Title shown above the table.

***

### columns?

```ts
optional columns?: DataTableColumnDef[];
```

Defined in: [auto/index.ts:249](https://github.com/Max-Health-Inc/prefab/blob/88d9aa00d6a50ef0286767079c6345c808f6a0a9/src/auto/index.ts#L249)

Override column definitions. If not set, auto-inferred from first row.

***

### exclude?

```ts
optional exclude?: string[];
```

Defined in: [auto/index.ts:251](https://github.com/Max-Health-Inc/prefab/blob/88d9aa00d6a50ef0286767079c6345c808f6a0a9/src/auto/index.ts#L251)

Fields to exclude from auto-generated columns.

***

### search?

```ts
optional search?: boolean;
```

Defined in: [auto/index.ts:253](https://github.com/Max-Health-Inc/prefab/blob/88d9aa00d6a50ef0286767079c6345c808f6a0a9/src/auto/index.ts#L253)

Enable search. Default true.

***

### sortable?

```ts
optional sortable?: boolean;
```

Defined in: [auto/index.ts:255](https://github.com/Max-Health-Inc/prefab/blob/88d9aa00d6a50ef0286767079c6345c808f6a0a9/src/auto/index.ts#L255)

Make all columns sortable. Default true.
