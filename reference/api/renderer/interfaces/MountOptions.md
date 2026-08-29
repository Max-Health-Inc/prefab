---
url: /prefab/reference/api/renderer/interfaces/MountOptions.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / MountOptions

# Interface: MountOptions

Defined in: [renderer/index.ts:99](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/renderer/index.ts#L99)

## Properties

### transport?

```ts
optional transport?: McpTransport | McpTransportOptions;
```

Defined in: [renderer/index.ts:101](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/renderer/index.ts#L101)

MCP transport configuration.

***

### onToast?

```ts
optional onToast?: (toast) => void;
```

Defined in: [renderer/index.ts:103](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/renderer/index.ts#L103)

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

Defined in: [renderer/index.ts:105](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/renderer/index.ts#L105)

Show a built-in theme toggle. Default: true. Set false to suppress.

***

### validate?

```ts
optional validate?: boolean;
```

Defined in: [renderer/index.ts:107](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/renderer/index.ts#L107)

Warn (console) on wire-format problems before rendering. Default: true. Non-fatal.
