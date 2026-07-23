---
url: /prefab/reference/api/rx/classes/Ref.md
---
[@maxhealth.tech/prefab](../../index.md) / [rx](../index.md) / Ref

# Class: Ref\<T>

Defined in: [rx/collection.ts:24](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/rx/collection.ts#L24)

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

Defined in: [rx/collection.ts:31](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/rx/collection.ts#L31)

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

Defined in: [rx/collection.ts:25](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/rx/collection.ts#L25)

***

### type

```ts
readonly type: "ref";
```

Defined in: [rx/collection.ts:26](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/rx/collection.ts#L26)

## Methods

### toRx()

```ts
toRx(): Rx;
```

Defined in: [rx/collection.ts:36](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/rx/collection.ts#L36)

Rx expression for use in component props

#### Returns

[`Rx`](Rx.md)

***

### toString()

```ts
toString(): string;
```

Defined in: [rx/collection.ts:40](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/rx/collection.ts#L40)

#### Returns

`string`

***

### toJSON()

```ts
toJSON(): string;
```

Defined in: [rx/collection.ts:44](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/rx/collection.ts#L44)

#### Returns

`string`

***

### dot()

#### Call Signature

```ts
dot<K>(field): Ref<T[K]>;
```

Defined in: [rx/collection.ts:54](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/rx/collection.ts#L54)

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

Defined in: [rx/collection.ts:56](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/rx/collection.ts#L56)

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

Defined in: [rx/collection.ts:68](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/rx/collection.ts#L68)

Shorthand for `.dot(field).pipe(pipeName, ...args)`.
Compiles to `{{ expr | dot:'field' | pipeName }}`.

Use for FHIR datatype formatting:
`ref.formatted('name', 'humanName')` → `{{ ... | dot:'name' | humanName }}`

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

Defined in: [rx/collection.ts:77](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/rx/collection.ts#L77)

Append a pipe filter to the ref expression.
`ref.pipe('humanName')` → `{{ expr | humanName }}`
`ref.pipe('date', 'long')` → `{{ expr | date:'long' }}`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| ...`args` | `unknown`\[] |

#### Returns

[`Rx`](Rx.md)
