/**
 * Live quote generation — the app's core function.
 *
 * Calls Claude (Haiku 4.5) with the user's pain points, their preferred voice
 * (tone, inferred from onboarding), and the time of day, using a
 * structured-output schema so the Today screen reliably gets
 * `{ quote, author, reflection }`. If the key is missing or the network is
 * down, it falls back to a small bundled set so the screen is never empty.
 *
 * We call the Messages API over `fetch` rather than the Node SDK: the official
 * SDK imports Node built-ins (node:fs) that don't exist in React Native /
 * Metro. To move to a proxy later, point API_URL at your endpoint and drop the
 * key — nothing outside this file changes.
 *
 * SECURITY: for this personal MVP the key ships in the client bundle via
 * EXPO_PUBLIC_ANTHROPIC_API_KEY. Fine for a personal build, NOT for release.
 */
import {
  TONE_VOICE,
  type PainPoint,
  type Quote,
  type TimeOfDay,
  type Tone,
} from '@/constants/quotable';

const MODEL = 'claude-haiku-4-5';
const API_URL = 'https://api.anthropic.com/v1/messages';
const apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;

const QUOTE_SCHEMA = {
  type: 'object',
  properties: {
    quote: { type: 'string' },
    author: { type: 'string' },
    reflection: { type: 'string' },
  },
  required: ['quote', 'author', 'reflection'],
  additionalProperties: false,
} as const;

function systemPrompt(tone: Tone): string {
  return `You are Quotable — a companion that hands someone the one quote they need to hear right now.

Given what's weighing on the person and the time of day, return ONE short quote (max ~30 words) that meets them exactly there. It may be a real attributed quote OR an original line you write — whichever lands truer. Also return one short sentence of reflection spoken to them like a friend.

Voice: ${TONE_VOICE[tone]}.

Rules:
- Human and specific, never generic or preachy. No hashtags, no emoji.
- If it's a real attributed quote, put the person's name in "author". If it's your own original line or genuinely anonymous, set "author" to an empty string.
- "reflection" is one warm sentence (max ~20 words).`;
}

function userPrompt(painPoints: PainPoint[], timeOfDay: TimeOfDay): string {
  const weighing = painPoints.length
    ? painPoints.join(', ')
    : 'nothing specific — just here';
  return `Weighing on them: ${weighing}\nTime of day: ${timeOfDay}`;
}

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Generate a live quote personalized to the user's context. */
export async function generateQuote(params: {
  painPoints: PainPoint[];
  tone: Tone;
  timeOfDay: TimeOfDay;
}): Promise<Quote> {
  const { painPoints, tone, timeOfDay } = params;

  if (apiKey) {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 256,
          system: systemPrompt(tone),
          output_config: {
            format: { type: 'json_schema', schema: QUOTE_SCHEMA },
          },
          messages: [{ role: 'user', content: userPrompt(painPoints, timeOfDay) }],
        }),
      });

      if (!res.ok) {
        throw new Error(`Anthropic API ${res.status}: ${await res.text()}`);
      }

      const data = (await res.json()) as {
        content: { type: string; text?: string }[];
      };
      const block = data.content.find((b) => b.type === 'text' && b.text);
      if (block?.text) {
        const parsed = JSON.parse(block.text) as {
          quote: string;
          author: string;
          reflection: string;
        };
        return {
          id: makeId(),
          text: parsed.quote.trim(),
          author: parsed.author.trim() ? parsed.author.trim() : null,
          reflection: parsed.reflection.trim(),
          createdAt: Date.now(),
        };
      }
    } catch (err) {
      // Fall through to the local set — never leave the screen empty.
      console.warn('[quotable] live generation failed, using fallback', err);
    }
  }

  return fallbackQuote(painPoints);
}

/** Small bundled set so the app works offline / without a key. */
const FALLBACKS: Partial<Record<PainPoint, { text: string; author: string | null; reflection: string }>> & {
  default: { text: string; author: string | null; reflection: string }[];
} = {
  anxiety: {
    text: 'Nothing in life is to be feared, it is only to be understood.',
    author: 'Marie Curie',
    reflection: 'Meet the worry with curiosity instead of dread.',
  },
  stress: {
    text: 'Almost everything will work again if you unplug it for a few minutes, including you.',
    author: 'Anne Lamott',
    reflection: 'Give yourself permission to pause.',
  },
  overthinking: {
    text: 'You do not have to believe everything you think.',
    author: null,
    reflection: 'A thought is a visitor, not a verdict.',
  },
  'self-doubt': {
    text: 'You have survived every hard day so far. That is not a small thing.',
    author: null,
    reflection: 'Your track record is perfect. Trust it.',
  },
  burnout: {
    text: 'Rest is not idleness — it is the ground the next day grows from.',
    author: null,
    reflection: 'You did enough. Let the day be done.',
  },
  loneliness: {
    text: 'You are not too much, and you are not alone in feeling alone.',
    author: null,
    reflection: 'Reach toward one person today, even briefly.',
  },
  grief: {
    text: 'Grief is love with nowhere to go — so let it move through you.',
    author: null,
    reflection: 'Be gentle. There is no timeline for this.',
  },
  'feeling stuck': {
    text: 'Start where you are. Use what you have. Do what you can.',
    author: 'Arthur Ashe',
    reflection: 'One small true step is plenty for now.',
  },
  default: [
    {
      text: 'Be gentle with yourself. You are doing the best you can.',
      author: null,
      reflection: 'Whatever today is, you are allowed to meet it softly.',
    },
    {
      text: 'Wherever you are, be all there.',
      author: 'Jim Elliot',
      reflection: 'Let this moment have all of you, just for a breath.',
    },
  ],
};

function fallbackQuote(painPoints: PainPoint[]): Quote {
  const keyed = painPoints.length ? FALLBACKS[painPoints[0]] : undefined;
  const pick =
    keyed ?? FALLBACKS.default[Math.floor(Math.random() * FALLBACKS.default.length)];
  return {
    id: makeId(),
    text: pick.text,
    author: pick.author,
    reflection: pick.reflection,
    createdAt: Date.now(),
  };
}
