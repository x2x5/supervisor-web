#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/skills.md"
SKILLS_DIR="$ROOT/plugins/phd-research/skills"

cat > "$OUT" <<'HDR'
# Part I: 写作 Prompt 集合

> 由 Supervisor-Skills 的 `plugins/phd-research/skills/*/SKILL.md` 自动聚合。

### Supervisor Skills
HDR

for f in "$SKILLS_DIR"/*/SKILL.md; do
  skill_dir="$(basename "$(dirname "$f")")"
  title="$skill_dir"
  case "$skill_dir" in
    idea-evaluator) title="Idea Evaluator" ;;
    vibe-research-workflow) title="Vibe Research Workflow" ;;
    intro-drafter) title="Introduction Drafter" ;;
    tech-paper-template) title="Tech Paper Template" ;;
    benchmark-paper-template) title="Benchmark Paper Template" ;;
    pre-submission-reviewer) title="Pre-Submission Reviewer" ;;
    figure-designer) title="Figure Designer" ;;
  esac
  {
    echo
    echo "## $title"
    echo
    echo '```markdown'
    cat "$f"
    echo
    echo '```'
  } >> "$OUT"
done

cat >> "$OUT" <<'TAIL'

---

# Part II: 说明

本文件用于网页卡片展示，保持 `Part I` 结构即可被页面解析。
TAIL

echo "Generated: $OUT"
