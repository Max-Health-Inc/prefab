---
url: /prefab/reference/api/renderer/interfaces/PrefabApp.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / PrefabApp

# Interface: PrefabApp

Defined in: [renderer/app.ts:56](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/renderer/app.ts#L56)

## Properties

### callTool

```ts
callTool: (name, args?) => Promise<unknown>;
```

Defined in: [renderer/app.ts:58](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/renderer/app.ts#L58)

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

Defined in: [renderer/app.ts:60](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/renderer/app.ts#L60)

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

Defined in: [renderer/app.ts:62](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/renderer/app.ts#L62)

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

Defined in: [renderer/app.ts:64](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/renderer/app.ts#L64)

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

Defined in: [renderer/app.ts:66](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/renderer/app.ts#L66)

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

Defined in: [renderer/app.ts:68](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/renderer/app.ts#L68)

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

Defined in: [renderer/app.ts:70](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/renderer/app.ts#L70)

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

Defined in: [renderer/app.ts:72](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/renderer/app.ts#L72)

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

Defined in: [renderer/app.ts:74](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/renderer/app.ts#L74)

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

Defined in: [renderer/app.ts:76](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/renderer/app.ts#L76)

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

Defined in: [renderer/app.ts:78](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/renderer/app.ts#L78)

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

Defined in: [renderer/app.ts:80](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/renderer/app.ts#L80)

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

Defined in: [renderer/app.ts:86](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/renderer/app.ts#L86)

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

Defined in: [renderer/app.ts:91](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/renderer/app.ts#L91)

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

Defined in: [renderer/app.ts:93](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/renderer/app.ts#L93)

Host context from initialization.

***

### capabilities

```ts
capabilities: HostCapabilities;
```

Defined in: [renderer/app.ts:95](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/renderer/app.ts#L95)

Host capabilities.

***

### theme

```ts
theme: HostTheme | undefined;
```

Defined in: [renderer/app.ts:97](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/renderer/app.ts#L97)

Host theme (if provided).

***

### transport

```ts
transport: McpTransport;
```

Defined in: [renderer/app.ts:99](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/renderer/app.ts#L99)

The underlying MCP transport.

***

### destroy

```ts
destroy: () => void;
```

Defined in: [renderer/app.ts:101](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/renderer/app.ts#L101)

Destroy the app and clean up.

#### Returns

`void`
