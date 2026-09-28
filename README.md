# oats.engineering

**A way of working for engineering teams of agents: experts who plan and coordinate,
developers who build, and an adversarial review before anything is presented.**

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
   │  spec → strategy → build     │
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
| **`oats.engineering-expert`** (capability) | your domain experts | Plan and write specs per surface; launch and drive developers; lead or join other experts on cross-domain work; verify what comes back for architecture, fit and simplicity. |
| **`oats.developer`** (capability) | your developers | Evaluate the spec (or write one); choose how to execute: yourself, a few subagents, a parallel workflow, one worktree or several; hand back verified work. |
| **`oats.adversarial-code-review`** (capability) | your developers | Before presenting work, spawn ONE reviewer, brief it without biasing it, and iterate with it until it approves. Also the reviewer's method: proven bugs, security, simplification. |
| **`code-reviewer`** (soul) | spawned by developers | The adversarial reviewer. It reads the work in the developer's worktree, runs tests only to confirm a finding, and stays for the whole loop. |

Each capability is an always-on briefing (inject) plus skills the agent loads when it needs
them. Nothing is tied to one project: your repository's own rules (test gates, branch
names, who merges) stay in your repository.

## Quick start

1. **Declare the package** in your `oats-workspace.yaml`:
   ```yaml
   packages:
     oats.engineering: v1.0.0
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
     oats.adversarial-code-review: { from: package }
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
OATS ≥ 0.29.0. Works with any harness OATS supports (pi, Claude Code, Codex); the developer
skills use your harness's own subagents or workflow tool when it has one.

## License
MIT
