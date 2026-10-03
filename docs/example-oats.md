# Example: the OATS workspace

OATS builds itself with this package. The workspace is `git:github.com/awebai/oats`; its
member repositories are the kernel repository and one repository per official package.

## Domains, surfaces and souls

| Role or domain (soul) | Surface (developer) | Paths |
|---|---|---|
| Maintainer: direction, architecture, launching work, review, releases (`oats-expert`) | — (launches the others' work) | the whole repository |
| Kernel & CLI (`oats-kernel-expert`) | kernel & CLI (`oats-kernel-developer`) | `lib/`, `bin/`, the schemas |
| Desktop (`oats-desktop-expert`) | app & server (`oats-desktop-developer`) | `packages/desktop/` |
|  | design (`oats-desktop-designer`) | `packages/desktop/renderer/` views, styles, copy |
| Provider integrations (`integrations-expert`) | provider packages (`oats-integrations-developer`) | `oats-aweb`, `oats-okf`, … |
| Deployments (`oats-operator-expert`) | — | onboarding, rebuilds, cutovers |
| Workspace config (`oats-setup-admin`, a developer-style soul) | the workspace's own config | `oats-workspace.yaml`, `souls/` |

Every domain expert has `oats.engineering-expert`; every developer has `oats.developer`.
`oats-expert` is the maintainer: it has `oats.maintainer`, not the expert role. It launches
each new effort to the domain expert best suited to lead it, as an independent instance,
and reviews and lands what comes back. Its maintainers, each an instance of `oats-expert` on
their own machine and for their own human, cross-review each other's work.

## Its workspace-specific rules

The OATS repository adds one private capability, `oats.workspace-experts`, given to its
experts. It carries what is specific to this project:
- the surface map above;
- **experts may keep their own worktrees**, named for the surface (`.work-kernel`,
  `.work-desktop`), to drive a small change, a spike or a release PR in-session, with the
  developer's discipline including the review loop. Launching a developer stays the default;
- **delivery:** every change reaches `main` by a PR; the owning expert verifies a developer's
  PR, and `oats-expert` (the maintainer) reviews and merges.

What stays OATS-specific lives with the `oats-expert` soul, not in `oats.maintainer`: the
framework's test gate and the consumers a review must read, the release lane and its
scripts, and the Desktop's accepted CLI versions.

## A real piece of work: team model v2 (OATS 0.30)

A change that touched the kernel, a provider package, the Desktop and the docs:
- `oats-expert` wrote the design decision and coordinated.
- The design fixed the **contracts between domains first**: the environment the kernel
  gives providers (`OATS_DEFAULT_TEAM`, `OATS_TEAMS`), and the JSON shapes the Desktop
  reads.
- **One developer per surface, in parallel:**
  - the kernel developer built the model and published the JSON shapes first, so the
    Desktop could build against them;
  - the integrations developer built the provider side;
  - the Desktop developer and designer built the server readers and the screens,
    **consumer-first** (the Desktop accepted the new shapes before the kernel shipped them);
  - a developer migrated the member repositories and docs.
- Each piece went through its own review loop; the owning expert verified it; the
  maintainer merged it; a live rehearsal proved the whole before the release.

What made it work: **interfaces agreed in writing before building**, one owner per
question, and consumers landing before producers.
