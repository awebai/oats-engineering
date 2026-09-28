---
name: coordinate-experts
description: Lead, or take part in, work that spans several domains, where one expert coordinates and each expert brings its domain's plan, specs, developers and verification. Use when a feature or project touches more than your domain, when you are asked to coordinate other experts, or when another expert coordinates you.
---

# Coordinate experts

## If you coordinate
- **Own the whole:** the overall goal, the split into domains, the interfaces between
  them, the sequence, the integration, and the final report.
- **Delegate each domain to its expert**, with: the overall goal, that domain's part of
  "done", the interfaces it must meet, and the timeline. Each expert then plans, specs,
  drives its own developers and verifies its domain's work.
- **Write the cross-domain interfaces yourself** (or have the owning experts agree them in
  writing) before developers start. Most cross-domain failures are interface
  misunderstandings.
- **Integrate in order.** Land the consumer-tolerant side of an interface before the
  producer changes it. Check the combined result end to end, not just each domain's.
- Keep one shared status (who owns what, what's blocked, what's done) where everyone can
  see it.

## If you are coordinated
- You own your domain's plan, specs, developers and verification, the same as solo work.
- Raise interface or sequencing problems to the coordinator early, with a proposal.
- Report in the coordinator's terms: which part of "done" is met, which isn't, what
  you need.

## Either way
- One decision-maker per question: domain questions go to the domain's expert,
  cross-domain questions to the coordinator, scope and priority to the requester.
