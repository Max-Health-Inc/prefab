---
url: /prefab/reference/api/mcp/variables/VSCODE_BRIDGE.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / VSCODE\_BRIDGE

# Variable: VSCODE\_BRIDGE

```ts
const VSCODE_BRIDGE: Readonly<Record<string, VsCodeTokenSource>>;
```

Defined in: [mcp/theme-bridge.ts:36](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/theme-bridge.ts#L36)

prefab tokens that VS Code can supply, with the same variables and static
fallbacks `prefab.css` uses. Tokens VS Code has no equivalent for (`--success`,
`--warning`, shadows, radii) are deliberately absent: the bridge only overrides
what the editor can actually provide.
