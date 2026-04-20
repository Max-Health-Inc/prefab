# prefab-ui — Project Checklist

## v0.1 — TypeScript Component Library (Scaffold)

- [x] GitHub repo (Max-Health-Inc/prefab-ui)
- [x] Project scaffold (Bun, TypeScript, ESM)
- [x] Core base classes (Component, ContainerComponent, StatefulComponent)
- [x] Serialization engine (toJSON, serializeValue, camelCase output)
- [x] Rx reactive expression builder (pipes, comparisons, ternary, built-in vars)
- [x] Client actions (SetState, ToggleState, AppendState, PopState, ShowToast, CloseOverlay, OpenLink, SetInterval)
- [x] MCP actions (CallTool, SendMessage, UpdateContext)
- [x] Layout components (Column, Row, Grid, GridItem, Container, Div, Span, Dashboard, DashboardItem, Pages, Page)
- [x] Typography components (Heading, H1-H4, Text, P, Lead, Large, Small, Muted, BlockQuote, Label, Link, Code, Markdown, Kbd)
- [x] Card components (Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter)
- [x] Data display components (DataTable, col, Badge, Dot, Metric, Ring, Progress, Separator, Loader, Icon)
- [x] Form components (Form, Input, Textarea, Button, ButtonGroup, Select, SelectOption, Checkbox, Switch, Slider)
- [x] Chart components (BarChart, LineChart, AreaChart, PieChart, RadarChart, ScatterChart, Sparkline)
- [x] Control flow components (ForEach, If, Elif, Else)
- [x] Interactive components (Tabs, Tab, Accordion, AccordionItem, Dialog, Popover, Tooltip, HoverCard, Carousel)
- [x] Media components (Image, Audio, Video, Embed, Svg, DropZone, Mermaid)
- [x] Alert components (Alert, AlertTitle, AlertDescription)
- [x] PrefabApp wrapper (toJSON → $prefab v0.2 wire format, toHTML → self-contained page)
- [x] Unit tests — 78 passing (core, rx, actions, components, app)
- [x] Build with tsc → dist/

## v0.2 — MCP Display Helpers

- [ ] `display()` — return a PrefabApp as MCP tool result content
- [ ] `display_form()` — return a form that submits back to an MCP tool
- [ ] `display_update()` — return a partial state update for an existing UI
- [ ] `display_error()` — return a standardized error view
- [ ] Integration tests with mock MCP tool handler

## v0.3 — Browser Renderer

- [ ] Renderer architecture (Preact or vanilla DOM)
- [ ] Component registry — map `type` string → render function
- [ ] State management — reactive store from `state` field
- [ ] Rx expression evaluation — parse `{{ expr }}` at runtime
- [ ] Action dispatcher — handle client actions (setState, showToast, etc.)
- [ ] MCP transport — CallTool sends to MCP server, updates state with result
- [ ] ForEach / If / Elif / Else runtime evaluation
- [ ] Theme application (CSS custom properties from theme field)
- [ ] KeyBindings listener
- [ ] Defs resolution (component templates)
- [ ] `PrefabRenderer.mount(el, data)` entry point
- [ ] Bundle (ESM + UMD/IIFE for CDN)
- [ ] Renderer unit tests

## v0.4 — Polish & Publish

- [ ] README with usage examples, API reference, wire format spec
- [ ] npm publish (`prefab-ui`)
- [ ] GitHub Actions CI (test + build on push)
- [ ] GitHub Actions publish (npm on tag/release)
- [ ] CDN hosting for renderer bundle (jsdelivr via npm)
- [ ] CHANGELOG.md
- [ ] LICENSE

## v0.5 — Advanced Features

- [ ] Validation — runtime schema validation of wire format
- [ ] onMount action support in renderer
- [ ] Stylesheet injection (custom CSS from stylesheets field)
- [ ] Accessibility audit (ARIA attributes, keyboard nav)
- [ ] Chart renderer integration (lightweight charting lib)
- [ ] Mermaid renderer integration
- [ ] DropZone file upload handling
- [ ] iframe sandboxing / AppBridge protocol for MistralOS
- [ ] Python parity audit — diff against prefab_ui v0.19.1 for missing features
