import os
from pathlib import Path

# ==============================
# CONFIGURACIÓN
# ==============================

# Carpeta base = donde ejecutás el script
BASE_DIR = Path.cwd()

# Carpeta de salida (se auto-excluye)
OUTPUT_DIR_NAME = "_tree_output"
OUTPUT_DIR = BASE_DIR / OUTPUT_DIR_NAME

# Carpetas a excluir (nombres o paths relativos)
EXCLUDE_DIRS = {
    OUTPUT_DIR_NAME,
    ".git",
    "node_modules",
    "__pycache__",
    ".venv",
    "venv"
}

# Archivos de salida
TREE_TXT = OUTPUT_DIR / "tree.txt"
TREE_MD = OUTPUT_DIR / "tree.md"


# ==============================
# UTILIDADES
# ==============================

def should_exclude(path: Path):
    """
    Determina si un path debe excluirse completamente.
    """
    for part in path.parts:
        if part in EXCLUDE_DIRS:
            return True
    return False


def safe_listdir(path):
    """
    Lista directorio con manejo de errores.
    """
    try:
        return sorted(path.iterdir(), key=lambda x: (not x.is_dir(), x.name.lower()))
    except Exception:
        return []


# ==============================
# GENERADOR DE TREE ASCII
# ==============================

def build_tree(root: Path):
    """
    Genera el tree ASCII completo.
    """
    lines = []

    def _build(current_path: Path, prefix=""):
        if should_exclude(current_path):
            return

        items = safe_listdir(current_path)
        items = [i for i in items if not should_exclude(i)]

        total = len(items)

        for index, item in enumerate(items):
            connector = "└── " if index == total - 1 else "├── "
            line = f"{prefix}{connector}{item.name}"

            # Añadir path absoluto
            line += f"  [{item.resolve()}]"
            lines.append(line)

            if item.is_dir():
                extension = "    " if index == total - 1 else "│   "
                _build(item, prefix + extension)

    # raíz
    lines.append(f"{root.name}  [{root.resolve()}]")
    _build(root)

    return "\n".join(lines)


# ==============================
# MAIN
# ==============================

def main():
    print("Escaneando carpeta...")
    
    # Crear carpeta output
    OUTPUT_DIR.mkdir(exist_ok=True)

    tree_str = build_tree(BASE_DIR)

    # Guardar TXT
    with open(TREE_TXT, "w", encoding="utf-8") as f:
        f.write(tree_str)

    # Guardar MD
    with open(TREE_MD, "w", encoding="utf-8") as f:
        f.write("# Tree Map\n\n")
        f.write("```text\n")
        f.write(tree_str)
        f.write("\n```")

    print("\n✔ Tree generado correctamente")
    print(f"TXT: {TREE_TXT}")
    print(f"MD : {TREE_MD}")


if __name__ == "__main__":
    main()