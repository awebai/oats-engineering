# Changelog

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
