---
url: /prefab/reference/api/mcp/interfaces/VsCodeTokenSource.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / VsCodeTokenSource

# Interface: VsCodeTokenSource

Defined in: [mcp/theme-bridge.ts:21](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/theme-bridge.ts#L21)

How one prefab token is sourced from the VS Code webview.

## Properties

### vscode

```ts
vscode: string;
```

Defined in: [mcp/theme-bridge.ts:23](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/theme-bridge.ts#L23)

VS Code webview variable supplying the value.

***

### light

```ts
light: string;
```

Defined in: [mcp/theme-bridge.ts:25](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/theme-bridge.ts#L25)

Static fallback when VS Code does not define it (light scheme).

***

### dark?

```ts
optional dark?: string;
```

Defined in: [mcp/theme-bridge.ts:27](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/theme-bridge.ts#L27)

Dark-scheme fallback. Omitted for scheme-independent tokens (fonts).
