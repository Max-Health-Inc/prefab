---
layout: home

hero:
  name: '<span style="white-space:nowrap">@maxhealth.tech/prefab</span>'
  text: TypeScript authoring for A2UI and MCP Apps
  tagline: Build the agent UI once, server-side. Emit A2UI for native rendering or $prefab for an MCP Apps iframe.
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: brand
      text: See the Demo
      link: /demo/
    - theme: brand
      text: Try the Playground
      link: /playground/
    - theme: alt
      text: Component Reference
      link: /reference/components
    - theme: alt
      text: GitHub
      link: https://github.com/Max-Health-Inc/prefab

features:
  - icon: 🧩
    title: 115+ Components
    details: Layout, typography, data tables, charts, forms, interactive tabs, accordions, dialogs — all declarative JSON.
  - icon: ⚡
    title: Reactive State
    details: 'Template expressions like <code>{{ count + 1 }}</code> with 20+ pipes. Auto-update on state changes, no framework needed.'
  - icon: 🔌
    title: MCP-Native
    details: display() and display_a2ui() wrap your tree as a tool result. ui:// and a2ui:// resource helpers, plus input_required for the 2026-07-28 revision.
  - icon: 🌐
    title: Zero-Dep Renderer
    details: Vanilla DOM renderer as a single IIFE script tag. Zero dependencies, zero build step for the browser.
  - icon: 🤖
    title: Auto-Renderers
    details: autoTable, autoChart, autoForm, autoMetrics — generate full UIs from raw data in one call.
  - icon: 🔀
    title: Two Wire Formats
    details: One component tree, two outputs. A2UI v1.0 validated against the official schemas, and $prefab v0.3 — a superset of the Python prefab-ui.
---
