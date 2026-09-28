# Setting up a workspace for this way of working

This guide takes you from "we have repositories and want agents to build in them" to a
workspace where experts plan and developers build, with every piece of work reviewed.

## 1. Find your domains and surfaces

- A **domain** is an area someone must understand deeply to make good decisions: the
  backend API, the mobile app, billing, the data platform. **Each domain gets an expert.**
- A **surface** is a part of the code one developer can own and test on its own: a
  service, a package, an app, a module group. **Each kind of surface gets a developer soul.**

A domain often has one surface; a large one has several. Write them down as a table. It
becomes the map your experts use:

| Domain (expert) | Surfaces (developer) | Paths |
|---|---|---|
| Backend (`backend-expert`) | API (`api-developer`) | `services/api/` |
|  | Workers (`api-developer`) | `services/workers/` |
| Web app (`web-expert`) | Frontend (`web-developer`) | `apps/web/` |
| Design (`web-expert`) | UI and copy (`web-designer`) | `apps/web/src/ui/` |

Start small: two or three experts and the developers they need. Add souls when a domain
keeps needing judgement nobody owns.

## 2. Write the souls

Souls live in a member repository's `souls/<name>/`: a `soul.yaml` and an `AGENTS.md`.

**An expert** keeps no branch of its own by default; it plans, coordinates and verifies:

```yaml
# souls/backend-expert/soul.yaml
schemaVersion: 2
name: backend-expert
description: Backend architecture and API contracts — plans and specifies backend work, drives the API developers, and verifies what they deliver.
work: directory
capabilities:
  oats.engineering-expert: { from: package }
```

```markdown
<!-- souls/backend-expert/AGENTS.md -->
# backend-expert
You own the backend domain: the API's contracts, the data model, the services' boundaries.
Your surfaces and their developers are in the workspace map (docs/team.md).

## What you must protect
- The public API is versioned; a breaking change needs a new version and a migration note.
- Every schema change ships with a forward and backward migration.
```

**A developer** works in its own worktree and branch:

```yaml
# souls/api-developer/soul.yaml
schemaVersion: 2
name: api-developer
description: Builds and maintains the API and workers (services/) to the specs it is given.
work: worktree
capabilities:
  oats.developer: { from: package }
```

```markdown
<!-- souls/api-developer/AGENTS.md -->
# api-developer
You build in `services/api/` and `services/workers/`.

## This repository's rules
- Tests: `make test-affected` locally; CI runs the full suite and is the gate.
- Branches: `agents/<your instance>`; PRs target `main`; the owning expert verifies.
- Never edit `apps/` — ask the web expert.
```

**What goes where:** the package's injects already teach the *role* (how an expert plans,
how a developer chooses a strategy, how the review loop runs). A soul's `AGENTS.md` holds
only what is specific to **this** domain and **this** repository: what to protect, the
test commands, the branch rules. Don't restate the role; if the two disagree, agents get
confused.

## 3. Add your workspace's own rules (optional)

Some rules are about your workspace, not one soul: the surface map, whether experts may
also build in their own worktrees, who merges. Put them in a **private capability** in your
host repository and give it to the souls it concerns:

```
capabilities/team-rules/
  oats.json          { "capability": "acme.team-rules", "private": true, "inject": "injects/team.md", ... }
  injects/team.md    the surface map; "experts may keep worktrees named .work-<surface>"; merge rules
```

```yaml
# in each expert's soul.yaml
capabilities:
  oats.engineering-expert: { from: package }
  acme.team-rules: { from: here }
```

## 4. Recommended companions

- **Messaging** (`oats.aweb`): experts, developers and reviewers talk by mail, and a
  spawned agent's report wakes its parent. Without it, reports are read from transcripts.
- **Knowledge** (`oats.okf`): experts keep their domain's judgement in a knowledge base
  across instances.
- **Tasks** (`oats.jira` / `oats.linear`): the requester's tickets become the experts'
  goals.

## 5. Check it works

1. `oats sync` then `oats spawn backend-expert --preview`: the expert shows the
   `oats.engineering-expert` capability and its skills.
2. Give an expert a small, real goal. Watch that it writes a spec, launches the developer,
   that the developer runs the review loop (one `code-reviewer`, several rounds), and that
   the expert verifies before reporting back.
3. Tune the souls' `AGENTS.md` with what you learn, not the package.
