---
url: /prefab/reference/api/renderer/interfaces/PrefabApp.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / PrefabApp

# Interface: PrefabApp

Defined in: [renderer/app.ts:55](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/renderer/app.ts#L55)

## Properties

### callTool

```ts
callTool: (name, args?) => Promise<unknown>;
```

Defined in: [renderer/app.ts:57](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/renderer/app.ts#L57)

Call an MCP tool through the transport.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| `args?` | `Record`<`string`, `unknown`> |

#### Returns

`Promise`<`unknown`>

***

### sendMessage

```ts
sendMessage: (message) => Promise<void>;
```

Defined in: [renderer/app.ts:59](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/renderer/app.ts#L59)

Send a message through the transport.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |

#### Returns

`Promise`<`void`>

***

### onToolInput

```ts
onToolInput: (handler) => void;
```

Defined in: [renderer/app.ts:61](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/renderer/app.ts#L61)

Register a handler for tool input from the host.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `handler` | `ToolInputHandler` |

#### Returns

`void`

***

### onToolResult

```ts
onToolResult: (handler) => void;
```

Defined in: [renderer/app.ts:63](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/renderer/app.ts#L63)

Register a handler for tool results from the host.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `handler` | `ToolResultHandler` |

#### Returns

`void`

***

### onToolCancelled

```ts
onToolCancelled: (handler) => void;
```

Defined in: [renderer/app.ts:65](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/renderer/app.ts#L65)

Register a handler for tool cancellation.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `handler` | `VoidHandler` |

#### Returns

`void`

***

### onToolInputPartial

```ts
onToolInputPartial: (handler) => void;
```

Defined in: [renderer/app.ts:67](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/renderer/app.ts#L67)

Register a handler for partial/streaming tool input.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `handler` | `ToolInputHandler` |

#### Returns

`void`

***

### onHostContextChanged

```ts
onHostContextChanged: (handler) => void;
```

Defined in: [renderer/app.ts:69](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/renderer/app.ts#L69)

Register a handler for host context changes (full params from host-context-changed).

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `handler` | (`context`) => `void` |

#### Returns

`void`

***

### render

```ts
render: (target, ...components) => MountHandle;
```

Defined in: [renderer/app.ts:71](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/renderer/app.ts#L71)

Render a component tree into a DOM element.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `target` | `string` | `HTMLElement` |
| ...`components` | [`ComponentNode`](ComponentNode.md)\[] |

#### Returns

[`MountHandle`](MountHandle.md)

***

### mount

```ts
mount: (target, data, opts?) => MountedApp;
```

Defined in: [renderer/app.ts:73](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/renderer/app.ts#L73)

Mount full wire-format data (legacy API).

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `target` | `string` | `HTMLElement` |
| `data` | [`PrefabWireData`](PrefabWireData.md) |
| `opts?` | [`MountOptions`](MountOptions.md) |

#### Returns

[`MountedApp`](MountedApp.md)

***

### requestMode

```ts
requestMode: (mode) => void;
```

Defined in: [renderer/app.ts:75](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/renderer/app.ts#L75)

Request a display mode change.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `mode` | [`DisplayMode`](../type-aliases/DisplayMode.md) |

#### Returns

`void`

***

### openLink

```ts
openLink: (url, target?) => void;
```

Defined in: [renderer/app.ts:77](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/renderer/app.ts#L77)

Request the host to open a URL.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `url` | `string` |
| `target?` | `string` |

#### Returns

`void`

***

### updateContext

```ts
updateContext: (context) => void;
```

Defined in: [renderer/app.ts:79](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/renderer/app.ts#L79)

Send context updates.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | `Record`<`string`, `unknown`> |

#### Returns

`void`

***

### setupAutoResize

```ts
setupAutoResize: (target) => () => void;
```

Defined in: [renderer/app.ts:85](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/renderer/app.ts#L85)

Observe an element and notify the host whenever it resizes.
Mirrors the ext-apps SDK `autoResize: true` behaviour.
Returns a teardown function that disconnects the observer.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `target` | `string` | `HTMLElement` |

#### Returns

() => `void`

***

### notifyPreferredSize

```ts
notifyPreferredSize: (layout) => void;
```

Defined in: [renderer/app.ts:90](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/renderer/app.ts#L90)

Notify the host of declarative layout/size preferences from the wire format.
Called automatically when mounting wire data with a `layout` field.

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

### host

```ts
host: HostContext;
```

Defined in: [renderer/app.ts:92](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/renderer/app.ts#L92)

Host context from initialization.

***

### capabilities

```ts
capabilities: HostCapabilities;
```

Defined in: [renderer/app.ts:94](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/renderer/app.ts#L94)

Host capabilities.

***

### theme

```ts
theme: HostTheme | undefined;
```

Defined in: [renderer/app.ts:96](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/renderer/app.ts#L96)

Host theme (if provided).

***

### transport

```ts
transport: McpTransport;
```

Defined in: [renderer/app.ts:98](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/renderer/app.ts#L98)

The underlying MCP transport.

***

### destroy

```ts
destroy: () => void;
```

Defined in: [renderer/app.ts:100](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/renderer/app.ts#L100)

Destroy the app and clean up.

#### Returns

`void`
