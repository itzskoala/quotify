# Dev log

This is a log of **prompts given to Claude Code** (the coding assistant working
on this repo) and its responses/plans — not to be confused with `../system_prompts/`
and `../few_shot_examples/`, which version the *in-app* LLM prompts that
`src/lib/anthropic.ts` sends to Claude at runtime. Different thing, same
top-level folder by request.

## Convention

One file per task, named `YYYY-MM-DD-HHmm-<slug>.md`, containing:

- **Prompt** — what was asked (verbatim or lightly trimmed)
- **Response/plan** — what Claude Code did or proposed, in enough detail to
  reconstruct the reasoning later
- Optional **Outcome** note if it's worth recording how it landed

Written for every task, not just substantial ones. Never edited after the
fact — if a task continues in a later turn, add a new file rather than
appending.
