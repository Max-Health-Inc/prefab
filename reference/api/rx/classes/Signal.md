---
url: /prefab/reference/api/rx/classes/Signal.md
---
[@maxhealth.tech/prefab](../../index.md) / [rx](../index.md) / Signal

# Class: Signal\<T>

Defined in: [rx/signal.ts:24](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/rx/signal.ts#L24)

A state key with an initial value, usable wherever a prop takes an rx expression.

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

Defined in: [rx/signal.ts:29](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/rx/signal.ts#L29)

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

Defined in: [rx/signal.ts:25](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/rx/signal.ts#L25)

***

### initial

```ts
readonly initial: T;
```

Defined in: [rx/signal.ts:26](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/rx/signal.ts#L26)

***

### options?

```ts
readonly optional options?: SignalOptions;
```

Defined in: [rx/signal.ts:27](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/rx/signal.ts#L27)

## Methods

### toRx()

```ts
toRx(): Rx;
```

Defined in: [rx/signal.ts:36](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/rx/signal.ts#L36)

Rx expression referencing this signal's value: `{{ key }}`

#### Returns

[`Rx`](Rx.md)

***

### toString()

```ts
toString(): string;
```

Defined in: [rx/signal.ts:41](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/rx/signal.ts#L41)

Serialize to the rx template string

#### Returns

`string`

***

### toJSON()

```ts
toJSON(): string;
```

Defined in: [rx/signal.ts:45](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/rx/signal.ts#L45)

#### Returns

`string`

***

### toState()

```ts
toState(): Record<string, T>;
```

Defined in: [rx/signal.ts:50](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/rx/signal.ts#L50)

State entry for PrefabApp: `{ key: initial }`

#### Returns

`Record`<`string`, `T`>
