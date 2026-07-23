---
url: /prefab/reference/api/actions/classes/SetState.md
---
[@maxhealth.tech/prefab](../../index.md) / [actions](../index.md) / SetState

# Class: SetState

Defined in: [actions/client.ts:16](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/actions/client.ts#L16)

Base interface all actions implement

## Implements

* [`Action`](../interfaces/Action.md)

## Constructors

### Constructor

```ts
new SetState(
   key, 
   value, 
   opts?): SetState;
```

Defined in: [actions/client.ts:17](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/actions/client.ts#L17)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `value` | `unknown` |
| `opts?` | [`SetStateOpts`](../interfaces/SetStateOpts.md) |

#### Returns

`SetState`

## Properties

### key

```ts
readonly key: string;
```

Defined in: [actions/client.ts:18](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/actions/client.ts#L18)

***

### value

```ts
readonly value: unknown;
```

Defined in: [actions/client.ts:19](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/actions/client.ts#L19)

## Methods

### toJSON()

```ts
toJSON(): ActionJSON;
```

Defined in: [actions/client.ts:23](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/actions/client.ts#L23)

#### Returns

[`ActionJSON`](../interfaces/ActionJSON.md)

#### Implementation of

[`Action`](../interfaces/Action.md).[`toJSON`](../interfaces/Action.md#tojson)
