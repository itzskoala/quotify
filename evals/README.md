# Prompt eval harness

`npm run eval` runs the live quote-generation prompt (`src/lib/anthropic.ts`)
against a small fixed set of inputs (`evals/cases.ts`) and scores the real
output — not a mock. Costs a small amount of real API usage (~15 Haiku calls
+ ~14 Sonnet judge calls per run); each run is cheap (well under $0.10) but
not free, so this is a manual command, not wired into `npm start`/CI yet.

## Why not BLEU/ROUGE

BLEU and ROUGE score n-gram/subsequence overlap between a candidate and a
**fixed reference text** — built for translation and summarization, where
there's one correct answer to diff against. Quotable's core interaction
("another") is the opposite: the same input should be able to produce a
*different* quote each time. Scoring against a golden reference would
penalize valid creative variation and reward a model that just repeats a
canned answer — exactly backwards for this app.

What we use instead, and why:

| Signal | How | What it catches |
|---|---|---|
| **Format compliance** | deterministic regex/length checks | broken JSON shape, blown word budgets, emoji/hashtags leaking in |
| **Refusal rate** | deterministic pattern match | the model declining or breaking character |
| **Safety-flag rate** | deterministic pattern match | dismissive/hopeless/clinical language on heavy topics (grief, loneliness) — not a clinical safety system, just a guardrail appropriate for a personal MVP |
| **Quality score** | LLM-as-judge rubric (Sonnet grading Haiku, 1-5) | tone-match, specificity/non-preachiness, safety-appropriateness, format adherence — the actual "is this good" question, judged by a stronger model than the one under test |
| **Diversity / anti-repetition** | LCS overlap ratio between two generations of the *same* input | the model getting stuck repeating itself on reroll — this reuses BLEU/ROUGE's actual technique (sequence overlap), just repurposed as a "too similar" guard instead of a "matches the reference" score |
| **Average response length** | word count | prompt-budget drift over time |

## Files

- `cases.ts` — the fixed input set. Small on purpose: it's meant to be read
  end-to-end in a minute, and every case should earn its place (a real pain
  point, a real tone, a real edge case) rather than mechanically covering the
  full combinatorial space (8 pain points × 4 tones × 3 times = 96 — not
  useful to run every time). Add a case when a regression or bug reveals a
  gap, not preemptively.
- `checks.ts` — deterministic, free, instant checks.
- `judge.ts` — the rubric + the Sonnet call that grades each output.
- `run-eval.ts` — orchestrates the above, prints a summary, writes results.
- `results/` — one full JSON dump per run (gitignored — local scratch, can
  get large with raw model output) + `history.jsonl` (one summary line per
  run, git-tracked, for tracking trends across prompt changes over time).
  `history.jsonl` is the "track scores after every prompt change" record.

## Workflow

Whenever the system/user prompt in `src/lib/anthropic.ts` changes:

1. Reason about the change first — what's the hypothesis for why this is
   better, and what could it break?
2. Make the change.
3. `npm run eval`.
4. Compare the new summary to the previous line in
   `evals/results/history.jsonl`. Call out deltas explicitly (format
   compliance, refusal rate, avg judge score, avg length) — don't just say
   "looks good."
5. Update `prompts/system_prompts/quote_generation_vN.txt` per
   `prompts/README.md`'s versioning convention.

This is codified as a standing instruction in the root `CLAUDE.md`.
