# Changelog

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
