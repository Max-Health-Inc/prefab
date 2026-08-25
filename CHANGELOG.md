# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- **`ForEach` maps onto A2UI's child template.** A2UI has iteration, the same construct `DataTable` already used: one template component instantiated per item, with paths inside it resolving relative to the current row. The emitter simply never wired it, so every loop was dropped. `$item` now resolves to a relative path and `$index` to the `@index` system function.
- **Mixed literal and template text is interpolated through `formatString`.** A2UI's `formatString` takes a single template string with JSON Pointers embedded as `${/path}`, so `Score: {{ score }}` crosses over intact. The previous code claimed the function "would need an argument list this function has no way to name", which was simply wrong about its signature. A string is interpolated only if every value in it binds; one unbindable expression makes the whole string unbindable, since interpolating half of it would change what the text says.
- **`Define` / `Use` / `Slot` are resolved at emit time by inlining the definition.** A2UI needs no named-template concept when the agent can expand the tree before sending it. A `Use`'s `overrides` are seeded into the data model and brought into scope by name, so a `{{ title }}` inside the body reads that call's value rather than the model root. Definitions are collected in a pre-pass, since prefab imposes no ordering between a `Use` and its `Define`, and a definition that uses itself reports a cycle rather than recursing until the stack gives out.
- `CardTitle`, `CardDescription` and `Tooltip` have first-class text mappings. They rendered correctly through the generic fallback but reported a degradation for what is an exact mapping, which accounted for 36 of the 160 diagnostics across the shipped examples.

### Fixed

- **A dropped node left its already-emitted children orphaned, producing a payload the renderer rejects.** A mapper reads its children before deciding whether it can map at all: `Dialog` emits its body, then finds it cannot build a trigger, returns nothing, and the body stays in the adjacency list with no component pointing at it. `interactive-showcase.json` — one of the shipped examples — emitted an unreachable `Row` on v0.3.10 for exactly this reason. Emission is now transactional: a node that drops rolls back every component and data-model key added while mapping it. The per-type registry tests could not catch this, because each mapper is correct in isolation and the fault is in the interaction; `test/a2ui-control.test.ts` now runs every shipped example through the emitter, which does catch it.
- **`Define` emitted its template body as visible content.** It fell to the generic fallback and was flattened to a `Column`, so a definition rendered where it was declared. The renderer draws nothing at the point of definition and now neither does the emitter.
- **The emitter knew only one of the two spellings for a tool-call action.** The renderer accepts `toolCall` and `callTool`, and the shipped examples use the latter, so every hand-written tool call was silently downgraded to a generic agent event and had its arguments dropped for not being scalar.
- **A string containing two templates was mis-read as one.** The sole-template pattern is lazy but still spanned `}} … {{`, so `{{ a }} of {{ b }}` matched as a single template whose body was `a }} of {{ b`, failed to parse as a path, and was reported unbindable instead of being interpolated.
- **A `Modal` whose trigger could not map lost the whole dialog.** prefab's dialog trigger is usually a `Button` with no `onClick`, because opening the dialog is implicit, and the `Button` mapper rightly refuses one with no action. A2UI's `Modal` accepts any component as its trigger, so it now falls back to the trigger's label as `Text`.

Across the twenty shipped examples this takes the emitter from 160 diagnostics and one invalid payload to 95 diagnostics and none. What remains is largely honest: charts, `Metric` trend styling, table controls, and the conditionals.


### Added

- **A2UI is now a first-class output target: `PrefabApp.toA2UI()` emits the same component tree as [A2UI](https://a2ui.org) v1.0.** A2UI is the Google-backed declarative agent-to-UI protocol, and it overlaps prefab's category exactly: the agent sends a component tree plus a data model, and the host's own renderer draws native widgets from it. It reaches renderers prefab has none of (React, Angular, Lit, Flutter, Swift, Jetpack Compose) with no iframe involved, and its agent-side SDK is Python-only, so a TypeScript authoring layer had no equivalent. Two structural gaps had to be bridged: A2UI keeps components in a flat adjacency list rather than a nested tree, and it binds dynamic values through JSON Pointers rather than interpolating `{{ }}` templates. `src/a2ui/` handles both, allocating ids deterministically so the same tree always emits byte-identical output.
- **`display_a2ui()` and `registerA2uiResource()` serve A2UI over MCP**, under the `application/a2ui+json` MIME type as an embedded resource in a tool result or as a standalone `a2ui://` resource, per the [A2UI over MCP](https://a2ui.org/guides/a2ui_over_mcp/) guide. They sit alongside the existing `ui://` MCP Apps helpers rather than replacing them, so one server can offer both and let the host choose. A `ui://` viewer is a pure function of the package version and stays shared-cacheable; an `a2ui://` surface is rebuilt on every read and defaults to no caching, so `resolveCache` is now exported from `resource.ts` and takes the defaults as a parameter instead of hard-coding the viewer's.
- **Multi Round-Trip input requests (protocol revision 2026-07-28).** The revision made the protocol core stateless and removed server-initiated `elicitation/create`; a handler now returns an `input_required` result and the client retries the call with the answers. That left `display_form()` reachable only on hosts that render UI. The same `AutoFormField[]` now also derives the restricted elicitation schema, so `display_form(fields, tool, { elicit: true })` asks for exactly what the rendered form asks for. `formSchema`, `formInputRequest`, `acceptedFormInput` and `inputResponse` are exported for handlers that compose the rounds themselves. `acceptedFormInput` validates the untrusted client response against the same field list: unknown keys, wrong types, out-of-bound numbers and unoffered enum values are dropped, and a missing required field fails the answer.
- **The playground has an A2UI tab.** The preview pane now switches between the rendered UI and the same payload translated to A2UI, with the message and component counts, a pill per diagnostic kind, and every diagnostic listed underneath. A `Stream` toggle splits the output into the three-message form. Being able to see what a payload costs in translation, on the twenty shipped examples, says more than the mapping table does.
- **`dist/a2ui.min.js`, the emitter as a standalone browser bundle.** The playground needs the emitter and does not need it inside `renderer.min.js`: almost no page that renders `$prefab` also emits A2UI, so folding it in would tax every consumer for a feature they do not use. It exposes `PrefabA2UI.emit()` and `PrefabA2UI.envelope()`, takes wire JSON rather than a component tree, and comes to 17 KB against the renderer's 108 KB. Attached to GitHub releases alongside the renderer bundles.
- `AutoFormField` gained `options`, `multiple`, `description`, `min`, `max` and `default`. A field with `options` renders as a `Select` instead of a bare `Input` on the UI path, and as an enum on the elicitation path.
- `McpDisplayResult<S>` pins `structuredContent` as present. Every display helper populates it, and the optional field on `McpToolResult` was forcing callers into a null check on something that is never absent.

### Changed

- **README, docs landing page and package description now lead with "TypeScript authoring for A2UI and MCP Apps".** The previous framing put "a superset of PrefectHQ's Python prefab-ui" in the second line, which tied the package's story to a project moving slowly and described an implementation detail rather than what the package is for. The superset relationship is still stated, one bullet down, where it belongs.

### Fixed

- **The A2UI emitter produced an invalid surface for most icons.** A2UI's `Icon.name` is a closed enum of 59 Material names, so an unrecognised value does not degrade to a fallback glyph — it fails schema validation and takes the component with it. prefab's `Icon(name)` accepts any string and follows Lucide, so every icon outside that enum emitted an invalid payload. The hand-written test view happened to use `Icon('mail')`, which is in the enum, so nothing caught it. `src/a2ui/icons.ts` now normalises the name, matches it against the enum case- and separator-insensitively, translates the Lucide names prefab itself ships (`AlertCircle` → `error`, `CheckCircle` → `check`), and drops the icon with a diagnostic when nothing means the same thing. The enum is duplicated as a literal because the package has no runtime dependencies and cannot read the catalog at emit time; a test asserts it matches the vendored catalog exactly, so a spec revision cannot let it drift.
- **`test/component-types.test.ts` depended on which test file the runner reached first.** It compared the generated `src/core/component-types.ts` against the whole renderer registry, which is a process-wide singleton any module can add to. `test/renderer-destroy.test.ts` and `test/pipe-wire.test.ts` register a dozen widgets inside their test bodies, so once the runner reached either of them first, all twelve became "renderable but absent from the generated list" and thirteen assertions failed. It passed locally and failed on CI purely on file-discovery order, and adding the A2UI test files was enough to flip it. `registerAllComponents()` now records the delta it contributes as the built-in set, and both the generator and the sync check read that instead of the full registry. The generated list is unchanged at 119 types.

### Internal

- **Registry-wide A2UI invariants, rather than one hand-written view per mapper family.** The per-family views check that the mappings are right; they cannot check that they are safe, because a mapper is only covered if someone remembered to write a view for it, and the branches that matter most are the guards deciding "this cannot be expressed, drop it and say why". Coverage of `catalog.ts` sat at 72% of functions with nearly every uncovered line being one of those guards. `test/a2ui-registry.test.ts` now asserts two properties across all 81 registry entries, so a mapper added later is covered the moment it is registered: nothing a mapper emits is ever invalid, given generous props or none at all; and nothing is dropped without a diagnostic. The furnished pass additionally requires an actual component, since "emits nothing" would otherwise satisfy the first property trivially. This is what surfaced the `Icon` enum bug. `catalog.ts` is now at 100% of functions and 97% of lines.
- Removed `hasTemplate` and `isTemplatedList`, both exported with no caller anywhere.
- Emitted A2UI payloads are validated in CI against the official v1.0 JSON Schemas, vendored under `test/fixtures/a2ui/v1_0/` (Apache-2.0, with a `NOTICE.md` recording the upstream commit) and refreshable with `bun scripts/sync-a2ui-schemas.ts`. They are checked in rather than fetched so the suite runs offline. The upstream YAML conformance suites were considered and rejected: they exercise SDK internals (streaming parser, catalog pruning, validator behaviour) that a producer does not implement, whereas the schemas define exactly what a producer must emit. Two structural rules the schemas cannot express — every child reference resolves, and every component is reachable from `root` — are asserted separately, taken from `conformance/core/validator.yaml`.

## [0.3.9] — 2026-08-07

### Added

- **`label` on every stateful control.** `InputProps` declared it privately and only `renderInput` drew it, so `Select({ label })` and `DatePicker({ label })` were documented but silently dropped. `label` moves to `StatefulProps`, and the wire shape shared by all of them is now one exported `statefulProps()` helper. `Select`, `RadioGroup` and `Combobox` are containers rather than `StatefulComponent`s and were each restating that block by hand, which is exactly how `label` went missing on them; they call the helper now. On the renderer side a single `withLabel()` decorator is applied at registration to the five controls that lay out vertically (`Select`, `DatePicker`, `Combobox`, `Textarea`, `Slider`). Checkbox, Switch, Radio, RadioGroup and ChoiceCard place their own label beside the control and are deliberately not wrapped.
- **`Tabs({ defaultTab })`** — a `Tab` title or a 0-based index, replacing a hardcoded `i === 0` in the renderer. An unmatched title or out-of-range index falls back to the first tab rather than leaving no tab selected.
- **`Table({ striped })`** — shades alternate body rows via a `pf-table-striped` modifier and a `:nth-child(even)` rule, rather than per-table styling.
- **`Sparkline({ width, height })`** — the renderer hardcoded 120×32; those are now the defaults.

- **`DropZone` actually handles files.** The renderer was a stub (`// File handling would go here`) with drag listeners and nothing behind them, so the documented `accept` applied to nothing. It now takes files by drag-and-drop or click-to-browse, is keyboard reachable (`role="button"`, Enter/Space), and accepts `label`, `accept`, `multiple`, `resultKey` and `onDrop`. Those names and the `$result` callback binding are the ones the `OpenFilePicker` action already uses, so both routes to a file list behave identically. `accept` is enforced for **dropped** files as well: the browser applies it to the file picker only, so drag-and-drop would otherwise bypass it entirely. Exported `matchesAccept()` handles the three `accept` forms (`image/*`, `.pdf`, `text/csv`); no equivalent existed to reuse, and the org's other drop zones are all React components with no overlap between them.

All five were documented in `docs/reference/components.md` with props-table entries before they existed, and were found by `bun run check:docs`.

### Docs

- **Every fenced `ts` example now typechecks, and CI enforces it.** `bun run check:docs` runs in `ci.yml` between the test and build steps. 71 blocks across 17 files, from 86 errors down to zero. The remaining fixes after the container-shape pass were all stale API forms rather than missing features: `rx` used as a tagged template (it is `rx(key)`, and interpolated text is a plain `'{{ key }}'` string, while `STATE.name` and `ITEM.dot('name')` cover the built-ins), `SelectOption`/`ComboboxOption` documented with an object when they take `(value, label)` positionally, `GridItem`'s `span` which is `colSpan`, `Button`'s `type: 'submit'` which is `submit: true`, `Metric`'s numeric `delta` where the type is `RxStr`, `Dialog`'s `trigger` documented as an element id when it takes a `Component`, `ForEach`'s `as` which does not exist (the loop variable is the exported `ITEM`), and `Slot('name')` which takes props. Four blocks carry `<!-- doccheck: skip -->` with a stated reason: two entry-point listings using `import { ... }`, a CSS side-effect import the bundler resolves rather than tsc, and companion-script code written against the renderer's browser global.

## [0.3.8] — 2026-08-05

### Fixed

- **Strict wire-format validation rejected four renderable component types.** `validateWireFormat(data, { strict: true })` checked `type` against a hand-written list in `src/core/validate.ts` that had fallen behind the renderer's registry: `Condition` (emitted by `If` / `Elif` / `Else`), `Detail`, `MasterDetail` and `PdfViewer` were all registered and renderable, but reported as `Unknown component type`. Any UI using a conditional therefore failed strict validation, as did two of the shipped examples. The list is no longer written by hand: `src/core/component-types.ts` is generated from the registry (`bun run gen:types`, also run by the build), and the validator consumes it. The generated module is import-free, so the validator still works server-side where the renderer is never loaded. Non-strict validation was unaffected, since unknown types are only an error under `strict`.
- **The shipped example UIs were never validated against the wire format.** `docs/public/examples/*.json` is the single source for the demo, the playground and the generated skill assets, and nothing pointed the package's own `validateWireFormat` at it, so an example could ship a key the renderer ignores and simply render nothing. That had already happened once (0.3.5 repaired examples declaring conditional branches under a non-existent `then` key). `test/doc-examples.test.ts` now validates all 20 in strict mode, which is what surfaced the validator drift above.

- **The display helpers could not be returned to an SDK tool handler without a cast.** `PrefabWireFormat` and `PrefabUpdateWire` were interfaces, so the `structuredContent` on every result from `display()`, `display_form()`, `display_update()`, `display_error()` and `display_success()` failed against the SDK's `{ [x: string]: unknown }` with "Index signature for type 'string' is missing". This is the same by-design TypeScript behaviour fixed for `src/mcp/types.ts` in 0.3.7 ([microsoft/TypeScript#15300](https://github.com/microsoft/TypeScript/issues/15300)); these two types were missed because they live outside that file, in `src/app.ts` and `src/mcp/display.ts`. Both are aliases now. Consumers had no way to fix this on their side, since the type came from here, and the only escape was an assertion. prefab carried the same workaround internally: `PrefabApp.toMcpResult()` used `wire as unknown as Record<string, unknown>`, a double assertion that only existed because of this, and is gone.
- **The 0.3.7 interop guard had a blind spot that let the above through.** `test/mcp-types.test.ts` modelled an SDK result as a flat `Record<string, unknown>`, which `McpToolResult` satisfies through its own explicit index signature, so the *value* of `structuredContent` was never checked against the narrower field type the SDK declares. The guard stayed green while every display helper was unassignable. It now also asserts against a stand-in that keeps the field shape, covering all five helpers and the typed-handler return position.

### Internal

- **`registeredComponentTypes()` on the renderer** returns every type the registry can render. The registry is the authority on that set, and nothing could read it, which is why a second copy existed to drift from. `test/component-types.test.ts` uses it to fail the build when the generated list and the registry disagree, in either direction, so a stale committed generated file cannot be merged.
- **One `escapeHtml` in `src/core/escape.ts` replaces three private copies** in `src/app.ts`, `src/mcp/resource.ts` and `src/renderer/components/typography.ts`, plus an `escapeAttr` in the first of those. The four escaped three different character sets (`& < > "`, `& < >`, and `& "`). Each was correct for its own context, and `resource.ts` was deliberately splitting text-content from attribute escaping, so this was not a live vulnerability, but nothing enforced any of it. The shared function covers `& < > " '`, which is safe in element text and in attribute values of either quote style, so callers no longer reason about context. Note for anyone narrowing it later: `renderMarkdownToHtml` escapes each line *before* parsing link and image URLs, so the up-front escape is what neutralizes `"` in `href`/`src`; a text-content-only escape there would open an attribute break-out. `test/escape.test.ts` pins the character set.
- Scoped the `consistent-type-definitions` exception per-declaration for the two wire types rather than per-file as `src/mcp/types.ts` does. `src/app.ts` and `src/mcp/display.ts` are mostly domain types that should stay interfaces, so flipping either file would invert the default for the wrong declarations. Moving the two types into `src/mcp/types.ts` was considered and rejected: that file has no imports by design, and `PrefabWireFormat` needs `ComponentJSON`, `ActionJSON`, `ColorMode` and `LayoutHints`, which would also make it cyclic with `src/app.ts`.

- **Staging CI is now the org pattern: push to `dev` keeps a promote PR open, merging it releases.** `auto-pr.yml` creates or refreshes a standing `dev → main` PR on every push to `dev`, and `release.yml` gained an `on: push: branches: [main]` trigger, so shipping is a one-click merge instead of a hand-written PR plus a manual `workflow_dispatch`. Copied from the sibling implementation in `Max-Health-Inc/mcp-http` rather than calling `Max-Health-Inc/.github`'s reusable `create-pr.yml`: that repo is private and this one is public, and GitHub does not let a public repo consume a reusable workflow from a private one. Tests are not duplicated into the PR workflow, since `ci.yml` already runs on the same push and reports onto the PR.
- **A merge that documents nothing now skips the release instead of failing it.** `release.yml` splits into a `gate` job and a `release` job; the gate uses the new `--check` flag on `scripts/changelog-release.ts`, which reports `promoted` / `present` / `missing` on stdout, writes nothing and always exits 0. A README or CI-only merge to `main` therefore leaves `main` green rather than red, while an explicit `workflow_dispatch` with an empty `[Unreleased]` still fails loudly, because asking for a release and having nothing to ship is an error. `--check` was added to `mcp-http`'s port of this script and is ported back here, where the script originated. Note the plain invocation was never a dry run: it rewrites `CHANGELOG.md` in place.
- **The release now merges itself back into `dev`.** The release commit promotes `[Unreleased]` to a version heading on `main`; leaving `dev` behind means its still-open `[Unreleased]` and `main`'s new heading differ only in where the heading sits, so git's line-based merge files `dev`'s newer entries under the *older* release heading. That silently attributes unshipped work to a published version and empties `[Unreleased]`, so the next merge skips its release. It happened between v0.3.6 and v0.3.7 and had to be repaired by hand. The sync step is best-effort and never fails a completed release; a conflict is reported in the run summary instead.
- Bumped `softprops/action-gh-release` to v3, which clears the Node 20 deprecation warning the v0.3.7 release run emitted.
- Bumped `actions/checkout` to v7 (six call sites across `auto-pr`, `ci`, `docs`, `publish` and `release`) and `actions/setup-node` to v7. Both were two majors behind. `setup-node` v7 drops its dummy `NODE_AUTH_TOKEN` export, which `publish.yml` never relied on: it publishes through OIDC trusted publishing (`id-token: write` plus `npx npm@latest publish --provenance`), the pattern that release documents. `oven-sh/setup-bun@v2` and `peaceiris/actions-gh-pages@v4` are on their current majors and unchanged.
- **Added `.github/dependabot.yml`, targeting `dev`.** Now that `release.yml` runs on `push: branches: [main]`, a Dependabot PR merged to `main` would cut a release for a routine bump, so the updates land on `dev` and ship through the standing promotion PR. Grouped per ecosystem, one PR a week each. Adapted from the sibling config in `mcp-http`, with a correction: TypeScript major bumps are ignored because `typescript-eslint@8.65.0` declares `peer typescript: >=4.8.4 <6.1.0` (verified against the installed tree, on `typescript` 6.0.3), and a grouped PR that fails every week would block the other dev-dependency updates. Worth knowing that the cap is `<6.1.0`, so even a minor bump to 6.1 falls outside the supported range.

### Docs

- **The npm package page now links to `https://maxhealth.tech/prefab` as its homepage.** `package.json` carried no `homepage`, so npm fell back to `repository` + `#readme` and sent every visitor to the raw README on GitHub instead of the documentation site. `bugs.url` is set alongside it, which npm was likewise deriving from `repository`. Both fields are read from the published tarball, so the listing only changes on the next release.
- Removed a stale README blockquote that restated the superset relationship six lines below the tagline already stating it, and pinned it to upstream `v0.19.1`. That pin predated 0.3.0's catch-up to upstream 0.20.x and contradicted the wire-format reference. The chart-formatting caveat it carried still lives in the Chart Formatting section, next to the props it describes.

## [0.3.7] — 2026-08-01

### Fixed

- **The MCP protocol types could not be returned to an SDK handler without a cast.** Every shape in `src/mcp/types.ts` was an `interface`, and the SDK's result types are passthrough (`{ [x: string]: unknown }`). TypeScript grants an implicit index signature only to aliases of object types, never to interfaces, whose key set is not final because declaration merging can reopen them ([microsoft/TypeScript#15300](https://github.com/microsoft/TypeScript/issues/15300), closed as by-design), so returning a `McpResourceReadResult` from a `resources/read` handler failed with "Index signature for type 'string' is missing" — the one thing the type exists for. They are all type aliases now. `McpToolResult` was unaffected because it carries an explicit index signature. Verified against `@modelcontextprotocol/server` 2.0.0 rather than a stand-in, and guarded by `test/mcp-types.test.ts`, which fails `typecheck` (not at runtime) if any of them reverts to an interface.
- `McpTextResourceContents`, `McpBlobResourceContents`, `McpImageContent` and `McpResourceContent` are now exported from the package root, not just from `/mcp`. `McpResourceReadResult`'s default type parameter references the contents types, so naming it from a root import was impossible.

### Internal

- Scoped `consistent-type-definitions` to `'type'` for `src/mcp/types.ts` only. The repo default stays `'interface'`, which matches the prevailing TypeScript style and typescript-eslint's own recommendation; flipping all 151 interfaces in `src/` would be churn for a problem that only bites where a type must satisfy a foreign passthrough shape. Scoping it means the linter enforces the correct form for anything added to that file rather than pushing the next author into the bug and then into a per-line disable.

## [0.3.6] — 2026-07-31

### Fixed

- **A scheme set on the prefab container, rather than on `<html>`, now flips prefab's own tokens too.** `setThemeAttrs` themes the mount container (`applyMode` sets both it and `documentElement`, and `createThemeToggle({ syncDocument: false })` sets *only* the container), and the compiled wire theme has always matched at any depth via `.dark, [data-theme="dark"]`. But every scheme block in `prefab.css` was gated on `:root[…]`, so the two sheets disagreed about depth: a container-scoped toggle applied the theme's dark values over prefab's *light* `--background` and `--foreground`, a half-flipped panel. The base sheet's explicit dark and light blocks now carry the same three selectors the compiled theme emits (`:root[data-theme=…]`, the bare attribute, and the `dark`/`light` class), so both flip on the same element. The `:root[…]` branch is retained, so root-level behaviour and its specificity tie against the `prefers-color-scheme` block are unchanged; only elements below the root gain the tokens they were already asking for. Two schemes on one page work as a consequence.
- **Inline `Svg` authored without `xmlns` now renders.** `renderSvg` parses with `DOMParser` `image/svg+xml` (strict XML), where a missing `xmlns` produced namespace-less elements that rendered at 0×0. The renderer now injects `xmlns="http://www.w3.org/2000/svg"` when it's absent (`xmlns` is optional in HTML, so authors routinely omit it).
- The MCP Apps `ui/initialize` handshake reported a stale hard-coded app version (`0.2`) in `appInfo`. It now uses the real package `VERSION`, so a host sees the actual prefab version. (This is the *app/package* version, distinct from the `0.3` wire-format version in `$prefab.version` and the `2026-01-26` MCP Apps protocol version.)

- **Object values no longer render as `[object Object]`.** Every value that reaches a table cell, chart label, axis tick, tooltip title, heading, `{{ }}` interpolation or state-bound form input is typed `unknown` (it comes from JSON), and each site coerced it with a bare `String()`. Objects and arrays of objects therefore rendered as `[object Object]`. All of those sites now go through the new `stringifyValue` helper, which emits compact JSON for objects (honouring `toJSON()`), ISO strings for dates, and comma-joined members for arrays.
- **Identity comparisons on object values no longer collide.** `DataTable` row-selection highlighting, the `find:` pipe's key map and `Collection.firstKey()`/`lastKey()` used the same `String()` coercion to build lookup keys, so *every* object value produced the identical key `[object Object]` and matched every other object. They use `stringifyValue` now, which is injective for distinct JSON values.

- **Custom pipes now work in hosts whose CSP forbids eval.** Wire pipes arrive as function source and were always hydrated with `new Function()`, which throws in a sandboxed iframe or VS Code webview without `'unsafe-eval'`, so every custom pipe silently degraded to the raw value. A pipe that is already registered locally (by a companion script loaded through `rendererHtml({ scripts })`) is now kept instead of being re-evaluated, so pre-registering is all it takes. The eval failure is also reported once per mount with an actionable message, rather than once per pipe as an opaque `EvalError`.
- **`registerViewerResource` emits the cache fields required by protocol revision 2026-07-28.** `resources/read` results extend `CacheableResult` (SEP-2549), and a result without `ttlMs`/`cacheScope` falls back to `{ ttlMs: 0, cacheScope: 'private' }`, meaning the viewer was re-fetched on every render. The viewer HTML is a pure function of the package version (the CDN base pins it), so it now ships `{ ttlMs: 86_400_000, cacheScope: 'public' }`, overridable via the new `cache` option and validated so an out-of-range value throws instead of being silently discarded.
- **`registerViewerResource` prefers `registerResource()` over the retired `resource()` overload.** `resource()` is deprecated in SDK v1 and gone in `@modelcontextprotocol/server` v2; `resource()` is now only a fallback, and a server exposing neither raises a clear `TypeError`.

### Added

- **`rendererHtml({ themeBridge: 'vscode' })` and the same option on `registerViewerResource`.** `prefab.css` resolves each token as MCP Apps host variable, then VS Code webview variable, then static default, so a host that defines the MCP Apps `--color-*` variables shadows the VS Code ones entirely and the viewer stops following the user's editor theme. The bridge emits a `<style>` block after `prefab.css` re-declaring the affected tokens with `--vscode-*` first and the MCP Apps layer dropped, keeping prefab's own fallbacks so nothing changes outside VS Code. Head order is the contract: base theme, bridge, then the caller's `stylesheets`. It covers `:root` and the `prefers-color-scheme: dark` block but deliberately not `:root[data-theme="dark"]`, which is the standalone dark palette (host theming cascades, the manual toggle does not). `VSCODE_BRIDGE` is the exported mapping table, and `test/theme-bridge.test.ts` cross-checks every entry against `prefab.css` so the bridge cannot drift from the theme it overrides.
- `registerViewerResource` declares the `io.modelcontextprotocol/ui` extension capability (SEP-2133) on the server, since MCP Apps is an extension to the core protocol rather than part of it. Opt out with `declareCapability: false`. Registering on an already-connected server logs a warning instead of throwing, and still registers the resource. (This entry said `…/apps` while the constant held that value; both are corrected. `…/ui` is what the MCP Apps spec defines and what `ext-apps` exports as `EXTENSION_ID`, so the old value declared the capability under a key no host looks up. Never published, so there is nothing to migrate.)
- `toolResult(payload)` builds the MCP tool-result envelope (`content[0].text` plus `structuredContent`) that the `display_*` helpers return, exported for handlers that already have wire JSON and were hand-rolling the same shape.
- New MCP protocol types: `McpCacheScope`, `McpCacheHint`, `McpResourceReadResult`, `ResourceConfig`, `ResourceReadHandler`, and `MCP_APP_MIME` / `APPS_EXTENSION` / `DEFAULT_VIEWER_CACHE` constants.

### Internal

- Tracked `brandc` 0.6.0, which stops `@property`-registering the scheme-dependent colour tokens so their `light-dark()` resolves against the element that reads it rather than once at `:root` (max-network/brandc#14). That only changes `toCss` output, which prefab does not consume — it compiles its own CSS from the wire `theme` — so the drift guard passes unchanged. Worth knowing anyway, because `setThemeAttrs` accepts any element: a host that themes a container rather than `documentElement` now gets the subtree themed correctly if it loads brandc's stylesheet.
- Added `stringifyValue` (`src/core/stringify.ts`, exported from the package root) as the single value-to-string coercion for display and identity, replacing 34 ad-hoc `String(unknown)` call sites across 11 modules.
- Bumped dev tooling: `eslint` 10.8.0, `typescript-eslint` 8.65.0, `happy-dom` 20.11.1, `@types/bun` 1.3.14, `jiti` 2.7.0, `typedoc` 0.28.20, `vitepress-plugin-llms` 1.13.4. The `typescript-eslint` bump is what surfaced the `String(unknown)` and `cacheScope` defects above, via `no-base-to-string` and `no-unnecessary-condition`.
- Centralized `VERSION` and `PROTOCOL_VERSION` into `src/core/version.ts` (a zero-import single source of truth) so the lean renderer bundle can read the version without pulling in the builder. `release.yml` now bumps that file.
- `structuredContent` on `McpToolResult` is now a type parameter carrying the payload type (SEP-2106 loosened the field to any JSON value), which removed the five `as unknown as Record<string, unknown>` casts in the display helpers and lets callers read the wire back without casting.
- Split `src/mcp/display.ts` (606 lines) into `display.ts` (the builders), `resource.ts` (`ui://` registration, CSP meta, viewer HTML) and `result.ts` (the shared envelope). All five `display_*` builders constructed the same envelope inline; they now share one, so protocol-level result fields have a single home.
- Confirmed `resultType` (SEP-2322) is not ours to set: `@modelcontextprotocol/server` treats it as a wire-only key, stamps it at its 2026-era encode seam and strips it before results reach consumers, which is why its public result types omit it. The one handler-authored case is `resultType: 'input_required'` for multi-round-trip results, which no display helper produces.
- Tracked `brandc` 0.5.0, which declares the token contract explicitly instead of deriving it from one brand (max-network/brandc#13, filed from prefab's side while writing the guard below). The guard now iterates the exported `BRANDS` rather than naming brands, splits scalars from colours using `CONTRACT_SCALARS`, and adds two checks the new API makes possible: prefab reads no token that left the contract (`DEPRECATED_TOKENS`) and none of any brand's private extras (`brandExtras`), either of which would tie prefab to a single brand.
- Pinned prefab's design tokens to the shared `brandc` contract with a drift guard (`test/brand-contract.test.ts`). All 30 token names `prefab.css` defines are already contract names, so the test asserts that and the reverse direction: every token prefab reads is covered by each shipped brand, in `:root` for scalars and in both schemes for colours. brandc is a devDependency only. prefab keeps zero runtime dependencies, and the token *values* stay as host-adaptive `var()` fallback chains (MCP Apps var, then VS Code var, then static default) rather than adopting brandc's literal `oklch()` values, which would break host theming and change the default look. `toPrefabTheme()` already emits prefab's exact wire `theme` shape, so a brand drives prefab with no adapter.
- `test/fixtures/run_fixtures.py` skips regeneration with a notice when the `prefab_ui` Python package is absent, instead of failing and blocking `bun run test`. Its status output is also written as UTF-8, since a cp1252 Windows console raised `UnicodeEncodeError` from inside the error handler and masked the real failure.

### Docs

- Rewrote the playground example descriptions in plain language for first-time viewers, dropping internal jargon (`Define`/`Use`/`Condition`, `display_update`, "mock MCP tool", `onChange`/`setState`, "wire format") in favor of what the user sees and does. The Composition example is restructured into two labeled sections with natural labels ("Grade:", "Note:") instead of "Condition:" / "If / Elif / Else:".

## [0.3.5] — 2026-07-22

### Fixed

- `validateWireFormat` no longer false-flags legitimate component slots. `trigger` (Dialog), `empty` (Detail/MasterDetail), `else` (Condition), and `summary` (ExpandableRow) are read by the renderer as component nodes, so they are no longer reported as misplaced children.
- **`Popover` and `HoverCard` now accept a `trigger` component** (like `Dialog`). Previously they rendered all children into hidden content with no visible trigger, so there was nothing to click or hover. The `trigger` is rendered as the always-visible target; `children` are the content.
- **`Slot` now receives injected content from `Use`.** A `Use` node's own `children` fill the default slot, and a `slots` map fills named slots, so a `Slot` inside a `Define` template renders the caller's content instead of only its fallback.

### Docs

- Added playground showcase examples: **Chart Gallery** (all six chart types as native SVG), **Analytics Dashboard** (KPI metrics, charts, tabs, and range controls driving reactive state), and **Interactive Components** (Dialog, Accordion, and Switch/Slider bound to a live readout).
- Added **MCP app examples** with an in-page mock MCP server, so the playground demonstrates the round-trip (not just on-demand rendering): **MCP: Tool Call** (`callTool` → `display_update`, server-authoritative counter), **MCP: Form → Tool** (form submit → tool → updated list), and **MCP: Live Data** (`Subscribe` with polling fallback → live metrics and chart). Modeled on the `_action` + `chess://` subscription pattern from real prefab MCP apps.
- Added coverage-filling examples that raise demonstrated component coverage from ~37% to ~60%: **Master / Detail** (`MasterDetail` + `Detail` + selection), **Form Controls** (`RadioGroup`, `Combobox`, `DatePicker`, `Switch`, `Slider` with a live readout), **Composition & Control Flow** (`Define`/`Use` template reuse + `Condition` + `If`/`Elif`/`Else`), and **Content & Media** (`Markdown`, `Code`, `Kbd`, inline `Svg`, `Ring`, `Sparkline`, `RadialChart`, `Histogram`, `Tooltip`, `Carousel`).
- Corrected the playground's AI system prompt: it now teaches the `0.3` wire format, the real component and action set, control flow, and pipes, replacing the stale `0.2` guidance (`showToast` `title`, `appendState` `item`, and non-existent components).

### Internal

- Expanded regression coverage with TDD probes across formatting pipes, expressions, state ops, `ForEach`, the semantic `Table`, `DataTable` interactions (accessor, row click, search), and chart edge cases (empty data, single point), alongside tests for the `Popover`/`HoverCard`/`Slot` fixes above.

## [0.3.4] — 2026-07-22

### Fixed

- Action dispatch failures are no longer silent. Every fire-and-forget handler (`onClick`, `onMount`, `onChange`, `onSubmit`, `onRowClick`, keyboard bindings, interval ticks, and `display_update` actions) now routes rejections through the logger via a new `fireAndForget` helper, so a throwing action surfaces instead of vanishing. The async actions (`toolCall`, `fetch`, `callHandler`, `subscribe`) report through a shared `reportActionError`: at `debug` when an `onError` handler is wired, at `warn` when none is, so an unhandled failure is never fully quiet.

### Internal

- The release workflow now requires a changelog entry: it fails if `## [Unreleased]` has no entries for the version about to ship, and otherwise promotes that section to the new version heading (`scripts/changelog-release.ts`). This keeps the changelog from drifting behind published releases.

## [0.3.3] — 2026-07-22

### Added

- **Centralized logger** (`src/core/logger.ts`), zero runtime dependencies. Mirrors the `@maxhealth.tech/utils` `createLogger` contract (scoped `error`/`warn`/`info`/`debug`, `[prefab]` / `[prefab:scope]` prefix) and adds a runtime `setLogLevel()` so an embedding host can mute or raise prefab's console output. All internal `console.*` calls now route through it. New exports: `createLogger`, `log`, `setLogLevel`, `getLogLevel`, `LogLevel`, `Logger` (and `window.prefab.setLogLevel`).
- **Wire validation now catches silent authoring mistakes.** `validateWireFormat` flags child components placed under a non-`children` key (e.g. `then`/`else`/`body`), which the renderer never reads, and requires a non-empty `message` on `showToast`. `PrefabRenderer.mount()` runs validation and reports any problems as non-fatal console warnings (opt out with `{ validate: false }`), so a payload that renders nothing now tells you why. `validateWireFormat` / `isValidWireFormat` are also exported from the renderer entry.

### Fixed

- **DataTable renders primitive rows.** A table over an array of strings or numbers rendered blank cells, because `row[column.key]` is undefined on a primitive. A primitive row is now used directly as the cell value, so a plain string list displays.

### Docs

- Repaired the playground examples, each verified against the live renderer: Conditional UI declared its branches under a non-existent `then` key (renamed to `children`), Todo List could not display its string tasks through a DataTable (now a `ForEach` list), and the Contact form toast passed `title` instead of `message`. The playground's own toast handler read `t.title` (never present on `ToastEvent`) and now reads `t.message`. All example payloads bumped to wire version `0.3`.
- Reframed the project tagline across the README and the site description: from a declarative UI component library "wire-compatible with" PrefectHQ's Python `prefab-ui` to a full-stack framework and a superset of it.

## [0.3.2] — 2026-07-19

### Fixed

- **Badge no longer stretches to full width.** `.pf-badge` is `inline-flex`, but as a flex child it was blockified and stretched to the container's cross size (full width inside a column, full height inside a row). It now uses `align-self: flex-start` to stay intrinsically sized; an explicit `w-full` or width utility still overrides it.

### Docs

- **Playground preview text contrast.** The mounted preview inherited the playground chrome's light-gray text color, leaving content near-invisible on a light preview. The preview now applies the theme's `--foreground`.
- **Single-sourced the playground theme state.** The toolbar "Dark" checkbox and the renderer's floating theme toggle were independent (one toggled a class, the other set `data-theme` plus localStorage and document sync) and drifted apart. They now share one source of truth. The demo and playground CDN example pins were bumped from `@0.2` to `@0.3`.

## [0.3.1] — 2026-06-27

Documentation and tooling release. No runtime or API changes: `src/` is unchanged aside from the version bump, so the published bundle is functionally identical to 0.3.0.

### Fixed

- Corrected the wire-protocol version label across the user-facing docs. The README badge and tagline, the skill header, the homepage feature text, and a version-pin example still advertised `0.2`, but the library has shipped protocol `0.3` since 0.3.0 (the renderer still accepts legacy `0.2` payloads).

### Docs

- Deduplicated the Guide and Reference sections. Each reference topic now lives in one place, and the Guide pages are concise conceptual pages that link into the reference, removing a large amount of duplicated content.
- Single-sourced the example UIs. The demo and playground now load one canonical set of `$prefab` examples from `docs/public/examples/` at runtime instead of embedding their own copies, and the skill bundle's example assets are generated from that same set.
- The programmatic API reference (actions, rx, mcp, auto, renderer) is now generated from the source TSDoc with TypeDoc, so it stays in sync with the code. The component catalog, wire format, and MCP Apps pages remain hand-written.

## [0.3.0] — 2026-06-16

### Wire Format (Breaking) — protocol `0.3`

Catches up to upstream PrefectHQ/prefab v0.20.x ("Wire Transfer", PR #431). The `$prefab.version` envelope is now **`0.3`**. The renderer still accepts `0.2` payloads, so existing stored wire data keeps rendering.

- **New top-level `css` field** — an array of inline CSS blocks, injected as `<style>` tags. The **theme is now compiled into this array** (`:root` for light, `.dark, [data-theme="dark"]` for dark) instead of shipping a structured `theme` object; `PrefabApp.toJSON()` no longer emits a `theme` key. New `compileThemeCss()` / `ThemeVars` exports expose the compiler.
- **`stylesheets` redefined as external URLs** — rendered as `<link rel="stylesheet" href="…">`. The renderer keeps a heuristic that still injects inline CSS found in `stylesheets` as `<style>` for backward compatibility with `0.2` payloads.
- **New top-level `mode` field** (`'light' | 'dark'`) — forces a color scheme. The renderer applies it via both the `data-theme` attribute and the `dark`/`light` class (so upstream-compiled `.dark {}` CSS resolves), and `toHTML()` stamps it on `<html>`.
- **`PrefabApp` / `DisplayOptions`** gain `css` and `mode` options; `display()` merges `css` (concatenated) and `mode` (override) like the other options.
- `toHTML()` now emits `css`/`stylesheets`/`mode` into `<head>` and strips them from the embedded JSON to avoid double-injection (mirrors upstream `html()`).

### Charts

- **`valueFormat` parity (PR #454)** — added the canonical `valueFormat` prop to cartesian/pie/radial charts (value-axis ticks + tooltip values), matching upstream's field name so chart formats are wire-compatible in both directions. `yAxisFormat` / `yAxisRightFormat` remain TS-only overrides for dual-axis charts. The renderer reads `valueFormat` as the base format and treats `"auto"` as "no explicit format".
- **Pie/Radial/Scatter data-binding parity** — `PieChart` and `RadialChart` now use upstream's `dataKey` (value) + `nameKey` (label) model, and `ScatterChart` gains `xAxis`/`yAxis`/`zAxis` (z = bubble size). The legacy `series`/`xAxis` inputs are still accepted and mapped onto the canonical fields (**dual-accept**, non-breaking), and the Pie renderer reads both shapes — so these charts now round-trip with the Python renderer. New exports: `CategoricalChartProps`, `PieChartProps`, `ScatterChartProps`.
- **Native Radial, Scatter & Radar renderers** — replaced the "not yet supported" placeholders with real SVG renderers, so **every chart type now draws natively** (the fallback is gone):
  - `RadialChart` — concentric value arcs (muted track + coloured value), configurable `innerRadius`/`startAngle`/`endAngle`.
  - `ScatterChart` — points over min/max axes with optional grid, tooltips, and **bubble sizing** from `zAxis`.
  - `RadarChart` — one polygon per series over angular axes, with `axisKey` spoke labels, `filled`, and `showDots`; legacy `xAxis` maps to `axisKey`.
  - All honour `valueFormat`.
- **Refactor** — the chart renderers' shared toolkit (colours, axes, SVG primitives, value formatting, legend) was extracted into `chart-helpers.ts` to keep each renderer file under the 700-LOC limit.

### Internal

- **DRY theme compilation** — `applyTheme()` (the legacy `theme`-object path) now routes its dark block through the same `compileThemeCss()` the wire path uses, so both paths emit byte-identical dark CSS. The CSS sanitizers are shared too.

> **Fixtures verified against upstream.** Golden fixtures were regenerated from upstream `prefab-ui` **0.20.2**: 9/10 are byte-identical to the previous `0.2` fixtures apart from the version bump (confirming parity, and that upstream emits `0.3`). The 10th (chart) now carries upstream's `valueFormat`, which the builder also emits.

## [0.2.40] — 2026-05-15

### New Features
- **`onHostContextChanged` callback** — `PrefabApp` now exposes `onHostContextChanged((ctx) => {...})` so components can react to arbitrary fields in `ui/notifications/host-context-changed` (e.g. refreshed access tokens, locale, custom app config). The existing `prefab:theme-update` event continues to fire for backward-compat theme handling (closes #14)
- **`prefab:host-context-changed` bridge event** — the bridge now dispatches the full params object from `host-context-changed` as a separate `prefab:host-context-changed` event, in addition to the existing `prefab:theme-update`

## [0.2.39] — 2026-05-10

### New Features
- **`display_update()` actions** — `display_update()` now accepts an optional `actions` parameter to fire actions alongside state deltas. Actions execute after the state is merged into the store (closes #13)
  ```ts
  display_update(
    { 'game.turn': 'b', 'game.fen': '...' },
    { actions: [new SendMessage("Your turn. Pick a move.")] }
  )
  ```

## [0.2.38] — 2026-05-09

### Bug Fixes
- **Fixed**: `display()` now merges options into an existing `PrefabApp` instance — previously `state`, `stylesheets`, `theme`, `layout`, `pipes`, and all other options were silently discarded when a `PrefabApp` was passed. State and defs are shallow-merged (options win on conflict), stylesheets are concatenated, and scalar options (theme, layout, cssClass, onMount) fall back to the app's value (closes #12)

## [0.2.37] — 2026-05-09

### New Features
- **Reactive `cssClass`** — `cssClass` now accepts `RxStr` (reactive expressions) on all components. Use `rx()` to dynamically set CSS classes based on state (closes #11 part 1)
- **`onClick` on all components** — `Div`, `Span`, `Column`, `Row`, `Grid`, `GridItem`, `Container`, and all other components now support `onClick` actions. Non-button elements automatically get `role="button"`, `tabindex="0"`, and keyboard (Enter/Space) support for accessibility (closes #11 part 2)

## [0.2.36] — 2026-05-09

### Bug Fixes
- **Fixed**: Subscribe `onDataCallback` no longer clobbers merged state with raw response data — when `display_update()` merges a state delta via `applyPrefabUpdate()`, `store.set(stateKey, data)` is now skipped, preventing `stateKey` collision with delta keys (closes #10)
- **Fixed**: ESLint config now ignores `docs/` (VitePress cache/dist) and `eslint.config.ts` — previously caused 60 spurious parsing errors

## [0.2.35] — 2026-05-09

### Bug Fixes
- **Fixed**: `display_form()` now forwards all `DisplayOptions` — `layout`, `cssClass`, `stylesheets`, `pipes`, `onMount`, `keyBindings`, and `defs` were silently dropped (only `state` and `theme` worked). `DisplayFormOptions` now extends `DisplayOptions`
- **Fixed**: `display_success` / `displaySuccess` and `DisplaySuccessOptions` are now exported from the package entry point

## [0.2.34] — 2026-05-09

### Bug Fixes
- **Fixed**: Subscribe fallback poll handler now detects `$prefab` responses — poll results containing full views trigger `remount()`, and `display_update` payloads merge state into the store. Previously poll results were stored as raw data, leaving the DOM frozen (closes #9)

## [0.2.33] — 2026-05-09

### Bug Fixes
- **Fixed**: `display()` now forwards `stylesheets` and `pipes` options to `PrefabApp` — previously these were silently dropped since `DisplayOptions` didn't include them (closes #8)

## [0.2.32] — 2026-05-09

### Bug Fixes
- **Fixed**: `If()` / `Elif()` shorthand now correctly detects `Rx` expression objects — the previous inline type check only matched strings and `Ref` (subscribe), silently treating `Rx({ expression })` as a props object
- **Fixed**: Action handlers (`toolCall`, `callHandler`, `fetch`) now handle `display_update()` state delta payloads (`{ $prefab, update: { state } }`) by merging into the store — previously these were silently dropped while `onToolResult` in auto-mount already handled them correctly (closes #7)

## [0.2.31] — 2026-05-09

### New Features
- **CallTool structuredContent remount** — when a `toolCall`, `callHandler`, or `fetch` action returns a full prefab view (`{ $prefab, view }`), the renderer remounts with the new view instead of just storing the raw result (#7)
  - Supports direct payloads, MCP `structuredContent` wrappers, and `content[].text` JSON blocks
  - Preserves existing store state across remounts
  - Handles pipes, stylesheets, layout hints, key bindings, defs, and theme on remount

## [0.2.30] — 2026-05-09

### Bug Fixes
- **Fixed**: Reverted serializer output back to **camelCase** (`cssClass`, `onMount`, `onClick`, `resultKey`, etc.), matching the upstream PrefectHQ/prefab wire format (`by_alias=True`). The snake_case serializer in v0.2.28 was a breaking change based on an incorrect assumption about the wire spec.
- **Kept**: Renderer normalization layer — `renderNode()` and `dispatchOne()` accept **both** snake_case and camelCase input, so Python-SDK-generated wire data still renders correctly.
- **Fixed**: `autoTable` column keys now match raw data keys (no `toCamelCase` conversion) — snake_case row keys like `proposed_start` render correctly without column/key mismatch.
- **Fixed**: `cdnBase()` now uses the **exact** version (`@0.2.30`) instead of a semver range (`@0.2`) — eliminates stale jsDelivr cache serving old renderer bundles after a new patch publish (closes #6)

## [0.2.29] — 2026-05-09 *(unpublished — included the faulty snake_case serializer from v0.2.28)*

### Bug Fixes
- **Fixed**: `rendererHtml()` CDN URL now derives major.minor from `VERSION` automatically — no more hardcoded `@0.2` constant that would go stale on a minor/major bump

## [0.2.28] — 2026-05-09 *(unpublished — snake_case serializer was a breaking change, reverted in v0.2.30)*

### New Features
- **`Subscribe` action** — real-time resource updates via `subscribe(uri, stateKey, opts)` with automatic fallback polling when the host doesn't support MCP `notifications/resources/updated` (#3)
  - Supports `fallbackInterval`, `fallbackTool`, `fallbackArgs` for polling-based hosts
  - `onData` / `onError` callbacks for reactive state binding
- **`PdfViewer` component** — embed PDF documents with `pdfViewer(src, opts)` (#2)

### ~~Wire Format (Breaking)~~
- ~~**snake_case wire format** — all structural keys in the `$prefab` JSON output are now snake_case~~ *(reverted in v0.2.30)*
- Renderer normalizes incoming JSON at entry points (`renderNode`, `dispatchOne`), accepting both snake_case and camelCase input for backwards compatibility
- User-data containers (`state`, `arguments`, `context`, `overrides`) are **not** converted — keys inside them are preserved as-is

### Bug Fixes
- **Fixed**: `fallbackArgs` reactive expressions now resolve correctly in Subscribe action
- **Fixed**: resilient cleanup for Subscribe timers and listeners
- **Fixed**: chart series structural keys (`dataKey` → `data_key`) now correctly serialized
- **Fixed**: `PrefabApp.toJSON()` root view outputs `css_class` (was bypassing `Component.toJSON()`)
- **Fixed**: wire format validator accepts both camelCase and snake_case action prop names

### Documentation
- SEO & LLM visibility improvements for documentation site

### Tests
- 22 new TDD tests for snake_case serialization and renderer normalization
- All 10 golden fixtures updated to snake_case wire format
- **1237 tests** passing across 36 files

## [0.2.27] — 2026-05-02

### Bug Fixes
- **Fixed**: `resourceMeta()` now serializes permissions as `{}` (empty objects) per the MCP Apps spec, not `true`. The DX-facing input type stays `boolean` for ergonomics; the wire output is now spec-compliant with `McpUiResourcePermissions`

## [0.2.26] — 2026-05-02

### New Features
- **`rendererHtml(opts?)`** — generates the viewer HTML page string for MCP Apps resources (loads `prefab.css` + `renderer.auto.min.js` from CDN, with optional extra scripts/stylesheets)
- **`registerViewerResource(server, opts?)`** — one-liner to register a `ui://` viewer resource with correct MIME type, CSP (auto-merged with jsdelivr default + script origins), Permission Policy, and `_meta` on both listing and content item
- **`PREFAB_RESOURCE_URI`** — default URI constant (`'ui://prefab/viewer'`)
- All three exported from both `@maxhealth.tech/prefab/mcp` and the main barrel

### Documentation
- Corrected CSP/permissions claims about Claude Desktop (it DOES enforce CSP via HTTP headers on `{hash}.claudemcpcontent.com`)
- Corrected cross-server tool call claim (spec says `"app": Tool callable by the app from this server only`)
- Updated host compatibility table (all hosts enforce CSP)
- Added `registerViewerResource()` shortcut section to `docs/reference/mcp-apps.md`
- Added `rendererHtml()`, `registerViewerResource()`, `PREFAB_RESOURCE_URI` reference docs to `docs/reference/mcp-display.md`

### Tests
- 15 new tests for `rendererHtml()`, `registerViewerResource()`, `PREFAB_RESOURCE_URI` (security escaping, CSP merging, handler invocation)
- Comprehensive layout hints test coverage (bridge, renderer combos, passthrough, HTML/MCP round-trip)
- **1174 tests** passing across 32 files

## [0.2.25] — 2026-04-30

### Layout Hints
- **New**: `LayoutHints` type — `preferredHeight`, `minHeight`, `maxHeight` (px) for declarative host container sizing
- `PrefabWireFormat.layout` — new optional field in the `$prefab` wire format
- `PrefabAppOptions.layout` — set directly on the app constructor
- `DisplayOptions.layout` — set via `display(view, { layout: { preferredHeight: 600 } })`
- Renderer applies `height` / `min-height` / `max-height` + `overflow: auto` as inline styles on the mount root
- `Bridge.notifyPreferredSize()` — emits `ui/notifications/preferred-size` (JSON-RPC) or `prefab:preferred-size` (prefab protocol) to the host on mount
- Auto-mount (`renderer.auto.min.js`) forwards layout hints automatically when wire data contains a `layout` field

### CSS Utilities
- **Added**: `max-h-*` utility classes (`max-h-48`, `max-h-64`, `max-h-80`, `max-h-96`, `max-h-full`, `max-h-screen`, `max-h-none`)

### Bug Fixes
- **Fixed**: `DOM.Iterable` added to tsconfig `lib` — resolves `NodeListOf` iteration errors in strict mode
- **Fixed**: null-safe `.textContent` access in `data.ts` (DataTable search) and `form.ts` (Combobox filter)
- **0 tsc errors**, **1149 tests** passing across 32 files

## [0.2.24] — 2026-04-30

### Utility Classes
- **Added**: ~200 Tailwind-compatible utility classes in `prefab.css` — auto-renderers no longer require Tailwind CSS
- Categories: display, flexbox, gap, padding (px/py/pt/pb/pl/pr scales), margin (mx/my/mt/mb/ml/mr scales), width, height, max-width (xs–7xl), typography (text-xs–4xl, font weights, alignment, line-height, tracking), theme-aware text/bg colors, borders, rounded, shadows, overflow, position, z-index, opacity, cursor, transitions, sr-only

### Theme Fix
- **Fixed**: reverted to v0.2.20 theme behaviour after regressions in v0.2.21/v0.2.22
- `applyHostTheme()` sets `data-theme` from host `colorScheme` again — toggle works correctly in hosted mode
- `syncVsCodeTheme()` restored for standalone VS Code webviews (reads `data-vscode-theme-kind`, MutationObserver)
- `[data-theme]` blocks use static values only (no host var references) — prevents both blocks resolving identically

## [0.2.22] — 2026-04-29

### Host Theme Adaptation
- Separated host theming from toggle: `applyHostTheme()` no longer sets `data-theme`
- Removed `syncVsCodeTheme()` (later restored in v0.2.23)

## [0.2.21] — 2026-04-29

### Host Theme Adaptation
- **Fixed**: hosted mode (Claude Desktop / VS Code) now adapts to host theme colors correctly
- `applyHostTheme()` no longer sets `data-theme` — host's inline CSS variables resolve through the `var()` fallback chain in `:root` / `@media dark` blocks automatically
- Removed `syncVsCodeTheme()` — VS Code's `--vscode-*` vars resolve through the same chain without needing `data-theme`
- `[data-theme]` blocks use static values only and are reserved for the standalone manual toggle
- Architecture: hosts control theme via inline vars (cascade), standalone controls via `data-theme` (static) — no conflict

## [0.2.20] — 2026-04-29

### Theme Toggle Fix
- **Fixed**: dark/light toggle icon flipped but colours didn't change — `@media (prefers-color-scheme: dark) :root:not(...)` at specificity (0,2,0) beat `[data-theme]` at (0,1,0). Bumped to `:root[data-theme="dark/light"]` (0,2,0) so toggle wins by source order

### VS Code Theme Sync
- `syncVsCodeTheme()` — reads `data-vscode-theme-kind` from `document.body`, maps to `data-theme` on `:root` (`vscode-dark` / `vscode-high-contrast` → `dark`, else `light`)
- `MutationObserver` watches for VS Code theme switches and keeps `data-theme` in sync automatically
- Only active in standalone / VS Code context (skipped when MCP Apps bridge is present)

### Tests
- Added `renderer-destroy.test.ts` — 12 tests for component destroy hook lifecycle
- **1142 tests** passing across 32 files

## [0.2.19] — 2026-04-29

### SDK Type Compatibility
- `McpToolResult` now structurally assignable to `@modelcontextprotocol/sdk` `CallToolResult` — no cast needed when returning `display()` from SDK tool handlers
- Added `[key: string]: unknown` index signature (satisfies SDK's `Result` base)
- Split `McpResourceContent.resource` into discriminated union (`McpTextResourceContents | McpBlobResourceContents`) matching SDK's `EmbeddedResource`
- Added optional `annotations?` and `_meta?` on all content types

### Host Theme Token Mapping
- **CSS fallback chain**: all design tokens in `prefab.css` resolve through 3 tiers — MCP Apps spec vars (`--color-background-primary`) → VS Code vars (`--vscode-editor-background`) → static defaults
- Applies to all theme blocks: `:root`, `@media (prefers-color-scheme: dark)`, `[data-theme="dark"]`, `[data-theme="light"]`
- Downstream MCP servers no longer need custom CSS for Claude Desktop or VS Code webview theming
- Added `--shadow-sm/md/lg` and `--border-radius-*` → `--radius` mapping from MCP Apps spec
- `applyHostTheme()` now injects host-provided `@font-face` / `@import` CSS from `styles.css.fonts` (idempotent `<style>` tag)
- `HostTheme.fontCss` field added; extracted from both `ui/initialize` and `ui/notifications/host-context-changed`

## [0.2.18] — 2026-04-29

### Builder API Improvements
- `display_success(title, body?)` — success-variant alert helper
- `resourceMeta(opts)` — build `_meta` for `resources/read` (CSP, permissions, domain, border)
- `PREFAB_CDN_META` — pre-built meta with jsDelivr CDN CSP for common deployments
- `structuredContent` on all display helpers (`display`, `display_form`, `display_update`, `display_error`, `display_success`)
- `PrefabApp.toMcpResult()` — returns `{ content, structuredContent }` for direct SDK tool handler return
- MCP actions: `RequestDisplayMode` action + `displayMode` option on `CallTool`
- New component support: `Embed`, `Markdown`, `Mermaid`, `CodeBlock` builder classes

### Tests
- **1130 tests** passing across 31 files

## [0.2.17] — 2026-04-28

### Auto-Resize
- `Bridge.setupAutoResize(el)` — `ResizeObserver` on the target element, notifies the host whenever the content dimensions change via `ui/notifications/size-changed` (JSON-RPC) or `prefab:size-changed` (prefab protocol). Mirrors the ext-apps SDK `autoResize: true` behaviour without the SDK dependency.
- `sendRpcNotification()` — fire-and-forget JSON-RPC notification (no `id`, no response expected)
- `PrefabApp.setupAutoResize(target)` — public API accepting selector or element
- `renderer.auto.min.js` now auto-observes `#root` after boot — hosts get size updates out of the box
- Deduplicates identical dimensions, fires initial notification immediately
- 4 new tests — **1130 total tests**

## [0.2.16] — 2026-04-28

### Docs
- Added `appInfo` vs `clientInfo` Common Pitfall section to `mcp-apps.md`
- Added ext-apps SDK vs native `ui/*` JSON-RPC comparison table
- Added ext-apps SDK source references to Reference section

## [0.2.15] — 2026-04-28

### Bug Fix: Claude Desktop / ChatGPT Breakage
- **Fixed**: `ui/initialize` handshake sent `clientInfo` instead of `appInfo` — hosts validate with Zod schema that requires `appInfo`, causing silent handshake failure (blank iframe, no error). The ext-apps SDK fallback in v0.2.11 masked this; removing the SDK in v0.2.12 exposed it.
- `Bridge.initialize()` error handling: `Promise.any` wrapped in try/catch, rethrows as descriptive `Error('Bridge init failed — no host responded')` with `{ cause }` preserving the `AggregateError`
- 2 new tests: `appInfo` field validation, clear error on dual-protocol failure — **1126 total tests**

## [0.2.14] — 2026-04-28

### Built-in Theme Toggle
- `createThemeToggle(root, options?)` — renders a floating sun/moon toggle button with two-way sync to `data-theme` attribute via `MutationObserver`
- `PrefabRenderer.mount()` auto-attaches toggle by default (opt out with `themeToggle: false`)
- Toggle preserved across re-renders

### Bug Fixes
- `appendState` action: support `item` alias (Python SDK compat)
- Charts: restore CSS custom properties in SVG presentation attributes for dark mode

## [0.2.13] — 2026-04-27

### Bug Fixes
- Renderer: remove all inline `theme-variable` styles, rely on CSS classes (CSP compliance)
- Badge: use `Partial<Record>` to satisfy `strict-boolean-expressions` lint rule
- Demo: fix theme toggle, favicon 404, copy-MCP-button styling
- Docs: inject CDN version from `package.json` at build time

## [0.2.12] — 2026-04-27

### Bundle Size Reduction
- **Removed** `@modelcontextprotocol/ext-apps` SDK dependency — 405 KB → 80 KB bundle
- Bridge now speaks native `ui/*` JSON-RPC without the SDK wrapper
- Docs updated to remove ext-apps references
- ⚠️ **Regression**: `clientInfo` field name broke Claude Desktop / ChatGPT (fixed in v0.2.15)

## [0.2.11] — 2026-04-27

### Theming
- `data-theme` attribute support in `prefab.css` — light/dark mode via attribute selector
- MCP agent skill: attach `prefab-skill.zip` to GitHub releases

## [0.2.10] — 2026-04-27

### Docs & Polish
- Select options shorthand syntax
- Remote usage mode documentation
- Brand assets, favicon, logo paths
- Playground: dark preview background
- Lint fixes: `Array<T>` → `T[]`, control char regex, `RegExp.exec`
- Markdown renderer: protect inline code from formatting, fix CRLF infinite loop
- DRY: `serializeCallbacks`, camelCase display aliases

## [0.2.9] — 2026-04-26

### Bug Fix
- `autoTable` column keys now match serialized row keys

## [0.2.8] — 2026-04-26

### Universal MCP Apps Bridge
- **Fixed**: `renderer.auto.min.js` now works in VS Code, Claude Desktop, ChatGPT, and all MCP Apps hosts without any inline adapter code
- `Bridge.initialize()` races `prefab:init` and `ui/initialize` JSON-RPC **in parallel** — whichever host protocol responds first wins. Eliminates the 1.5s dead time on JSON-RPC hosts
- `app()` now buffers `tool-result` events — host can send results before `onToolResult` is registered without data loss
- `auto.ts` defers `boot()` to `DOMContentLoaded` (or microtask if already loaded)

## [0.2.7] — 2026-04-25

### Chart Formatting
- Generic pipe formatting for chart axes and tooltips
- `tooltipXKey` — separate data key for tooltip vs x-axis labels
- Fix: remove non-null assertion in PieChart tooltip key lookup (lint)

## [0.2.6] — 2026-04-25

### Chart Tooltips
- Production-quality tooltips with crosshair, data dots, null gaps, a11y, touch support

## [0.2.5] — 2026-04-25

### Custom Renderers
- `registerComponent(type, renderFn)` exposed on `window.prefab` for custom component renderers

## [0.2.4] — 2026-04-25

### Chart Axes
- Y-axis, X-axis labels, grid lines, dual Y-axis support

## [0.2.3] — 2026-04-25

### JSON-RPC Protocol
- Native `ui/*` JSON-RPC protocol — zero-adapter VS Code support

## [0.2.2] — 2026-04-25

### Auto-Mount Bundle
- `renderer.auto.min.js` — CSP-safe self-executing bundle
- CI: attach `renderer.auto.min.js` + `prefab.css` to GitHub releases
- Wire compat: `callTool` action alias + `Condition` component

### Docs
- Signal, Collection, Ref, sugar actions, find/dot pipes, Detail/MasterDetail, CSS theme, versioned CDN
- Live playground (Monaco editor + shareable URLs + AI prompt)

## [0.2.1] — 2026-04-25

### Bug Fix: If/Elif/Else Conditional Chains
- **Fixed**: `Elif` and `Else` nodes rendered independently instead of being consumed by the preceding `If` chain
- New `renderChildArray()` detects `If/Elif/Else` sibling sequences as a single conditional chain
- 55 new tests — **913 total tests**

### Bug Fix: Browser Pipe Registration
- **Fixed**: Custom pipes registered in Node were not available in the browser renderer bundle
- `PrefabApp({ pipes })` accepts pipe functions, serializes source into wire format
- Renderer `mount()` hydrates wire pipes via `new Function()` before first render
- Built-in pipes cannot be shadowed by wire pipes (security)
- 12 new tests — **858 total tests**

## [0.2.0] — 2026-04-25

### Breaking: Wire Format v0.2
- `$prefab.version` bumped to `0.2`
- Initial release of the `0.2.x` series with all v0.1.x features plus the universal MCP Apps bridge

## [0.1.10] — 2026-04-24

### Action-Builder Sugar
- `set(signal, value)` — ergonomic wrapper for `new SetState(signal.key, value)`
- `toggle(signal)` — wrapper for `new ToggleState(signal.key)`
- `append(collection, item, index?)` — wrapper for `new AppendState(collection.stateKey, item)`
- `pop(collection, indexOrValue?)` — wrapper for `new PopState(collection.stateKey, indexOrValue)`, defaults to last element
- All helpers accept `Signal`, `Collection`, or raw `string` key via `StateTarget` type
- `set()` passes through `SetStateOpts` (onSuccess/onError callbacks)
- 17 new tests in `test/sugar.test.ts` — **846 total tests**

## [0.1.8] — 2026-04-24

### Reactive Primitives
- `signal(key, initial)` — named reactive scalar for wire format, auto-registers state
- `collection(key, rows, { key })` — named keyed array, auto-registers state
- `Ref<T>` — lazy pipe expression referencing a row in a collection via `collection.by(signal)`
- Typed `Ref.dot(field)` — returns `Ref<T[K]>` with autocomplete on `keyof T`
- `Ref.formatted(field, pipe, ...args)` — sugar for `.dot(field).pipe(pipe)`
- `Rx.pipe(name, ...args)` — public variadic pipe builder (was private single-arg)
- `Ref.pipe(name, ...args)` — delegates to `Rx.pipe()`

### Pipe Extension Point
- `registerPipe(name, fn)` — global custom pipe registry for companion packages
- `unregisterPipe(name)` — remove a pipe (tests)
- `listPipes()` — list registered names (debugging)
- Built-in pipes always shadow custom pipes (safety)
- Re-registration warns and overwrites (HMR-friendly)
- Custom pipes receive variadic parsed args (`| date:'long'`, `| between:1,10`)

### Selection & Master-Detail
- `DataTable({ from, selected })` — auto-wires `rowKey`, `onRowClick → SetState`, highlight
- `Detail({ of, empty, children })` — conditional pane, shows children when ref resolves
- `MasterDetail({ masterWidth, gap, children })` — two-pane flex layout
- `col()` descriptor overload: `col({ key, header, format, accessor, sortable })`
- `format` on columns applies pipe (built-in or custom) to cell values
- `accessor` on columns resolves pipe expressions per cell (`name | humanName`)

### Auto State Collection
- `signal()` and `collection()` factories auto-register into a global collector
- `PrefabApp` constructor drains collector — no more `state: { ...c.toState(), ...s.toState() }`
- Explicit `state` overrides auto-collected on key conflicts
- Duplicate state keys warn (`[prefab] state key "X" registered multiple times`)
- `resetAutoState()` exported for test cleanup

### Renderer
- `find` pipe filter — O(1) keyed lookup with generation-aware cache
- `dot` pipe filter — extract property from object
- `Store.generation` counter — monotonically increasing, invalidates find cache on mutation
- `applyFilter` falls through to custom pipe registry after built-ins
- `RxStr` widened to `string | Rx | Ref` — Ref works in all component props

### Bug Fixes (TDD)
- `find` pipe: numeric key coercion (`'2' !== 2`) — fixed with `String()` on both sides
- `find` pipe: scope dot-path resolution (`$item.managerId`) — walk scope object
- `find` cache: stale after in-place mutation — fixed with generation counter
- `Detail`: `0` treated as truthy — added explicit `!== 0` check
- `col({ format })`: built-in pipes silently ignored — route through `applyFilter`
- `col({ accessor, format })`: double-applied formatting — skip format when accessor present
- Duplicate auto-state keys: silent overwrite — now warns

### Tests
- 829 tests passing across 24 files
- New: `test/signal-collection.test.ts` (67 tests)
- New: `test/pipes.test.ts` (17 tests)
- New: `test/tdd-bugs.test.ts` (6 tests)

## [0.1.0] — 2026-04-20

Initial release.

### Component Library
- Core classes: `Component`, `ContainerComponent`, `StatefulComponent`
- `PrefabApp` wrapper with `$prefab` v0.2 wire format and `toHTML()` self-contained page export
- `rx()` reactive expression builder (pipes, comparisons, ternary, built-in vars)
- 80+ components across layout, typography, card, data, form, chart, control, interactive, media, alert
- Table components: `Table`, `TableHead`, `TableBody`, `TableFooter`, `TableRow`, `TableHeader`, `TableCell`, `TableCaption`, `ExpandableRow`
- Form extensions: `Radio`, `RadioGroup`, `Combobox`, `ComboboxOption`, `Calendar`, `DatePicker`, `Field`, `ChoiceCard`, and more
- Chart extensions: `RadialChart`, `Histogram` (in addition to Bar, Line, Area, Pie, Radar, Scatter, Sparkline)
- Composition: `Define`, `Use`, `Slot` for template reuse
- Client actions: `SetState`, `ToggleState`, `AppendState`, `PopState`, `ShowToast`, `CloseOverlay`, `OpenLink`, `SetInterval`, `Fetch`, `OpenFilePicker`, `CallHandler`
- MCP actions: `CallTool`, `SendMessage`, `UpdateContext`, `RequestDisplayMode`

### MCP Display Helpers
- `display()`, `display_form()`, `display_update()`, `display_error()`

### Auto-Renderers
- `autoDetail`, `autoTable`, `autoChart`, `autoForm`, `autoComparison`, `autoMetrics`, `autoTimeline`, `autoProgress`

### Browser Renderer
- Vanilla DOM renderer — 55+ components, zero framework dependencies
- Reactive `Store` with get/set/merge/toggle/append
- Rx expression engine: ternary, logical, arithmetic, 15+ pipes, dot access, scoped variables
- Action dispatcher — 15 action types
- MCP transport — HTTP POST to `/mcp/tools/call`
- Theme engine — CSS custom properties from `theme` field (light/dark)
- Chart renderer — built-in SVG for Bar, Line, Area, Pie
- Mermaid integration — delegates to global `mermaid` if available
- IIFE bundle: `renderer.min.js` (54KB) for `<script>` tag usage, `window.prefab` global

### ext-apps Bridge
- `app()` one-call factory with PostMessage transport, host theme mapping, lifecycle hooks
- Capability negotiation, display mode requests, tool input/result/cancelled/partial events
- Auto-detect environment: iframe → PostMessage, standalone → HTTP transport

### Validation & Accessibility
- `validateWireFormat()` + `isValidWireFormat()` with detailed error reporting
- Stylesheet injection — renderer applies `stylesheets` field as `<style>` tags
- ARIA roles/attributes and keyboard navigation on all interactive components

### Infra
- GitHub Actions CI (test + build on push) and publish (npm on tag)
- 253 tests passing across 11 files (570 assertions)
- MIT license
