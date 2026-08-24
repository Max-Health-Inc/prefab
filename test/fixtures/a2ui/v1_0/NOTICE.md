# A2UI v1.0 JSON Schemas (vendored)

These files are copied verbatim from [a2ui-project/a2ui](https://github.com/a2ui-project/a2ui)
and are licensed under the Apache License 2.0. Copyright 2024 Google LLC.

| File | Upstream path |
|---|---|
| `agent_to_renderer.json` | `specification/v1_0/json/agent_to_renderer.json` |
| `agent_to_renderer_list.json` | `specification/v1_0/json/agent_to_renderer_list.json` |
| `agent_to_renderer_list_wrapper.json` | `specification/v1_0/json/agent_to_renderer_list_wrapper.json` |
| `common_types.json` | `specification/v1_0/json/common_types.json` |
| `basic-catalog.json` | `specification/v1_0/catalogs/basic/catalog.json` |

Vendored at upstream commit `f5baf760d23a5b21ba05a97f7d16d6db73fb8af6`.

They are vendored rather than fetched so `bun test` stays offline and a CI run
cannot go red because a2ui.org was slow. Refresh them with:

```bash
bun scripts/sync-a2ui-schemas.ts
```

## The catalog slot

`agent_to_renderer.json` refers to the active catalog as the sibling
`catalog.json`, which resolves to `https://a2ui.org/specification/v1_0/catalog.json`.
That is a slot, not a file: a surface declares which catalog it uses through
`catalogId`, and the validator binds the corresponding schema into that slot.
`test/a2ui-conformance.test.ts` binds `basic-catalog.json` there, because the
Basic catalog is what the prefab emitter targets.
