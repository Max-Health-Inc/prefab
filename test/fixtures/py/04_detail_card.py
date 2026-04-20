"""
Detail Card — card with rich content, metrics, and nested layout.

Demonstrates: Card, CardHeader, CardTitle, CardDescription, CardContent,
  CardFooter, Column, Row, Metric, Separator, Text, Badge
"""
from prefab_ui.app import PrefabApp
from prefab_ui.components import (
    Badge, Card, CardContent, CardDescription, CardFooter, CardHeader,
    CardTitle, Column, Metric, Row, Separator, Text,
)

with Card() as view:
    with CardHeader():
        CardTitle("Patient Summary")
        CardDescription("Last updated: 2024-01-15")
    with CardContent():
        with Column(gap=3):
            with Row(gap=4):
                Metric(label="Heart Rate", value="72 bpm")
                Metric(label="Blood Pressure", value="120/80")
                Metric(label="Temperature", value="98.6°F")
            Separator()
            Text("Patient is in stable condition.")
    with CardFooter():
        Badge("Stable", variant="success")

app = PrefabApp(view=view)
