#!/usr/bin/env python3
"""
Scan images/portfolio and print portfolioData-style JavaScript for script.js.

Layout expected per category:
  images/portfolio/<category>/<id>/Input.<ext>   (reference image, any case)
  images/portfolio/<category>/<id>/1.jpg, 2.png, ... (outputs; sorted by number in filename)

Category-level files like cover.jpg are ignored. Subfolders under each category are sorted
numerically when the folder name is digits, otherwise alphabetically.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"}


def natural_sort_key(path: Path) -> tuple:
    """Sort paths so 2.jpg comes before 10.jpg."""
    stem = path.stem
    parts = re.split(r"(\d+)", stem)
    key: list = []
    for p in parts:
        if p.isdigit():
            key.append(int(p))
        else:
            key.append(p.lower())
    return (tuple(key), path.suffix.lower())


def is_image_file(path: Path) -> bool:
    return path.is_file() and path.suffix.lower() in IMAGE_EXTENSIONS


def find_input_image(folder: Path) -> Path | None:
    for p in folder.iterdir():
        if p.is_file() and is_image_file(p) and p.stem.lower() == "input":
            return p
    return None


def output_images(folder: Path, input_path: Path | None) -> list[Path]:
    out: list[Path] = []
    for p in folder.iterdir():
        if not p.is_file() or not is_image_file(p):
            continue
        if p.stem.lower() == "input":
            continue
        if input_path is not None and p.samefile(input_path):
            continue
        out.append(p)
    out.sort(key=natural_sort_key)
    return out


def subdir_sort_key(name: str) -> tuple:
    if name.isdigit():
        return (0, int(name))
    return (1, name.lower())


def js_escape_string(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def format_js_object(items: list[dict], indent: str = "    ") -> str:
    lines: list[str] = []
    for i, item in enumerate(items):
        block_lines = [f"{indent}{{"]
        props: list[str] = []
        if "inputImage" in item:
            props.append(f'{indent}  inputImage: "{js_escape_string(item["inputImage"])}"')
        if "input" in item:
            props.append(f'{indent}  input: "{js_escape_string(item["input"])}"')
        for pi, line in enumerate(props):
            if pi < len(props) - 1 or item.get("outputs"):
                line += ","
            block_lines.append(line)
        outs = item.get("outputs", [])
        block_lines.append(f"{indent}  outputs: [")
        for j, o in enumerate(outs):
            comma = "," if j < len(outs) - 1 else ""
            block_lines.append(f'{indent}    "{js_escape_string(o)}"{comma}')
        block_lines.append(f"{indent}  ]")
        block_lines.append(f"{indent}}}")
        sep = "," if i < len(items) - 1 else ""
        block_lines[-1] += sep
        lines.extend(block_lines)
    return "\n".join(lines)


def scan_category(category_dir: Path, web_prefix: str) -> list[dict]:
    """Build list of {inputImage?, outputs: [...]} for one category folder."""
    if not category_dir.is_dir():
        return []

    entries: list[dict] = []
    subdirs = [p for p in category_dir.iterdir() if p.is_dir()]
    subdirs.sort(key=lambda p: subdir_sort_key(p.name))

    for folder in subdirs:
        input_path = find_input_image(folder)
        outputs = output_images(folder, input_path)
        if not outputs and input_path is None:
            continue
        rel_base = Path(web_prefix.strip("./")) / category_dir.name / folder.name
        obj: dict = {"outputs": []}
        if input_path is not None:
            obj["inputImage"] = f"./{rel_base.as_posix()}/{input_path.name}"
        for op in outputs:
            obj["outputs"].append(f"./{rel_base.as_posix()}/{op.name}")
        entries.append(obj)

    return entries


def scan_portfolio_root(portfolio_root: Path, web_prefix: str) -> dict[str, list[dict]]:
    """Return { category_name: [ items... ], ... } for all category folders."""
    if not portfolio_root.is_dir():
        raise SystemExit(f"Not a directory: {portfolio_root}")

    result: dict[str, list[dict]] = {}
    cats = [p for p in portfolio_root.iterdir() if p.is_dir()]
    cats.sort(key=lambda p: p.name.lower())
    for cat in cats:
        result[cat.name] = scan_category(cat, web_prefix)
    return result


def format_full_portfolio_data(data: dict[str, list[dict]], indent: str = "    ") -> str:
    parts: list[str] = ["const portfolioData = {"]
    keys = sorted(data.keys(), key=str.lower)
    for ki, key in enumerate(keys):
        items = data[key]
        parts.append(f'{indent}{key}: [')
        if items:
            inner = format_js_object(items, indent=indent + "  ")
            parts.append(inner)
        parts.append(f"{indent}]")
        if ki < len(keys) - 1:
            parts[-1] += ","
    parts.append("};")
    return "\n".join(parts)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--root",
        type=Path,
        default=Path(__file__).resolve().parent / "images" / "portfolio",
        help="Path to images/portfolio (default: next to this script)",
    )
    parser.add_argument(
        "--prefix",
        default="./images/portfolio",
        help='Web path prefix for URLs (default: "./images/portfolio")',
    )
    parser.add_argument(
        "--category",
        action="append",
        dest="categories",
        metavar="NAME",
        help="Only include this category (repeatable). Default: all folders under root.",
    )
    args = parser.parse_args()
    root = args.root.resolve()

    data = scan_portfolio_root(root, args.prefix)
    if args.categories:
        want = {c.lower() for c in args.categories}
        data = {k: v for k, v in data.items() if k.lower() in want}

    print(format_full_portfolio_data(data))
    # stderr summary for empty categories
    empty = [k for k, v in data.items() if not v]
    if empty:
        print(
            f"# Note: no numbered project folders with outputs found in: {', '.join(empty)}",
            file=sys.stderr,
        )


if __name__ == "__main__":
    main()
