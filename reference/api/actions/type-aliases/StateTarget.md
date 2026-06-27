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

Defined in: [actions/sugar.ts:24](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/actions/sugar.ts#L24)

Anything that resolves to a state key: Signal, Collection, or raw string.
