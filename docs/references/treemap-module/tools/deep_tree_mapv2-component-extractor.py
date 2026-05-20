import json
import re
from pathlib import Path

BASE_DIR = Path.cwd()
OUTPUT_HTML = BASE_DIR / "ANALYZER.html"

EXCLUDE = {".git","node_modules","__pycache__",".venv","venv"}

MAX_FILE_SIZE = 200_000

# ==============================
# HELPERS
# ==============================

def should_exclude(path):
    return any(p in EXCLUDE for p in path.parts)

def is_text(path):
    try:
        with open(path, "rb") as f:
            return b"\0" not in f.read(1024)
    except:
        return False

def read(path):
    try:
        if path.stat().st_size > MAX_FILE_SIZE:
            return None
        if not is_text(path):
            return None
        return path.read_text(errors="ignore")
    except:
        return None

# ==============================
# PARSERS
# ==============================

IMPORT_RE = re.compile(r'import .* from [\'"](.*?)[\'"]')
REQUIRE_RE = re.compile(r'require\([\'"](.*?)[\'"]\)')
EXPORT_RE = re.compile(r'export (function|class) (\w+)')
HTML_TAG_RE = re.compile(r'<([a-zA-Z0-9\-]+)')
CSS_CLASS_RE = re.compile(r'\.([a-zA-Z0-9_-]+)')

def analyze_file(path):
    content = read(path)
    if not content:
        return None

    imports = IMPORT_RE.findall(content)
    imports += REQUIRE_RE.findall(content)

    exports = EXPORT_RE.findall(content)
    exports = [name for _, name in exports]

    tags = HTML_TAG_RE.findall(content)
    classes = CSS_CLASS_RE.findall(content)

    return {
        "path": str(path.resolve()),
        "name": path.name,
        "imports": imports,
        "exports": exports,
        "tags": tags,
        "classes": classes,
        "content": content[:5000]  # truncate for browser
    }

# ==============================
# SCAN
# ==============================

files = []

for p in BASE_DIR.rglob("*"):
    if p.is_file() and not should_exclude(p):
        data = analyze_file(p)
        if data:
            files.append(data)

# ==============================
# BUILD DEP GRAPH
# ==============================

path_map = {f["path"]: f for f in files}

# reverse dependencies
dependents = {f["path"]: [] for f in files}

for f in files:
    for imp in f["imports"]:
        for target in files:
            if imp in target["path"]:
                dependents[target["path"]].append(f["path"])

# ==============================
# HTML
# ==============================

html = f"""
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Dependency Analyzer</title>

<style>
body {{ background:#0f1115; color:#e6edf3; font-family:Arial; margin:0; }}
.container {{ display:flex; height:100vh; }}
.sidebar {{ width:30%; overflow:auto; border-right:1px solid #333; }}
.main {{ width:70%; padding:10px; overflow:auto; }}

.node {{ padding:4px; cursor:pointer; }}
.node:hover {{ background:#1f2630; }}

pre {{ background:#161a22; padding:10px; overflow:auto; }}

.section {{ margin-bottom:20px; }}
</style>
</head>

<body>

<div class="container">
<div class="sidebar" id="list"></div>
<div class="main" id="detail"></div>
</div>

<script>

const FILES = {json.dumps(files)};
const DEPENDENTS = {json.dumps(dependents)};

function show(file) {{
  const d = document.getElementById("detail");

  const deps = file.imports.join("<br>");
  const exps = file.exports.join(", ");
  const uses = (DEPENDENTS[file.path] || []).join("<br>");

  d.innerHTML = `
    <h2>${{file.name}}</h2>

    <div class="section">
      <b>Imports</b><br>${{deps || "None"}}
    </div>

    <div class="section">
      <b>Exports</b><br>${{exps || "None"}}
    </div>

    <div class="section">
      <b>Used By</b><br>${{uses || "None"}}
    </div>

    <div class="section">
      <b>Tags (HTML)</b><br>${{file.tags.join(", ")}}
    </div>

    <div class="section">
      <b>CSS Classes</b><br>${{file.classes.join(", ")}}
    </div>

    <div class="section">
      <b>Preview</b>
      <pre>${{file.content}}</pre>
    </div>
  `;
}}

function renderList() {{
  const list = document.getElementById("list");

  FILES.forEach(f => {{
    const div = document.createElement("div");
    div.className = "node";
    div.textContent = f.name;
    div.onclick = () => show(f);
    list.appendChild(div);
  }});
}}

renderList();

</script>

</body>
</html>
"""

# ==============================
# WRITE
# ==============================

with open(OUTPUT_HTML, "w", encoding="utf-8") as f:
    f.write(html)

print("✔ Analyzer generated:")
print(OUTPUT_HTML)