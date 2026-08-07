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

Defined in: [actions/sugar.ts:24](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/actions/sugar.ts#L24)

Anything that resolves to a state key: Signal, Collection, or raw string.
