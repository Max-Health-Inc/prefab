# Common UI Patterns

Proven layouts you can adapt. The full wire-format JSON for the most common
patterns lives once as canonical example files — load them instead of copying
JSON inline:

- Demo & playground apps fetch them from `/prefab/examples/<id>.json`.
- The skill bundles the same files under `assets/examples/<id>.json` (generated
  from `docs/public/examples/` by `scripts/gen-skill-assets.ts`).

| Pattern | Canonical example | What it shows |
|---------|-------------------|---------------|
| Analytics Dashboard | `dashboard.json` | KPI metrics row + line chart + data table |
| Detail Card with Status | `patient-card.json` | Entity summary with metrics, separator, status badges |
| Interactive Form | `contact-form.json` | Inputs, select, textarea, actions, reactive state |
| Tabbed Settings | `settings-tabs.json` | Multi-section tabs with alerts, checkboxes, selects |
| Comparison Chart | `revenue-chart.json` | Metrics + multi-series bar chart |
| Interactive Todo | `todo-app.json` | Reactive list with `appendState` / state-bound table |
| Counter | `counter-app.json` | `setState` with reactive expressions |
| Conditional UI | `conditional-ui.json` | `If` branches driven by state |
| Data Table | `user-directory.json` | Searchable, sortable table |
| Hello World | `hello-world.json` | Minimal envelope + heading + badge |

> The canonical files use `"$prefab": { "version": "0.2" }`. When authoring fresh
> UIs, use the current protocol version (`"0.3"`) shown throughout this skill; the
> component shapes are otherwise identical.

Below are patterns that are **not** covered by the canonical example files.

## MCP Tool Integration

Form that calls an MCP tool and displays results — wiring `toolCall` actions to
state and rendering the result in a table.

```json
{
  "$prefab": { "version": "0.3" },
  "view": {
    "type": "Column", "gap": 16,
    "children": [
      { "type": "Heading", "content": "Search", "level": 2 },
      { "type": "Row", "gap": 8, "children": [
        { "type": "Input", "name": "query", "placeholder": "Search..." },
        { "type": "Button", "label": "Search", "onClick": {
          "action": "toolCall",
          "tool": "search_records",
          "arguments": { "query": "{{ state.query }}" },
          "resultKey": "results",
          "onSuccess": { "action": "setState", "key": "items", "value": "{{ result.data }}" },
          "onError": { "action": "showToast", "title": "Error", "description": "{{ error }}", "variant": "destructive" }
        }}
      ]},
      { "type": "If", "condition": "{{ state.loading }}", "children": [{ "type": "Loader" }] },
      { "type": "If", "condition": "{{ state.items | length > 0 }}", "children": [
        { "type": "DataTable",
          "columns": [
            { "key": "name", "header": "Name", "sortable": true },
            { "key": "type", "header": "Type" },
            { "key": "updated", "header": "Updated", "format": "date" }
          ],
          "rows": "{{ state.items }}",
          "search": false
        }
      ]}
    ]
  },
  "state": { "query": "", "items": [], "loading": false }
}
```

## Anti-Patterns to Avoid

1. **Missing envelope** — Always wrap in `{ "$prefab": { "version": "0.3" }, "view": { ... } }`
2. **Flat layout** — Don't put 10 children at root level. Group into Cards/Rows/Columns.
3. **Missing state** — If you use `{{ state.x }}`, declare `x` in `"state"`
4. **camelCase types** — Wrong: `"type": "dataTable"` → Right: `"type": "DataTable"`
5. **Orphan options** — `SelectOption` must be inside `Select.children` (or use `options` shorthand)
6. **Giant JSON** — Keep responses under ~200 components. Split into pages if larger.
