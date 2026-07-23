# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

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
