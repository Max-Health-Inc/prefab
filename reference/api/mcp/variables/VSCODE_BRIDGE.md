---
url: /prefab/reference/api/mcp/variables/VSCODE_BRIDGE.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / VSCODE\_BRIDGE

# Variable: VSCODE\_BRIDGE

```ts
const VSCODE_BRIDGE: Readonly<Record<string, VsCodeTokenSource>>;
```

Defined in: [mcp/theme-bridge.ts:36](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/mcp/theme-bridge.ts#L36)

prefab tokens that VS Code can supply, with the same variables and static
fallbacks `prefab.css` uses. Tokens VS Code has no equivalent for (`--success`,
`--warning`, shadows, radii) are deliberately absent: the bridge only overrides
what the editor can actually provide.
