# Prompt artifacts

This directory is the version history of the prompts Quotable sends to Claude.
It exists so a prompt change is a reviewable, diffable artifact — not just a
line buried in a component file.

`src/lib/anthropic.ts` stays the **executable source of truth** (the system
prompt is a function of `tone`, not a static string, so it can't just be
loaded from a `.txt` file at runtime without adding complexity the app
doesn't need yet). The files here are dated snapshots + changelog, kept in
sync by hand whenever the prompt changes.

## Layout

```
prompts/
  system_prompts/
    quote_generation_v1.txt   # current live system prompt template
  few_shot_examples/          # reserved — empty until we add few-shot examples
  templates/                  # reserved — empty until we add response templates
  dev-log/                    # separate concern — see dev-log/README.md
```

Note: `dev-log/` is unrelated to the in-app prompt versioning described
below — it's a log of prompts given to Claude Code (the assistant) and its
responses, kept here at the user's request. See `dev-log/README.md`.

## Convention

Every time `systemPrompt()` or `userPrompt()` in `src/lib/anthropic.ts`
changes:

1. Copy the current `quote_generation_vN.txt` to `vN+1`.
2. Update the header block: date, what changed, why.
3. Update the template body to match the new code exactly (interpolated
   values are marked `{{like this}}`).
4. Run `npm run eval` and paste the before/after summary (format compliance,
   refusal rate, avg judge score, avg length) into the changelog header of
   the new version file.

Never edit a version file after it's been superseded — add a new one. The
stack of files is the audit trail.
