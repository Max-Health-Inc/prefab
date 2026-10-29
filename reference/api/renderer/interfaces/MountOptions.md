---
url: /prefab/reference/api/renderer/interfaces/MountOptions.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / MountOptions

# Interface: MountOptions

Defined in: [renderer/index.ts:103](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/renderer/index.ts#L103)

## Properties

### transport?

```ts
optional transport?: McpTransport | McpTransportOptions;
```

Defined in: [renderer/index.ts:105](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/renderer/index.ts#L105)

MCP transport configuration.

***

### onToast?

```ts
optional onToast?: (toast) => void;
```

Defined in: [renderer/index.ts:107](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/renderer/index.ts#L107)

Toast notification handler.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `toast` | `ToastEvent` |

#### Returns

`void`

***

### themeToggle?

```ts
optional themeToggle?: boolean | ThemeToggleOptions;
```

Defined in: [renderer/index.ts:109](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/renderer/index.ts#L109)

Show a built-in theme toggle. Default: true. Set false to suppress.

***

### validate?

```ts
optional validate?: boolean;
```

Defined in: [renderer/index.ts:111](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/renderer/index.ts#L111)

Warn (console) on wire-format problems before rendering. Default: true. Non-fatal.
