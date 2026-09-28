---
name: worktrees
description: When and how to use extra worktrees for a piece of work: parallel paths that touch the same files, a spike, a second branch. Integrate them and clean them up before handing back. Use when your execution strategy needs more than one checkout.
---

# Extra worktrees

Your work-mode briefing gives the command. You can create as many worktrees as the work needs,
on new or existing branches; by default they live in your home as `.work-<purpose>`. What you
create, you clean up. This skill is about using them well.

## When
- **Parallel paths that touch the same files:** one worktree per path, so agents don't
  overwrite each other.
- **A spike** you may throw away, kept apart from the real branch.
- **Another branch** the work needs: a fix on another base, a stacked change, or an open PR
  you've been asked to rework.

Not for parallel paths that touch different files: those share one worktree (the
**execution-strategy** skill).

## Use
- Base each worktree on the branch it will merge back into.
- Build and test each path inside its own worktree.
- Integrate into your main branch in the planned order, resolving conflicts yourself, then
  run the full verification on the merged result. The review loop reviews the merged result.

## Before handing back
- Every worktree is merged into your main branch, or its branch is pushed and named in your
  handback, or it's deliberately abandoned.
- Then remove them all; the worktree list shows only your main tree.
