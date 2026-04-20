"""
Form with Actions — form inputs with action dispatch.

Demonstrates: Column, Heading, Input, Textarea, Button, CallHandler, state
"""
from prefab_ui.app import PrefabApp
from prefab_ui.actions import CallHandler
from prefab_ui.components import Button, Column, Heading, Input, Textarea

with Column(gap=4) as view:
    Heading("Contact Form", level=2)
    Input(name="email", label="Email", placeholder="you@example.com")
    Textarea(name="message", placeholder="Your message...")
    Button("Submit", on_click=CallHandler("submit_form"))

app = PrefabApp(view=view, state={"email": "", "message": ""})
