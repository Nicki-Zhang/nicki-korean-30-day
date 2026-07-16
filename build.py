from __future__ import annotations

import json
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "index.html.html"
DIST = ROOT / "dist"
ASSETS = DIST / "assets"


def extract(pattern: str, text: str, label: str) -> str:
    match = re.search(pattern, text, re.DOTALL | re.IGNORECASE)
    if not match:
        raise RuntimeError(f"Could not find {label} in {SOURCE.name}")
    return match.group(1).strip()


def build() -> None:
    if not SOURCE.exists():
        raise FileNotFoundError(f"Missing course source: {SOURCE}")

