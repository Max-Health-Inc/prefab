---
url: /prefab/reference/api/mcp/interfaces/VsCodeTokenSource.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / VsCodeTokenSource

# Interface: VsCodeTokenSource

Defined in: [mcp/theme-bridge.ts:7](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/mcp/theme-bridge.ts#L7)

How one prefab token is sourced from the VS Code webview.

## Properties

### vscode

```ts
vscode: string;
```

Defined in: [mcp/theme-bridge.ts:9](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/mcp/theme-bridge.ts#L9)

VS Code webview variable supplying the value.

***

### light

```ts
light: string;
```

Defined in: [mcp/theme-bridge.ts:11](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/mcp/theme-bridge.ts#L11)

Static fallback when VS Code does not define it (light scheme).

***

### dark?

```ts
optional dark?: string;
```

Defined in: [mcp/theme-bridge.ts:13](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/mcp/theme-bridge.ts#L13)

Dark-scheme fallback. Omitted for scheme-independent tokens (fonts).
