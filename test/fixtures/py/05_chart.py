"""
Chart — bar chart with data series.

Demonstrates: Column, Heading, BarChart
"""
from prefab_ui.app import PrefabApp
from prefab_ui.components import Column, Heading
from prefab_ui.components.charts import BarChart

data = [
    {"month": "Jan", "revenue": 4000, "costs": 2400},
    {"month": "Feb", "revenue": 3000, "costs": 1398},
    {"month": "Mar", "revenue": 2000, "costs": 9800},
    {"month": "Apr", "revenue": 2780, "costs": 3908},
]

with Column(gap=4) as view:
    Heading("Revenue Report", level=2)
    BarChart(
        data=data,
        x_axis="month",
        series=[
            {"dataKey": "revenue", "label": "Revenue", "color": "#4f46e5"},
            {"dataKey": "costs", "label": "Costs", "color": "#ef4444"},
        ],
        height=300,
    )

app = PrefabApp(view=view)
