---
url: /prefab/reference/api/mcp/variables/APPS_EXTENSION.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / APPS\_EXTENSION

# Variable: APPS\_EXTENSION

```ts
const APPS_EXTENSION: "io.modelcontextprotocol/ui" = 'io.modelcontextprotocol/ui';
```

Defined in: [mcp/resource.ts:149](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/mcp/resource.ts#L149)

Capability key for the MCP Apps extension (versioned independently of core).

The identifier is `…/ui`, and the trap here is that `…/apps` looks right and is
wrong. The normative source is the MCP Apps spec, which states "This extension is
identified as: `io.modelcontextprotocol/ui`" in both the current `2026-01-26`
revision and the draft, and the reference implementation agrees:
`ext-apps/src/server/index.ts` exports `EXTENSION_ID = "io.modelcontextprotocol/ui"`.

`io.modelcontextprotocol/apps` appears only as illustrative "e.g." text in the Rust
and C# SDKs' generic `ServerCapabilities.extensions` doc comments (and their test
fixtures), showing the SHAPE of the extensions map rather than naming this extension.
Copying it from there declares the capability under a key no host looks up, which
fails silently: rendering still works, because hosts fall back to detecting apps via
`_meta.ui` plus the MIME type, so only the SEP-2133 declaration is lost.

Duplicated as a literal rather than imported, because prefab ships zero dependencies.
