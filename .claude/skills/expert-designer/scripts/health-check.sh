#!/usr/bin/env bash
# Expert Designer Skill — Project Health Check
# Run: bash tools/scripts/health-check.sh

set -e
PASS=0
FAIL=0
WARN=0

check() {
  if eval "$2" &>/dev/null; then
    echo "  ✅ $1"
    ((PASS++))
  else
    echo "  ❌ $1"
    ((FAIL++))
  fi
}

warn() {
  if eval "$2" &>/dev/null; then
    echo "  ✅ $1"
    ((PASS++))
  else
    echo "  ⚠️  $1 (optional)"
    ((WARN++))
  fi
}

echo "╔══════════════════════════════════════════╗"
echo "║  Expert Designer — Health Check          ║"
echo "╚══════════════════════════════════════════╝"
echo ""

echo "📁 Project Structure:"
check "CLAUDE.md exists" "[ -f CLAUDE.md ]"
check ".claude/settings.json exists" "[ -f .claude/settings.json ]"
check ".claude/hooks/pre-commit.sh exists" "[ -f .claude/hooks/pre-commit.sh ]"
check "pre-commit.sh is executable" "[ -x .claude/hooks/pre-commit.sh ]"
check "docs/ directory exists" "[ -d docs ]"
check "docs/architecture.md exists" "[ -f docs/architecture.md ]"
check "docs/decisions/ has at least one ADR" "ls docs/decisions/ADR-*.md &>/dev/null"
check "docs/runbooks/ has files" "ls docs/runbooks/*.md &>/dev/null"
check ".gitignore excludes .env" "grep -q '.env' .gitignore 2>/dev/null"
echo ""

echo "🔧 Settings Validation:"
check "settings.json is valid JSON" "python3 -c 'import json; json.load(open(\".claude/settings.json\"))' 2>/dev/null || node -e 'JSON.parse(require(\"fs\").readFileSync(\".claude/settings.json\"))'"
echo ""

echo "🧠 Skills:"
for skill_dir in .claude/skills/*/; do
  if [ -d "$skill_dir" ]; then
    skill_name=$(basename "$skill_dir")
    check "Skill '$skill_name' has SKILL.md" "[ -f '${skill_dir}SKILL.md' ]"
  fi
done
echo ""

echo "📊 External Skills:"
warn "find-skills installed" "[ -f .claude/skills/find-skills/SKILL.md ]"
warn "content-strategy installed" "[ -f .claude/skills/content-strategy/SKILL.md ]"
warn "social-content installed" "[ -f .claude/skills/social-content/SKILL.md ]"
warn "pricing-strategy installed" "[ -f .claude/skills/pricing-strategy/SKILL.md ]"
warn "ui-ux-pro-max installed" "[ -f .claude/skills/ui-ux-pro-max/SKILL.md ]"
warn "frontend-design installed" "[ -f .claude/skills/frontend-design/SKILL.md ]"
warn "writing-plans installed" "[ -f .claude/skills/writing-plans/SKILL.md ]"
echo ""

echo "📝 CLAUDE.md Sections:"
if [ -f CLAUDE.md ]; then
  for section in "Identity" "Structure" "Conventions" "Skills" "Commands" "Guardrails" "Context"; do
    warn "CLAUDE.md has '$section' section" "grep -qi '$section' CLAUDE.md"
  done
fi
echo ""

echo "════════════════════════════════════════════"
echo "  Results: ✅ $PASS passed | ❌ $FAIL failed | ⚠️  $WARN warnings"
echo "════════════════════════════════════════════"

if [ $FAIL -gt 0 ]; then
  echo "  ⛔ Fix the failures above before proceeding."
  exit 1
else
  echo "  🎉 Project is healthy!"
  exit 0
fi
