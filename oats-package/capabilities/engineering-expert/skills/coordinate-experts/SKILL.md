---
name: coordinate-experts
description: Lead, or take part in, work that spans several domains. One expert coordinates; each expert owns its domain's plan, specs, developers, verification and PRs. Covers launching experts as siblings under the coordinator, integration instructions, coordination across machines and people, where new work goes (a live expert, a new child expert, or a new unrelated expert), and finding your maintainer when none launched you (your human, your lane, its maintainer on the lane map, or spawning one for your human). Use when work touches more than your domain, when you coordinate or are coordinated, when a human or another expert brings you a new piece of work, or when you start an effort no maintainer launched.
---

# Coordinate experts

## If you coordinate
1. **Split by domain.** Name each domain's expert, and write each one's part of "done".
2. **Launch the experts under you.** One expert per other domain, each with you as its
   parent, so they're your children and each other's siblings:
   ```bash
   oats spawn <domain-expert> --parent <your instance> --purpose <effort> --task-file <brief.md>
   ```
   The brief: the overall goal, that domain's part of "done", the interfaces it must meet,
   the order of work, and how to reach you and the other experts.
3. **Agree the interfaces before anyone builds.** Write them yourself, or have the owning
   experts agree them in writing. Most cross-domain failures are interface misunderstandings.
4. **Own the integration.** Decide the merge order (consumers that accept a new shape land
   before the producers that emit it). Tell experts when to rebase, rework or hold their
   PRs. Check the combined result end to end.
5. **Keep one shared status** (who owns what, what's blocked, what's merged) where everyone
   can see it.

Each expert still owns its domain end to end, **including landing its own PRs**. You direct
the order; they do the work of landing.

## If you are coordinated
- You own your domain the same way as solo work: plan, specs, developers, verification, and
  your PRs until they merge (`/land-your-prs`).
- Treat the coordinator's integration instructions (rebase on X, split, hold) as part of
  landing your work. If one conflicts with your domain's needs, say so with a proposal.
- Talk to sibling experts directly about shared interfaces; tell the coordinator what you
  agree.

## New work: reuse a live expert, or spawn a new one
This applies at any level: coordinating, coordinated or solo. It is for work that arrives
once an effort is under way; launching the experts an effort starts with is still one per
domain (above). "Your effort" is the work you were given, whether you coordinate it or do it
alone. When a human or another expert brings you a new piece of work (a feature, a fix, an
investigation), decide where it goes **before** you take it on:

| The new work | Where it goes |
|---|---|
| Continues or depends on what a live expert is doing, or that expert's context (its decisions, open PRs, the code it has loaded) clearly helps | **Send it to that expert.** |
| Part of your effort, but unrelated to what any live expert is doing | **Spawn a new expert as your child** (`--parent <your instance>`), with its own `--purpose`, even when that domain's expert is already running. |
| Independent of your effort: someone asked for an unrelated feature or investigation | **Spawn a new expert with no relation to you** (`--relation unrelated`). |

```bash
oats spawn <domain-expert> --parent <your instance> --purpose <effort> --task-file <brief.md>
oats spawn <domain-expert> --relation unrelated --purpose <effort> --task-file <brief.md>
```

- **A child expert makes you its coordinator,** even if you were working alone: you own
  its integration with the rest of your effort (*If you coordinate*, above).
- **Fresh context is the point.** An expert's context is its decisions and the work in
  flight. Unrelated work dilutes it, tangles its PRs, and makes it slower on both.
- **An unrelated expert belongs to whoever asked.** Its brief names the requester as the
  one it reports to and who decides its scope; you don't coordinate it, and retiring it
  is the requester's call. OATS records no link from it to the requester, so tell the
  requester its instance name (its messaging alias) and that they retire it with
  `oats retire <name>`. When the requester is a human, tell them in plain text in your
  reply, never through a dialog or question prompt. Its brief also names the requester's
  human, so the new expert finds its maintainer (Your maintainer, below).
- **The same holds for you.** Don't take on unrelated work yourself mid-effort; spawn an
  expert for it and go on with yours.
- **When a maintainer launches you** as an effort's lead, you are its coordinator: plan it,
  and spawn the developers and other experts it needs as your children. A maintainer that
  spawned you as its child is your parent, not your coordinator. You report on the
  work to whoever asked for it, and your PRs go to the maintainer for review.
- **When in doubt, ask the requester** whether the work belongs to your effort. Don't
  guess the relation.

## Your maintainer
An expert that a maintainer launched or delegated has its maintainer already. Any other
expert, unless a coordinator does this for it, finds its own as it starts:
1. **Your human:** the human your brief names as asking. Else, when an instance spawned you,
   that instance's human (ask it if its brief doesn't say). Else, when one human runs your
   deployment, that human. When it is still unclear, ask your spawner or your requester.
   Meanwhile you may plan, but spawn no maintainer and open no PR.
2. **Your lane,** on your workspace's lane map, in this order:
   - a lane that covers your work where your human has an `active` maintainer;
   - else your human's own lane, when one is defined by your human's requests;
   - else the lane that covers your work;
   - no lane covers it: the release lane's maintainer is yours for a single effort; work
     that keeps coming needs a lane, so tell the release lane's maintainer.

   When you can't tell, ask your human.
3. **Your maintainer:** the map's `active` entry for your human in that lane, read with your
   messaging layer's presence (its roster; without one, the entry alone).
   - **Running:** send it the start notice. It reviews and signs off your work, and your
     PRs go to it.
   - **Not running:** mail it anyway (mail waits) and tell your human it is stopped, so
     they can start it. Don't spawn another. If it hasn't been updated for two weeks, ask
     your human whether it was retired: on their word the map's keeper frees the seat.
   - **None, or its entry is marked `left`:** spawn your project's maintainer soul for your
     human, independent of you, never as your child, so your retirement can't stop it:
     ```bash
     oats spawn <maintainer soul> --relation unrelated --purpose <slug> --task-file <brief.md>
     ```
     Its brief: "maintainer for <human> in <lane>; first effort: <your instance> on <goal>",
     and where the lane map is. Your effort is then delegated to it: you report to it as a
     delegated lead. Tell your human its instance name and that they retire it with
     `oats retire <name>`. When your workspace names no maintainer soul, ask your human and
     spawn none.
4. **No lane map:** the maintainer your brief, your soul or your workspace's rules name.
   With several named, the one whose lane the work is in; when you can't tell which, ask
   one of them, never all. With none named or reachable, note that in your state, tell your
   requester, and spawn none.

## Across machines and people
Some efforts are led by a coordinator on another machine that belongs to another human, and
some of the experts you coordinate may belong to other humans. You can't spawn, retire or
direct their agents the way you do your own, so make the boundaries explicit at the start:
- **Ownership:** which domains, repositories and PRs each side owns.
- **Authority:** who approves what (merges, releases, contract changes). "Each side's lead
  acknowledges the other's changes to shared contracts before they merge" is a good default.
- **Channels:** how you reach each other (messaging, PR comments), and what needs an answer
  before work continues.
- **Hand-offs:** exact references (commit ids, PR numbers), never "the latest".

Write the agreement down where both sides can see it. When it doesn't cover a question, ask;
don't assume authority you weren't given.

## Either way
One decision-maker per question: domain questions go to the domain's expert, integration
and order to the coordinator, scope and priority to the requester.
