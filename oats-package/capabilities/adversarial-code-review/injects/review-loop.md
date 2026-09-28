## Adversarial code review: one reviewer per piece of work, until it is satisfied

Before you present a piece of work to your expert, it goes through an adversarial review.
Follow the **run-the-review-loop** skill:

- **Spawn ONE `code-reviewer`** for the piece of work, attached to the worktree the work
  is in. Do it when the work is complete and verified, not per commit.
- **Brief it with the goal, the spec and the diff range. Do NOT send your reasoning or
  how you solved it:** the reviewer's value is that it reads the code without your
  assumptions.
- **Iterate with the SAME reviewer:** fix what it finds, tell it what changed, and let it
  re-review. Don't spawn a new reviewer per round.
- **You're done when it approves.** If you disagree with a finding, say why; it decides
  or withdraws. After 4 rounds without agreement, stop and take the open points to your
  expert.
- **Retire the reviewer** when the loop ends, and include its final verdict and the
  number of rounds in your handback.

Never skip the review because the change "is small" unless your expert said so. Never
review your own work in its place.
