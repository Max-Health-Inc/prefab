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

Defined in: [actions/sugar.ts:24](https://github.com/Max-Health-Inc/prefab/blob/7a2e43417fa83301b42abd7447c199249e6c40f6/src/actions/sugar.ts#L24)

Anything that resolves to a state key: Signal, Collection, or raw string.
