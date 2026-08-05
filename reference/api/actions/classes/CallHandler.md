---
url: /prefab/reference/api/actions/classes/CallHandler.md
---
[@maxhealth.tech/prefab](../../index.md) / [actions](../index.md) / CallHandler

# Class: CallHandler

Defined in: [actions/client.ts:201](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/actions/client.ts#L201)

Base interface all actions implement

## Implements

* [`Action`](../interfaces/Action.md)

## Constructors

### Constructor

```ts
new CallHandler(handler, opts?): CallHandler;
```

Defined in: [actions/client.ts:202](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/actions/client.ts#L202)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `handler` | `string` |
| `opts?` | [`CallHandlerOpts`](../interfaces/CallHandlerOpts.md) |

#### Returns

`CallHandler`

## Properties

### handler

```ts
readonly handler: string;
```

Defined in: [actions/client.ts:203](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/actions/client.ts#L203)

## Methods

### toJSON()

```ts
toJSON(): ActionJSON;
```

Defined in: [actions/client.ts:207](https://github.com/Max-Health-Inc/prefab/blob/c28332f5d123b3553a0d155787630df810963a02/src/actions/client.ts#L207)

#### Returns

[`ActionJSON`](../interfaces/ActionJSON.md)

#### Implementation of

[`Action`](../interfaces/Action.md).[`toJSON`](../interfaces/Action.md#tojson)
