---
url: /prefab/reference/api/actions/classes/RequestDisplayMode.md
---
[@maxhealth.tech/prefab](../../index.md) / [actions](../index.md) / RequestDisplayMode

# Class: RequestDisplayMode

Defined in: [actions/mcp.ts:62](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/actions/mcp.ts#L62)

Base interface all actions implement

## Implements

* [`Action`](../interfaces/Action.md)

## Constructors

### Constructor

```ts
new RequestDisplayMode(mode): RequestDisplayMode;
```

Defined in: [actions/mcp.ts:63](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/actions/mcp.ts#L63)

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

Defined in: [actions/mcp.ts:63](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/actions/mcp.ts#L63)

## Methods

### toJSON()

```ts
toJSON(): ActionJSON;
```

Defined in: [actions/mcp.ts:65](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/actions/mcp.ts#L65)

#### Returns

[`ActionJSON`](../interfaces/ActionJSON.md)

#### Implementation of

[`Action`](../interfaces/Action.md).[`toJSON`](../interfaces/Action.md#tojson)
