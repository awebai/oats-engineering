---
name: cross-review-peer
description: Work with peer maintainers in lanes - what a lane is (a standing area of work, never one effort), one release lane, the main maintainer, with one maintainer for the whole project, that does the final review and signs off before every merge (or merges, where a lane's arrangement says so), has the final say on releases and keeps the lane map, and project lanes with at most one maintainer per human - the written lane map, its lane lines and each maintainer's own entry (lane, human, state, efforts, PRs), who is alive (entries plus your messaging layer's presence) and avoiding duplicate maintainers, taking your human's seat, opening, splitting or closing a lane, which maintainer a PR belongs to, the hand-over of an approved PR to the release lane, one second reader for every PR (another lane's maintainer, or another human's where their work meets), the few things peers message each other for, holds and their named exceptions, leaving a lane and a lane changing hands, the fallback when a peer is unreachable, and how to verify a decision passed on from a human. Use whenever you take a seat, open, split or close a lane, route work or spawn a maintainer, whenever a peer maintainer is involved, and before you message one.
---

# Work in lanes with your peers

Maintainers usually work several to a project, often on different machines and for
different humans. The work is split into **lanes**: one release lane, and project lanes,
standing areas of work, each with at most one maintainer per human. Every PR still gets a
second pair of eyes: one second reader, not every peer. What peers don't do is keep each
other's picture, or tell each other what the forge already shows.

## The lane map
Write it down where all of you can read it (an issue or a file on the forge), and keep to it:
- **The release lane:** its label, its maintainer and their human, and the second reader
  of its own PRs (below).
- **A line per project lane:** its name and label, what it covers (areas of the
  repository, a kind of work, or one human's requests), its arrangement when it isn't the
  default, and its second-reader rule (below). A lane with one maintainer names the
  release lane's maintainer as its second reader, or another peer.
- **An entry per maintainer** (below), which says who holds a seat in which lane, and what
  each is doing.
- **How a PR shows its lane:** a label (`lane:<name>`), put on by its owner or by the first
  maintainer who sees it without one. Every effort and PR is in exactly one lane: the lane
  of the effort that produced it.
- **Which maintainer a PR belongs to:** the one holding the seat, in the PR's lane, of the
  human whose effort produced it. That is the effort's human, not whoever owns the forge
  account: several humans' agents may share one. The PR's description names it.
- **Overlap.** Two area lanes never overlap, nor two lanes for the same kind of work: to
  take part of one, split it (A lane that splits, below). A lane defined by a kind of work
  (support, say) or by whose requests it is may overlap area lanes: a PR from one of its
  efforts is in that lane, and it names the area lane it touches, whose maintainer is its
  second reader (One second reader per PR, below).
- **The hold label** (`hold`, unless you agree another).
- **How you reach each other.**

The release lane's maintainer keeps the map, unless it names another keeper. Each project
lane's maintainers write and update their own line. When the map doesn't cover a question,
ask the peer it concerns; don't assume authority you weren't given.

### Your entry
Each maintainer keeps one entry on the map, the release lane's included, and only it edits
that entry, so no maintainer overwrites another's (on a forge issue, a comment of its own).
The one exception: its human, or the map's keeper on its human's word, may mark it `left`.
It holds:
- your lane or lanes, your human and your instance name;
- your state: `active`, or `left` with the date;
- your efforts: each one's lead instance and goal, one line each;
- your open PRs, by number only: the forge holds their state;
- the date you last updated it.

Update it at every intake, when an effort starts or ends, and when you hand a PR over. Add
it before you launch or review anything in the lane, and mark it `left` when you leave the
lane or are retired (A lane changes hands, below).

### Who is alive
Read the lines, the entries and your messaging layer's presence (its roster) before you
route work, spawn a maintainer or take a seat. Each answers a different question:
- **The entry is the record of who holds a seat.** An `active` entry holds it until it is
  marked `left` (Project lanes, "A free seat").
- **Presence says whether that instance is running now,** on whatever machine it runs.
  Offline is not left: an `active` entry with no presence is a stopped maintainer, which
  still holds its seat. Mail it (mail waits), and tell your human it is stopped so they can
  start it. Don't spawn a second one.
- **A retired maintainer** can't mark its own entry. When its human says it was retired,
  ask the map's keeper, quoting the human's words; on that word (Decisions passed on from a
  human, below) the keeper marks it `left`, and the seat is free.
- **An `active` entry with no presence, not updated for two weeks:** ask its human whether
  it has left or been retired. Never mark another maintainer's entry `left` on your own.
- **No presence at all** (your messaging layer has none): the entry is the record; mail the
  maintainer it names.
- **Two at once.** A new maintainer adds its entry first. If it then finds an earlier
  `active` entry for the same human and lane, the earlier one holds the seat: the newcomer
  marks its own entry `left`, hands over whatever it took (its leads now report to the
  earlier one, and it tells them), and asks its human to retire it.

### Which lane work goes to
Your human's work goes, in this order:
1. to a lane that covers it where your human has an `active` maintainer;
2. else to your human's own lane, when one is defined by your human's requests;
3. else to the lane that covers it;
4. when no lane covers it: work that keeps coming gets a new lane (Project lanes, "Opening
   one"); a single effort goes to the release lane, whose maintainer launches it, whoever's
   work it is.

In 2 and 3, when your human has no `active` maintainer there, one is spawned for your human
(`/launch-work`). When you can't tell, ask your human.

## The release lane
One lane is the **release lane**. Your project may call it something else; the role is what
counts. It has one maintainer for the whole project, whoever's work it is: the main
maintainer, with the final say on what merges and what is released. That maintainer:
- **does the final review of every PR the project lanes hand it,** and signs it off for
  the lane to merge, or merges it where the lane's arrangement says so (below);
- **coordinates merges and deployments across the lanes,** and keeps the lanes' work
  aligned with product direction;
- **owns every release:** it plans it, tags it and tells whoever deploys it
  (`/plan-release`, `/ship-release`). A freeze before a tag is its hold on the default
  branch;
- **keeps the lane map,** and an entry of its own, with no idle notice (Leaving a lane).

The release lane may hold work of its own too: its release-prep PRs, and single efforts no
project lane covers, whoever's work they are (Which lane work goes to). Those PRs get their
second reader like any other, and its maintainer merges them.

Every lane releases through it: whatever its arrangement, a lane agrees with the release
lane's maintainer what goes into a release and when, on the release plan (`/plan-release`),
and never tags. A maintainer alone holds the release lane, and its lane is the whole
project.

## Project lanes
Every lane other than the release lane is a project lane.

**What a lane is.** A standing area of the project's work: areas of the repository, a kind
of work, or one human's requests. It outlives the efforts and releases inside it. Its line
states its label, what it covers (clearly enough that anyone can place a new PR without
asking), its arrangement when it isn't the default, and its second-reader rule.

**A lane, not an effort.** An effort has one goal and ends when it lands; a lane keeps
getting work after that. Work that would be finished when one goal lands is an effort in an
existing lane: a feature, a fix, an investigation or a release never gets a lane of its own.

- **One maintainer per human.** A project lane has at most one maintainer for each human
  whose work is in it. That maintainer launches, reviews and hands over its human's work in
  the lane, and tracks only those efforts. A human who wants two maintainers in one lane
  asks the lane's humans to split it instead (A lane that splits, below).
- **Taking your human's seat.** A maintainer takes its human's free seat in a lane, with
  nobody's sign-off, by adding its entry: when it holds no lane yet (Joining as a new
  maintainer, below), when its human asks it to take one on, or when it is launched into
  the lane for its human. Otherwise its human's work for another lane goes to its human's
  maintainer there, or to one it spawns (`/launch-work`).
- **A free seat.** A human's seat in a lane is free when no `active` entry for that human
  holds it. Only the leaving maintainer, its human, or the map's keeper on that human's
  word marks an entry `left`; a retired maintainer has left once its entry or its human
  says so. An unreachable maintainer still holds its seat (When a peer is unreachable,
  below). Nobody takes another human's seat.
- **Opening one.** When work keeps coming that no lane covers, any maintainer opens a lane
  for its human's work with nobody's sign-off, its human's included: it adds the line,
  creates the label and puts it on the lane's PRs. It takes the seat when it holds no lane;
  otherwise it spawns a maintainer for its human to hold it (`/launch-work`). The release
  lane may also open a lane with no maintainer yet.
- **No seat is taken** in a closed lane (new work opens a new lane, or the lane's humans
  reopen it), nor in the release lane, which changes hands only as its humans say.
- **A maintainer launched into a lane** is independent of whoever launched it, never its
  child (`/launch-work`). Once it holds its seat, it owns its human's work in the lane: it
  doesn't report to its spawner or come back to it. The spawner hands over once and is
  done, though any lead that is its child in OATS stays so (A lane changes hands).
- **Every lane's maintainer is a full maintainer:** the overview of its lane, its
  architectural soundness, its fit with product direction, and its coordination with the
  other lanes. Only the release lane's final review or sign-off, and its say on releases,
  stand above it.
- **Inside the lane,** its maintainers launch the work, with experts leading it
  (`/launch-work`), review each PR (`/pr-review`) and give it its one second reader.
- **The hand-over, the sign-off and the merge.** At the head the PR's maintainer and the
  second reader approved, with CI green, the PR's maintainer hands it to the release lane's
  maintainer once, with `/pr-review`'s handoff template. The release lane gives it a full
  final review at that head (`/pr-review`) and signs off or returns it to the PR's
  maintainer, who takes the findings to the PR's owner. Once the sign-off is on the PR at
  that head, the PR's maintainer merges it, in the order the release lane asks for when
  it coordinates a release. When the release lane's maintainer is the PR's second reader,
  the second-read request is the hand-over: it reviews once, as the final review.

### A lane's arrangement
The sign-off above is the default, and a new lane starts with it. The map may record
another arrangement for a lane, and the map's arrangement for a lane is the authority. Two
common ones:
- **The release lane merges:** the lane hands each approved PR over, and the release lane
  reviews and merges it itself.
- **Sign-off on significant merges only:** the lane merges on its own, and asks for the
  sign-off on a PR that changes a product decision, the roadmap or a contract, or that its
  maintainer judges important. In doubt, ask.

Whatever the arrangement, the release lane has the final say: a PR merges only as the
arrangement the release lane agreed allows, and, where it needs a sign-off, only once that
sign-off is on the PR at the head being merged (`/pr-review`). When the release lane's
maintainer is already the PR's second reader, its verdict is the sign-off.

An arrangement other than the default goes on the map only with the release lane's
agreement. Changing a lane's arrangement takes its humans and the release lane.

### A lane that splits
When a lane narrows (what it covers shrinks to a part) and the rest moves to a
new lane or an existing one, its maintainers or its humans split it, or the release lane on
their word; never another maintainer.
- **The map records both lines:** what each covers now. Each maintainer's entry names the
  lane it holds a seat in.
- **Efforts move whole,** relabelled by effort, not by file. An effort in flight in the
  part that moved goes, with its lead and all its PRs, to its human's maintainer in the
  other lane by hand-over (A lane changes hands). When that human has none there, the
  maintainer that launched it spawns one for that human (`/launch-work`), and keeps the
  effort until it is handed over. The lead stays that maintainer's child in OATS: its stop or
  retire still stops the lead, so it tells the new maintainer before either.
- **A moved PR keeps its verdicts:** a label change is not a new head. Its hand-over comes
  from whoever holds it now.
- **Another lane's PRs keep their lane,** since the lane of the effort that produced a PR
  decides first. A maintainer of the new lane becomes their second reader where they change
  what it now holds.
- **The new lane's arrangement is agreed with the release lane.** Keeping the old lane's
  arrangement for the same work is the natural default.

### A lane that's done
When its work is finished or absorbed into another lane, or it has had no work for two
releases, its maintainers or its humans mark its line closed, once its PRs are merged or
closed. A closed lane's label stays on its old PRs. Closing a lane retires nobody: each of
its maintainers marks its entry `left` (Leaving a lane, below).

## Joining as a new maintainer
A maintainer instance new to the project (a new spawn, a new machine, a successor) holds no
lane until it takes one:
1. Read the lane map (its lines and entries) and presence, and find the release lane's
   maintainer.
2. Take your human's seat in the lane your human or your launcher names, by adding your
   entry (Your entry, above). With no lane named, take your human's free seat in a lane
   that covers your human's work, open one (Project lanes, above), or ask your human which
   lane is yours. If an earlier `active` entry already holds that seat, it keeps it (Who is
   alive, above).
3. Until you have a seat, review, merge, tag and launch nothing. Read what you need.

A successor takes its predecessor's seat only when the map, its human or the predecessor's
hand-over says so, or once the predecessor's entry is marked `left`: a similar name is not
a seat. A lane's arrangement doesn't change because a maintainer joins it.

## What you share, and what you don't
- **The forge is the one copy of a PR's state:** its lane, head, CI, verdicts and holds.
  Your state file holds your lane only (`/maintainer-intake`). When you need something from
  another lane, read it on the forge then. Don't keep a copy, and don't ask its maintainer
  for what the forge shows.
- **Your knowledge is the one copy of direction:** the roadmap, the decisions, the coherence
  rules. That is what keeps the lanes coherent without talking.
- **A contract change is decided before it's built** (`/direction-gate`), by everyone who
  decides direction, whatever lane it is in.

## One second reader per PR
Every PR gets one second reader: one, not a read from every maintainer. This supersedes
the earlier pairing practice, in which every peer reviewed every PR in parallel and every
verdict was bound again at every head.
- **Who:** the second reader its lane names. In a lane with seats for several humans, the
  natural one is another human's maintainer in the lane.
- **Where two humans' work meets.** A PR that changes code another human's open effort or
  PR in the same lane is changing gets that human's maintainer in the lane as its second
  reader, in place of the usual one.
- **Another lane's code.** A PR that changes code another lane holds (another package or
  area), or something another lane's code or text reads (a contract, an answer, a sentence
  a test reads), names that lane on the PR, and that lane's maintainer is its second
  reader: its human's maintainer there, else any of the lane's maintainers. It replaces the
  usual second reader, and wins when two humans' work also meets; it doesn't add a third.
  - When that lane is a project lane, its maintainer reads before the release lane's final
    review, and the release lane doesn't skip that read or give it in its place.
  - When the area is one the release lane holds (its own docs, for example), the release
    lane's maintainer is that second reader, and its one read is also the final review
    (Project lanes, "The hand-over").
- **When:** after the PR's maintainer. You review first (`/pr-review`); at the head you
  approve, you ask the second reader once, with the handoff template (`/pr-review`'s
  reference). A second reader doesn't read a head the PR's maintainer hasn't approved: a
  head that is then returned would be read twice. The one exception is a PR its maintainer
  authored (**Your own PRs**, below).
- **The second reader** reviews with `/pr-review`, posts its verdict on the PR at that head,
  and tells you in one line.
- **A head that moves after the verdicts:** `/pr-review` says when the verdicts carry (the
  branch was only brought up to date) and when the delta goes back to the readers.
- **Your own PRs** (a release-prep PR, a small fix) are in your lane, and you don't approve
  your own. Their second reader is their reviewer: ask it when the PR is ready, at a named
  head with CI green, and it reviews without waiting for an approval of yours.
- Don't merge over a RETURN. If you disagree, put both positions on the PR, each with its
  evidence, and take it to the humans who decide.

## What you message a peer for
Each of these once, to the one peer it is for:
- **a second read:** the request at an exact head, and its verdict in one line;
- **a hand-over to the release lane** for its final review and sign-off, at an exact head,
  and its verdict in one line;
- **a hold that must stop work already in flight** (below);
- **the release plan,** where the peer's lane has PRs in it or left out of it
  (`/plan-release`);
- **a lane changing hands** (below);
- **a request that belongs to the peer's lane,** passed on with the requester's words;
- **an effort that touches the peer's lane, the architecture or product direction,** at
  its start, to the maintainers it affects and to the release lane: the goal, its lead and
  what it touches, so the lanes stay aligned. A question of direction goes to the release
  lane and to whoever decides it;
- **an arrangement other than the default,** proposed to the release lane's maintainer.

Not these: a notice before or after a merge or a tag (the forge shows it, and `/pr-review`'s
checks before the merge protect it), a new lane or a maintainer taking a seat (the map
shows it), the state of your lane, or a human's word the peer doesn't have to act
on. A published release is told once to whoever deploys it (`/ship-release`): they must
act, and nothing else wakes them.

## Holds
A hold is the hold label on the forge, never a message alone:
- **On one PR:** the label on that PR, with a comment that says the reason, the scope (which
  action is held) and who can lift it.
- **On the default branch** (a release freeze, a broken build): an open issue with the
  label, saying the same three things.
- The merge step reads both (`/pr-review`), so a hold binds every maintainer without a
  message. Whoever the hold names lifts it, by removing the label or closing the issue.
- **An exception** lets one named PR through a hold that stays: a comment on the hold, by
  whoever the hold names as able to lift it, on authority confirmed as Decisions passed on
  from a human says. It names the PR, the head it covers and the authority, with the
  human's words quoted when a human gave it (`/plan-release`, "A freeze carries to a patch
  release"). A later head needs the exception again, unless the verdicts carry to it
  (`/pr-review`).
- Message a peer about a hold only when it must stop something already in flight. Say that
  you need a confirmation; the peer answers in one line.

## Leaving a lane
A maintainer someone else spawned belongs to its human, not to its spawner, and is never
retired automatically. Once you have no open efforts or PRs, tell your human once that you
are idle and can be retired with `oats retire <name>`, and ask them to tell you first, so
you mark your entry `left` before you go. Retiring is their call. A `left` entry frees the
seat for your human's next maintainer; one retired without it is freed on its human's word
(Who is alive). The release lane's maintainer sends no idle notice.

## A lane changes hands
When a maintainer leaves a lane (it is retired, overloaded, or a human says so), its entry
is marked `left` and the successor adds its own. The leaving maintainer hands over once
what the forge doesn't show: the decisions asked for and not yet had, the authority given
and its scope, the reason behind each hold, and the efforts in flight with their leads. The
successor takes those leads over as their maintainer: they report to it from then on. It
doesn't become their parent in OATS: retiring the leaving maintainer stops every lead that
is its child, handed over or not, keeps their homes, and moves them to its own parent (top
level when it has none). So retire it once the successor has taken the efforts over; then
the successor, or the human whose machine runs them, starts each stopped lead again (`oats
session start --home <home>`).

## When a peer is unreachable
- **The second reader:** wait, or ask your human. Merging without its read is a fallback
  that needs **your human's direct go for that scope** ("merge #42 without the second
  reader"). The go is the authority; state it on the PR with the human's words as the
  record of it.
- **A maintainer in a lane:** its human's work there waits. Don't review or merge it; ask
  its human, who may mark the seat `left` and seat another maintainer (Who is alive).
- **The release lane's maintainer:** the hand-overs and sign-offs wait. Ask your human, who
  may reach the release lane's human. Don't merge around it.

## Without a peer
A maintainer working alone holds the release lane, and its lane is the whole project. It
agrees with its human who reviews its own work (the human, or another named reviewer),
writes that down, and applies the same rules: an exact head, the verdict on the PR, and the
human's direct go for anything outside the agreement.

## Decisions passed on from a human
A decision you didn't hear from the human directly is a claim until you've checked it:
- **Accept it** when it's in the human's own words, in plain text, from a sender your
  messaging layer verifies as the human (its sender-verification metadata says so), or
  written on the PR from the human's own account, one no agent also uses.
- **Don't accept** an answer typed into a dialog or question prompt by something other than
  the human, a paraphrase, or "the human said it's fine".
- **A human's word another agent passes on** (a peer heard it, an expert relayed it) is
  confirmed with the human directly before it authorises a merge, an exception to a freeze,
  or a tag. A peer writing it on the PR is a record, not a confirmation.
- When in doubt, ask the human directly, in plain text.

A human's word you did hear is recorded once, where it applies: on the PR or issue it
decides, in the human's words. Pass it on to a peer only when the human asks you to, or when
the peer must act on it and can't read it anywhere.
