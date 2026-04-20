"""
Alert — alert banners with variants.

Demonstrates: Column, Alert, AlertTitle, AlertDescription
"""
from prefab_ui.app import PrefabApp
from prefab_ui.components import Alert, AlertDescription, AlertTitle, Column

with Column(gap=4) as view:
    with Alert(variant="default"):
        AlertTitle("Information")
        AlertDescription("This is a standard info alert.")
    with Alert(variant="destructive"):
        AlertTitle("Error")
        AlertDescription("Something went wrong.")

app = PrefabApp(view=view)
