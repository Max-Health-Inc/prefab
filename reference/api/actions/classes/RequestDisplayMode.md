---
url: /prefab/reference/api/actions/classes/RequestDisplayMode.md
---
[@maxhealth.tech/prefab](../../index.md) / [actions](../index.md) / RequestDisplayMode

# Class: RequestDisplayMode

Defined in: [actions/mcp.ts:62](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/actions/mcp.ts#L62)

Base interface all actions implement

## Implements

* [`Action`](../interfaces/Action.md)

## Constructors

### Constructor

```ts
new RequestDisplayMode(mode): RequestDisplayMode;
```

Defined in: [actions/mcp.ts:63](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/actions/mcp.ts#L63)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `mode` | [`DisplayMode`](../type-aliases/DisplayMode.md) |

#### Returns

`RequestDisplayMode`

## Properties

### mode

```ts
readonly mode: DisplayMode;
```

Defined in: [actions/mcp.ts:63](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/actions/mcp.ts#L63)

## Methods

### toJSON()

```ts
toJSON(): ActionJSON;
```

Defined in: [actions/mcp.ts:65](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/actions/mcp.ts#L65)

#### Returns

[`ActionJSON`](../interfaces/ActionJSON.md)

#### Implementation of

[`Action`](../interfaces/Action.md).[`toJSON`](../interfaces/Action.md#tojson)
