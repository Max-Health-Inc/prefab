---
url: /prefab/reference/api/rx/classes/Collection.md
---
[@maxhealth.tech/prefab](../../index.md) / [rx](../index.md) / Collection

# Class: Collection\<T>

Defined in: [rx/collection.ts:86](https://github.com/Max-Health-Inc/prefab/blob/c512f3bb2fb808f4335797b98c7b93774e2b1b30/src/rx/collection.ts#L86)

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

Defined in: [rx/collection.ts:91](https://github.com/Max-Health-Inc/prefab/blob/c512f3bb2fb808f4335797b98c7b93774e2b1b30/src/rx/collection.ts#L91)

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

Defined in: [rx/collection.ts:87](https://github.com/Max-Health-Inc/prefab/blob/c512f3bb2fb808f4335797b98c7b93774e2b1b30/src/rx/collection.ts#L87)

***

### keyField

```ts
readonly keyField: string;
```

Defined in: [rx/collection.ts:88](https://github.com/Max-Health-Inc/prefab/blob/c512f3bb2fb808f4335797b98c7b93774e2b1b30/src/rx/collection.ts#L88)

***

### rows

```ts
readonly rows: T[];
```

Defined in: [rx/collection.ts:89](https://github.com/Max-Health-Inc/prefab/blob/c512f3bb2fb808f4335797b98c7b93774e2b1b30/src/rx/collection.ts#L89)

## Accessors

### length

#### Get Signature

```ts
get length(): number;
```

Defined in: [rx/collection.ts:112](https://github.com/Max-Health-Inc/prefab/blob/c512f3bb2fb808f4335797b98c7b93774e2b1b30/src/rx/collection.ts#L112)

Number of rows.

##### Returns

`number`

## Methods

### firstKey()

```ts
firstKey(): string | null;
```

Defined in: [rx/collection.ts:98](https://github.com/Max-Health-Inc/prefab/blob/c512f3bb2fb808f4335797b98c7b93774e2b1b30/src/rx/collection.ts#L98)

Key of the first row, or null if empty.

#### Returns

`string` | `null`

***

### lastKey()

```ts
lastKey(): string | null;
```

Defined in: [rx/collection.ts:105](https://github.com/Max-Health-Inc/prefab/blob/c512f3bb2fb808f4335797b98c7b93774e2b1b30/src/rx/collection.ts#L105)

Key of the last row, or null if empty.

#### Returns

`string` | `null`

***

### by()

```ts
by<K>(key): Ref<T>;
```

Defined in: [rx/collection.ts:120](https://github.com/Max-Health-Inc/prefab/blob/c512f3bb2fb808f4335797b98c7b93774e2b1b30/src/rx/collection.ts#L120)

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

Defined in: [rx/collection.ts:125](https://github.com/Max-Health-Inc/prefab/blob/c512f3bb2fb808f4335797b98c7b93774e2b1b30/src/rx/collection.ts#L125)

Rx expression referencing the full array: `{{ stateKey }}`

#### Returns

[`Rx`](Rx.md)

***

### toString()

```ts
toString(): string;
```

Defined in: [rx/collection.ts:129](https://github.com/Max-Health-Inc/prefab/blob/c512f3bb2fb808f4335797b98c7b93774e2b1b30/src/rx/collection.ts#L129)

#### Returns

`string`

***

### toJSON()

```ts
toJSON(): string;
```

Defined in: [rx/collection.ts:133](https://github.com/Max-Health-Inc/prefab/blob/c512f3bb2fb808f4335797b98c7b93774e2b1b30/src/rx/collection.ts#L133)

#### Returns

`string`

***

### toState()

```ts
toState(): Record<string, T[]>;
```

Defined in: [rx/collection.ts:138](https://github.com/Max-Health-Inc/prefab/blob/c512f3bb2fb808f4335797b98c7b93774e2b1b30/src/rx/collection.ts#L138)

State entry for PrefabApp: `{ stateKey: rows }`

#### Returns

`Record`<`string`, `T`\[]>
