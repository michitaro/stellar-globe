#!/usr/bin/env python3

from __future__ import annotations

import json
import sys
from pathlib import Path


NOTEBOOK_NAME = "query-response-diagnostic.ipynb"


def filter_contents_index(index_path: Path) -> None:
    if not index_path.exists():
        return

    data = json.loads(index_path.read_text(encoding="utf-8"))
    content = data.get("content")
    if not isinstance(content, list):
        return

    filtered = [
        entry for entry in content
        if not isinstance(entry, dict) or entry.get("name") != NOTEBOOK_NAME
    ]
    if filtered == content:
        return

    data["content"] = filtered
    index_path.write_text(
        json.dumps(data, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def main() -> int:
    if len(sys.argv) != 2:
        raise SystemExit(f"usage: {Path(sys.argv[0]).name} <jupyterlite-output-dir>")

    output_dir = Path(sys.argv[1])
    (output_dir / "files" / NOTEBOOK_NAME).unlink(missing_ok=True)
    filter_contents_index(output_dir / "api" / "contents" / "all.json")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
