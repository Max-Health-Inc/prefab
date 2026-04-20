# Changelog

All notable changes to this project will be documented in this file.

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
