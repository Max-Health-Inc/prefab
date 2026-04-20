"""
Hello World — simplest possible component tree.

Demonstrates: Column, Heading, Badge
"""
from prefab_ui.app import PrefabApp
from prefab_ui.components import Badge, Column, Heading

with Column(gap=4) as view:
    Heading("Hello World")
    Badge("Active", variant="success")

app = PrefabApp(view=view)
