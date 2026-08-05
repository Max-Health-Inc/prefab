---
url: /prefab/reference/api/rx/classes/Ref.md
---
[@maxhealth.tech/prefab](../../index.md) / [rx](../index.md) / Ref

# Class: Ref\<T>

Defined in: [rx/collection.ts:25](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/rx/collection.ts#L25)

A lazy, serializable reference to a row in a collection.
The expression is evaluated at runtime by the renderer's pipe evaluator.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

## Constructors

### Constructor

```ts
new Ref<T>(expr): Ref<T>;
```

Defined in: [rx/collection.ts:32](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/rx/collection.ts#L32)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `expr` | `string` |

#### Returns

`Ref`<`T`>

## Properties

### expr

```ts
readonly expr: string;
```

Defined in: [rx/collection.ts:26](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/rx/collection.ts#L26)

***

### type

```ts
readonly type: "ref";
```

Defined in: [rx/collection.ts:27](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/rx/collection.ts#L27)

## Methods

### toRx()

```ts
toRx(): Rx;
```

Defined in: [rx/collection.ts:37](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/rx/collection.ts#L37)

Rx expression for use in component props

#### Returns

[`Rx`](Rx.md)

***

### toString()

```ts
toString(): string;
```

Defined in: [rx/collection.ts:41](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/rx/collection.ts#L41)

#### Returns

`string`

***

### toJSON()

```ts
toJSON(): string;
```

Defined in: [rx/collection.ts:45](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/rx/collection.ts#L45)

#### Returns

`string`

***

### dot()

#### Call Signature

```ts
dot<K>(field): Ref<T[K]>;
```

Defined in: [rx/collection.ts:55](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/rx/collection.ts#L55)

Type-safe property access on the referenced row.
Returns `Ref<T[K]>` so downstream type checking works.

`ref.dot('name')` → `Ref<HumanName[]>` with expr `{{ ... | dot:'name' }}`

##### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* `string` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `field` | `K` |

##### Returns

`Ref`<`T`\[`K`]>

#### Call Signature

```ts
dot(field): Ref;
```

Defined in: [rx/collection.ts:57](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/rx/collection.ts#L57)

Untyped escape hatch for dynamic/computed field names.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `field` | `string` |

##### Returns

`Ref`

***

### formatted()

```ts
formatted(
   field, 
   pipeName, ...
   args): Rx;
```

Defined in: [rx/collection.ts:69](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/rx/collection.ts#L69)

Shorthand for `.dot(field).pipe(pipeName, ...args)`.
Compiles to `{{ expr | dot:'field' | pipeName }}`.

Use to format a nested field with any built-in or registered pipe:
`ref.formatted('total', 'currency')` → `{{ ... | dot:'total' | currency }}`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `field` | `string` | keyof `T` & `string` |
| `pipeName` | `string` |
| ...`args` | `unknown`\[] |

#### Returns

[`Rx`](Rx.md)

***

### pipe()

```ts
pipe(name, ...args): Rx;
```

Defined in: [rx/collection.ts:78](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/rx/collection.ts#L78)

Append a pipe filter to the ref expression.
`ref.pipe('upper')` → `{{ expr | upper }}`
`ref.pipe('date', 'long')` → `{{ expr | date:'long' }}`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| ...`args` | `unknown`\[] |

#### Returns

[`Rx`](Rx.md)
