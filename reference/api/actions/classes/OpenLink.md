---
url: /prefab/reference/api/actions/classes/OpenLink.md
---
[@maxhealth.tech/prefab](../../index.md) / [actions](../index.md) / OpenLink

# Class: OpenLink

Defined in: [actions/client.ts:113](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/actions/client.ts#L113)

Base interface all actions implement

## Implements

* [`Action`](../interfaces/Action.md)

## Constructors

### Constructor

```ts
new OpenLink(url, target?): OpenLink;
```

Defined in: [actions/client.ts:114](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/actions/client.ts#L114)

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `url` | `string` | `undefined` |
| `target` | `string` | `'_blank'` |

#### Returns

`OpenLink`

## Properties

### url

```ts
readonly url: string;
```

Defined in: [actions/client.ts:115](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/actions/client.ts#L115)

***

### target

```ts
readonly target: string = '_blank';
```

Defined in: [actions/client.ts:116](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/actions/client.ts#L116)

## Methods

### toJSON()

```ts
toJSON(): ActionJSON;
```

Defined in: [actions/client.ts:119](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/actions/client.ts#L119)

#### Returns

[`ActionJSON`](../interfaces/ActionJSON.md)

#### Implementation of

[`Action`](../interfaces/Action.md).[`toJSON`](../interfaces/Action.md#tojson)
