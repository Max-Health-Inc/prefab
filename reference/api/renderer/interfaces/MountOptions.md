---
url: /prefab/reference/api/renderer/interfaces/MountOptions.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / MountOptions

# Interface: MountOptions

Defined in: [renderer/index.ts:94](https://github.com/Max-Health-Inc/prefab/blob/88d9aa00d6a50ef0286767079c6345c808f6a0a9/src/renderer/index.ts#L94)

## Properties

### transport?

```ts
optional transport?: McpTransport | McpTransportOptions;
```

Defined in: [renderer/index.ts:96](https://github.com/Max-Health-Inc/prefab/blob/88d9aa00d6a50ef0286767079c6345c808f6a0a9/src/renderer/index.ts#L96)

MCP transport configuration.

***

### onToast?

```ts
optional onToast?: (toast) => void;
```

Defined in: [renderer/index.ts:98](https://github.com/Max-Health-Inc/prefab/blob/88d9aa00d6a50ef0286767079c6345c808f6a0a9/src/renderer/index.ts#L98)

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

Defined in: [renderer/index.ts:100](https://github.com/Max-Health-Inc/prefab/blob/88d9aa00d6a50ef0286767079c6345c808f6a0a9/src/renderer/index.ts#L100)

Show a built-in theme toggle. Default: true. Set false to suppress.
