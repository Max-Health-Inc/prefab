---
url: /prefab/reference/api/rx/classes/Signal.md
---
[@maxhealth.tech/prefab](../../index.md) / [rx](../index.md) / Signal

# Class: Signal\<T>

Defined in: [rx/signal.ts:34](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/rx/signal.ts#L34)

A named reactive scalar. Carries a state key, an initial value,
and produces rx expressions for component props.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* [`SignalValue`](../type-aliases/SignalValue.md) | [`SignalValue`](../type-aliases/SignalValue.md) |

## Constructors

### Constructor

```ts
new Signal<T>(
   key, 
   initial, 
options?): Signal<T>;
```

Defined in: [rx/signal.ts:39](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/rx/signal.ts#L39)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `initial` | `T` |
| `options?` | [`SignalOptions`](../interfaces/SignalOptions.md) |

#### Returns

`Signal`<`T`>

## Properties

### key

```ts
readonly key: string;
```

Defined in: [rx/signal.ts:35](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/rx/signal.ts#L35)

***

### initial

```ts
readonly initial: T;
```

Defined in: [rx/signal.ts:36](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/rx/signal.ts#L36)

***

### options?

```ts
readonly optional options?: SignalOptions;
```

Defined in: [rx/signal.ts:37](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/rx/signal.ts#L37)

## Methods

### toRx()

```ts
toRx(): Rx;
```

Defined in: [rx/signal.ts:46](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/rx/signal.ts#L46)

Rx expression referencing this signal's value: `{{ key }}`

#### Returns

[`Rx`](Rx.md)

***

### toString()

```ts
toString(): string;
```

Defined in: [rx/signal.ts:51](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/rx/signal.ts#L51)

Serialize to the rx template string

#### Returns

`string`

***

### toJSON()

```ts
toJSON(): string;
```

Defined in: [rx/signal.ts:55](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/rx/signal.ts#L55)

#### Returns

`string`

***

### toState()

```ts
toState(): Record<string, T>;
```

Defined in: [rx/signal.ts:60](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/rx/signal.ts#L60)

State entry for PrefabApp: `{ key: initial }`

#### Returns

`Record`<`string`, `T`>
