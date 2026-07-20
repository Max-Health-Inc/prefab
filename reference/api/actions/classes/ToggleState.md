---
url: /prefab/reference/api/actions/classes/ToggleState.md
---
[@maxhealth.tech/prefab](../../index.md) / [actions](../index.md) / ToggleState

# Class: ToggleState

Defined in: [actions/client.ts:37](https://github.com/Max-Health-Inc/prefab/blob/88d9aa00d6a50ef0286767079c6345c808f6a0a9/src/actions/client.ts#L37)

Base interface all actions implement

## Implements

* [`Action`](../interfaces/Action.md)

## Constructors

### Constructor

```ts
new ToggleState(key): ToggleState;
```

Defined in: [actions/client.ts:38](https://github.com/Max-Health-Inc/prefab/blob/88d9aa00d6a50ef0286767079c6345c808f6a0a9/src/actions/client.ts#L38)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

#### Returns

`ToggleState`

## Properties

### key

```ts
readonly key: string;
```

Defined in: [actions/client.ts:38](https://github.com/Max-Health-Inc/prefab/blob/88d9aa00d6a50ef0286767079c6345c808f6a0a9/src/actions/client.ts#L38)

## Methods

### toJSON()

```ts
toJSON(): ActionJSON;
```

Defined in: [actions/client.ts:40](https://github.com/Max-Health-Inc/prefab/blob/88d9aa00d6a50ef0286767079c6345c808f6a0a9/src/actions/client.ts#L40)

#### Returns

[`ActionJSON`](../interfaces/ActionJSON.md)

#### Implementation of

[`Action`](../interfaces/Action.md).[`toJSON`](../interfaces/Action.md#tojson)
