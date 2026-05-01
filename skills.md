# Part I: 写作 Prompt 集合

> 由 Supervisor-Skills 的 `plugins/phd-research/skills/*/SKILL.md` 自动聚合。

### Supervisor Skills

## Benchmark Paper Template

```markdown
---
name: benchmark-paper-template
description: Structures Benchmark and Evaluation papers using the five-pillar framework (Research Gap, Construction Pipeline, Evaluation Framework, Empirical Findings, optional Companion Method). Returns a completeness audit, a six-part Introduction logic chain, a Section 2-7 skeleton, and a pre-submission checklist. Use when writing a benchmark paper, structuring a benchmark paper, checking whether a benchmark idea is substantive, drafting a benchmark Introduction, or planning the data-construction pipeline or experiments.
license: CC-BY-4.0
---

# Benchmark Paper Template

## Overview

A Benchmark paper does not win by proposing a new algorithm. It wins by defining a new evaluation dimension and shipping a construction pipeline that makes the measurement high-quality, scalable, and reproducible. This skill scaffolds the five pillars a reviewer checks, then gives you a six-part Introduction chain, a Section 2-7 skeleton, and a pre-submission checklist. Stage-specific depth lives in seven reference files under `references/`.

## Core capabilities

1. **Five-pillar completeness audit**: is the Research Gap articulated? Is the Construction Pipeline principled? Is the Evaluation Framework fine-grained? Do the Empirical Findings reveal capability boundaries? Is a Companion Method warranted?
2. **Introduction six-part logic chain**: Background + Running Example, Existing-Benchmark Limitations (no more than three), Research Questions, Design Considerations, Our Proposal, Contributions.
3. **Section skeleton for §2 to §7**: Task and Design Goals, Construction Pipeline, Optional Companion Method, Experiments organized by RQ, Discussion and Research Opportunities, Related Work with benchmark comparison table, Conclusion.
4. **Pre-submission self-check**: four-category reviewer checklist (Introduction, Benchmark section, Experiments, Overall) with Critical, Major, Minor severity.

## Benchmark paper vs technical paper

| Dimension | Technical paper | Benchmark paper |
|---|---|---|
| Main contribution | Novel algorithm or method | Novel evaluation dimension or dataset |
| Introduction axis | Key Idea or Mechanism | Evaluation Gap and Benchmark Design Rationale |
| Problem definition | One-sentence goal | The problem definition IS the contribution |
| Heaviest chapter | Method | Construction Pipeline + Evaluation Framework |
| Experiments purpose | Prove "my method beats baselines" | Reveal "where model capability boundaries sit" |
| Canonical Figure 1 | Method framework diagram | Running example + pipeline diagram |

For technical and position papers, use the `tech-paper-template` skill. For the Introduction outline in isolation, use `intro-drafter`.

## The five pillars

1. **Research Gap**. What dimension of evaluation does existing work miss? Ground the gap in a concrete failure case and cite at least three prior benchmarks whose limitations you are addressing (no more than three). Exemplars: StatQA highlights missing statistical-method appropriateness; nvBench 2.0 highlights query-ambiguity blindness; VisJudge-Bench highlights the fidelity-expressiveness-aesthetics trinity in visualization evaluation.
2. **Construction Pipeline**. How do you build high-quality, scalable, reproducible data? Three common paradigms: Reverse Synthesis (seed knowledge then instantiate), Controlled Injection (seed queries then inject targeted ambiguity or error), Adaptive Generation with Expert Validation. Specify source selection, generation, annotation, quality control, split strategy, and statistical profile. Deep dive: `references/construction-pipeline.md`.
3. **Evaluation Framework**. Beyond a single overall score: difficulty tiers, error taxonomy, per-dimension rubrics. Explain why this taxonomy diagnoses what the gap pointed at. Deep dive: `references/benchmark-design.md`.
4. **Empirical Findings**. Multi-angle comparisons (Human vs LLM, architecture families, error distributions) condensed into bolded *Finding X:* sentences that read like lemmas. Each Finding must be actionable for future research. Deep dive: `references/experiments.md`.
5. **Companion Method (optional)**. A specialized model tuned for this benchmark signals that the community can act on the findings. Examples: Step-Text2Vis, VisJudge. Not mandatory, but strongly recommended for benchmarks targeting mature tasks.

## Introduction six-part flowchart

1. **Research Background + Running Example (Figure 1)**. Establish the task, why it matters, and one concrete example that threads through the entire paper.
2. **Existing-Benchmark Limitations**. At most three, each specific and traceable to an evaluation blind spot. Avoid vague "is limited" phrasing.
3. **Research Questions**. Two or three RQs covering construction quality, capability boundaries, and the human-AI gap.
4. **Design Considerations**. What should a good benchmark for this dimension have? Quality, scale, coverage, reproducibility, contamination resistance.
5. **Our Proposal**. One paragraph: the benchmark plus the companion method if any.
6. **Contributions**. Typically four items: benchmark + pipeline innovation + systematic evaluation + findings or companion method.

## Section skeleton

- **§2 Task + Design Goals**: problem formulation, goals (G1 coverage, G2 fine-grained diagnostics, G3 reproducibility, G4 contamination resistance). See `references/benchmark-design.md`.
- **§3 Construction Pipeline**: sources, generation, annotation protocol, QC, statistical profile. Figure 2 is the canonical pipeline diagram. See `references/construction-pipeline.md`.
- **§4 Companion Method (optional)**: a specialized model whose training set is this benchmark.
- **§5 Experiments**: organized by RQ. Include the Overall Performance table (typically the largest table in the paper), fine-grained analysis, a human baseline when available, and bolded *Finding X:* summaries. See `references/experiments.md`.
- **§6 Discussion + Research Opportunities**: what the findings reveal and what comes next.
- **§7 Related Work**: a benchmark comparison table (often labelled Table 1) is essential, either here or at the end of §1.

The full section-by-section writing guide with page budgets and figure placement is in `references/paper-structure.md`.

## Prompt template

Paste the block below into your AI assistant with the input slots filled.

```markdown
# Role
You are a senior researcher who has published multiple Benchmark papers at top venues (NeurIPS Datasets and Benchmarks Track, SIGMOD, VLDB, ICML, ICLR). You know what reviewers look for in Benchmark submissions and how those criteria differ from Technical papers.

# Task
I will give you the core information about a Benchmark or Evaluation paper. Audit it against the five-pillar framework, then produce a complete logic skeleton for the paper.

# Five pillars (all must be addressed)
1. Research Gap: which dimension of evaluation does existing work miss?
2. Construction Pipeline: how is the data built at scale without losing quality?
3. Evaluation Framework: what is the fine-grained taxonomy?
4. Empirical Findings: what capability boundary does this reveal?
5. Companion Method (optional): a specialized model tuned for this benchmark.

# Input
- Research area: [e.g., Text-to-SQL, Text-to-Visualization, code generation]
- Benchmark name: [name]
- Research gap and motivation: [the evaluation blind spot you target]
- Construction approach: [how the data is built]
- Evaluation framework: [metrics and taxonomy]
- Data scale: [number of tasks, domains, difficulty tiers]
- Key findings or insights: [one to three]

# Output

## Step 1: Five-pillar completeness table

| Pillar | Covered? | Your content | Improvement suggestion |
|---|---|---|---|
| Research Gap | Y or N | ... | ... |
| Construction Pipeline | Y or N | ... | ... |
| Evaluation Framework | Y or N | ... | ... |
| Empirical Findings | Y or N | ... | ... |
| Companion Method | Y, N, or NA | ... | ... |

## Step 2: Introduction six-part logic chain

| Part | Your content |
|---|---|
| 1. Background + Running Example | ... |
| 2. Existing-benchmark limitations (up to 3) | Limitation 1: ... | Limitation 2: ... | Limitation 3: ... |
| 3. Research Questions | RQ1: ... | RQ2: ... | RQ3 (optional): ... |
| 4. Design Considerations | ... |
| 5. Our Proposal | ... |
| 6. Contributions | 1. ... | 2. ... | 3. ... | 4. ... |

## Step 3: Section outline for §2 to §7

For each section, produce a one-paragraph sketch naming the figure or table that carries its weight.

## Step 4: Pre-submission self-check

Load `references/checklist.md` and walk the four-category checklist. Report any Critical or Major items that are unresolved.
```

## Reference exemplars

- **StatQA (NeurIPS 2024)**: gap is evaluation of statistical-method appropriateness; pipeline is reverse synthesis from textbooks; finding is that LLMs often pick the statistically wrong test even when the numeric answer is computed correctly.
- **nvBench 2.0 (NeurIPS 2025)**: gap is query-ambiguity blindness in Text-to-Visualization; pipeline is controlled ambiguity injection; finding is that LLM output quality swings dramatically with minor wording changes, while humans navigate via clarification dialogue.
- **VisJudge-Bench (ICLR 2026)**: gap is the fidelity-expressiveness-aesthetics trinity in visualization quality; pipeline is expert-curated with adaptive generation; companion method is VisJudge, a specialized judge model trained on this benchmark.

## Usage tips

- Use early, at scope lock. The cheapest fix for a missing pillar is before data construction starts.
- When the user's answer to a pillar is "we have this but it is messy", point them to the specific file in `references/` rather than trying to resolve it in one turn.
- Do not confuse this Introduction flowchart with the technical-paper flowchart; they are structurally different. For technical papers, invoke `tech-paper-template`.
- For pre-submission self-check, load `references/checklist.md` and walk it line by line with the user.

## References

- [`references/gap-analysis.md`](references/gap-analysis.md): systematic identification of the evaluation blind spot.
- [`references/benchmark-design.md`](references/benchmark-design.md): design goals, task scope, taxonomy patterns, evaluation framework.
- [`references/construction-pipeline.md`](references/construction-pipeline.md): the three construction paradigms, pipeline stages, quality control.
- [`references/experiments.md`](references/experiments.md): baseline selection, RQ-driven analysis, *Finding X* pattern, case studies.
- [`references/paper-structure.md`](references/paper-structure.md): section-by-section writing with page budgets and figure placement.
- [`references/checklist.md`](references/checklist.md): four-category pre-submission checklist with severity classification.
- [`references/instantiation-template.md`](references/instantiation-template.md): fillable template for instantiating this thinking model on your paper.
- [`references/orchestrator-notes.md`](references/orchestrator-notes.md): historical notes from the earlier staged orchestrator architecture, kept for context.

```

## Figure Designer

```markdown
---
name: figure-designer
description: >-
  Advises on the design of the three core figures in a technical paper:
  the Motivated Example (Figure 1), the Solution Overview
  (Methodology), and the Experimental Results figures. Recommends the
  right design paradigm, layout, labelling, and tool for each figure
  type, then runs a quality-control audit. Use when the user asks to
  'design a figure', 'draw Figure 1', 'plot experiment results',
  'choose the right chart type', 'which figure tool to use', or
  'figure looks unprofessional'.
license: CC-BY-4.0
---

# Figure Designer

## Overview

A top-venue paper typically carries six to eight figures, with three
carrying almost all the storytelling weight: the Motivated Example
(Figure 1, on page 1 or the top of page 2), the Solution Overview
(inside the Methodology section), and the Experimental Results
figures (inside the Experiments section). Reviewers scan these three
in under a minute to decide whether the paper is worth reading in
detail; weak figures sink otherwise-strong papers.

This skill takes the user's intent (what they want to communicate)
plus context (research area, method name, target venue) and returns
the recommended paradigm, a layout sketch, labelling guidance,
tool suggestion, and a quality-control audit against a universal
rule set (vector format, font size, colour-blind-safe encoding,
self-contained caption, honest axis ranges).

## When to use this skill

- Before drawing any figure in a paper.
- The user asks to 'design a figure', 'draw Figure 1', 'plot
  experiment results', 'choose the right chart type'.
- The user has drawn a figure and wants a design audit.
- The user is unsure which figure type or paradigm to choose.
- Preparing camera-ready figures before submission.

## When NOT to use this skill

- The user only wants generic plotting help (bar chart, line chart)
  outside a paper. Regular assistance suffices.
- The paper is not yet structured; use `intro-drafter` or
  `tech-paper-template` first to decide what figures the paper
  needs.
- The user wants a review of an already-finished paper. Use
  `pre-submission-reviewer`.

## Core procedure

### Step 1: Figure-type identification

Decide which of the three core types the figure is. If the user's
request does not match any, either it is a supporting figure (use
the experimental-results guidance as a base) or it does not belong
in the paper.

If the mode is `figure-audit` and the user has provided an image
path, load the image with the Read tool **before** proceeding to
Step 2. Vision-based inspection enables the universal rule audit
in Step 6 to check font legibility, colour palette, raster-vs-
vector tells, and chartjunk directly rather than relying on user
description. If no image is provided, continue in text-only mode
and mark vision-only rules (font size, raster detection, colour
palette) as "user must verify" in the final audit report.

### Step 2: Paradigm recommendation

See: references/motivated-example.md, references/solution-overview.md,
or references/experimental-results.md depending on figure type.

Each figure type has two to three canonical paradigms. Pick the one
that fits the user's storytelling need, and explain why the other
paradigms fit less well.

### Step 3: Layout sketch

Produce a text description of the layout: panel positions, element
placement, arrows, colour assignments. The goal is that the user
could draw the first draft from the sketch alone.

### Step 4: Labelling and annotation guidance

- Name every visible element concretely (no "Module A", "X", "Y").
- Annotate critical points (failure highlight, success highlight,
  comparison emphasis).
- Specify font sizes and colour palette. Default colour palette:
  ColorBrewer Qualitative or Viridis for sequential.

### Step 5: Tool suggestion

See: references/tools.md for the tool matrix and the decision
heuristic.

Default recommendations:

- Motivated Example and Solution Overview: PowerPoint (draft),
  Figma (polish).
- Experimental Results: Matplotlib or Seaborn in a reusable
  `plot_utils.py` script.
- LaTeX-integrated figures: TikZ or PGFPlots.

### Step 6: Universal rule audit

See: references/design-rules.md for the full universal rule set.

Verify every proposed or existing figure against:

- Vector format (PDF, EPS, SVG) for export.
- Font size at least 8pt post-scaling.
- Small canvas (not large canvas with small fonts).
- Colour-blind-safe palette; no colour-only encoding.
- Self-contained caption whose first sentence states the core
  finding.
- Honest axis ranges.
- No 3D effects, no chartjunk.

Flag every violation with severity.

### Step 7: Integrity gate

Run the checks in the Integrity gate section below.

### Step 8: Output

Emit the full design in the Output format below.

## Integrity gate

Bullets tagged [inspection] are checked by the LLM from its own
output. Bullets tagged [user-verify] require the user to confirm
because the check depends on either the drawn figure or knowledge
the skill does not have (paper context, prior Introduction).

Before returning the design:

1. **[inspection]** Paradigm matches figure type (motivated example
   is not a pipeline; overview is not a bar chart).
2. **[inspection]** Layout sketch is concrete enough that the user
   could draw from it.
3. **[inspection]** Labels are real entity names, not placeholders.
4. **[inspection]** Tool suggestion matches the figure's complexity
   (not Matplotlib for a multi-icon motivated example, not
   PowerPoint for a 20-method bar chart).
5. **[inspection] when image provided, [user-verify] text-only**
   Universal rule audit has been run; no CRITICAL violation is
   left unaddressed. Vision-only rules (raster-vs-vector, font
   size, colour palette) are only checkable when the user supplies
   an image.
6. **[user-verify]** For motivated examples, the example is the
   same running example referenced by the Introduction (no new
   example introduced in Figure 1). The skill does not see the
   Introduction; the user confirms.
7. **[inspection]** For experimental results, the chart type
   matches the data type (time-series uses line, multi-method
   comparison uses grouped bar, trade-off uses scatter).

If any [inspection] check fails, mark the design as "needs user
attention". For [user-verify] items, surface them to the user as
items they must confirm before submission.

## Output format

### 1. Figure type
- Type: <motivated-example or solution-overview or experimental-results>
- Reason: <one sentence>

### 2. Paradigm recommendation
- Paradigm: <name>
- Why this paradigm: <rationale>
- Alternatives considered and rejected: <list>

### 3. Layout sketch
- Canvas: <size>
- Panels: <list with positions and contents>
- Arrows and connections: <list>
- Colour assignment: <mapping>

### 4. Labelling and annotations
- Element names: <list>
- Critical highlights: <list>
- Font sizes: <target>
- Colour palette: <name>

### 5. Tool suggestion
- Primary: <tool>
- Alternative: <tool>
- Reason: <rationale>

### 6. Universal rule audit
- [ ] Vector format: <pass or fail>
- [ ] Font size: <pass or fail>
- [ ] Colour-blind safe: <pass or fail>
- [ ] Self-contained caption: <pass or fail>
- [ ] Honest axis range (if applicable): <pass or fail>
- [ ] No chartjunk: <pass or fail>

### 7. Integrity gate result
- Gate 1-7: <pass or fail>

### 8. Severity summary
- <n> CRITICAL, <m> MAJOR, <k> MINOR
- Top three actions first: ...

```

## Idea Evaluator

```markdown
---
name: idea-evaluator
description: >-
  Evaluates a preliminary research idea against a five-dimension framework
  (Higher, Faster, Stronger, Cheaper, Broader) plus idea-lifecycle and
  student-capability matching, paradigm-shift probing, and a fatal-flaws
  audit. Returns a reviewer-style verdict. Use when the user has a draft
  research idea and asks whether it is worth pursuing, asks to 'evaluate
  this idea', 'score this idea', 'assess feasibility', 'novelty check',
  'is this a good research direction', or before committing to a paper
  scope.
license: CC-BY-4.0
---

# Idea Evaluator

## Overview

This skill evaluates a preliminary research idea from the combined
perspective of a top-venue reviewer and an experienced advisor. It
scores the idea against five improvement dimensions from the
idea-generation guide (Higher, Faster, Stronger, Cheaper,
Broader), matches the idea's lifecycle against the user's actual
capability and available hours per week, probes whether the idea has
paradigm-shift potential, flags fatal flaws, and returns one of three
verdicts: Strong Accept, Accept with Revisions, or Reject and Pivot.

The goal is to kill weak ideas before the student invests months, and to
shape promising-but-underdeveloped ideas into stronger forms before
writing begins.

## When to use this skill

- The user has a draft idea and asks whether it is worth pursuing.
- The user asks for novelty check, feasibility assessment, or scoring.
- Before the user commits to a paper scope or starts implementation.
- The user is comparing two or three candidate ideas and needs a
  structured trade-off.
- The user suspects scope creep and wants an external check.
- The user mentions 'evaluate this idea', 'score this idea', 'assess
  feasibility', or 'is this a good research direction'.

## When NOT to use this skill

- The user has already implemented the idea and is writing the paper.
  Use `intro-drafter`, `tech-paper-template`, or
  `benchmark-paper-template` (separate plugin) instead.
- The user explicitly wants brainstorming of new ideas from scratch.
  Use plain conversation; see handbook 2.3 for a disruptive-innovation
  playbook.
- The user asks for review of an existing manuscript. Use
  `pre-submission-reviewer`.
- The user asks to evaluate a benchmark contribution specifically.
  Use `benchmark-paper-template` (separate plugin) in targeted mode.

## Core procedure

### Step 1: First impression and paper-type positioning

Read the user's idea description. In one paragraph, state whether the
idea reads as Novel Problem, Novel Method, or New Setting. Is the
story compelling in one sentence? If you cannot write that sentence,
the idea itself is probably not yet clear enough for evaluation; ask
the user to restate.

### Step 2: Fatal-flaws audit (early gate)

See: references/fatal-flaws.md for the ten canonical fatal flaws,
each with a detection rule and a defense strategy.

Run the fatal-flaws audit **before** the scoring steps rather than
after them. Identify at most two fatal flaws. For each, state the
flaw, cite the detection rule, and recommend a concrete defense.

**Short-circuit rule.** If any fatal flaw is tagged CRITICAL in the
severity taxonomy (single-handedly causes rejection, unfixable
within the lifecycle), stop here and emit the verdict directly:

- Verdict: Reject and Pivot.
- Output sections 1 (First impression), 2 (Fatal flaws with the
  CRITICAL flaw), and 8 (Verdict with the flaw-driven rationale)
  only.
- Do **not** run the five-dimension scoring, paradigm-shift probe,
  feasibility check, or integrity gate. Those would be decoration
  on a rejection.

If no CRITICAL flaw is found, continue to Step 3.

### Step 3: Lifecycle and capability matching

See: references/lifecycle-capability-matching.md for the six-category
lifecycle matrix, capability self-assessment rubric, and mismatch
recovery strategies.

Map the idea onto one of six categories (Application, Foundational
Theory, Cross-Disciplinary, Frontier Exploration, Data-Intensive,
Innovative Technique). Match against the user's declared capability
(effective hours per week, skill depth, theoretical versus applied
strength). Output a mismatch flag if lifecycle is shorter than the
user's realistic execution window.

### Step 4: Five-dimension scoring

See: references/five-dimensions.md for each dimension's entry
strategies, scoring rubric, and worked examples.

Score the idea on each of:

- **Higher**: effectiveness and accuracy gains.
- **Faster**: efficiency and cost reduction.
- **Stronger**: robustness, noise tolerance, generalisation.
- **Cheaper**: data, annotation, or solution cost reduction.
- **Broader**: cross-domain transplantation or unification.

Score each 1-10 with explicit evidence from the user's stated
contribution. Identify the two or three dimensions where the idea
has the highest ceiling and recommend emphasising those in the paper.

### Step 5: Paradigm-shift probe

See: references/paradigm-shift-probe.md for the four probing principles
(First Principles, Elephant in the Room, Technology Cycle, Hamming's
Rule) and the cross-reference to handbook section 2.3 when deeper
disruptive-innovation exploration is needed.

Test the idea against four questions:

1. Does it challenge a hidden assumption the field takes for granted?
2. Does it address an elephant-in-the-room problem everyone sees but
   nobody wants to touch?
3. Does it ride a technology-cycle shift (for example, LLMs making a
   previously impractical approach now feasible)?
4. If this problem solved itself, would the field change meaningfully?
   (Hamming's Rule)

Two or more yes answers means the idea has disruptive potential. Note
that, and recommend reading handbook 2.3 to deepen the thinking on
disruptive-innovation dimensions.

### Step 6: Feasibility check

Against the user's stated resources (hardware, data access, team size,
engineering skills, timeline), assess:

- Compute risk: does the experiment fit on stated hardware?
- Data risk: is the required data accessible, or does it need
  expensive annotation or private sources?
- Engineering risk: does the implementation match the user's skill
  stack?
- Timeline risk: does the estimated end-to-end duration (coding,
  experiments, writing, revision) fit within the idea's lifecycle?

If any risk is high, flag it explicitly with a suggested mitigation.

### Step 7: Integrity gate

Before emitting the verdict, run the checks in the Integrity gate
section below.

### Step 8: Final verdict

Issue one of three verdicts:

- **Strong Accept**: execute now. Two or more dimensions at 8+, no
  fatal flaws, capability match green, lifecycle fit.
- **Accept with Revisions**: pivot the scope per recommendations
  before starting. Some dimensions weak, fixable flaws, or lifecycle
  mismatch that can be shortened.
- **Reject and Pivot**: do not pursue this version. Dominated by a
  prior benchmark or method, unfixable capability mismatch, or more
  than one fatal flaw.

Emit the evaluation in the Output format below.

## Integrity gate

Each bullet is tagged with an enforceability class. [inspection]
means the LLM can verify the bullet from the produced output alone.
[attestation] means the LLM states it has done the check, but the
user remains responsible for verification. [user-attest] means the
bullet is a user-side rule the skill cannot confirm.

Before returning the verdict:

1. **[inspection]** Every dimension score cites specific evidence
   from the user's stated contribution; no score is "gut feeling".
2. **[inspection]** Feasibility claims reference the user's stated
   resources, not generic assumptions.
3. **[inspection]** Novelty claims either cite specific prior work
   or are labelled "unverified; literature check required".
4. **[inspection]** Fatal flaws are specific and actionable; "this
   might not work" is not a flaw statement.
5. **[inspection]** Verdict is consistent with scoring: Strong
   Accept requires at least two dimensions at 8+ and zero CRITICAL
   flaws.
6. **[inspection]** Paradigm-shift claim cites which probing
   question was answered positively.
7. **[attestation]** Lifecycle prediction is reasoned from the
   field's recent pace; the user should sanity-check against their
   own knowledge of the subfield before acting on it.

If any [inspection] check fails, downgrade the verdict and mark
the corresponding output section as "needs user attention". For
[attestation] bullets, the skill states the check was run and the
user confirms the result.

## Output format

### 1. First impression
- Paper type: <Novel Problem or Novel Method or New Setting>
- One-sentence story: <...>

### 2. Fatal-flaws audit (early gate)
| # | Flaw | Severity | Defense |
|---|---|---|---|
| 1 | ... | CRITICAL or MAJOR | ... |

*If any CRITICAL flaw is present, skip sections 3-7 and go to
section 8 with verdict Reject and Pivot.*

### 3. Lifecycle and capability match
| Aspect | User's input | Assessment |
|---|---|---|
| Idea category | ... | ... |
| Lifecycle | ... months | ... |
| Weekly effective hours | ... | ... |
| Fit | ... | Green or Yellow or Red |

### 4. Five-dimension radar
| Dimension | Score 1-10 | Evidence | Lift suggestion |
|---|---|---|---|
| Higher | ... | ... | ... |
| Faster | ... | ... | ... |
| Stronger | ... | ... | ... |
| Cheaper | ... | ... | ... |
| Broader | ... | ... | ... |

### 5. Paradigm-shift probe
| Probe | Yes or No | Rationale |
|---|---|---|
| First Principles | ... | ... |
| Elephant in the Room | ... | ... |
| Technology Cycle | ... | ... |
| Hamming's Rule | ... | ... |

Disruptive potential: <none, possible, strong>.

### 6. Feasibility
| Risk | Level | Mitigation |
|---|---|---|
| Compute | ... | ... |
| Data | ... | ... |
| Engineering | ... | ... |
| Timeline | ... | ... |

### 7. Integrity gate result
- Gate 1 through 7: <pass or fail>

### 8. Verdict
**<Strong Accept or Accept with Revisions or Reject and Pivot>**

Top three actions to take first:
1. ...
2. ...
3. ...

```

## Introduction Drafter

```markdown
---
name: intro-drafter
description: >-
  Drafts a 6-paragraph Introduction outline for a technical paper from a
  structured Flowchart: background and running example, existing
  limitations, problem essence and goal, key challenges, solution
  overview, contributions. Positions the paper as Technique or New
  Problem/Setting and aligns contributions with challenges. Use when
  the user asks to 'draft the Introduction', 'outline the
  Introduction', 'intro logic needs clarifying', 'help structure the
  paper story', or before writing any Introduction prose.
license: CC-BY-4.0
---

# Introduction Drafter

## Overview

The Introduction is the compressed version of the entire paper. In one
and a half to two pages it must state the research object, why the
problem matters, why existing work falls short, what the paper
contributes, and how the contribution maps to section numbers.
Reviewers decide whether to keep reading by the time they finish the
Introduction, so the logical throughline has to be airtight.

This skill takes a small set of inputs (research area, limitations,
hard constraints, key idea, challenges, solution overview) and
produces a six-paragraph outline with an explicit purpose and writing
points for every paragraph, plus a positioning as Technique Paper or
New Problem/Setting Paper. It enforces the rule that contributions
align one-to-one with challenges, and that every claim has a section
to deliver it.

## When to use this skill

- Before writing any Introduction prose.
- The user has finished planning but the Intro story feels fragmented.
- The user has a partial Intro and wants to restructure.
- The user asks to 'draft the Introduction', 'outline the
  Introduction', 'intro logic needs clarifying', or 'help structure
  the paper story'.
- The paper's contributions are clear, but the storyline connecting
  them is not.
- `idea-evaluator` has returned Strong Accept and the next step is
  drafting.

## When NOT to use this skill

- The paper's core idea is not yet stable. Use `idea-evaluator` first.
- The paper is a benchmark paper. Use `benchmark-paper-template` (separate plugin)
  instead; the flowchart differs.
- The user wants to polish Introduction prose that is already
  structured. Use `pre-submission-reviewer` instead.
- The user wants to evaluate whether the Introduction is ready for
  submission. Use `pre-submission-reviewer`.

## Core procedure

### Step 1: Paper-type positioning

See: references/paper-types.md for the Technique versus New
Problem/Setting distinction, positioning criteria, and worked
examples from Alpha-SQL, AFlow, and LEAD.

Decide which type the paper is:

- **Technique Paper**: main contribution is a new method or mechanism
  solving an existing problem. Narrative axis is Key Idea / Mechanism.
  Goal gets one sentence in passing.
- **New Problem/Setting Paper**: main contribution is a new problem
  formulation. Narrative axis is Goal / Problem Formulation. Key
  Idea supports "why this definition is reasonable".

The positioning decides how much weight Paragraph 3 carries: in
Technique papers it is a short bridge; in New Problem papers it is a
load-bearing paragraph.

### Step 2: Paragraph-by-paragraph outline

See: references/flowchart.md for each paragraph's canonical purpose,
writing points, and common failures.

For each of the six paragraphs, return a mini-section containing:

- **Purpose**: one sentence.
- **Writing points**: three to five bullets derived from the user's
  inputs, each actionable.
- **Gaps**: what the user's inputs do not yet cover for this
  paragraph. Tag each with severity (CRITICAL, MAJOR, MINOR).

Paragraphs:

1. Background and Motivation. Running example. Why the problem
   matters in the real world.
2. Limitations of existing work. At most three, each framed as
   "prior work X does not handle Y".
3. Problem essence and Our Goal. Hard constraints explicit. In
   Technique papers this is a bridge; in New Problem/Setting papers
   this is the contribution itself.
4. Key challenges. At most three, each explaining why naive
   extension of prior work fails.
5. Solution overview. Each module addresses a challenge. Expect a
   one-to-one mapping between Paragraph 4 challenges and Paragraph 5
   modules.
6. Contributions. Three or four numbered bullets. Each maps to a
   section reference.

### Step 3: Running example design

See: references/running-example.md for the design principles (real,
specific, simple-yet-complete, recurring throughout), two design
patterns (concrete-failure versus good-versus-bad), and worked
examples.

If the user's inputs do not yet include a running example, propose
two or three candidate examples and ask the user to pick. Record the
chosen example in Paragraph 1 and make sure Paragraph 5 references
it ("the Methodology section applies DynaGraph's hotspot detector to
the running example from Section 1").

### Step 4: Contribution alignment check

See: references/contribution-patterns.md for strong-versus-weak
contribution patterns, anti-patterns, and the canonical mapping to
section numbers.

For each contribution bullet, verify:

- Maps to a challenge in Paragraph 4, a module in Paragraph 5, or a
  specific experiment result.
- Specific, not vague ("comprehensive evaluation" is not a
  contribution).
- Cites the section number that delivers it.

### Step 5: Flowchart consistency check

Verify the six paragraphs form a single logical throughline:

- Paragraph 1's running example is referenced in Paragraph 5 or a
  case study forecast.
- Paragraph 2's limitations motivate Paragraph 4's challenges.
- Paragraph 3's goal aligns with Paragraph 6's contribution 1.
- Paragraph 4's challenges map one-to-one with Paragraph 5's modules.
- Paragraph 5's modules appear in Paragraph 6's contribution 2 or 3.

Any break in the chain is a CRITICAL gap.

### Step 6: Integrity gate

Before emitting the outline, run the checks in the Integrity gate
section below.

### Step 7: Output the outline

Emit the outline in the Output format below. For `interactive` mode,
do not emit; converse one paragraph at a time.

## Integrity gate

All seven bullets are **[inspection]** class: the LLM verifies each
directly from its own output (counting, pattern-matching, or
comparing sections). No user-side attestation required.

Before returning the outline:

1. **[inspection]** Running example named in Paragraph 1 reappears
   in Paragraph 5 or 6 (or the Case Study forecast).
2. **[inspection]** Limitations (Paragraph 2) are at most three and
   each is specific to a named prior work or a named capability.
3. **[inspection]** Challenges (Paragraph 4) are at most three and
   each explains why a naive extension of prior work fails.
4. **[inspection]** Challenge-to-module mapping is one-to-one, not
   one-to-many or many-to-one.
5. **[inspection]** Contributions (Paragraph 6) are three or four
   and each maps to a section number.
6. **[inspection]** No contribution is vague language ("extensive
   experiments", "thorough analysis" on their own).
7. **[inspection]** Paper-type positioning from Step 1 is reflected
   in Paragraph 3's weight.

If any check fails, mark the paragraph as "needs user attention"
and do not claim the outline is complete.

## Output format

### 0. Type positioning
- Type: <Technique Paper or New Problem/Setting Paper>
- Rationale: <one sentence>
- Implication: <how Paragraph 3 weight adjusts>

### 1. Paragraph 1: Background and Motivation
- Purpose: <...>
- Running example: <...>
- Writing points:
  1. ...
  2. ...
- Gaps: <list with severity>

### 2. Paragraph 2: Limitations (at most 3)
- Purpose: <...>
- Writing points:
  - Limitation 1: ...
  - Limitation 2: ...
  - Limitation 3: ... (if applicable)
- Gaps: <list with severity>

### 3. Paragraph 3: Problem Essence and Our Goal
- Purpose: <...>
- Hard constraints: <...>
- Goal sentence candidate: "<...>"
- Writing points: <list>
- Gaps: <list with severity>

### 4. Paragraph 4: Key Challenges (at most 3)
- Purpose: <...>
- Writing points:
  - Challenge 1: ... why naive fails
  - Challenge 2: ...
  - Challenge 3: ...
- Gaps: <list with severity>

### 5. Paragraph 5: Solution Overview
- Purpose: <...>
- Challenge to module mapping:
  - Challenge 1 -> Module A
  - Challenge 2 -> Module B
  - Challenge 3 -> Module C
- Writing points: <list>
- Gaps: <list with severity>

### 6. Paragraph 6: Contributions
1. <contribution 1> (Section <X>)
2. <contribution 2> (Section <Y>)
3. <contribution 3> (Section <Z>)
4. <contribution 4 if applicable> (Section <W>)
- Gaps: <list with severity>

### 7. Flowchart consistency
- Running-example loop: <pass or fail>
- Limitations-challenges link: <pass or fail>
- Goal-contribution1 link: <pass or fail>
- Challenge-module mapping: <pass or fail>
- Contribution-section mapping: <pass or fail>

### 8. Integrity gate result
- Gate 1-7: <pass or fail>

### 9. Severity summary
- <n> CRITICAL, <m> MAJOR, <k> MINOR
- Top three actions first: ...

```

## Pre-Submission Reviewer

```markdown
---
name: pre-submission-reviewer
description: >-
  Runs a pre-submission review of a technical paper across five
  dimensions: macro logic, writing details, English grammar, LaTeX
  formatting, and figure quality. Uses a reviewer-style severity
  taxonomy (CRITICAL / MAJOR / MINOR) and flags banned AI-tone
  vocabulary and em-dash misuse. Use when the user asks to 'review
  this paper', 'audit before submission', 'check the draft', 'find
  issues', 'proofread', or within one week of a submission
  deadline.
license: CC-BY-4.0
---

# Pre-Submission Reviewer

## Overview

Three to five days before a submission deadline is the window where
a careful external review pays off most. This skill takes a full
paper or key sections and produces a structured review across five
dimensions, each with severity-tagged findings and concrete
rewrite suggestions. It enforces the mechanical rules from the
writing-checklist section (no em-dashes, no banned AI-tone
vocabulary, leading text per paragraph, topic-sentence discipline,
citation-format uniformity) and surfaces the patterns that
non-native English-speaking authors most commonly violate
(articles, subject-verb agreement, tense consistency, which versus
that, Chinglish phrasing).

The output is not a rewrite. It is a prioritised list of findings
with severity tags; the author decides which to fix. CRITICAL items
should block submission until addressed.

## When to use this skill

- Three to five days before a submission deadline.
- The user asks to 'review this paper', 'audit before submission',
  'check the draft', 'find issues', 'proofread'.
- After a camera-ready revision, before sending the final version.
- After any major rewrite (rebuttal responses, Section 3 overhaul).
- When the user suspects AI-tone contamination in a section.

## When NOT to use this skill

- The paper is still being structured. Use `tech-paper-template`,
  `intro-drafter`, or `benchmark-paper-template` (separate plugin) first.
- The user wants structural advice rather than review. Use the
  drafting skills instead.

## Core procedure

### Step 1: Dimension 1 Macro logic review

See: references/logic-and-structure.md for the Logic First rule,
Self-contained rule, Leading Text rule, and Running Example rule.

Check:

- Introduction flowchart is intact (Background, Limitations, Goal
  or Key Idea, Challenges, Methodology, Contributions).
- Contributions map one-to-one with methodology modules and with
  section numbers.
- Experiments validate the paper's main claims, not tangential
  ones.
- Related Work covers the necessary prior art.
- Running example is consistent across Introduction, Methodology,
  Experiments.

Every break in the chain is CRITICAL.

### Step 2: Dimension 2 Writing details review

See: references/logic-and-structure.md for paragraph-level rules.

Check:

- Every paragraph has a topic sentence.
- Paragraphs transition smoothly; no orphan paragraphs.
- Paragraphs are not over 10 lines; split if so.
- No repeated or redundant passages.
- Abstract covers problem, method, result.

### Step 3: Dimension 3 English grammar review

See: references/grammar-rules.md for the canonical list of errors
common to non-native English authors, with corrections and
examples.

Check the usual suspects:

- Article use (a, an, the).
- Subject-verb agreement (third-person singular).
- Tense consistency (Related Work past, method present).
- Passive-voice overuse.
- Which versus that.
- Sentence length; split long sentences at "Specifically,".
- Chinglish patterns.

### Step 4: Dimension 4 LaTeX format review

See: references/latex-rules.md for the canonical list of LaTeX-
specific issues.

Check:

- Equation numbering contiguous; every numbered equation
  referenced.
- Figures and tables have captions; captions are detailed.
- Citations use the correct command and the non-breaking tilde
  (for example, `ResNet~\cite{X}`, never `ResNet\cite{X}`).
- Labels use underscores, not spaces or hyphens.
- Vector figure format; no raster.
- Page-limit compliance.

### Step 5: Dimension 5 Figure quality review

See: references/forbidden-patterns.md for chartjunk patterns and
the full figure-quality checklist.

For each figure:

- Vector format.
- Font size large enough post-scaling.
- Colour-blind-safe palette; dual encoding.
- Self-contained caption with a finding in the first sentence.
- No chartjunk.
- Motivated example is concrete and failure-revealing.
- Solution overview has labels matching section titles.

### Step 6: Banned-vocabulary and em-dash scan

See: references/forbidden-patterns.md for the banned-word list.

Scan the full paper for:

- Em-dashes used as sentence connectors (banned; project rule).
- AI-tone words: innovative, pioneering, revolutionary paradigm,
  transformative framework, superior, surpass, excel, remarkable,
  unprecedented, breakthrough performance, general-purpose, is
  capable of, notably, yet, yielding, at its essence, encompass,
  differentiate, reveal, underscore, pave the way for, highlight
  the potential of, profound challenges, stems from, rigid,
  impede.

Flag each occurrence with a severity tag. Em-dashes are MAJOR by
default; banned AI-tone words are MAJOR if they appear three or
more times.

### Step 7: Section-by-section review

See: references/section-guides.md for the per-section writing
guides for Abstract, Introduction, Problem Formulation, Framework
or Method, Experiments, Related Work, and Conclusion.

For each section, check that the section's content matches the
guide's canonical structure (for example, Abstract's five-sentence
formula: what, why, challenges, how, results).

### Step 8: Integrity gate

Run the checks in the Integrity gate section below.

### Step 9: Output

Emit the review in the Output format below.

## Severity taxonomy

- **CRITICAL**: blocks submission. Example: contributions do not
  map to sections; introduction flowchart broken; no real-world
  running example; raster figure in final draft; missing key
  baseline; page-limit violation.
- **MAJOR**: reviewers will flag in first round. Example:
  topic-sentence absent from 3+ paragraphs; em-dash in 5+ places;
  banned AI-tone word in 3+ places; Table 1 comparison missing;
  chart type mismatched with data.
- **MINOR**: polish. Example: two long sentences that could be
  split; default Matplotlib styling; single article error.

## Integrity gate

Each bullet is tagged [inspection] (LLM verifies from the paper
text) or [attestation] (LLM runs the procedure and states it has
done so; user remains responsible for confirming completeness).

Before emitting the review:

1. **[inspection]** Every finding quotes specific text (sentence,
   phrase, figure name); no "the Introduction is unclear" without
   a quoted line.
2. **[inspection]** Every CRITICAL finding has a concrete fix
   suggestion, not "rewrite entirely".
3. **[inspection]** No fabricated quotes: only text actually
   present in the submitted material.
4. **[inspection]** Severity assignments follow the taxonomy;
   nothing is marked CRITICAL for taste reasons.
5. **[inspection]** Dimension 3 (grammar) findings cite the
   specific grammar rule from `references/grammar-rules.md`.
6. **[attestation]** Dimension 6 banned-vocabulary scan is run in
   full on the entire paper, not sampled. The skill attests the
   full scan; if the paper is extremely long, the skill states it
   chunked the input and describes the chunking strategy.
7. **[inspection]** Final score matches the CRITICAL + MAJOR
   count; a score of 9 or 10 requires zero CRITICAL and at most
   two MAJOR items.

If any [inspection] check fails, mark the output as "needs user
attention". For [attestation] bullets, the skill states the scope
of its scan and the user confirms completeness.

## Output format

### Summary
- CRITICAL: <n>
- MAJOR: <m>
- MINOR: <k>
- Top three fixes first: ...

### Dimension 1: Macro logic
| # | Finding | Severity | Suggested fix |
|---|---|---|---|
| 1 | <quoted text> | CRITICAL or MAJOR or MINOR | <fix> |

### Dimension 2: Writing details
<same table shape>

### Dimension 3: English grammar
<same table shape, citing grammar-rule ID>

### Dimension 4: LaTeX format
<same table shape>

### Dimension 5: Figure quality
<same table shape>

### Banned-vocabulary and em-dash scan
<list with line references>

### Integrity gate result
- Gate 1 through 7: <pass or fail>

### Final score (1-10)
<score>

### Submission recommendation
- <Ready to submit | Needs 1-2 days more work | Needs major revision before submission>

```

## Tech Paper Template

```markdown
---
name: tech-paper-template
description: >-
  Structures a technical paper's full logical skeleton using a
  thinking-template table (research background, limitations, key idea
  or goal, challenges, methodology modules, contributions), positions
  the paper as Technique or New Problem/Setting, and runs a four-point
  self-consistency check. Use when the user is brainstorming a paper,
  discussing progress with an advisor, or planning the paper before
  drafting. Also use for 'paper skeleton', 'paper logic chain',
  'thinking template', 'paper-structure planning'.
license: CC-BY-4.0
---

# Tech Paper Template

## Overview

Before drafting any prose, a technical paper needs a full logical
skeleton: the research background, the specific limitations of prior
work, the key idea or research goal, the technical challenges that
prevent a naive solution, the methodology modules that address each
challenge, and the contributions that the paper will claim. This
skill fills in that skeleton via a standardised thinking-template
table, positions the paper type, and runs four self-consistency
checks on the logic chain.

The output is a filled-in thinking template plus a consistency
report. It is suitable for advisor-student brainstorming sessions,
weekly progress meetings, and the final planning step before writing
begins. It does not draft Introduction prose (use `intro-drafter` for
that); it operates at the logical-skeleton layer.

## When to use this skill

- Early brainstorming of a paper project.
- Weekly progress meeting with an advisor or collaborator.
- Pre-drafting planning after `idea-evaluator` returns Strong Accept.
- The paper's logic chain feels incoherent and needs an audit.
- The user asks for 'paper skeleton', 'paper logic chain', 'thinking
  template', or 'paper-structure planning'.
- The user is unsure whether their paper is Technique or New
  Problem/Setting.

## When NOT to use this skill

- The paper is a benchmark paper. Use `benchmark-paper-template` (separate plugin).
- The user needs an Introduction-specific paragraph outline. Use
  `intro-drafter` (typically run this skill first, then
  `intro-drafter`).
- The user has a written draft and wants review feedback. Use
  `pre-submission-reviewer`.
- The idea itself is not yet vetted. Use `idea-evaluator` first.

## Core procedure

### Step 1: Paper-type positioning

See: references/paper-types.md for the positioning criteria and
worked examples.

Decide Technique versus New Problem/Setting. In Technique, the Key
Idea carries the narrative and Our Goal is a short bridge. In New
Problem/Setting, Our Goal is the contribution and the Key Idea
justifies feasibility.

If the user's inputs describe a benchmark, stop and redirect to
`benchmark-paper-template` (separate plugin).

### Step 2: Fill the thinking template

See: references/thinking-template.md for each template cell's content
contract, what a strong cell looks like, and common failure modes.

Fill the seven cells:

1. Research background. Scenario, importance, motivation.
2. Limitations 1 through 3 (2 is acceptable; more than 3 is not).
3. Key idea or Our Goal. One sentence.
4. Challenges 1 through 3 (similar cap).
5. Methodology modules. One module per challenge.
6. Contributions (3 or 4, each mapped to a section).

If a cell is incomplete given the user's inputs, mark it as a gap
with severity.

### Step 3: Run four self-consistency checks

See: references/consistency-checks.md for the detailed checking
procedure and examples of chain breaks.

Run each check:

1. **Limitations to Key Idea**: does the Key Idea or Goal address
   the stated Limitations? If not, either the Limitations are
   wrong or the Key Idea is misaligned.
2. **Key Idea to Challenges**: do the Challenges arise naturally
   from implementing the Key Idea? If not, the challenges are
   invented to justify modules rather than derived from the idea.
3. **Challenges to Methodology**: does each methodology module
   address one challenge? If not, there is a module without
   justification or a challenge without a fix.
4. **Methodology to Contributions**: do the contributions cover
   each module or experimental result? If not, contributions are
   vague or promising more than the paper delivers.

Every failure is CRITICAL.

### Step 4: Generate methodology outline

See: references/thinking-template.md for the methodology-outline
template.

From the challenges, derive a methodology outline: topic sentence,
per-module subsection names, and per-module one-sentence summary.
This becomes the skeleton for Section 3 or 4 of the paper.

### Step 5: Integrity gate

Before emitting, run the checks in the Integrity gate section
below.

### Step 6: Output

Emit the filled template plus the consistency report in the
Output format below.

## Integrity gate

All seven bullets are **[inspection]** class: the LLM verifies each
directly from the filled template (counting, pattern-matching, or
comparing cells). No user-side attestation required.

Before returning the filled template:

1. **[inspection]** Paper-type positioning is consistent with the
   user's actual contribution (Technique paper not shoehorned into
   New Problem framing, or vice versa).
2. **[inspection]** Limitations are specific and cited-able, not
   vague.
3. **[inspection]** Key Idea or Goal is a single sentence a
   reviewer could quote.
4. **[inspection]** Challenges derive from implementing the Key
   Idea; they are not invented.
5. **[inspection]** Methodology modules have one-to-one mapping
   with challenges.
6. **[inspection]** Contributions map to methodology modules and
   to specific sections.
7. **[inspection]** All four self-consistency checks pass.

If any check fails, mark the skeleton as "needs user attention".

## Output format

### 1. Paper-type positioning
- Type: <Technique Paper or New Problem/Setting Paper>
- Rationale: <one sentence>

### 2. Thinking template

| Stage | Your content |
|---|---|
| Research background | ... |
| Limitation 1 | ... |
| Limitation 2 | ... |
| Limitation 3 (if applicable) | ... |
| Key Idea / Our Goal | ... |
| Challenge 1 | ... |
| Challenge 2 | ... |
| Challenge 3 (if applicable) | ... |
| Methodology topic sentence | ... |
| Module A (addresses Challenge 1) | ... |
| Module B (addresses Challenge 2) | ... |
| Module C (addresses Challenge 3) | ... |
| Contribution 1 | ... (Section <X>) |
| Contribution 2 | ... (Section <Y>) |
| Contribution 3 | ... (Section <Z>) |

### 3. Self-consistency checks
- Check 1 Limitations -> Key Idea: <pass or fail>
- Check 2 Key Idea -> Challenges: <pass or fail>
- Check 3 Challenges -> Methodology: <pass or fail>
- Check 4 Methodology -> Contributions: <pass or fail>

### 4. Severity summary
- <n> CRITICAL, <m> MAJOR, <k> MINOR.
- Top three fixes first: ...

### 5. Next suggested skill
- If all checks pass: `intro-drafter` to produce the Introduction
  paragraph outline.
- If checks fail: address the flagged chain breaks first.

```

## Vibe Research Workflow

```markdown
---
name: vibe-research-workflow
description: >-
  Guides AI-assisted research across three sub-flows, Vibe Coding,
  Vibe Figure, and Vibe Writing, with behavioural rules that keep the
  user in charge of academic judgment while delegating mechanical
  work to AI. Recommends the right tool (Cursor, Claude Code, Codex,
  Figma, Gemini) for the current stage. Use when the user asks 'how
  to use AI for research', 'Vibe Coding tips', 'AI-assisted writing
  workflow', 'which AI tool for this', or starts an AI-assisted work
  session.
license: CC-BY-4.0
---

# Vibe Research Workflow

## Overview

Vibe Research is the modern research workflow where large language
models and AI coding tools handle mechanical tasks (implementation,
figure rendering, language polish) while the researcher retains
full ownership of research direction, problem framing, experimental
design, and factual accuracy. The goal is a two-to-five times
productivity gain on routine tasks without compromising academic
integrity.

The skill has three sub-flows: **Vibe Coding** (AI-assisted code),
**Vibe Figure** (AI-assisted figure production), **Vibe Writing**
(AI-assisted prose polish). Each is governed by six behavioural
rules that draw a hard line between acceptable use (mechanical
acceleration, auxiliary suggestions, style correction) and
academic misconduct (fabricated citations, outsourced scientific
judgment, hidden AI authorship).

This skill is a meta-skill that orchestrates tool selection, flow
design, and integrity enforcement across a research session. It
consolidates the the curriculum's Vibe Research section into a
single invocable procedure.

## When to use this skill

- Starting a new AI-assisted work block (a morning of coding, a
  figure day, a writing session).
- The user asks 'how to use AI for research', 'Vibe Coding tips',
  'AI-assisted writing workflow', 'which AI tool for this'.
- The user is choosing between Cursor, Claude Code, Codex, Figma,
  Gemini, or other tools.
- The user wants a workflow plan for a multi-day project
  involving AI.
- The user suspects AI output has drifted into unacceptable
  territory (fabricated citations, outsourced reasoning).

## When NOT to use this skill

- The user wants AI to generate the paper directly. Reject
  politely; the integrity rules forbid it. Redirect to
  `intro-drafter`, `tech-paper-template`, or
  `pre-submission-reviewer` depending on intent.
- The user wants a code implementation done. This skill guides
  the process; it does not replace the implementation itself.
- The user wants to evaluate research direction. Use
  `idea-evaluator` (see handbook 2.3 for disruptive-innovation deep-dive).

## Core procedure

### Step 1: Phase classification

Decide which phase the user is in: coding, figure, writing, or
mixed.

### Step 2: Behavioural rules recap

See: references/behavior-guidelines.md for the full six-rule set.

State the six rules succinctly at the start of the session:

1. AI-assisted work is permitted for literature search and
   organisation, code and debugging support, language and
   expression polish.
2. Research ideas, problems, designs, technical paths,
   experimental plans, core conclusions, and novelty must be the
   user's own and fully understood.
3. Every AI-generated or AI-assisted passage is verified by the
   user against the actual research process, experimental
   results, and facts.
4. No fabricated citations; references come from the user's own
   reading and confirmation.
5. No academic misconduct, including fabricated data,
   experimental results, or plagiarism concealment.
6. Venue or school AI-disclosure requirements are honoured.

These rules are non-negotiable and enforced in the integrity
gate.

### Step 3: Phase-specific procedure

For Vibe Coding, see: references/vibe-coding.md.

For Vibe Figure, see: references/vibe-figure.md.

For Vibe Writing, see: references/vibe-writing.md.

Each phase has its own core techniques (Plan Mode, Small Steps,
Clear Requirements for coding; four-step figure workflow; red-line
rules for writing).

### Step 4: Tool selection

See: references/tool-selection.md for the tool matrix.

Match tool to phase:

- Coding: Cursor (IDE-native) or Claude Code (agentic CLI) or
  Codex.
- Figure: PowerPoint plus Figma for static figures; Matplotlib
  plus Seaborn for experimental results; Gemini for first-draft
  sketches.
- Writing: Claude or ChatGPT for language polish; Grammarly for
  grammar; Overleaf for LaTeX.

### Step 5: Integrity gate

Before closing the session, run the checks in the Integrity gate
section below.

### Step 6: Output

Emit the workflow plan in the Output format below.

## Integrity gate

This skill is a behavioural nudge, not a verification engine. Most
bullets are tagged [user-attest] because the LLM cannot actually
observe the user's private verification work. [inspection] tags
apply only to checks the LLM can confirm from its own outputs and
the user's session history.

Before ending the session:

1. **[inspection]** The six behavioural rules have been stated at
   the start of the session.
2. **[user-attest]** No fabricated citation has been introduced or
   accepted. (The LLM cannot verify citations without web access;
   the user confirms via DBLP or arXiv.)
3. **[user-attest]** The user's research direction, framing, and
   contributions are owned by the user, not by AI.
4. **[user-attest]** Every AI-generated code block has been
   reviewed and tested by the user.
5. **[user-attest]** Every AI-drafted paragraph has been rewritten
   or at minimum sentence-by-sentence verified by the user.
6. **[attestation]** Venue or school AI-disclosure rules have been
   checked. The skill asks the user to name the venue and
   surfaces known policy types; the user confirms compliance.
7. **[user-attest]** The user's own expertise is still driving the
   project; AI is an accelerator, not a replacement.

Any red-line violation (rules 1-6) stops the session. The user
should fix the violation or consult an advisor before
continuing. Because most bullets are [user-attest], the skill's
effective value is the reminder at session start, not a runtime
block.

## Output format

### 1. Phase
- Primary phase: <coding or figure or writing or mixed>
- Secondary phases: <list>

### 2. Behavioural rules recap
- Rule 1-6 (see references/behavior-guidelines.md): acknowledged

### 3. Workflow plan
| Time block | Phase | Activity | Tool | User check |
|---|---|---|---|---|
| ... | ... | ... | ... | ... |

### 4. Tool recommendations
| Phase | Primary tool | Alternative | Reason |
|---|---|---|---|
| Coding | ... | ... | ... |
| Figure | ... | ... | ... |
| Writing | ... | ... | ... |

### 5. Red-line reminders
- ... (from references/vibe-writing.md)

### 6. Integrity gate plan
- Verification points: ...
- AI-disclosure requirements for the target venue: ...

```

---

# Part II: 说明

本文件用于网页卡片展示，保持 `Part I` 结构即可被页面解析。
