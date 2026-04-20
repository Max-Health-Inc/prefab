#!/usr/bin/env python3
"""
Runner — executes each .py fixture and dumps its `app` to JSON.

Each .py file must define a module-level `app` (PrefabApp instance).
Outputs to test/fixtures/golden/<name>.json.

Usage:
    python test/fixtures/run_fixtures.py
"""

import importlib.util
import json
import sys
from pathlib import Path

PY_DIR = Path(__file__).parent / "py"
OUT_DIR = Path(__file__).parent / "golden"
OUT_DIR.mkdir(exist_ok=True)


def run_fixture(py_path: Path) -> dict:
    """Import a fixture .py file and return app.to_json()."""
    spec = importlib.util.spec_from_file_location(py_path.stem, py_path)
    if spec is None or spec.loader is None:
        raise ImportError(f"Cannot load {py_path}")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    if not hasattr(mod, "app"):
        raise AttributeError(f"{py_path.name} must define a module-level `app` (PrefabApp)")
    return mod.app.to_json()


def main() -> None:
    py_files = sorted(PY_DIR.glob("*.py"))
    if not py_files:
        print("No .py fixtures found in", PY_DIR)
        sys.exit(1)

    ok, fail = 0, 0
    for py_file in py_files:
        name = py_file.stem.replace("_", "-")
        out = OUT_DIR / f"{name}.json"
        try:
            data = run_fixture(py_file)
            with open(out, "w") as f:
                json.dump(data, f, indent=2)
            print(f"  ✓ {py_file.name} → {out.name}")
            ok += 1
        except Exception as e:
            print(f"  ✗ {py_file.name}: {e}")
            fail += 1

    print(f"\nDone. {ok} ok, {fail} failed. Output in {OUT_DIR}")
    if fail:
        sys.exit(1)


if __name__ == "__main__":
    main()
