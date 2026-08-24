---
url: /prefab/reference/api/renderer/interfaces/ThemeToggleOptions.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / ThemeToggleOptions

# Interface: ThemeToggleOptions

Defined in: [renderer/theme.ts:13](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/renderer/theme.ts#L13)

## Properties

### position?

```ts
optional position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
```

Defined in: [renderer/theme.ts:15](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/renderer/theme.ts#L15)

Position of the toggle inside the prefab root. Default: 'top-right'.

***

### storageKey?

```ts
optional storageKey?: string;
```

Defined in: [renderer/theme.ts:17](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/renderer/theme.ts#L17)

localStorage key for persistence. Default: 'prefab-theme'.

***

### syncDocument?

```ts
optional syncDocument?: boolean;
```

Defined in: [renderer/theme.ts:19](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/renderer/theme.ts#L19)

Whether to sync with document.documentElement\[data-theme]. Default: true.
