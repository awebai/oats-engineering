---
name: execution-strategy
description: Decide how to execute a piece of work, from implementing it yourself to a couple of simple subagents to a parallel dynamic workflow, in one worktree or several. Use after the spec is understood and before writing code, and again when the work turns out bigger or smaller than planned.
---

# Execution strategy

Pick the lightest strategy that fits. Parallelism costs coordination, context and review
effort; it pays only when the work really splits.

## 1. Size and shape the work
- How many **independent paths** are there? (Paths that can be built and tested without
  each other's output.)
- Do the paths **touch the same files**?
- How much is **mechanical** (renames, fixture updates, repetitive edits) versus
  **judgement** (design, tricky logic)?

## 2. Choose

| The work | Strategy |
|---|---|
| Small, or mostly one line of reasoning | **Implement it yourself.** The default. |
| One main line plus a few bounded side tasks (research a library, update fixtures, write a test file) | **Yourself + a couple of simple subagents** for the side tasks. You keep the main line. |
| Several independent paths that **don't touch the same files** | **A parallel workflow in ONE worktree.** Each path gets its own agent; you integrate. |
| Several paths that **do touch the same files** or need different branches | **A parallel workflow across several worktrees**, one per path (the **worktrees** skill), merged in an agreed order. |

Use your harness's own orchestration (a workflow tool, subagents) when it has one; the
decision above is the same whatever tool runs it.

## 3. If you parallelize
- Write each agent a **self-contained brief**: its spec slice, its files, what not to touch,
  and how to verify. Agents don't share your context.
- **You own integration:** you merge the paths, run the full verification, and are
  accountable for the result as if you had written it all.
- Review what the agents produce before it goes to the adversarial review. Don't pass
  unread code on.
- Keep the number of parallel agents to what you can actually integrate: usually 2–4.

## 4. Re-decide when reality changes
If a "simple" task grows, or a planned split turns out to be one tangled change, change the
strategy and say so in your notes. Don't force the plan.
