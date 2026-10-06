---
url: /prefab/reference/api/renderer/interfaces/McpTransport.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / McpTransport

# Interface: McpTransport

Defined in: [renderer/actions.ts:47](https://github.com/Max-Health-Inc/prefab/blob/c0556f0632cf75f3e410fd7efc1a25abaf224e54/src/renderer/actions.ts#L47)

## Properties

### capabilities?

```ts
readonly optional capabilities?: object;
```

Defined in: [renderer/actions.ts:55](https://github.com/Max-Health-Inc/prefab/blob/c0556f0632cf75f3e410fd7efc1a25abaf224e54/src/renderer/actions.ts#L55)

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

Defined in: [renderer/actions.ts:48](https://github.com/Max-Health-Inc/prefab/blob/c0556f0632cf75f3e410fd7efc1a25abaf224e54/src/renderer/actions.ts#L48)

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

Defined in: [renderer/actions.ts:49](https://github.com/Max-Health-Inc/prefab/blob/c0556f0632cf75f3e410fd7efc1a25abaf224e54/src/renderer/actions.ts#L49)

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

Defined in: [renderer/actions.ts:51](https://github.com/Max-Health-Inc/prefab/blob/c0556f0632cf75f3e410fd7efc1a25abaf224e54/src/renderer/actions.ts#L51)

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

Defined in: [renderer/actions.ts:53](https://github.com/Max-Health-Inc/prefab/blob/c0556f0632cf75f3e410fd7efc1a25abaf224e54/src/renderer/actions.ts#L53)

Subscribe to a resource URI for push updates. Returns an unsubscribe function.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `uri` | `string` |
| `onData` | (`data`) => `void` |

#### Returns

() => `void`
