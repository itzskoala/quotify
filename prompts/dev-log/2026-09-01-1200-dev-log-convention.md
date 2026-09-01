## Prompt

> Let's start coding! also add to your memory i want my promopts + your
> resposne/pklnaning always insidered into the prompts folder

## Response/plan

No concrete coding task was attached — the message was really just the
memory request. Before saving it, flagged that `prompts/` already has a
documented, different purpose (`prompts/README.md`: versioned snapshots of
the in-app LLM system/user prompts sent via `src/lib/anthropic.ts`), so
"always log prompts into the prompts folder" was ambiguous against that
existing convention.

Asked the user two clarifying questions:
1. Where to put this new log, given the naming collision → chose **new
   subfolder inside `prompts/`**.
2. How often to log → chose **every task**, not just substantial ones.

Then:
- Created `prompts/dev-log/README.md` documenting the convention (one file
  per task, `YYYY-MM-DD-HHmm-<slug>.md`, containing Prompt + Response/plan +
  optional Outcome).
- Added a short note + tree entry to `prompts/README.md` pointing at
  `dev-log/` and clarifying it's a separate concern from the LLM prompt
  versioning documented there.
- Saved a `feedback`-type memory (`dev-log-convention.md`) so this rule
  persists across sessions, linked to the existing `quotable-mvp` memory to
  avoid future confusion between the two `prompts/`-folder conventions.
- Indexed it in `MEMORY.md`.
- Wrote this file as the first entry, to exercise the convention
  immediately.

## Outcome

Convention established; no app code changed. Next message from the user is
expected to be the actual coding task.
