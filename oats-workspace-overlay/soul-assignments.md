# Soul assignments, renames and cleanup (in the oats repo)

## Capabilities per soul

| Soul | `work` | oats.engineering capabilities | Plus |
|---|---|---|---|
| `oats-expert` | directory | engineering-expert | oats.workspace-experts |
| `oats-kernel-expert` | directory | engineering-expert | oats.workspace-experts |
| `oats-desktop-expert` | directory | engineering-expert | oats.workspace-experts |
| `integrations-expert` | directory | engineering-expert | oats.workspace-experts |
| `oats-operator-expert` | directory | engineering-expert | oats.workspace-experts |
| `market-research-expert` | directory | engineering-expert | (research, not code; plans and coordinates studies) |
| `oats-kernel-developer` (was `cli-dev`) | worktree | developer + adversarial-code-review | |
| `oats-desktop-developer` (was `oats-desktop-engineer`) | worktree | developer + adversarial-code-review | |
| `oats-desktop-designer` (was `ux-designer`) | worktree | developer + adversarial-code-review | |
| `oats-integrations-developer` (new) | worktree | developer + adversarial-code-review | |
| `oats-setup-admin` | worktree | developer + adversarial-code-review | oats.setup (it applies config by PR) |
| package experts (`oats-*-expert` in each package repo) | directory | engineering-expert | (each repo decides; recommended) |

**Dropped:** `oats-assistant` (folded into `oats-operator-expert`), `oats-dev-expert` (oats.dev
retires), and the `oats.dev` package and its `reviewer` soul (replaced by `code-reviewer`).

## Cleanup: soul text that contradicts the new capabilities
Remove from the souls' AGENTS.md (the capabilities now carry the generic rules):
- Expert souls: "advise and document; do not implement unilaterally" wording that reads as
  "experts don't drive work" → experts plan, spec, launch developers and verify. Keep the
  project-specific escalation (framework changes go to the human) where it exists.
- Expert souls: stewardship "feed repo-state / delivery-log" steps (the ledgers leave the
  repo, per the docs audit).
- Developer souls: the oats.review "reviewer per commit, then gone" discipline → one
  code-reviewer per piece of work, iterated.
- Developer souls: "run the full local gate" → the repository's recorded gate (affected
  suites; CI is the gate).
- Anything restating the role loop, spec handling or execution strategy the injects now own.

## Order of work
1. **Antares** creates `awebai/oats-engineering` and has a developer build it from these
   drafts: manifests, a validator, tests, CI, a README. Antares reviews and tags `v1.0.0`.
2. **oats repo PR** (one): mirror + catalog pin + workspace pin of oats.engineering;
   remove the oats.dev pin, member and catalog entry; the private `oats.workspace-experts`
   capability; the soul renames and assignments above; the soul cleanup. The developer
   souls PR (#279) is renamed to the new names and merges first, with no review capability.
3. **Archive** `awebai/oats-dev` (read-only; not deleted).
