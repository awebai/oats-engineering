---
name: launch-work
description: Turn the work someone asks the maintainer for into launched work, without leading it - usually a human's high-level picture of what they want (a feature, a fix, an investigation, a project) - clarify only what changes who leads it, find the lane (or define one) and the best-suited expert, delegate to a live expert whose work it continues or spawn one independent lead expert per independent effort, brief it, tell the requester, and track it in the state file; also launching another maintainer into a lane. Use whenever a human describes work they want, or anyone asks you to start, launch or hand off work.
---

# Launch work

You start work; experts lead it. Every effort you launch gets one lead expert, independent
of you, who writes its spec and plan and coordinates the developers and other experts it
needs. You stay an individual instance: nothing you launch becomes your child, so the work
doesn't all hang from you.

This is your normal intake. Humans usually give you the high-level picture, a few sentences
about work they want done, not a spec. That is enough: your job is to get it to the right
lead with a good brief. The lead works out the detail, with the human where it needs them.

## 1. Understand the request
- What is asked, by whom, and what "done" means to them. Ask only what changes who should
  lead it, or how many efforts it is. Leave the rest for the lead: don't gather
  requirements, and don't write a spec.
- **How many efforts?** Work with separate goals that can land on their own is separate
  efforts, each with its own lead. One goal that touches several domains is one effort.
- **Consult your knowledge:** the roadmap (does this fit, does it jump the queue?), the
  decisions it touches, and who owns the domain. A request that needs a direction decision
  first goes through `/direction-gate` before anyone builds.
- **Whose lane is it?** With peer maintainers, a request for work in another lane goes to
  that lane's maintainer, once, with the requester's words (`/cross-review-peer`). Tell the
  requester who has it, and launch nothing. Work for a new project of your human's that no
  lane of yours covers gets a lane of its own: define it on the lane map first
  (`/cross-review-peer`, "Project lanes"). The release lane's maintainer may instead keep
  its human's work in its own lane.

## 2. Find the expert
- **The domain:** from your knowledge and the expert map your soul or workspace keeps
  (which expert soul owns which area); with no map, ask your human. For work across
  domains, pick the domain where most of the risk or the design sits: its expert leads,
  and brings in the others.
- **The live instances:** who is running now and on what (your state file, your OATS
  status, your messaging roster).

## 3. Delegate or spawn
| The work | Do |
|---|---|
| Continues what a live expert is doing, or that expert's context (its decisions, open PRs, the code it has loaded) clearly helps | **Delegate it to that expert** by message, with the brief below: it leads this as an effort of its own, launched by you. It confirms it takes it, and tells its own coordinator, if it has one. If it can't take it, spawn a new lead. |
| Anything else | **Spawn a new instance of the domain's expert, independent of you:** `oats spawn <expert> --relation unrelated --purpose <slug> --task-file <brief.md>` |

- **One lead per effort,** never one per domain: the lead brings in the other experts as
  its children if it needs them. Several independent efforts get one lead each.
- **Never as your child,** and never a developer directly: specs and builds are the lead's
  job.
- Don't pile unrelated work onto a busy expert, to save a spawn.

## 4. Brief the lead
The brief holds:
1. **That it leads this effort,** launched by you, so it sends you no start notice.
2. **The goal** and why, in a few sentences, and what "done" means to the requester.
3. **Who asked,** and that the lead reports on the work to them.
4. **What your knowledge says** that bears on it: the decisions and coherence rules it
   must respect, and where it sits on the roadmap.
5. **Delivery:** its PRs come to you for review, and to no other maintainer: you ask the
   second reader, and you hand the approved PR on to the release lane where your lane's
   arrangement says so. With peer maintainers, name your lane's label for it to put on its
   PRs (`/cross-review-peer`).

Don't split the work by domain or surface for it, and don't write its spec or plan:
planning and coordination are the lead's role.

## 5. Close the loop
- Tell the requester the lead's instance name and how to reach it. A human is told in
  plain text, never through a dialog.
- Add it to your state file: the effort, its lead, who asked, and what you're waiting for.
- From then on the lead reports PRs to you like any expert (`/pr-review`). Don't ask it
  for progress: it tells you what blocks it, and it hands over its PRs.
- **When the effort is done** (its PRs merged, the requester satisfied), ask the
  requester whether to retire the lead: a human retires it or tells you to; when the
  requester is an agent, ask your human. Then close the row in your state file.

## Launching a maintainer into a lane
When your human asks for another maintainer in a lane, yours or a new one, launch it like a
lead: an instance of your project's maintainer soul, independent of you, never as your
child (`oats spawn <maintainer soul> --relation unrelated --purpose <slug> --task-file
<brief.md>`). Its brief names the lane, where the lane map is, its human, and the efforts
in flight it takes over, if any. It adds itself to the lane's line on the map
(`/cross-review-peer`, "Joining as a new maintainer"). Tell your human its instance name.
