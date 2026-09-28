---
name: worktrees
description: Create, use and clean up extra git worktrees for parallel or isolated work, inside your own home. Use when execution needs more than one checkout (parallel paths that touch the same files, a spike, a second branch), or before handing back to remove them.
---

# Extra worktrees

Your main checkout is your `work/`. When you need more, add worktrees next to it, inside
your home, named for their purpose.

## Create
```bash
# from your home; the repo is the one work/ checks out
git -C work fetch origin
git -C work worktree add ../.work-<purpose> -b <branch> <base>
#   e.g. git -C work worktree add ../.work-parser -b agents/<you>-parser origin/main
```
- **Where:** always inside your home (`./.work-<purpose>`), never next to the repository or
  in a shared directory.
- **Branch:** one new branch per worktree, named under your usual branch prefix, based on
  the branch it must merge back into.
- **Name** by purpose (`.work-parser`, `.work-spike-cache`), not by number.

## Use
- Run each path's build and tests inside its own worktree.
- Merge back into your main branch in the order the plan set, resolving conflicts
  yourself. Run the full verification on the merged result.

## Clean up before handing back
```bash
git -C work worktree list          # everything you created
git -C work worktree remove ../.work-<purpose>
git -C work branch -d <branch>     # once merged; -D only if you are sure it's abandoned
```
Nothing you created may outlive the work: stray worktrees and branches confuse the next
person and can block your own retirement. Unmerged work you want to keep: push its branch
and say so in your handback.
