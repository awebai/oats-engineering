# Example: the OATS workspace

OATS builds itself with this package. The workspace is `git:github.com/awebai/oats`; its
member repositories are the kernel repository and one repository per official package.

## Domains, surfaces and souls

| Domain (expert) | Surface (developer) | Paths |
|---|---|---|
| Direction, architecture, maintainer review (`oats-expert`) | — (coordinates the others) | the whole repository |
| Kernel & CLI (`oats-kernel-expert`) | kernel & CLI (`oats-kernel-developer`) | `lib/`, `bin/`, the schemas |
| Desktop (`oats-desktop-expert`) | app & server (`oats-desktop-developer`) | `packages/desktop/` |
|  | design (`oats-desktop-designer`) | `packages/desktop/renderer/` views, styles, copy |
| Provider integrations (`integrations-expert`) | provider packages (`oats-integrations-developer`) | `oats-aweb`, `oats-okf`, … |
| Deployments (`oats-operator-expert`) | — | onboarding, rebuilds, cutovers |
| Workspace config (`oats-setup-admin`, a developer-style soul) | the workspace's own config | `oats-workspace.yaml`, `souls/` |

Every expert has `oats.engineering-expert`; every developer has `oats.developer` and
`oats.adversarial-code-review`.

## Its workspace-specific rules

The OATS repository adds one private capability, `oats.workspace-experts`, given to its
experts. It carries what is specific to this project:
- the surface map above;
- **experts may keep their own worktrees**, named for the surface (`.work-kernel`,
  `.work-desktop`), to drive a small change, a spike or a release PR in-session, with the
  developer's discipline including the review loop. Launching a developer stays the default;
- **delivery:** every change reaches `main` by a PR; the owning expert verifies a developer's
  PR, and `oats-expert` (the maintainer) reviews and merges.

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
