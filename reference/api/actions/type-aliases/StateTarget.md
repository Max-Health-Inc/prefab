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

Defined in: [actions/sugar.ts:24](https://github.com/Max-Health-Inc/prefab/blob/c512f3bb2fb808f4335797b98c7b93774e2b1b30/src/actions/sugar.ts#L24)

Anything that resolves to a state key: Signal, Collection, or raw string.
