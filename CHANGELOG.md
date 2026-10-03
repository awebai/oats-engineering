# Changelog

## 1.8.1 - 2026-10-03

### Changed

- **A PR is reviewed only after its owner says the developer's review loop converged.** `/pr-review` starts only on the owner's hand-over: the loop converged (its final verdict and rounds), the exact head, and CI green on that head. Until then: no review, no reviewers or subagents on it, no findings. A head that moves after the hand-over waits for the next hand-over; then only the delta is reviewed and the verdict re-bound. A PR with no owning expert (a human's, an outside contributor's, a peer's release-prep PR) is ready when its author marks it ready for review or asks for review at a named head, with CI green on it; for a fork, the workflow and secrets check comes first so that CI can run. `/cross-review-peer` applies the same rule between peers, and a moved head waits for the next hand-over at merge time too.
- `/verify-developer-work`: verify only after the developer reports convergence at a named head, never a branch still changing.
- `/land-your-prs`: hand a PR to the maintainer only when the developer's loop converged, you verified it and CI is green on that exact head, and say all three with the head. Don't push to a PR under the maintainer's review without telling it: batch the fixes, let the developer's loop converge again (its reviewer, or a new one if it was retired; a fix the expert makes itself goes through a code reviewer too), then hand over the new head with the delta.
- `/coordinate-developers`, `/run-the-review-loop` and the developer inject: a developer reports when its loop has converged, not before, with the final verdict, its rounds and the head; no intermediate heads.

## 1.8.0 - 2026-10-03

### Changed

- **A maintainer is not an expert.** Don't give one soul both `oats.maintainer` and `oats.engineering-expert`; the maintainer instructions no longer mention holding the expert role.
- **The maintainer launches work and doesn't lead it.** It stays an individual instance and never spawns experts or developers as its children. When asked to start work, it either delegates to a live expert whose work it continues, or spawns one independent lead expert (`--relation unrelated`) for the effort. That lead plans the work and coordinates developers and other experts under itself.
- **Consult the soul's knowledge first, and keep the instance state accurate.** Both are stressed for maintainers (before every decision, review, release plan and launch; the state updated whenever the maintainer acts) and for experts (the inject, `/plan-and-spec`, `/coordinate-developers`, `/land-your-prs`). Layer-neutral: no knowledge-layer commands.
- **Experts tell a standing maintainer what they start** when they lead an effort no maintainer launched or delegated (a human started them directly, or another expert spawned them unrelated). Their brief, soul or workspace rules name the maintainer; a maintainer that launched the work gets no notice. `/maintainer-intake` adds those efforts to the overview, flags idle ones, and its state file gains an "Efforts in flight" table. When an effort is done, the maintainer asks the requester whether to retire its lead.
- `/coordinate-experts`: an expert launched by a maintainer as an effort's lead coordinates it, reports on the work to whoever asked, and sends its PRs to the maintainer.
- `/cross-review-peer` and `/plan-release`: peers review each other's release-prep PRs; landing your own release-prep PR is spelled out.
- `/pr-review` stands on its own for any project: read the PR as a whole (the description matches the diff, scope, links); check that the pre-PR review and the expert's acceptance were at this head, or review the delta; find the consumers of every changed export, shape, key, flag, error code and format by searching this repository and its dependents.
- `/verify-developer-work`: verify at the handover's pinned head; read the recorded decisions and coherence rules first; check the evidence of a real run when the spec asks for one.
- The examples in `/plan-and-spec` and `/understand-the-spec` no longer come from the OATS codebase.
- `/pr-review` also covers PRs from forks and first-time contributors (CI with secrets, workflow and permission changes), new or bumped dependencies, unresolved review threads, drafts and PRs too large to review. `/ship-release` says what to do when a published release is bad; `/plan-release` covers hotfixes and backports.

### Added

- `/launch-work` (in `oats.maintainer`): understand the request and consult knowledge; find the domain and the live experts; delegate or spawn one independent lead; brief it (goal, who asked, the decisions it must respect, delivery to the maintainer); tell the requester its name; track it in the state file.

## 1.7.0 - 2026-10-02

### Added

- **`oats.maintainer`**, a new capability for the whole maintainer job. It is generic: the project's own facts (test gate, release lane, roadmap, decisions) stay with the soul and its knowledge.
  - Its always-loaded instructions name each skill with its load trigger. They also cover authority with a clear source, cross-review between peer maintainers as the normal practice (including for a soul that is also an expert), experts reporting to the maintainer, plain-text questions to humans, and CI as the gate.
  - What the maintainer keeps in its knowledge: one living roadmap (superseded, not dated), each architectural or structural call with its reason and rejected alternatives, and the coherence rules it enforces. Not one-off patches.
  - Skills:
    - `/maintainer-intake`: the overview, rebuilt from the sources into a fixed state file, then the knowledge pass.
    - `/direction-gate`: whether a change belongs and fits the roadmap; contracts decided before they're built; decisions recorded.
    - `/pr-review`: four gates, a verdict bound to the exact head and posted on the PR, a head-guarded merge, and a check that what landed is what was reviewed.
    - `/plan-release`: scope, version, notes, and merge order including shared notes files.
    - `/ship-release`: exact artifacts under explicit authority, a verification checklist, and partial-publication rules.
    - `/cross-review-peer`: the peer agreement, the unreachable-peer fallback, and verifying decisions passed on from a human.
    - `/keep-it-clean`: follow-ups, docs in step, drift and duplication, and retiring what's dead.
- The README, the setup guide, the work-flow guide and the OATS example describe the maintainer. A soul skill named like a capability skill is refused at spawn, so a project keeps its own release and review specifics under names of their own.
- The package validator checks that every capability's inject names each of its skills, as a `/skill` code span.

### Changed

- `/run-the-review-loop`: when picking the reviewer's model, the developer reads both the reviewer soul's default (`launch.declared`) and what this machine will launch (`launch.effective`). When `launch.from` is `local`, the machine's `oats-local.yaml` `souls.launch` overrides the default. If the override is another harness than the developer's, the developer spawns the reviewer without `--harness`/`--model`, so the override applies. Only when the effective reviewer would run on the developer's own harness and model does it pick another.

### Unchanged

- Requires OATS 0.30.0 or later. The expert and code-review capabilities only change version.

## 1.6.0 - 2026-10-02

### Added

- Where new work goes, at any level (coordinating, coordinated or solo). When a human or another expert brings an expert new work, the expert decides before taking it on. It sends the work to a live expert only when it continues that expert's work or that expert's context clearly helps. Otherwise it spawns a new expert: as its child when the work is part of its effort, or with `--relation unrelated` when the work is independent, reporting to whoever asked and named to them, so they can reach and retire it (OATS records no link from it to the requester). A human requester is told in plain text, never through a dialog. Stated in the expert instructions, in `/coordinate-experts` ("New work: reuse a live expert, or spawn a new one") and in docs/how-the-work-flows.md.

### Unchanged

- Requires OATS 0.30.0 or later. Developers keep each workflow under 10 agents, and the human's opt-in stays the human's. Review happens on local branches, before the PR.

## 1.5.0 - 2026-10-01

### Changed

- Developers keep each dynamic workflow under 10 agents, counting every agent across its stages; for 10 or more they ask their human for permission first, saying how many agents and why. Within the cap they run workflows without asking each time where the harness allows it; where the harness requires the human's opt-in (Claude Code's workflow tool does), they use a standing opt-in the human configured, or ask once per task with the planned agent count. Stated in the developer instructions, `/execution-strategy` and the README.
- Unchanged from 1.4.0: requires OATS 0.30.0 or later; review happens on local branches, before the PR; the packaged `code-reviewer` prefers Codex with `gpt-6-astra`.

## 1.4.0 - 2026-09-30

### Changed

- The developer's first two steps are REQUIRED before implementation starts: load `/understand-the-spec` and follow it, and load `/execution-strategy` and decide with it how the work will run. The developer instructions now say so in those two steps, instead of only naming the skills.
- Unchanged from 1.3.0: requires OATS 0.30.0 or later; review happens on local branches, before the PR; the packaged `code-reviewer` prefers Codex with `gpt-6-astra`.

## 1.3.0 - 2026-09-29

### Changed

- Review happens before the PR, on local branches. A branch the expert returns is fixed and its delta re-reviewed by the same reviewer before the next handback. The developer's adversarial loop with the `code-reviewer` runs on its consolidated local branch; the developer hands that reviewed branch (not a PR) to its expert; the expert reviews the branch (`verify-developer-work`); only when the expert accepts it is a PR opened (`land-your-prs`). Never open a PR to get a review. Stated in the developer, reviewer and expert instructions and in `run-the-review-loop`, `verify-developer-work` and `land-your-prs`.
- Unchanged from 1.2.0: requires OATS 0.30.0 or later, and the packaged `code-reviewer` prefers Codex with `gpt-6-astra`.

## 1.2.0 - 2026-09-29

### Changed

- Requires OATS 0.30.0 or later (was 0.29.0): the packaged soul now declares a launch preference, a 0.30 key that 0.29 refuses.
- The packaged `code-reviewer` soul prefers Codex with `gpt-6-astra` (`launch: { harness: codex, model: gpt-6-astra }`), a different model family from the developers it reviews. A machine overrides it in `oats-local.yaml` `souls.launch`; spawn flags win over both.
- On a machine without the `codex` binary, spawning `code-reviewer` is refused with `E_HARNESS_UNAVAILABLE` until Codex is installed or the machine overrides the preference (`oats-local.yaml` `souls.launch`, or `--harness`/`--model` at spawn).
- Vendored OATS schemas refreshed from OATS v0.30.0.

## 1.1.0 - 2026-09-28

### Added

- Developer documentation maintenance skill: `/maintain-dev-docs`.
- Code-review documentation review skill: `/review-dev-docs`.
- Review-loop guidance to pick a different reviewer model.

### Changed

- The developer's step 3 is now "Consolidate, verify, document."

## 1.0.0 - 2026-09-28

- Initial official release of `oats.engineering` with `oats.engineering-expert`,
  `oats.developer`, `oats.code-review`, and the packaged `code-reviewer` soul.
