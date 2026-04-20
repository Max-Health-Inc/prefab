"""
Tabs — tabbed navigation with content panels.

Demonstrates: Column, Heading, Tabs, Tab, Text
"""
from prefab_ui.app import PrefabApp
from prefab_ui.components import Column, Heading, Tab, Tabs, Text

with Column(gap=4) as view:
    Heading("Settings", level=2)
    with Tabs():
        with Tab(title="General"):
            Text("General settings go here.")
        with Tab(title="Security"):
            Text("Security settings go here.")
        with Tab(title="Notifications"):
            Text("Notification preferences go here.")

app = PrefabApp(view=view)
