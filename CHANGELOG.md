# Changelog

## Unreleased

Maintainers per human, experts that find theirs, a lane map that shows who is alive and
what each is doing, and a definition of a lane.

### Added

- **What a lane is** (`/cross-review-peer`, the inject). A standing area of a project's
  work: areas of the repository, a kind of work, or one human's requests. Work that would
  be finished when one goal lands is an effort in an existing lane, not a new lane. Each
  line states its label, what it covers, its arrangement and its second-reader rule. Two
  area lanes never overlap, nor two lanes for the same kind of work; a lane defined by a
  kind of work or by whose requests it is may overlap area lanes, and the area lane a PR
  touches is its second reader. A lane closes when its
  work is finished or absorbed, or after two releases with no work.
- **An entry per maintainer on the lane map** (`/cross-review-peer`, `/maintainer-intake`,
  `/launch-work`). Each maintainer keeps one entry, which only it edits: its lane, its
  human, `active` or `left`, its efforts with their leads, its open PRs by number, and the
  date. It updates the entry at every intake, when an effort starts or ends, and at every
  hand-over.
- **Who is alive** (`/cross-review-peer`). The entry is the record of who holds a seat;
  your messaging layer's presence says whether it is running now. A stopped maintainer
  still holds its seat: mail it and tell your human, never spawn a second. An old entry
  with no presence is a question for its human. Of two maintainers spawned at once for the
  same human and lane, the earlier entry holds the seat.
- **Experts find their maintainer** (the expert inject, `/coordinate-experts`,
  `/land-your-prs`). An expert no maintainer launched or delegated finds its human (its
  brief, else its spawning instance's human, else the deployment's one human; when unclear,
  it asks, and spawns no maintainer and opens no PR until it knows), then its human's
  maintainer for its lane on the map, and gives it the start notice. When there is none, it
  spawns one for its human, independent of itself, and its effort is delegated to it. Its
  PR descriptions name the maintainer.
- **Which lane work goes to** (`/cross-review-peer`, `/launch-work`, `/coordinate-experts`):
  a lane that covers it where your human has a maintainer; else your human's own lane;
  else the lane that covers it, with a maintainer spawned for your human; and when no lane
  covers it, a new lane for work that keeps coming, or the release lane for a single
  effort.
- **Leaving a lane** (`/cross-review-peer`, `/maintainer-intake`). A maintainer is never
  retired automatically. Once it has no open efforts or PRs, it tells its human once that
  it is idle, and asks its human to say before retiring it, so it marks its entry `left`
  first. A maintainer retired without that is marked `left` by the map's keeper on its
  human's own word. A maintainer that can't be reached holds only its own human's work.
- **A maintainer owns its lane** (the inject, `/cross-review-peer`). Once it holds a seat,
  it owns its human's work in the lane, even when another maintainer spawned it: it doesn't
  report to its spawner. Every lane's maintainer is a full maintainer (overview,
  architecture, coordination, and its fit with the product direction set for it, which the
  release lane keeps aligned); only the release lane's final review or sign-off, and its
  say on releases, stand above it.
- **Staying aligned** (the inject, `/cross-review-peer`). Maintainers read each other's
  entries before they plan, and tell the maintainers an effort affects, and the release
  lane, once at its start when it touches another lane, the architecture or product
  direction.

### Changed

- **The release lane is the main maintainer** (the inject, `/cross-review-peer`). It has
  the final say on what merges and what is released, coordinates merges and deployments
  across the lanes, and keeps their work aligned with product direction.
- **A lane merges its own PRs once the release lane has signed off** (`/cross-review-peer`,
  `/pr-review`, the inject, `/launch-work`). This is the new default arrangement: the lane
  hands the approved PR to the release lane, which gives it a full final review at that
  head; once its sign-off is on the PR at that head, the lane's maintainer merges, in the
  order the release lane asks for in a release. "The release lane merges" and "sign-off on
  significant merges only" remain arrangements a lane may agree with the release lane.
  Lanes already on a map keep the arrangement recorded there.
- **Specs, plans and design proposals are the experts'** (the inject). A maintainer never
  writes them or works out how to build a thing, however small: it spawns an expert.
- **One maintainer per human in a project lane** (the inject, `/cross-review-peer`). Each
  human's maintainer launches, reviews and hands over that human's work in the lane. A
  maintainer takes its human's seat with nobody's sign-off; this replaces "joining needs
  the agreement of the lane's maintainer or its human". The release lane keeps one
  maintainer for the whole project.
- **Opening a lane needs nobody's sign-off,** its human's included (`/cross-review-peer`,
  the inject). A maintainer that already holds a lane spawns a maintainer for its human to
  hold the new one.
- **Routing is per human** (`/launch-work`, the inject). Your human's work for another lane
  goes to your human's maintainer there; when your human has none, you spawn one for your
  human. Another human's work goes to that human's maintainer.
- **Which maintainer a PR belongs to, and its second reader** (`/cross-review-peer`). A PR
  belongs to the maintainer of the human whose effort produced it, in its lane: the
  effort's human, not the forge account. Where it changes code another human's effort in
  the lane is changing, that human's maintainer is its second reader.
- **Shorter injects and skills, rules unchanged** (`oats.maintainer`,
  `oats.engineering-expert`, `oats.developer`). Each inject opens with a short block of
  the rules that are expensive to break, marked IMPORTANT, ALWAYS or NEVER, the only caps
  in the text. Rationale and duplication between the inject and the skills are cut, and
  every rule keeps one home: the inject says when to load a skill, and the skill holds the
  procedure. Word counts (inject; skills):
  - maintainer: 2,046 to 1,101; 14,214 to 11,399;
  - expert: 981 to 484; 3,647 to 2,950;
  - developer: 597 to 292; 2,720 to 2,085.

### What to do

- Move your lane map to the new shape: a line per lane, and an entry per maintainer that
  only that maintainer edits. Each running maintainer adds its entry at its next intake.
- Where one human has two maintainers in one lane, ask that human which keeps the seat, or
  split the lane, before both add entries.
- Close or absorb lanes that are really single efforts.
- A lane whose line records no arrangement was on the old default, where the release lane
  merges. The keeper records "the release lane merges" on its line, unless the lane and the
  release lane agree to the new default.
- Name the maintainer soul in your workspace's rules, so an expert can spawn one.

## 1.13.0 - 2026-10-26

A maintainer's leads are its children, lanes can be claimed and split, work for another
lane is routed, and what the maintainers learned running lanes is taught generically.

### Added

- **Taking and claiming a lane** (`/cross-review-peer`, the inject). A maintainer takes a
  lane when it holds none, or when its human asks it to take one on: it defines a new one,
  or claims a project lane with no active maintainer by adding itself to the lane's line,
  with nobody's sign-off. The release lane may open a lane with no maintainer yet, for one
  to claim. Only the leaving maintainer, its human, or the map's keeper on that human's
  word marks a maintainer as left; an unreachable maintainer still holds its lane; a
  closed lane and the release lane are never claimed. Joining a lane that has an active
  maintainer takes its human launching you into it, or the agreement of its maintainer or
  its human.
- **Work for another lane** (`/launch-work`, the inject). A maintainer launches only work in
  a lane it holds. Work a human asks for in another lane goes to that lane's maintainer, or,
  when the lane has no maintainer or doesn't exist yet, to a maintainer it spawns for that
  lane, independent of itself, when its human asks for the work. It tells the human
  plainly who has the work now, and how to retire a maintainer it spawned.
- **A lane that splits** (`/cross-review-peer`). The lane's maintainers or humans split it.
  The map records both lines; efforts move whole, with their leads and PRs, by hand-over;
  a moved PR keeps its verdicts, since a label change is not a new head; another lane's PRs
  keep their lane. The new lane's arrangement is agreed with the release lane; keeping the
  old one for the same work is the natural default.
- **Exceptions to a hold** (`/cross-review-peer`, `/pr-review`, `/plan-release`). Whoever
  can lift the hold writes the exception on it, naming the PR, its head and the authority.
  A freeze before a tag carries over to a patch release the human picks: each change the
  human named, and the release-prep PR, gets an exception, quoting the human.
- **A cancelled effort leaves nothing half-done** (`/keep-it-clean`, `/launch-work`): revert
  merged but unreleased code that would ship inert, mark its decision deferred or
  superseded, close its design record with the reason, and retire its instances.

### Changed

- **A maintainer's leads are its children** (the inject, `/launch-work`,
  `/support-maintainer`, `/coordinate-experts`). Work launched in a lane the maintainer
  holds is spawned as its child (`--parent "$OATS_INSTANCE"`); the maintainer is its
  parent, not its coordinator. This replaces "never as your child". Stopping or retiring
  the maintainer stops its leads first. A retire stops every lead that is its child,
  handed over or not, keeps their homes and moves them to its own parent, so a maintainer
  is retired once its efforts are done or a successor has taken them over and can start
  them again. A maintainer launched into a lane stays independent: a peer, not a child.
- **Another lane's code** (`/cross-review-peer`, `/pr-review`). A PR that changes code
  another project lane holds gets that lane's maintainer as its second reader, before the
  release lane's final review, which doesn't skip it. Where the area is the release
  lane's own (its docs, for example), the release lane's one read is both.
- **The release lane's final review is a full review** (`/pr-review`): all four gates, at
  the head handed over. A rebase with a hunk resolved by hand goes back to the lane's
  readers for that delta.
- **A human's word another agent passes on** (`/cross-review-peer`, the inject) is confirmed
  with the human directly before it authorises a merge, an exception to a freeze, or a tag.
  A peer writing it on the PR is a record, not a confirmation.
- **Superseding a decision a human accepted** (`/direction-gate`) needs that human's own
  confirmation, cited exactly, before the knowledge change merges.
- **Partial or failed publication** (`/ship-release`): once the cause outside the tag is
  fixed, re-run only the failed step from the same tag, never retag; a fault in the tagged
  source ships as the next version. A credential fault goes to the human who owns the
  credential. Installing from the artifacts CI built while publication is blocked is the
  human's call, and the skill says what differs.
- `README.md`, `docs/how-the-work-flows.md`, `docs/setting-up-a-workspace.md` and
  `docs/example-oats.md` follow.

### Unchanged

- One release lane and one lane per project, the default hand-over and the map's
  arrangement as the authority; contracts decided before they're built; only the release
  lane tags; one second reader per PR; nobody merges over a RETURN or a hold.

### What to do

- **Maintainers with leads launched before this version:** nothing. Those leads stay
  independent; new leads are spawned as children.
- **Whoever stops a maintainer:** its leads stop with it, unless the stop is non-recursive.
- **Peer maintainers:** a lane with no active maintainer can be claimed on the map. A
  maintainer that leaves a lane, or its human, marks it as left on the lane's line.

## 1.12.0 - 2026-10-26

One release lane, and one lane per project. Humans give the picture; maintainers launch the
work.

### Added

- **Project lanes** (`/cross-review-peer`, the maintainer inject). Every lane other than the
  release lane is a project lane. A maintainer defines one when its human's work needs it,
  with nobody's sign-off, by adding its line to the lane map: name, label, what it covers,
  its maintainers and their human, its second reader. A human may launch maintainers into a
  lane, several maintainers may share one, and a finished project's lane is marked closed.
- **The hand-over to the release lane** (`/cross-review-peer`, `/pr-review`). By default a
  project lane launches its work, reviews it and gives each PR its one second reader, then
  hands the PR at the approved head to the release lane, which does the final review and
  merges. When the release lane's maintainer is the PR's second reader, the second-read
  request is the hand-over and its one read is the final review. The release lane may hold
  work of its own (its release-prep PRs, its human's work) and merges those PRs; a PR is in
  the lane of the effort that produced it.
- **A lane's arrangement** (`/cross-review-peer`). The map may record another arrangement
  for a lane, such as sign-off on every merge or only on significant ones, and the map's
  arrangement is the authority. A new lane starts with the default; another arrangement
  needs the release lane's agreement, and changing one takes the lane's humans and the
  release lane.
- **A human's high-level picture is the maintainer's normal intake** (the inject,
  `/launch-work`). The maintainer clarifies only what changes who leads the work, writes the
  brief and launches the right expert, one per independent effort; the expert writes the
  spec and plan. The maintainer never writes specs.
- **Launching a maintainer into a lane** (`/launch-work`), when a human asks for one:
  independent of the launcher, briefed with the lane and its human.

### Changed

- **Joining** (`/cross-review-peer`, `/maintainer-intake`, the inject). A new maintainer reads
  the map and takes the lane its human or launcher names, or defines one. This replaces
  asking the map's keeper which lane is its own and acting on nothing until the map names
  it.
- `/maintainer-intake` and its state file: in a shared lane, a maintainer tracks the efforts
  it launched and the PRs handed to it; the release lane also tracks the PRs handed to it
  and the sign-offs asked of it. `/plan-release`: every lane agrees its releases with the
  release lane on its plan. `/support-maintainer`: support is a project lane, and the
  release owner is the release lane's maintainer.
- `README.md` and `docs/how-the-work-flows.md` describe the release lane and project lanes.

### Unchanged

- Contracts are decided before they're built, whatever the lane (`/direction-gate`); every
  lane agrees with the release lane what goes into a release, and only the release lane
  tags; each PR gets one second reader; nobody merges over a RETURN or a hold.

### What to do

- **Peer maintainers:** in your lane map, call one lane the release lane, give each other
  lane its line, and record any lane whose arrangement isn't the default hand-over.
- **A maintainer alone:** nothing.

## 1.11.0 - 2026-10-23

The release lane holds the final say, and a new maintainer joins a lane before it acts.

### Added

- **The release lane** (`/cross-review-peer`, the maintainer inject). One lane is the
  release lane. Its maintainer owns, plans and tags every release and keeps the lane map
  unless the map names another keeper. The map says, for each other lane, when a merge
  needs its sign-off: on every merge, or only on a significant one (a product decision,
  the roadmap, a contract, or what the lane's maintainer judges important). The lane's
  maintainer asks for the sign-off once, at the head both readers approved, and merges once
  it is on the PR; when the release lane's maintainer is already the second reader, its
  verdict is the sign-off. A lane that merges on its own still agrees its releases with the
  release lane, on the release plan, and never tags. A maintainer alone holds the release
  lane too.
- **Joining as a new maintainer** (`/cross-review-peer`, `/maintainer-intake`, the inject). A
  maintainer the lane map doesn't name, whether a new spawn, a new machine or a successor,
  asks the map's keeper once for its lane, and until the map names it reviews, merges,
  tags and launches nothing. A successor takes a lane only when the map or the hand-over
  says so.
- **A maintainer's harvest checkpoints** (the inject): a feature ready, a release or deploy
  shipped, and a direction decision with the human. The maintainer runs its knowledge
  layer's harvest procedure at each one, as that layer's rules allow (oats.okf 5.3.0 and
  later name these checkpoints), instead of waiting for a task to finish.

### Changed

- `/pr-review`'s merge step checks the release lane's sign-off at the head when the map asks
  for one. `/plan-release`: the release owner is the release lane's maintainer. Peers
  message each other for two more things: a sign-off and joining.
- `docs/how-the-work-flows.md`: the lanes example gains the sign-off and a joining maintainer.

### What to do

- **Peer maintainers:** name the release lane in your map, say for each other lane whether
  every merge or only a significant one needs its sign-off, and name who keeps the map.
- **A maintainer alone:** nothing.

### Unchanged

- Requires OATS 0.30.0 or later. No skill is added or removed. The developer, expert and
  code-review capabilities only change version.

## 1.10.0 - 2026-10-13

Maintainers work in lanes, without keeping each other's picture and without a message per
event (awebai/oats#1103). Two maintainers on one repository each swept every open PR on
every wake, kept the peer's review of each in their own state, and told each other before
and after every merge.

### Changed

- **A lane has one maintainer** (`/cross-review-peer`, rewritten). The peers' written agreement is a lane map: for each lane what belongs to it, its maintainer and its second reader; the label a PR shows its lane with; the hold label; who owns the next release. Every effort and PR is in exactly one lane. A maintainer alone has one lane, the whole project, and nothing changes for it but the sweep below.
- **The forge is the one copy of a PR's state.** A maintainer's state file holds its own lane only; another lane's PRs, verdicts and holds are read on the forge when needed and never copied. The state shape's review column is "me / second reader", its header names the lane, and "Release in flight" holds the plan only for the release owner.
- **`/maintainer-intake` no longer sweeps on every wake.** A full sweep runs at session start, after a compaction and at least weekly, over the maintainer's lane. On a wake the maintainer handles the event and updates the rows it touches. A PR with no lane is given one from the map; only its lane's maintainer takes it. An effort with no activity is read on the forge and in its lead's status first, and its lead is asked only when something waits on it: never for a progress report.
- **Every PR gets one second reader, asked once.** This supersedes the earlier pairing practice, in which every peer reviewed every PR in parallel and every verdict was bound again at every head. The lane's maintainer reviews first and asks the second reader at the head it approved; the second reader posts its verdict on the PR and answers in one line. A PR that changes something another lane's code or text reads has that lane's maintainer as its second reader, in place of the usual one. A PR its lane's maintainer authored is read by its second reader when the author asks, with no approval of the author's to wait for. Unchanged: a contract change is decided before it is built, by everyone who decides direction.
- **Peers message each other for five things:** a second read, a hold that must stop work in flight, the release plan, a lane changing hands, and a request that belongs to the peer's lane. No notice before or after a merge or a tag. A human's word is recorded once where it applies, and passed on only when the human asks or the peer must act on it and can't read it anywhere. A go passed on by another agent is still not authority until verified.
- **A hold is a label on the forge:** on the PR it holds, or on an open issue for a hold on the default branch, each with its reason, scope and who lifts it. `/pr-review`'s merge step reads both.
- **`/pr-review`, before a merge:** when the default branch moved since CI ran on the head, the merging maintainer runs, on a trial merge, the test files changed or added by the PR and by what merged since its base; when those are more than a couple, or the host lacks something, it brings the branch up to date and lets CI run. Two changes that share no file can still break each other.
- **The merging maintainer brings a branch up to date itself,** with the forge's update of the PR branch (a merge of the default branch, never a force-push). Both verdicts carry when the PR's own change is unchanged and CI is green on the updated head; a conflict goes back to the owner. A head its owner rebased carries both verdicts when every commit is `=` in the range-diff and CI is green; any other commit goes back to both readers for that delta. The merge is guarded by the head the verdicts carried to. With a merge queue, the maintainer enqueues the approved head and none of this is used.
- **`/pr-review` reviews only the maintainer's own lane,** tells the owner its verdict and the merge in one line each, and asks the second reader once it approves.
- **`/launch-work`:** a request for another lane's work goes to that lane's maintainer once; the brief names one maintainer for the lead's PRs and the lane's label; the maintainer doesn't ask a lead for progress.
- **`/plan-release`:** one maintainer owns a release and writes its plan on the forge, where peers answer it; a freeze is a hold on the default branch. **`/ship-release`:** a published release is told once to those who must act on it.
- **`/support-maintainer`:** support is a lane whose second reader is the feature maintainer driving the area; its verdict on the PR is the written agreement a support merge needs. A support merge needs no notice.
- **Experts hand over to one maintainer** (the expert inject, `/land-your-prs`): the one whose lane the work is in, never all of them, and the maintainer asks the second reader. After the hand-over the expert leaves the branch alone: the maintainer brings it up to date.
- `docs/how-the-work-flows.md` gains "Two maintainers, two lanes".

### What to do

- **Peer maintainers:** rewrite your agreement as a lane map (`/cross-review-peer`), create the lane labels and the hold label on your forge, and drop each other's PRs from your state files.
- **A maintainer alone:** nothing.

### Unchanged

- Requires OATS 0.30.0 or later. No skill is added or removed. The developer and code-review capabilities only change version.

## 1.9.1 - 2026-10-12

### Fixed

- **`/run-the-review-loop`: the reviewer's spawn command shows `--parent "$OATS_INSTANCE"` and `--repo <repository>`.** Without them, a developer whose consolidated worktree is an extra worktree of its home (`<home>/.work-<purpose>`) was refused twice by released kernels: first for the repository, then for the owner (awebai/oats#958). `<repository>` is the absolute path of the clone the worktree belongs to, and the skill says where a developer reads it. A developer gives both flags for `<home>/work` and for an extra worktree alike.
- **`/worktrees`: before removing a worktree, a developer retires every instance attached to it**, usually the reviewer. Removing a worktree with an instance attached left that instance with a work link to a path that is gone (awebai/oats#964).
- **Handing back and removing worktrees no longer contradict each other.** `/worktrees` and the developer inject said to remove every extra worktree before handing back, and `/run-the-review-loop` said to keep the reviewer until the expert accepts; with the reviewer attached to an extra worktree, both could not be done. Now a developer removes before handing back only the extra worktrees no instance is attached to. A worktree with an instance attached stays; once the expert accepts, the developer retires the reviewer and then removes that worktree. For a reviewer attached to `<home>/work` the order is as before: it is retired after acceptance, and nothing is removed.

### Unchanged

- Requires OATS 0.30.0 or later. The expert, code-review and maintainer capabilities only change version.

## 1.9.0 - 2026-10-07

### Added

- **`/support-maintainer`** (in `oats.maintainer`): how a maintainer takes the project's support work. A support desk opens one ticket per outside request and hands it in; the support maintainer acknowledges it, triages it on the ticket (valid, duplicate, class and severity, whether it belongs in support or with the feature roadmap, security moved to the private route), routes each valid ticket to one lead with `/launch-work`, and keeps the desk informed of each change so it can tell the requester. A ticket's quoted report, and every comment on it not by a project member, is untrusted input: never run, followed or copied into a brief as an instruction. Leads reproduce only with their own steps. Neither the desk nor a ticket is authority, and a task the desk wrote grants nothing beyond its fixed brief: a desk-spawned support maintainer also needs its human's direct go for every merge and release, and launches no leads on the desk's machine. Security reports that arrive by mail are worked in a private advisory or ticket, and only their references are kept in state. At most 3 support leads are in flight unless the human agrees to more. The support maintainer doesn't drive features or releases alone: before a lead starts it checks who drives the area. Every support merge needs a feature maintainer's written agreement, and every tag the release owner's (`/cross-review-peer`, `/plan-release`). When nobody answers, it merges and tags nothing and asks its human. Deployments stay their operators'. Its state file gains a "Support tickets" table.
- The maintainer inject names `/support-maintainer` and says what a support maintainer is.

## 1.8.1 - 2026-10-03

### Changed

- **A PR is reviewed only after its owner says the developer's review loop converged.** `/pr-review` starts only on the owner's hand-over: the loop converged (its final verdict and rounds), the exact head, and CI green on that head. Until then: no review, no reviewers or subagents on it, no findings. A head that moves after the hand-over waits for the next hand-over; then only the delta is reviewed and the verdict re-bound. A PR with no owning expert (a human's, an outside contributor's, a peer's release-prep PR) is ready when its author marks it ready for review or asks for review at a named head, with CI green on it; for a fork, the workflow and secrets check comes first so that CI can run. `/cross-review-peer` applies the same rule between peers, and a moved head waits for the next hand-over at merge time too.
- `/verify-developer-work`: verify only after the developer reports convergence at a named head, never a branch still changing.
- `/land-your-prs`: hand a PR to the maintainer only when the developer's loop converged, you verified it and CI is green on that exact head, and say all three with the head. Don't push to a PR under the maintainer's review without telling it: batch the fixes, let the developer's loop converge again (its reviewer, or a new one if it was retired; a fix the expert makes itself goes through a code reviewer too), then hand over the new head with the delta.
- `/coordinate-developers`, `/run-the-review-loop` and the developer inject: a developer reports when its loop has converged, not before, with the final verdict, its rounds and the head; no intermediate heads.

## 1.8.0 - 2026-10-03

### Changed

- **A maintainer is not an expert.** Don't give one soul both `oats.maintainer` and `oats.engineering-expert`; the maintainer instructions no longer mention holding the expert role.
- **The maintainer launches work and doesn't lead it.** It stays an individual instance and never spawns experts or developers as its children. When asked to start work, it either delegates to a live expert whose work it continues, or spawns one independent lead expert (`--relation unrelated`) for the effort. That lead plans the work and coordinates developers and other experts under itself.
- **Consult the soul's knowledge first, and keep the instance state accurate.** Both are stressed for maintainers (before every decision, review, release plan and launch; the state updated whenever the maintainer acts) and for experts (the inject, `/plan-and-spec`, `/coordinate-developers`, `/land-your-prs`). Layer-neutral: no knowledge-layer commands.
- **Experts tell a standing maintainer what they start** when they lead an effort no maintainer launched or delegated (a human started them directly, or another expert spawned them unrelated). Their brief, soul or workspace rules name the maintainer; a maintainer that launched the work gets no notice. `/maintainer-intake` adds those efforts to the overview, flags idle ones, and its state file gains an "Efforts in flight" table. When an effort is done, the maintainer asks the requester whether to retire its lead.
- `/coordinate-experts`: an expert launched by a maintainer as an effort's lead coordinates it, reports on the work to whoever asked, and sends its PRs to the maintainer.
- `/cross-review-peer` and `/plan-release`: peers review each other's release-prep PRs; landing your own release-prep PR is spelled out.
- `/pr-review` stands on its own for any project: read the PR as a whole (the description matches the diff, scope, links); check that the pre-PR review and the expert's acceptance were at this head, or review the delta; find the consumers of every changed export, shape, key, flag, error code and format by searching this repository and its dependents.
- `/verify-developer-work`: verify at the handover's pinned head; read the recorded decisions and coherence rules first; check the evidence of a real run when the spec asks for one.
- The examples in `/plan-and-spec` and `/understand-the-spec` no longer come from the OATS codebase.
- `/pr-review` also covers PRs from forks and first-time contributors (CI with secrets, workflow and permission changes), new or bumped dependencies, unresolved review threads, drafts and PRs too large to review. `/ship-release` says what to do when a published release is bad; `/plan-release` covers hotfixes and backports.

### Added

- `/launch-work` (in `oats.maintainer`): understand the request and consult knowledge; find the domain and the live experts; delegate or spawn one independent lead; brief it (goal, who asked, the decisions it must respect, delivery to the maintainer); tell the requester its name; track it in the state file.

## 1.7.0 - 2026-10-02

### Added

- **`oats.maintainer`**, a new capability for the whole maintainer job. It is generic: the project's own facts (test gate, release lane, roadmap, decisions) stay with the soul and its knowledge.
  - Its always-loaded instructions name each skill with its load trigger. They also cover authority with a clear source, cross-review between peer maintainers as the normal practice (including for a soul that is also an expert), experts reporting to the maintainer, plain-text questions to humans, and CI as the gate.
  - What the maintainer keeps in its knowledge: one living roadmap (superseded, not dated), each architectural or structural call with its reason and rejected alternatives, and the coherence rules it enforces. Not one-off patches.
  - Skills:
    - `/maintainer-intake`: the overview, rebuilt from the sources into a fixed state file, then the knowledge pass.
    - `/direction-gate`: whether a change belongs and fits the roadmap; contracts decided before they're built; decisions recorded.
    - `/pr-review`: four gates, a verdict bound to the exact head and posted on the PR, a head-guarded merge, and a check that what landed is what was reviewed.
    - `/plan-release`: scope, version, notes, and merge order including shared notes files.
    - `/ship-release`: exact artifacts under explicit authority, a verification checklist, and partial-publication rules.
    - `/cross-review-peer`: the peer agreement, the unreachable-peer fallback, and verifying decisions passed on from a human.
    - `/keep-it-clean`: follow-ups, docs in step, drift and duplication, and retiring what's dead.
- The README, the setup guide, the work-flow guide and the OATS example describe the maintainer. A soul skill named like a capability skill is refused at spawn, so a project keeps its own release and review specifics under names of their own.
- The package validator checks that every capability's inject names each of its skills, as a `/skill` code span.

### Changed

- `/run-the-review-loop`: when picking the reviewer's model, the developer reads both the reviewer soul's default (`launch.declared`) and what this machine will launch (`launch.effective`). When `launch.from` is `local`, the machine's `oats-local.yaml` `souls.launch` overrides the default. If the override is another harness than the developer's, the developer spawns the reviewer without `--harness`/`--model`, so the override applies. Only when the effective reviewer would run on the developer's own harness and model does it pick another.

### Unchanged

- Requires OATS 0.30.0 or later. The expert and code-review capabilities only change version.

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
