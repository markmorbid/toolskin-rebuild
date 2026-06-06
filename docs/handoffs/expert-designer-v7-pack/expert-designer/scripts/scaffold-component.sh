#!/usr/bin/env bash
# scaffold-component.sh — copy a recipe out of the skill into your project
# Usage: bash scripts/scaffold-component.sh <recipe-name>
#   where <recipe-name> is one of:
#     card-stat | card-feature | card-media | card-person | card-price
#     card-quote | card-action | card-list | card-spotlight | card-glass
#     btn | input | badge | chip | nav | footer | modal | toast
#     hero-centered | hero-asymmetric | hero-oversized | bento | dashboard
#
# Writes <recipe-name>.html to the current directory with token vars wired up.

set -e

NAME="${1:-}"
if [ -z "$NAME" ]; then
  echo "usage: bash scaffold-component.sh <recipe-name>"
  echo ""
  echo "available recipes:"
  echo "  cards:      card-stat card-feature card-media card-person card-price"
  echo "              card-quote card-action card-list card-spotlight card-glass"
  echo "  components: btn input badge chip nav footer modal toast"
  echo "  patterns:   hero-centered hero-asymmetric hero-oversized bento dashboard"
  exit 2
fi

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
SKILL_DIR=$(dirname "$SCRIPT_DIR")
OUT="${NAME}.html"

if [ -f "$OUT" ]; then
  read -p "$OUT already exists — overwrite? [y/N] " ok
  [ "$ok" = "y" ] || exit 0
fi

# Header for every scaffolded file
cat > "$OUT" <<'HTML_HEAD'
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Toolskin — RECIPE_NAME</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&family=JetBrains+Mono:wght@400..700&display=swap">
  <link rel="stylesheet" href="TOKENS_PATH">
</head>
<body>
HTML_HEAD

# Compute relative path to templates/tokens.css
# Default assumption: scaffolded into current working dir; tokens.css alongside or in templates/
sed -i.bak "s|RECIPE_NAME|${NAME}|g; s|TOKENS_PATH|${SKILL_DIR}/templates/tokens.css|g" "$OUT" && rm "${OUT}.bak"

case "$NAME" in
  card-stat)
    cat >> "$OUT" <<'EOF'

<main style="padding: var(--ts-section-pad); display: grid; place-items: center; min-height: 100dvh;">
  <article class="ts-card ts-card--stat" style="width: 320px;">
    <p class="ts-card__eyebrow">Monthly Recurring Revenue</p>
    <div class="ts-card__metric">$248,400</div>
    <div class="ts-card__delta ts-card__delta--up">↑ +12.4% vs last month</div>
  </article>
</main>
EOF
    ;;

  card-feature)
    cat >> "$OUT" <<'EOF'

<main style="padding: var(--ts-section-pad); max-width: var(--ts-container-lg); margin: 0 auto;">
  <div class="ts-grid">
    <article class="ts-card ts-card--feature">
      <div class="ts-card__icon">⚡</div>
      <h3 class="ts-card__title">Real-time collaboration</h3>
      <p class="ts-card__body">Multiplayer cursors and presence built-in. Your team sees changes the moment you make them.</p>
      <a class="ts-card__link" href="#">Learn more →</a>
    </article>
    <article class="ts-card ts-card--feature">
      <div class="ts-card__icon">◯</div>
      <h3 class="ts-card__title">Lightning fast</h3>
      <p class="ts-card__body">Zero-runtime CSS and modern frameworks. Loads in under 200ms on any device.</p>
      <a class="ts-card__link" href="#">Learn more →</a>
    </article>
    <article class="ts-card ts-card--feature">
      <div class="ts-card__icon">◇</div>
      <h3 class="ts-card__title">Enterprise ready</h3>
      <p class="ts-card__body">SOC2 Type II compliant, single sign-on, and audit logs included from day one.</p>
      <a class="ts-card__link" href="#">Learn more →</a>
    </article>
  </div>
</main>
EOF
    ;;

  hero-centered)
    cat >> "$OUT" <<'EOF'

<section class="ts-hero ts-hero--centered" style="padding: clamp(96px, 16vh, 192px) var(--ts-container-pad); text-align: center;">
  <div style="max-width: var(--ts-container-md); margin: 0 auto;">
    <p class="ts-badge ts-badge--accent" style="margin-bottom: var(--ts-sp-6);">v2.0 is live</p>
    <h1 style="font-family: var(--ts-font-display); font-size: var(--ts-fs-display); font-weight: 700; line-height: var(--ts-lh-display); letter-spacing: var(--ts-tracking-tighter); margin: 0 0 var(--ts-sp-8); text-wrap: balance;">
      The #1 AI Agent for<br>all your codebase
    </h1>
    <p style="color: var(--ts-text-secondary); font-size: var(--ts-fs-lead); max-width: 60ch; margin: 0 auto var(--ts-sp-10);">
      Autonomously resolving complex refactoring tasks, generating optimal architecture.
    </p>
    <div style="display: inline-flex; gap: var(--ts-sp-3);">
      <a class="ts-btn ts-btn--primary ts-btn--lg" href="#">Start free trial</a>
      <a class="ts-btn ts-btn--outline ts-btn--lg" href="#">View demo</a>
    </div>
  </div>
</section>
EOF
    ;;

  bento)
    cat >> "$OUT" <<'EOF'

<main style="padding: var(--ts-section-pad); max-width: var(--ts-container-xl); margin: 0 auto;">
  <div class="ts-bento">
    <article class="ts-card ts-bento__hero">
      <h2 style="font-family: var(--ts-font-display); font-size: var(--ts-fs-h2); line-height: var(--ts-lh-headline); letter-spacing: var(--ts-tracking-tight); margin: 0; text-wrap: balance;">
        The modern way to build digital products.
      </h2>
      <p style="color: var(--ts-text-secondary); margin-top: var(--ts-sp-4); max-width: 50ch;">
        A premium UI toolkit designed for speed, beauty, and flexibility.
      </p>
    </article>
    <article class="ts-card ts-bento__tall">
      <p class="ts-card__eyebrow">Weekly Downloads</p>
      <div class="ts-card__metric">1.2M+</div>
      <p style="color: var(--ts-success); font-size: var(--ts-fs-caption); margin: 0;">↑ +24% this week</p>
    </article>
    <article class="ts-card ts-bento__third">⚡ Lightning Fast</article>
    <article class="ts-card ts-bento__third">◇ Enterprise Ready</article>
    <article class="ts-card ts-bento__third">◯ Open Source</article>
  </div>
</main>
EOF
    ;;

  *)
    cat >> "$OUT" <<EOF

<main style="padding: var(--ts-section-pad);">
  <h1>Recipe "${NAME}" not yet templated.</h1>
  <p>See expert-designer/references/ for the canonical recipe and copy-paste manually.</p>
</main>
EOF
    ;;
esac

cat >> "$OUT" <<'EOF'

</body>
</html>
EOF

echo "wrote $OUT"
echo "→ open in browser, then iterate."
echo "→ verify with: node ${SKILL_DIR}/scripts/audit-design.mjs $OUT"
