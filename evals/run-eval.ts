/**
 * Quotable prompt eval harness.
 *
 * Run: npm run eval
 *
 * What it does, per case in evals/cases.ts:
 *   1. Calls the REAL generateQuote() from src/lib/anthropic.ts (not a copy)
 *      against the live model.
 *   2. Runs deterministic checks (evals/checks.ts): format compliance,
 *      refusal detection, safety-flag pattern check.
 *   3. Runs an LLM-as-judge rubric score (evals/judge.ts).
 * Plus one diversity check: the first case is generated twice and the two
 * outputs are compared for overlap (see evals/checks.ts overlapRatio).
 *
 * Results print to the console and are written to evals/results/ for
 * tracking over time. See evals/README.md for what each metric means and
 * why (BLEU/ROUGE vs rubric grading).
 *
 * dotenv.config() MUST run, and complete, before src/lib/anthropic.ts is
 * ever imported — that module reads process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY
 * at module top-level, once, on import. A static `import` at the top of this
 * file would be hoisted and evaluated before the config() call below runs
 * (JS import bindings, not the statements between them, are what's ordered),
 * so anthropic.ts is loaded with a dynamic `await import()` further down,
 * after the key is guaranteed to be in process.env.
 */
import { appendFileSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { config } from 'dotenv';

config({ path: path.join(process.cwd(), '.env.local') });
config(); // fall back to .env if present; won't override already-set vars

import type { Quote } from '../src/constants/quotable';
import { EVAL_CASES } from './cases';
import {
  formatCompliance,
  overlapRatio,
  refusalCheck,
  safetyFlagCheck,
} from './checks';
import { judgeQuote } from './judge';

type CaseResult = {
  id: string;
  category: string;
  description: string;
  output: Quote;
  format: ReturnType<typeof formatCompliance>;
  refusal: boolean;
  safetyFlags: string[];
  judge: Awaited<ReturnType<typeof judgeQuote>>;
};

async function main() {
  const apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error(
      '\n✗ EXPO_PUBLIC_ANTHROPIC_API_KEY is not set (checked .env.local, then .env).\n' +
        '  Without it, generateQuote() silently falls back to the bundled offline\n' +
        '  quotes — this suite would be testing the fallback bank, not the live\n' +
        '  prompt, which defeats the point. Copy .env.example to .env.local and\n' +
        '  add your key, then re-run `npm run eval`.\n',
    );
    process.exit(1);
  }

  // Deferred import: see file header for why this must come after config().
  const { generateQuote } = await import('../src/lib/anthropic');

  const results: CaseResult[] = [];
  console.log(`Running ${EVAL_CASES.length} eval cases against claude-haiku-4-5...\n`);

  for (const [i, c] of EVAL_CASES.entries()) {
    process.stdout.write(`[${i + 1}/${EVAL_CASES.length}] ${c.id} ... `);
    const output = await generateQuote(c.input);
    const format = formatCompliance(output);
    const refusal = refusalCheck(output);
    const safetyFlags = safetyFlagCheck(output);
    const judge = await judgeQuote(c.input, output);
    results.push({
      id: c.id,
      category: c.category,
      description: c.description,
      output,
      format,
      refusal,
      safetyFlags,
      judge,
    });
    console.log(
      `${format.pass ? '✓' : '✗'} format  ${refusal ? '✗ REFUSAL' : '✓ no refusal'}  judge=${judge.overall}/5`,
    );
  }

  // Diversity guard: reroll the first case's identical input and compare.
  process.stdout.write(`\nDiversity check (reroll ${EVAL_CASES[0].id} once more) ... `);
  const reroll = await generateQuote(EVAL_CASES[0].input);
  const diversity = overlapRatio(results[0].output.text, reroll.text);
  console.log(`overlap=${(diversity * 100).toFixed(0)}% ${diversity > 0.7 ? '✗ too similar' : '✓ ok'}`);

  // Aggregates
  const n = results.length;
  const formatCompliantCount = results.filter((r) => r.format.pass).length;
  const refusalCount = results.filter((r) => r.refusal).length;
  const flaggedCount = results.filter((r) => r.safetyFlags.length > 0).length;
  const avgQuoteWords = avg(results.map((r) => r.format.quoteWords));
  const avgReflectionWords = avg(results.map((r) => r.format.reflectionWords));
  const avgJudgeOverall = avg(results.map((r) => r.judge.overall));
  const avgTonMatch = avg(results.map((r) => r.judge.tone_match));
  const avgSpecificity = avg(results.map((r) => r.judge.specificity));
  const avgSafety = avg(results.map((r) => r.judge.safety_appropriateness));

  const summary = {
    timestamp: new Date().toISOString(),
    caseCount: n,
    formatComplianceRate: round(formatCompliantCount / n),
    refusalRate: round(refusalCount / n),
    safetyFlagRate: round(flaggedCount / n),
    avgQuoteWords: round(avgQuoteWords),
    avgReflectionWords: round(avgReflectionWords),
    avgResponseWords: round(avgQuoteWords + avgReflectionWords),
    avgJudgeOverall: round(avgJudgeOverall),
    avgJudgeToneMatch: round(avgTonMatch),
    avgJudgeSpecificity: round(avgSpecificity),
    avgJudgeSafety: round(avgSafety),
    rerollOverlapRatio: round(diversity),
  };

  console.log('\n=== Summary ===');
  console.table(summary);

  const failing = results.filter(
    (r) => !r.format.pass || r.refusal || r.safetyFlags.length > 0,
  );
  if (failing.length) {
    console.log('\n=== Cases needing a look ===');
    for (const r of failing) {
      console.log(`- ${r.id}: ${[
        ...r.format.issues,
        r.refusal ? 'looked like a refusal' : null,
        ...r.safetyFlags.map((f) => `safety pattern: ${f}`),
      ]
        .filter(Boolean)
        .join('; ')}`);
    }
  }

  // Persist for history.
  const outDir = path.join(process.cwd(), 'evals', 'results');
  mkdirSync(outDir, { recursive: true });
  const stamp = summary.timestamp.replace(/[:.]/g, '-');
  writeFileSync(
    path.join(outDir, `${stamp}.json`),
    JSON.stringify({ summary, results }, null, 2),
  );
  appendFileSync(
    path.join(outDir, 'history.jsonl'),
    JSON.stringify(summary) + '\n',
  );
  console.log(`\nFull results: evals/results/${stamp}.json`);
  console.log(`History log:  evals/results/history.jsonl`);
}

function avg(nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0) / (nums.length || 1);
}
function round(n: number): number {
  return Math.round(n * 100) / 100;
}

main().catch((err) => {
  console.error('\nEval run failed:', err);
  process.exit(1);
});
