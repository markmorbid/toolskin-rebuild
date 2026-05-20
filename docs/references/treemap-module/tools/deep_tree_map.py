import os
from pathlib import Path

# ==============================
# CONFIG
# ==============================

BASE_DIR = Path.cwd()

OUTPUT_DIR_NAME = "_tree_output"
OUTPUT_DIR = BASE_DIR / OUTPUT_DIR_NAME

EXCLUDE_DIRS = {
    OUTPUT_DIR_NAME,
    ".git",
    "node_modules",
    "__pycache__",
    ".venv",
    "venv"
}

# 🔥 CONTROL DE LIMPIEZA
SHOW_FULL_PATH = False   # <<<<<< CAMBIÁ ESTO
VERTICAL_SPACING = 1     # líneas vacías entre bloques (0,1,2...)

TREE_MD = OUTPUT_DIR / "tree.md"


# ==============================
# HELPERS
# ==============================

def should_exclude(path: Path):
    return any(part in EXCLUDE_DIRS for part in path.parts)


def safe_listdir(path):
    try:
        return sorted(path.iterdir(), key=lambda x: (not x.is_dir(), x.name.lower()))
    except Exception:
        return []


def format_name(path: Path):
    if SHOW_FULL_PATH:
        return f"{path.name}  [{path.resolve()}]"
    return path.name


# ==============================
# TREE BUILDER
# ==============================

def build_tree(root: Path):
    lines = []

    def _build(current_path: Path, prefix=""):
        if should_exclude(current_path):
            return

        items = [i for i in safe_listdir(current_path) if not should_exclude(i)]
        total = len(items)

        for index, item in enumerate(items):
            connector = "└── " if index == total - 1 else "├── "
            lines.append(f"{prefix}{connector}{format_name(item)}")

            if item.is_dir() and index < total - 1:
                extension = "    " if index == total - 1 else "│   "
                _build(item, prefix + extension)

                # 🔥 ESPACIADO ENTRE BLOQUES DE CARPETAS
                if VERTICAL_SPACING > 0:
                    spacer_line = prefix.rstrip()
                    if spacer_line:
                        lines.extend([spacer_line] * VERTICAL_SPACING)
                    else:
                        lines.extend([""] * VERTICAL_SPACING)

    lines.append(format_name(root))
    lines.append("")  # espacio inicial

    _build(root)

    return "\n".join(lines)


# ==============================
# MAIN
# ==============================

def main():
    print("Scanning...")

    OUTPUT_DIR.mkdir(exist_ok=True)

    tree_str = build_tree(BASE_DIR)

    with open(TREE_MD, "w", encoding="utf-8") as f:
        f.write("# Tree Map (Clean)\n\n")
        f.write("```text\n")
        f.write(tree_str)
        f.write("\n```")

    print("✔ Done")
    print(f"MD: {TREE_MD}")


if __name__ == "__main__":
    main()  