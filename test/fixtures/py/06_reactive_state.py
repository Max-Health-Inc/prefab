"""
Reactive State — counter app with Rx template expressions.

Demonstrates: Column, Heading, Text, Row, Button, SetState, Rx, state
"""
from prefab_ui.app import PrefabApp
from prefab_ui.actions import SetState
from prefab_ui.components import Button, Column, Heading, Row, Text
from prefab_ui.rx import Rx

count = Rx("count")

with Column(gap=4) as view:
    Heading("Counter App")
    Text(f"Count: {count}")
    with Row(gap=2):
        Button("+1", on_click=SetState("count", count + 1))
        Button("-1", on_click=SetState("count", count - 1))
        Button("Reset", on_click=SetState("count", 0))

app = PrefabApp(view=view, state={"count": 0})
