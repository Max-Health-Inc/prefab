"""
Nested Layout — deep nesting with two-panel card.

Demonstrates: Column, Card, CardContent, Row, Heading, Text
"""
from prefab_ui.app import PrefabApp
from prefab_ui.components import Card, CardContent, Column, Heading, Row, Text

with Column(gap=4) as view:
    with Card():
        with CardContent():
            with Row(gap=4):
                with Column(gap=2):
                    Heading("Left Panel", level=3)
                    Text("Left content")
                with Column(gap=2):
                    Heading("Right Panel", level=3)
                    Text("Right content")

app = PrefabApp(view=view)
