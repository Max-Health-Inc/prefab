"""
Full App — complete envelope with state, defs, and actions.

Demonstrates: PrefabApp envelope, Define, Column, Card, CardContent,
  Text, Button, Heading, Muted, ToggleState, state, defs
"""
from prefab_ui.app import PrefabApp
from prefab_ui.actions import ToggleState
from prefab_ui.components import Button, Card, CardContent, Column, Heading, Muted, Text
from prefab_ui.define import Define

with Define("greeting") as greeting:
    with Column(gap=2):
        Heading("Welcome back!")
        Muted("You have new notifications.")

with Column(gap=4) as view:
    with Card():
        with CardContent():
            Text("Dashboard content here.")
    Button("Toggle dark mode", on_click=ToggleState("darkMode"))

app = PrefabApp(
    view=view,
    state={"darkMode": False, "user": {"name": "Alice"}},
    defs=[greeting],
)
