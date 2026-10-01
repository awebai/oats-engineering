# oats.engineering

**A way of working for engineering teams of agents: experts who plan, coordinate and land
the work; developers who build it in parallel and get it through an adversarial review
before anything is presented.**

`oats.engineering` is an official [OATS](https://github.com/awebai/oats) package. Add it to a
workspace, give its capabilities to your souls, and your agents work like a small
engineering organisation:

```
            requester (you)
                  │  goal
                  ▼
   ┌──────────────────────────────┐       leads or joins
   │  expert (one per domain)     │◄────── other experts on
   │  plans · specs · coordinates │        cross-domain work
   │  · verifies                  │
   └──────────────┬───────────────┘
        spec per  │  surface                ▲ handback: verified,
                  ▼                          │ reviewed work
   ┌──────────────────────────────┐          │
   │  developer (one per surface) │──────────┘
   │  spec → parallel build →     │
   │  consolidate → review loop   │
   └──────────────┬───────────────┘
                  │  one piece of work
                  ▼
   ┌──────────────────────────────┐
   │  code-reviewer               │  attached to the developer's worktree;
   │  bugs · security · simplify  │  iterated with until it approves
   └──────────────────────────────┘
```

## What's in the package

| | Give it to | It teaches |
|---|---|---|
| **`oats.engineering-expert`** (capability) | your domain experts | Skills: `/plan-and-spec`, `/coordinate-developers`, `/coordinate-experts`, `/verify-developer-work`, `/land-your-prs`. Plan and write specs per surface; launch and drive developers; lead or join other experts on cross-domain work, including across machines and people; verify what comes back for architecture, fit and simplicity; own their PRs until merged. |
| **`oats.developer`** (capability) | your developers | Skills: `/understand-the-spec`, `/execution-strategy`, `/worktrees`, `/maintain-dev-docs`, `/run-the-review-loop`. Evaluate the spec (or write one); execute it, leaning toward parallel dynamic workflows in one or several worktrees; consolidate, verify, document; then iterate with ONE `code-reviewer` until it approves before handing back. |
| **`oats.code-review`** (capability) | the `code-reviewer` soul (already assigned) | Skills: `/adversarial-review`, `/security-review`, `/simplification-review`, `/review-dev-docs`. The reviewer's role and method: try to break the change, prove each finding, security, simplification and development-doc passes, low noise, same reviewer every round. |
| **`code-reviewer`** (soul) | spawned by developers | The adversarial reviewer, carrying only `oats.code-review`. It reads the work in the developer's worktree, runs tests only to confirm a finding, and stays for the whole loop. |

Each capability is an always-on briefing (inject) plus skills the agent loads when it needs
them. Nothing is tied to one project: your repository's own rules (test gates, branch
names, who merges) stay in your repository.

## Quick start

1. **Declare the package** in your `oats-workspace.yaml`:
   ```yaml
   packages:
     oats.engineering: v1.5.0
   ```
2. **Give the capabilities to your souls** in each `soul.yaml`:
   ```yaml
   # an expert
   capabilities:
     oats.engineering-expert: { from: package }

   # a developer
   work: worktree
   capabilities:
     oats.developer: { from: package }
   ```
3. **Sync and spawn:** `oats sync`, then `oats spawn <expert> --task "<goal>"`. The expert
   takes it from there.

A messaging capability (for example `oats.aweb`) is strongly recommended: experts,
developers and reviewers coordinate by mail. Without one, reports land in session
transcripts.

## Guides

- **[Setting up a workspace for this way of working](docs/setting-up-a-workspace.md):**
  choosing domains and surfaces, the experts and developers you need, soul examples,
  and the repository-specific rules you add yourself.
- **[How the work flows](docs/how-the-work-flows.md):** one feature end to end, from goal
  to merged PR, including a cross-domain effort.
- **[Example: the OATS workspace](docs/example-oats.md):** how the OATS project itself is
  organised with this package.

## Requirements
OATS ≥ 0.30.0. Works with any harness OATS supports (pi, Claude Code, Codex). The packaged
`code-reviewer` prefers Codex with `gpt-6-astra` (`launch:` in its soul); a machine overrides it
in `oats-local.yaml` `souls.launch`, and spawn flags win over both. Developers use
your harness's workflow tool for parallel work; where it has none, its subagents in the same
pattern, keeping each workflow under 10 agents and asking you first for more. Where the
harness requires your opt-in to run a workflow (Claude Code's workflow tool does), they
ask for it once per task. To let them run workflows unattended, turn that opt-in on yourself
in the harness: in Claude Code, `/effort ultracode` (or `claude --effort ultracode`) for a
session, or `"ultracode": true` in your Claude Code settings for every session; its
`workflowSizeGuideline` setting (default `medium`, under 10 agents) matches the cap
([Claude Code workflows](https://code.claude.com/docs/en/workflows.md)).

## License
MIT
