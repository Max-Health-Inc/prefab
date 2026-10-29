---
url: /prefab/reference/api/renderer/interfaces/McpTransport.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / McpTransport

# Interface: McpTransport

Defined in: [renderer/actions.ts:44](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/renderer/actions.ts#L44)

## Properties

### capabilities?

```ts
readonly optional capabilities?: object;
```

Defined in: [renderer/actions.ts:52](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/renderer/actions.ts#L52)

Transport capabilities discovered during handshake.

#### subscriptions?

```ts
optional subscriptions?: boolean;
```

## Methods

### callTool()

```ts
callTool(name, args): Promise<unknown>;
```

Defined in: [renderer/actions.ts:45](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/renderer/actions.ts#L45)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| `args` | `Record`<`string`, `unknown`> |

#### Returns

`Promise`<`unknown`>

***

### sendMessage()

```ts
sendMessage(message): Promise<void>;
```

Defined in: [renderer/actions.ts:46](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/renderer/actions.ts#L46)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |

#### Returns

`Promise`<`void`>

***

### updateModelContext()?

```ts
optional updateModelContext(update): Promise<void>;
```

Defined in: [renderer/actions.ts:48](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/renderer/actions.ts#L48)

Replace what this view has told the model, without starting a turn.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `update` | [`ModelContextUpdate`](ModelContextUpdate.md) |

#### Returns

`Promise`<`void`>

***

### subscribe()?

```ts
optional subscribe(uri, onData): () => void;
```

Defined in: [renderer/actions.ts:50](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/renderer/actions.ts#L50)

Subscribe to a resource URI for push updates. Returns an unsubscribe function.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `uri` | `string` |
| `onData` | (`data`) => `void` |

#### Returns

() => `void`
