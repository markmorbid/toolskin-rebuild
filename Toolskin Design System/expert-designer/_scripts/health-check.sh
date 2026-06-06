#!/usr/bin/env bash
# Expert Designer Skill — Project Health Check v6
# Run: bash scripts/health-check.sh

set -u
PASS=0
FAIL=0
WARN=0

# colors
G='\033[32m'; R='\033[31m'; Y='\033[33m'; D='\033[2m'; B='\033[1m'; X='\033[0m'

check() {
  if eval "$2" &>/dev/null; then
    printf "  ${G}✓${X} %s\n" "$1"; PASS=$((PASS+1))
  else
    printf "  ${R}✗${X} %s\n" "$1"; FAIL=$((FAIL+1))
  fi
}

warn() {
  if eval "$2" &>/dev/null; then
    printf "  ${G}✓${X} %s\n" "$1"; PASS=$((PASS+1))
  else
    printf "  ${Y}⚠${X} %s ${D}(optional)${X}\n" "$1"; WARN=$((WARN+1))
  fi
}

printf "\n${B}── Expert Designer · Toolskin Health Check ──${X}\n\n"

# ── 1 · Skill files ──
printf "${B}1. Skill structure${X}\n"
check "expert-designer/SKILL.md exists"               "[ -f expert-designer/SKILL.md ]"
check "01-foundation reference"                       "[ -f expert-designer/references/01-foundation.md ]"
check "02-typography reference"                       "[ -f expert-designer/references/02-typography.md ]"
check "03-layout-and-spacing reference"               "[ -f expert-designer/references/03-layout-and-spacing.md ]"
check "04-cards-and-containers reference"             "[ -f expert-designer/references/04-cards-and-containers.md ]"
check "05-awwwards-patterns reference"                "[ -f expert-designer/references/05-awwwards-patterns.md ]"
check "06-component-recipes reference"                "[ -f expert-designer/references/06-component-recipes.md ]"
printf "\n"

# ── 2 · Scripts ──
printf "${B}2. Scripts${X}\n"
check "generate-colors.js exists"                     "[ -f expert-designer/scripts/generate-colors.js ]"
check "audit-design.mjs exists"                       "[ -f expert-designer/scripts/audit-design.mjs ]"
check "health-check.sh exists"                        "[ -f expert-designer/scripts/health-check.sh ]"
check "scaffold-component.sh exists"                  "[ -f expert-designer/scripts/scaffold-component.sh ]"
printf "\n"

# ── 3 · Templates ──
printf "${B}3. Templates${X}\n"
check "seed-page.html exists"                         "[ -f expert-designer/templates/seed-page.html ]"
check "tokens.css exists"                             "[ -f expert-designer/templates/tokens.css ]"
warn "showcase.html exists"                           "[ -f expert-designer/showcase.html ]"
printf "\n"

# ── 4 · Color engine ──
printf "${B}4. Color engine${X}\n"
if command -v node &>/dev/null; then
  if [ -f expert-designer/scripts/generate-colors.js ]; then
    # Try running the generator (require node modules — may not be installed in this scaffold)
    if (cd expert-designer && node scripts/generate-colors.js 2>/dev/null); then
      printf "  ${G}✓${X} generate-colors.js runs and APCA passes\n"; PASS=$((PASS+1))
    else
      printf "  ${Y}⚠${X} generate-colors.js needs node deps ${D}(npm install apcach culori)${X}\n"; WARN=$((WARN+1))
    fi
  fi
else
  printf "  ${Y}⚠${X} node not available — color generator can't run\n"; WARN=$((WARN+1))
fi
printf "\n"

# ── 5 · Guardrails in any CSS ──
printf "${B}5. Guardrail scan (any local CSS)${X}\n"
if ls expert-designer/**/*.css 2>/dev/null | head -1 >/dev/null; then
  if grep -rn "!important" expert-designer/**/*.css 2>/dev/null | head -1 >/dev/null; then
    printf "  ${R}✗${X} '!important' found in CSS:\n"; FAIL=$((FAIL+1))
    grep -rn "!important" expert-designer/**/*.css 2>/dev/null | head -5 | sed 's/^/      /'
  else
    printf "  ${G}✓${X} no !important declarations in skill CSS\n"; PASS=$((PASS+1))
  fi
else
  printf "  ${D}— no local CSS to scan${X}\n"
fi
printf "\n"

# ── summary ──
printf "${B}── Summary ──${X}\n"
printf "  ${G}%d passed${X}  ·  ${R}%d failed${X}  ·  ${Y}%d warnings${X}\n\n" "$PASS" "$FAIL" "$WARN"

if [ $FAIL -gt 0 ]; then
  printf "${R}${B}HALT.${X} Fix the failures above before designing.\n\n"
  exit 1
else
  printf "${G}${B}✓ skill is healthy.${X}\n\n"
  exit 0
fi
