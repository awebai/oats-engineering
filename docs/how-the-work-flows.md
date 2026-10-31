# How the work flows

## One feature, one domain

**The goal:** "Rate-limit the public API: 100 requests per minute per key, with a clear
error."

1. **You → the expert.** `oats spawn backend-expert --task "Rate-limit the public API ..."`.
2. **The expert plans and specifies** (`/plan-and-spec`). It reads the code, chooses
   a design (a token bucket in the gateway middleware, not per-service), and writes a spec:
   the goal, "done when" (a 429 with `Retry-After` after 100 calls; existing keys unaffected
   until enabled), the contracts (the error shape is public, so it's versioned), the edge
   cases (clock skew, burst at the minute boundary), the tests, and what's out of scope
   (per-endpoint limits).
3. **The expert launches a developer** (`/coordinate-developers`):
   `oats spawn api-developer --task-file spec-rate-limit.md`.
4. **The developer checks the spec** (`/understand-the-spec`) and asks one question
   with a proposed answer: "Should internal service keys be exempt? I propose yes, via
   the existing `internal` flag." The expert answers and updates the spec.
5. **The developer chooses a strategy** (`/execution-strategy`): three paths that
   touch different files (the middleware, its tests, the fixtures and docs), so a **dynamic
   workflow in one worktree** runs them in parallel and integrates them.
6. **It consolidates and verifies** in that worktree: tests for every "done when", plus a
   real run against a local gateway.
7. **Adversarial review** (`/run-the-review-loop`). It spawns ONE `code-reviewer`
   attached to its worktree, briefed with the goal, the spec and the diff range, but not
   its own reasoning.
   - **Round 1:** `CHANGES NEEDED`. A blocker (the bucket is per process, so two gateway
     replicas allow 200/min; proven with the replica test) and a security major (the key
     is logged in the 429 path). One simplification: drop a config option nothing sets.
   - **Round 2:** the developer fixes both and takes the simplification; the same reviewer
     re-checks the delta: `APPROVE`. The developer keeps it until the expert accepts.
8. **Handback to the expert:** what was done against "done when", the test and run results,
   "adversarial review: APPROVE after 2 rounds", and what's out of scope.
9. **The expert verifies** (`/verify-developer-work`): the design matches (shared
   bucket store, as specified); it fits the middleware pattern; it's simple; nothing
   glaring. It accepts.
10. **The expert lands the PR** (`/land-your-prs`): it opens it, answers a bot's
    finding and a teammate's review comment (the developer fixes one and takes the delta
    through its review loop; the expert replies to the other with the reason), keeps it
    rebased, merges it by the repository's rules, checks main's CI, and tells the
    developer it is merged and green. The developer replies "done, no harvest duty", and
    the expert retires it without asking anyone.

## A step that stalls

The same review, but the reviewer's provider refuses its turn. The failed turn runs nothing,
so the reviewer reports nothing, and the developer, which ended its turn to wait, runs
nothing either. Neither can notice, so the developer set a checkpoint first
(`/run-the-review-loop`): a wake job on its own home, due when the verdict is overdue.

- The wake fires from the host's timer, whatever the harness or messaging layer, on a home
  whose `wakeHold` covers it: a wake's Enter answers an open dialog. Where it doesn't, the
  developer hands the wait to its expert, which sets it on its own home. If no level can,
  the wait has no bound, and the maintainer tells its human.
- The developer reads what it may read: a `running` reviewer with no claim says nothing either
  way, so that alone proves nothing.
- It asks one precise question and sets a second checkpoint, half as far out.
- The second one fires with no answer, which ends the wait: it spawns a new reviewer on
  another model with the same brief, retires the stalled one and says so in its handback.

Had the verdict come in time, it would have removed the job and heard nothing more. Each
level does the same for the child it waits on (the expert for its developer, the maintainer
for its lead), so if the developer stalls instead, a covered expert's checkpoint catches it.

## A feature across domains

**The goal:** "Show each user their remaining API quota in the web app."

- The **web-expert** coordinates (`/coordinate-experts`). It launches the
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

## Unrelated work arrives mid-effort

While the web-expert coordinates the quota feature, a human asks it to investigate slow
logins. That work is independent of the quota effort, and no live expert's context helps
with it, so the web-expert spawns a new `backend-expert` for it with
`--relation unrelated`. That expert works for the human who asked, not for the web-expert,
and contacts them only for what they must decide. Having no parent, it sends its done line
to its maintainer and retires itself once the investigation is done. The backend-expert already on the quota work keeps its context for the quota
work. Had the request been part of the quota effort (say, "also show the quota in the
CLI"), the web-expert would have spawned the new expert as its own child.

## Across machines and people

The same effort might be led by a coordinator on a colleague's machine, or the backend
expert might belong to another team's human. Neither side can spawn or direct the other's
agents, so they agree at the start, in writing: who owns which domains and PRs, who
approves shared contract changes, how they reach each other, and that hand-offs name exact
commits and PR numbers. OATS itself is built this way by its maintainers, each on their own
machine.

## The maintainer

Where the workspace has a maintainer, new work often starts with it, and every PR heading to
the default branch goes through it. It runs `/maintainer-intake` when its session starts
and after a compaction: it reads its knowledge first (the roadmap, the decisions), then
rebuilds what's open, at which head, and who is waiting on whom. When a message wakes it, it
handles that message and updates what it touches; it doesn't sweep again.

A human asks it, in one sentence, to rate-limit the public API. That is enough: the
maintainer doesn't ask for a spec or write one. It consults its knowledge (rate limits sit
in the gateway, by an earlier decision) and launches the work with `/launch-work`. No live
expert is on the gateway, so it spawns a `backend-expert` as its child (`--parent`),
briefed with the goal, who asked and that decision. The human hears from the expert only
when there is something to decide. The maintainer is its parent, not its coordinator: the backend-expert leads from
there, as in the first section. Had a human started the backend-expert directly,
the expert would have told the maintainer what it was starting.

For the rate-limit PR, it waits for the backend-expert's hand-over (the developer's loop
converged, the expert verified it, CI green at the head), then reviews at that exact head
with `/pr-review`:
`/direction-gate` first (the error shape is a public contract, and it was decided in the
spec, so it fits), then correctness, security and mergeability. It posts APPROVE at that
head on the PR and tells the backend-expert in one line. Before it merges it checks that
nothing holds the PR or the default branch, and that the default branch hasn't moved since
CI ran on that head; had it moved, the maintainer would bring the branch up to date itself
and let CI run again, without a new review. It merges with the head guard. Then it checks
that the merged tree is the one it reviewed, and that the default branch is green on it.
Once the backend-expert has retired its developer and reports "done, harvested:
<harvester>", the maintainer retires it without asking anyone and records why.

When enough has landed, it plans the release (`/plan-release`): the PRs in, the version,
the notes and the merge order. Then it ships it and verifies the publication item by item
(`/ship-release`). Its own release-prep PR is reviewed by its second reader. Along the way
it records what the next
maintainer needs: the roadmap moved on, the decision that public error shapes are
versioned, a coherence rule about where rate limits live.

## A release lane and project lanes

The project grows. The web-app maintainer holds the **release lane**: it does the final
review and the merge, plans and tags every release, and keeps the lane map on the forge
(`/cross-review-peer`). A second human wants the gateway and the API worked on, so their
maintainer opens a **project lane** for it, with nobody's sign-off: it adds the lane's
line to the map (`lane:gateway`, what it covers, its second reader: the release lane's
maintainer), adds its own entry (its lane, its human, its efforts and PRs), and puts the
label on its PRs. The gateway is a standing area of work; the rate limit inside it is an
effort, and gets no lane of its own.

From then on each keeps only its lane in its state file. The gateway maintainer doesn't
track the web app's PRs: when it needs one, it reads it on the forge. The backend-expert
hands its rate-limit PR to the gateway maintainer alone. That maintainer approves first and
then asks for the second read, once, at the head it approved. The second reader is the
release lane's maintainer, so its read is also the final review: it posts its verdict on
the PR, which is its sign-off, and tells the gateway maintainer in one line. The gateway
maintainer merges. The gateway lane owns its work; the release lane, the main maintainer,
keeps the final say on what merges and what is released. When it freezes the default
branch before the tag, it opens an issue with the hold label, and every lane's merge step
finds it there.

Later a third human starts a frontend-expert directly, on another machine, to build a
client for the gateway API. The expert reads the map and its messaging roster: its human
has no maintainer in the gateway lane, so it spawns one for that human, independent of
itself, and tells the human its name and how to retire it. The new maintainer adds its own
entry to the map; a lane has one maintainer per human (an overrun one adds an
overflow seat, its child, which holds no seat), and only the release lane has one
for the whole project. Each gateway maintainer now reviews its own human's PRs, and they
are each other's natural second reader; where a PR changes code the other human's effort is
changing, the other one must read it. At the head both approved, the PR's maintainer hands
it to the release lane once; the release lane reviews it as its final reader and signs off,
and the PR's maintainer merges. The gateway lane's humans then ask to move faster, and the
release lane agrees to another arrangement, recorded on the map: the gateway lane merges on
its own and asks for the release lane's sign-off only on significant merges (a product
decision, the roadmap, a contract). Its next small fix merges on its own, and goes out in
the release the release lane plans.

Later the gateway lane's humans narrow it to the API, and on their word the release lane
opens a proxy lane (`lane:proxy`) on the map, with no maintainer yet. The gateway human's
maintainer has a proxy effort in flight, so it spawns a proxy maintainer for the gateway
human, independent of itself, and hands it the effort whole, its lead and its PRs
relabelled: their verdicts carry, since a label change is not a new head. The new lane
keeps the gateway lane's arrangement, as the release lane agrees. Then the web-app human
asks the web-app maintainer for a proxy fix. It launches nothing: the web-app human has no
maintainer in the proxy lane, so it spawns one for them, independent of itself, briefed
with the lane and the human's words, and tells the human its instance name, its lane, how
to reach it and how to retire it. The new maintainer adds its entry to the map and launches
the fix. Once the fix is merged and nothing else is open, it tells its human once that it
is idle: a maintainer holds a standing seat, so retiring it is the human's call.

## A support ticket

Where the workspace runs a support desk, outside requests arrive as tickets, and one
maintainer instance is the **support maintainer** (`/support-maintainer`). A user writes to
the desk that the gateway returns 500 on an empty body. The desk opens one ticket with the
report quoted and marked untrusted, and hands the ticket reference to the support
maintainer. The support maintainer acknowledges it, reproduces nothing from the quoted
text, and triages on the ticket: a valid bug, high severity. Before launching, it checks
who drives the area. The feature maintainer has the rate-limit PR in review on the same
handler, so they agree in writing that the fix lands after it, in the same release. It
launches one lead with `/launch-work`, a backend-expert briefed with its own summary and
the ticket reference. The PR comes to it at an exact head as usual, and the feature
maintainer reviews it too, since it touches code they have in flight. After the merge, the
release owner ships it. At each step the support maintainer tells the desk what changed
(routed, then fixed in the named release), and the desk tells the user what the ticket says.

## When the expert builds it itself

Sometimes launching a developer costs more than the change: a one-line config fix, a
release PR, a spike to test a design. If your workspace allows it (its own rules, section 3
of the setup guide), the expert works in its own worktree **with the developer's
discipline**, including the review loop. The default is still to launch a developer.
