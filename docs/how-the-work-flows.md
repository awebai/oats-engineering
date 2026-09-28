# How the work flows

## One feature, one domain

**The goal:** "Rate-limit the public API: 100 requests per minute per key, with a clear
error."

1. **You → the expert.** `oats spawn backend-expert --task "Rate-limit the public API ..."`.
2. **The expert plans and specifies** (skill: *plan-and-spec*). It reads the code, chooses
   a design (a token bucket in the gateway middleware, not per-service), and writes a spec:
   the goal, "done when" (a 429 with `Retry-After` after 100 calls; existing keys unaffected
   until enabled), the contracts (the error shape is public, so it's versioned), the edge
   cases (clock skew, burst at the minute boundary), the tests, and what's out of scope
   (per-endpoint limits).
3. **The expert launches a developer** (skill: *coordinate-developers*):
   `oats spawn api-developer --task-file spec-rate-limit.md`.
4. **The developer checks the spec** (skill: *understand-the-spec*) and asks one question
   with a proposed answer: "Should internal service keys be exempt? I propose yes, via
   the existing `internal` flag." The expert answers and updates the spec.
5. **The developer chooses a strategy** (skill: *execution-strategy*): three paths that
   touch different files (the middleware, its tests, the fixtures and docs), so a **dynamic
   workflow in one worktree** runs them in parallel and integrates them.
6. **It consolidates and verifies** in that worktree: tests for every "done when", plus a
   real run against a local gateway.
7. **Adversarial review** (skill: *run-the-review-loop*). It spawns ONE `code-reviewer`
   attached to its worktree, briefed with the goal, the spec and the diff range, but not
   its own reasoning.
   - **Round 1:** `CHANGES NEEDED`. A blocker (the bucket is per process, so two gateway
     replicas allow 200/min; proven with the replica test) and a security major (the key
     is logged in the 429 path). One simplification: drop a config option nothing sets.
   - **Round 2:** the developer fixes both and takes the simplification; the same reviewer
     re-checks the delta: `APPROVE`. The developer retires it.
8. **Handback to the expert:** what was done against "done when", the test and run results,
   "adversarial review: APPROVE after 2 rounds", and what's out of scope.
9. **The expert verifies** (skill: *verify-developer-work*): the design matches (shared
   bucket store, as specified); it fits the middleware pattern; it's simple; nothing
   glaring. It accepts.
10. **The expert lands the PR** (skill: *land-your-prs*): it opens it, answers a bot's
    finding and a teammate's review comment (the developer fixes one; the expert replies to
    the other with the reason), keeps it rebased, merges it by the repository's rules,
    checks main's CI, and retires the developer.

## A feature across domains

**The goal:** "Show each user their remaining API quota in the web app."

- The **web-expert** coordinates (skill: *coordinate-experts*). It launches the
  **backend-expert** with itself as the parent, so the domain experts are siblings under
  the coordinator.
- **The interface first:** the two experts agree `GET /v2/quota → {limit, remaining,
  resetsAt}` in writing before anyone builds.
- Each expert specs its side and drives its own developer: `api-developer` for the
  endpoint, `web-developer` and `web-designer` for the view.
- Each developer runs its own review loop; each expert verifies its own domain.
- Each expert lands its own PRs. The coordinator sets the order: it has the backend PR
  merge first and asks the web expert to rebase onto it before merging. Then it checks
  the whole flow end to end, and reports.

## Across machines and people

The same effort might be led by a coordinator on a colleague's machine, or the backend
expert might belong to another team's human. Neither side can spawn or direct the other's
agents, so they agree at the start, in writing: who owns which domains and PRs, who
approves shared contract changes, how they reach each other, and that hand-offs name exact
commits and PR numbers. OATS itself is built this way by two maintainers, each with a lead
expert on their own machine.

## When the expert builds it itself

Sometimes launching a developer costs more than the change: a one-line config fix, a
release PR, a spike to test a design. If your workspace allows it (its own rules, section 3
of the setup guide), the expert works in its own worktree **with the developer's
discipline**, including the review loop. The default is still to launch a developer.
