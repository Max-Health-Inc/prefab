---
url: /prefab/reference/api/renderer/classes/Bridge.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / Bridge

# Class: Bridge

Defined in: [renderer/bridge.ts:99](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/renderer/bridge.ts#L99)

## Constructors

### Constructor

```ts
new Bridge(hostOrigin?): Bridge;
```

Defined in: [renderer/bridge.ts:116](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/renderer/bridge.ts#L116)

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `hostOrigin` | `string` | `'*'` |

#### Returns

`Bridge`

## Accessors

### supportsSubscriptions

#### Get Signature

```ts
get supportsSubscriptions(): boolean;
```

Defined in: [renderer/bridge.ts:318](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/renderer/bridge.ts#L318)

Whether the host indicated subscription support during handshake.

##### Returns

`boolean`

***

### activeProtocol

#### Get Signature

```ts
get activeProtocol(): "prefab" | "jsonrpc";
```

Defined in: [renderer/bridge.ts:352](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/renderer/bridge.ts#L352)

Which protocol is active after initialize().

##### Returns

`"prefab"` | `"jsonrpc"`

## Methods

### connect()

```ts
connect(): void;
```

Defined in: [renderer/bridge.ts:121](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/renderer/bridge.ts#L121)

Start listening for messages (prefab:\* and JSON-RPC ui/\*).

#### Returns

`void`

***

### initialize()

```ts
initialize(appCapabilities): Promise<HostContext>;
```

Defined in: [renderer/bridge.ts:173](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/renderer/bridge.ts#L173)

Init handshake. Races prefab:init and ui/initialize JSON-RPC in parallel.
Whichever protocol responds first wins.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `appCapabilities` | [`AppCapabilities`](../interfaces/AppCapabilities.md) |

#### Returns

`Promise`<[`HostContext`](../interfaces/HostContext.md)>

***

### createTransport()

```ts
createTransport(): McpTransport;
```

Defined in: [renderer/bridge.ts:189](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/renderer/bridge.ts#L189)

Create an McpTransport that routes through the active protocol.

#### Returns

[`McpTransport`](../interfaces/McpTransport.md)

***

### requestMode()

```ts
requestMode(mode): void;
```

Defined in: [renderer/bridge.ts:197](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/renderer/bridge.ts#L197)

Request a display mode change.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `mode` | [`DisplayMode`](../type-aliases/DisplayMode.md) |

#### Returns

`void`

***

### openLink()

```ts
openLink(url, target?): void;
```

Defined in: [renderer/bridge.ts:206](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/renderer/bridge.ts#L206)

Request the host to open a URL.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `url` | `string` |
| `target?` | `string` |

#### Returns

`void`

***

### updateContext()

```ts
updateContext(context): void;
```

Defined in: [renderer/bridge.ts:215](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/renderer/bridge.ts#L215)

Send context updates to the host.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | `Record`<`string`, `unknown`> |

#### Returns

`void`

***

### setupAutoResize()

```ts
setupAutoResize(el): () => void;
```

Defined in: [renderer/bridge.ts:232](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/renderer/bridge.ts#L232)

Observe an element's size and notify the host whenever it changes.
Mirrors the ext-apps SDK's `autoResize: true` behaviour — uses a
`ResizeObserver` on the target element and sends
`ui/notifications/size-changed` (JSON-RPC) or
`prefab:size-changed` (prefab protocol).

Returns a teardown function that disconnects the observer.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `el` | `HTMLElement` |

#### Returns

() => `void`

***

### notifyPreferredSize()

```ts
notifyPreferredSize(layout): void;
```

Defined in: [renderer/bridge.ts:278](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/renderer/bridge.ts#L278)

Notify the host of declarative layout/size hints from the wire format.
Sends once when the UI mounts so the host can pre-allocate space.

Uses `ui/notifications/preferred-size` (JSON-RPC) or
`prefab:preferred-size` (prefab protocol).

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `layout` | { `preferredHeight?`: `number`; `minHeight?`: `number`; `maxHeight?`: `number`; } |
| `layout.preferredHeight?` | `number` |
| `layout.minHeight?` | `number` |
| `layout.maxHeight?` | `number` |

#### Returns

`void`

***

### subscribe()

```ts
subscribe(
   uri, 
   onData, 
   onError?): () => void;
```

Defined in: [renderer/bridge.ts:290](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/renderer/bridge.ts#L290)

Subscribe to push updates for a resource URI via `resources/subscribe` (JSON-RPC) or `prefab:subscribe`.
`onError` receives a refused or timed-out JSON-RPC subscription. Returns the unsubscribe function.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `uri` | `string` |
| `onData` | (`data`) => `void` |
| `onError?` | (`error`) => `void` |

#### Returns

() => `void`

***

### on()

```ts
on(type, handler): void;
```

Defined in: [renderer/bridge.ts:323](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/renderer/bridge.ts#L323)

Register a handler for a message type (prefab:\* or internal).

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `type` | `string` |
| `handler` | (`payload`) => `void` |

#### Returns

`void`

***

### off()

```ts
off(type, handler): void;
```

Defined in: [renderer/bridge.ts:332](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/renderer/bridge.ts#L332)

Remove a handler.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `type` | `string` |
| `handler` | (`payload`) => `void` |

#### Returns

`void`

***

### disconnect()

```ts
disconnect(): void;
```

Defined in: [renderer/bridge.ts:337](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/renderer/bridge.ts#L337)

Disconnect and clean up.

#### Returns

`void`
