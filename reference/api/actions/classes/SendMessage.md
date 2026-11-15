---
url: /prefab/reference/api/actions/classes/SendMessage.md
---
[@maxhealth.tech/prefab](../../index.md) / [actions](../index.md) / SendMessage

# Class: SendMessage

Defined in: [actions/mcp.ts:40](https://github.com/Max-Health-Inc/prefab/blob/4e102b3517c5a62f380fd91b75fb8c49a1f96cec/src/actions/mcp.ts#L40)

Base interface all actions implement

## Implements

* [`Action`](../interfaces/Action.md)

## Constructors

### Constructor

```ts
new SendMessage(message): SendMessage;
```

Defined in: [actions/mcp.ts:41](https://github.com/Max-Health-Inc/prefab/blob/4e102b3517c5a62f380fd91b75fb8c49a1f96cec/src/actions/mcp.ts#L41)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |

#### Returns

`SendMessage`

## Properties

### message

```ts
readonly message: string;
```

Defined in: [actions/mcp.ts:41](https://github.com/Max-Health-Inc/prefab/blob/4e102b3517c5a62f380fd91b75fb8c49a1f96cec/src/actions/mcp.ts#L41)

## Methods

### toJSON()

```ts
toJSON(): ActionJSON;
```

Defined in: [actions/mcp.ts:43](https://github.com/Max-Health-Inc/prefab/blob/4e102b3517c5a62f380fd91b75fb8c49a1f96cec/src/actions/mcp.ts#L43)

#### Returns

[`ActionJSON`](../interfaces/ActionJSON.md)

#### Implementation of

[`Action`](../interfaces/Action.md).[`toJSON`](../interfaces/Action.md#tojson)
