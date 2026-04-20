"""
Data Table — tabular data display with columns.

Demonstrates: Column, Heading, DataTable, DataTableColumn
"""
from prefab_ui.app import PrefabApp
from prefab_ui.components import Column, DataTable, DataTableColumn, Heading

rows = [
    {"name": "Alice", "role": "Admin", "status": "Active"},
    {"name": "Bob", "role": "Editor", "status": "Inactive"},
    {"name": "Carol", "role": "Viewer", "status": "Active"},
]

with Column(gap=4) as view:
    Heading("User Directory", level=2)
    DataTable(
        rows=rows,
        columns=[
            DataTableColumn(key="name", header="Name"),
            DataTableColumn(key="role", header="Role"),
            DataTableColumn(key="status", header="Status"),
        ],
    )

app = PrefabApp(view=view)
