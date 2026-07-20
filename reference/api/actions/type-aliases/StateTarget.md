---
url: /prefab/reference/api/actions/type-aliases/StateTarget.md
---
[@maxhealth.tech/prefab](../../index.md) / [actions](../index.md) / StateTarget

# Type Alias: StateTarget

```ts
type StateTarget = 
  | Signal
  | Collection
  | string;
```

Defined in: [actions/sugar.ts:24](https://github.com/Max-Health-Inc/prefab/blob/88d9aa00d6a50ef0286767079c6345c808f6a0a9/src/actions/sugar.ts#L24)

Anything that resolves to a state key: Signal, Collection, or raw string.
