---
url: /prefab/reference/api/rx/classes/Collection.md
---
[@maxhealth.tech/prefab](../../index.md) / [rx](../index.md) / Collection

# Class: Collection\<T>

Defined in: [rx/collection.ts:87](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/rx/collection.ts#L87)

A named keyed array. Serializes rows into state and provides
typed lookup helpers that compile to pipe expressions.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* `Record`<`string`, `unknown`> | `Record`<`string`, `unknown`> |

## Constructors

### Constructor

```ts
new Collection<T>(
   stateKey, 
   rows, 
keyField): Collection<T>;
```

Defined in: [rx/collection.ts:92](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/rx/collection.ts#L92)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `stateKey` | `string` |
| `rows` | `T`\[] |
| `keyField` | `string` |

#### Returns

`Collection`<`T`>

## Properties

### stateKey

```ts
readonly stateKey: string;
```

Defined in: [rx/collection.ts:88](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/rx/collection.ts#L88)

***

### keyField

```ts
readonly keyField: string;
```

Defined in: [rx/collection.ts:89](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/rx/collection.ts#L89)

***

### rows

```ts
readonly rows: T[];
```

Defined in: [rx/collection.ts:90](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/rx/collection.ts#L90)

## Accessors

### length

#### Get Signature

```ts
get length(): number;
```

Defined in: [rx/collection.ts:113](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/rx/collection.ts#L113)

Number of rows.

##### Returns

`number`

## Methods

### firstKey()

```ts
firstKey(): string | null;
```

Defined in: [rx/collection.ts:99](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/rx/collection.ts#L99)

Key of the first row, or null if empty.

#### Returns

`string` | `null`

***

### lastKey()

```ts
lastKey(): string | null;
```

Defined in: [rx/collection.ts:106](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/rx/collection.ts#L106)

Key of the last row, or null if empty.

#### Returns

`string` | `null`

***

### by()

```ts
by<K>(key): Ref<T>;
```

Defined in: [rx/collection.ts:121](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/rx/collection.ts#L121)

Create a Ref that lazily resolves a row by signal key.
Compiles to: `{{ stateKey | find:'keyField',signal.key }}`

#### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* [`SignalValue`](../type-aliases/SignalValue.md) |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | [`Signal`](Signal.md)<`K`> |

#### Returns

[`Ref`](Ref.md)<`T`>

***

### toRx()

```ts
toRx(): Rx;
```

Defined in: [rx/collection.ts:126](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/rx/collection.ts#L126)

Rx expression referencing the full array: `{{ stateKey }}`

#### Returns

[`Rx`](Rx.md)

***

### toString()

```ts
toString(): string;
```

Defined in: [rx/collection.ts:130](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/rx/collection.ts#L130)

#### Returns

`string`

***

### toJSON()

```ts
toJSON(): string;
```

Defined in: [rx/collection.ts:134](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/rx/collection.ts#L134)

#### Returns

`string`

***

### toState()

```ts
toState(): Record<string, T[]>;
```

Defined in: [rx/collection.ts:139](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/rx/collection.ts#L139)

State entry for PrefabApp: `{ stateKey: rows }`

#### Returns

`Record`<`string`, `T`\[]>
