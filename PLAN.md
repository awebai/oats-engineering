# PLAN: `oats.engineering`, the official engineering package (draft for review)

**Status:** a draft for the human to review. These files are the proposed CONTENT. A
developer turns them into the `awebai/oats-engineering` repository (manifests, validator,
tests, CI, the v1.0.0 tag), and the oats repo mirrors and pins it in the official catalog.

## What it is

It replaces `oats.dev`, which is retired from the workspace. There are three capabilities
and one package soul, all generic (nothing OATS-project-specific):

| Capability | Who gets it | What it teaches |
|---|---|---|
| `engineering-expert` | every expert soul | Experts plan, spec, coordinate developers (and other experts), and verify the work developers hand back. |
| `developer` | every developer soul | Understand or write the spec; choose how to execute (solo, subagents, a workflow, several worktrees); deliver. |
| `adversarial-code-review` | every developer soul | Before presenting work, run ONE reviewer per piece of work and iterate with it until it is satisfied. Its skills are the reviewer's method: bugs, security, simplification. |

| Package soul | Spawned by | Role |
|---|---|---|
| `code-reviewer` | a developer, via `adversarial-code-review` | Adversarial reviewer. It is attached to the developer's worktree, runs tests only to confirm a finding, and lives for the whole review loop. |

## Files (open each to review)

```
oats-package/
  oats-package.json                          package manifest
  capabilities/
    engineering-expert/
      oats.json
      injects/expert.md                      always-on: the expert's role and loop
      skills/plan-and-spec/SKILL.md          turning a goal into plans + specs per surface
      skills/coordinate-developers/SKILL.md  launching and driving developers
      skills/coordinate-experts/SKILL.md     leading or joining a cross-domain effort
      skills/verify-developer-work/SKILL.md  the expert's review: architecture, fit, simplicity
    developer/
      oats.json
      injects/developer.md                   always-on: the developer's role and loop
      skills/understand-the-spec/SKILL.md    evaluating a spec, or writing one
      skills/execution-strategy/SKILL.md     solo / subagents / workflow / multi-worktree
      skills/worktrees/SKILL.md              extra worktrees, safely
    adversarial-code-review/
      oats.json
      injects/review-loop.md                 always-on (developers): the review loop rule
      skills/run-the-review-loop/SKILL.md    the developer side: spawn once, brief, iterate
      skills/adversarial-review/SKILL.md     the reviewer's method: real bugs, low noise
      skills/security-review/SKILL.md        the reviewer's security pass
      skills/simplification-review/SKILL.md  the reviewer's refactor/simplify pass
  souls/
    code-reviewer/soul.yaml + AGENTS.md
oats-workspace-overlay/
  oats-experts.md                            the OATS-repo-specific expert inject (NOT in the package)
  soul-assignments.md                        which soul gets what; the renames; cleanup
```

## Decisions taken (the human's direction, 2026-09-28)

- A new repo, `awebai/oats-engineering`, in the official catalog. `oats.dev` stops being used.
- Experts are planners and coordinators, not just advisers. Any expert may plan for and
  coordinate any soul, and may be coordinated by another expert on cross-domain work.
- To drive development, an expert launches a developer per surface; several surfaces mean
  several developers. The expert writes the specs. An expert MAY also keep its own
  worktrees (`.work-<surface>`) to drive work in-session. That rule is OATS-repo-specific,
  so it lives in the workspace overlay, not in the package.
- Developers may create several worktrees. They evaluate the spec (or write one), then
  pick the execution strategy.
- Review: ONE reviewer per piece of work, iterated with until satisfied (not a fresh one per
  round). It is briefed with the goal, the spec and the diff range, NOT the developer's
  reasoning (so it stays unbiased). It is not noisy, catches real bugs, covers security, and
  suggests simplifications.
- Experts do their own verification on what developers hand back: architecture, coherence,
  fit, simplest solution, and glaring bugs. They assume the adversarial review happened, and
  check that it did.

## Open questions for the human (defaults chosen; say if you disagree)

1. **The review-round cap.** "Iterate until it's happy" is the rule, capped at **4 rounds**;
   after that the developer escalates the disagreement to its expert. This stops a loop.
   (Your earlier LFX note said "one review + one fix round". This supersedes it for OATS.)
2. **Remove oats.dev from the workspace** (pin, member repo, `oats-dev-expert` soul) in the
   same change that pins oats.engineering. Default: yes. The repo gets archived, not deleted.
3. **Package id `oats.engineering`**, capability ids `engineering-expert`, `developer`,
   `adversarial-code-review`, soul `code-reviewer`. (The oats.* prefix matches the other
   official packages.)
