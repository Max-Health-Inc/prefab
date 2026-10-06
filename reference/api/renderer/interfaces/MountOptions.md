---
url: /prefab/reference/api/renderer/interfaces/MountOptions.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / MountOptions

# Interface: MountOptions

Defined in: [renderer/index.ts:100](https://github.com/Max-Health-Inc/prefab/blob/c0556f0632cf75f3e410fd7efc1a25abaf224e54/src/renderer/index.ts#L100)

## Properties

### transport?

```ts
optional transport?: McpTransport | McpTransportOptions;
```

Defined in: [renderer/index.ts:102](https://github.com/Max-Health-Inc/prefab/blob/c0556f0632cf75f3e410fd7efc1a25abaf224e54/src/renderer/index.ts#L102)

MCP transport configuration.

***

### onToast?

```ts
optional onToast?: (toast) => void;
```

Defined in: [renderer/index.ts:104](https://github.com/Max-Health-Inc/prefab/blob/c0556f0632cf75f3e410fd7efc1a25abaf224e54/src/renderer/index.ts#L104)

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

Defined in: [renderer/index.ts:106](https://github.com/Max-Health-Inc/prefab/blob/c0556f0632cf75f3e410fd7efc1a25abaf224e54/src/renderer/index.ts#L106)

Show a built-in theme toggle. Default: true. Set false to suppress.

***

### validate?

```ts
optional validate?: boolean;
```

Defined in: [renderer/index.ts:108](https://github.com/Max-Health-Inc/prefab/blob/c0556f0632cf75f3e410fd7efc1a25abaf224e54/src/renderer/index.ts#L108)

Warn (console) on wire-format problems before rendering. Default: true. Non-fatal.
