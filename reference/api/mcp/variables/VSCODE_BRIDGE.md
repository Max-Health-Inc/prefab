---
url: /prefab/reference/api/mcp/variables/VSCODE_BRIDGE.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / VSCODE\_BRIDGE

# Variable: VSCODE\_BRIDGE

```ts
const VSCODE_BRIDGE: Readonly<Record<string, VsCodeTokenSource>>;
```

Defined in: [mcp/theme-bridge.ts:36](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/mcp/theme-bridge.ts#L36)

prefab tokens that VS Code can supply, with the same variables and static
fallbacks `prefab.css` uses. Tokens VS Code has no equivalent for (`--success`,
`--warning`, shadows, radii) are deliberately absent: the bridge only overrides
what the editor can actually provide.
