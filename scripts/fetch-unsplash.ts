/**
 * One-off curation helper — searches Unsplash and prints candidate photos as
 * JSON so a human (or Claude) can hand-pick which ones go into
 * `src/constants/photos.ts`. Not run by the app; not part of any build step.
 *
 * Usage: npx tsx scripts/fetch-unsplash.ts "<query>" [count] [orientation]
 * Requires UNSPLASH_ACCESS_KEY in .env.local (see .env.example).
 *
 * This only searches/lists candidates — it does NOT trigger a download.
 * Per Unsplash's API Guidelines, `download_location` should be pinged once
 * per photo actually chosen for use, not for every search result shown
 * while browsing. Run `trigger-unsplash-download.ts` for photos you keep.
 */
import { config } from 'dotenv';

config({ path: '.env.local' });

const key = process.env.UNSPLASH_ACCESS_KEY;
if (!key) {
  console.error('UNSPLASH_ACCESS_KEY not set in .env.local');
  process.exit(1);
}

const [, , query, countArg, orientationArg] = process.argv;
if (!query) {
  console.error('Usage: npx tsx scripts/fetch-unsplash.ts "<query>" [count] [orientation]');
  process.exit(1);
}
const count = countArg ? Number(countArg) : 6;
const orientation = orientationArg ?? 'portrait';

async function main() {
  const url = new URL('https://api.unsplash.com/search/photos');
  url.searchParams.set('query', query);
  url.searchParams.set('per_page', String(count));
  url.searchParams.set('orientation', orientation);
  url.searchParams.set('content_filter', 'high');

  const res = await fetch(url, { headers: { Authorization: `Client-ID ${key}` } });
  if (!res.ok) {
    console.error(`Unsplash error ${res.status}: ${await res.text()}`);
    process.exit(1);
  }
  const data = await res.json();

  const picks = (data.results ?? []).map((p: any) => ({
    id: p.id,
    description: p.alt_description ?? p.description ?? null,
    url: p.urls.regular as string,
    downloadLocation: p.links.download_location as string,
    photographer: p.user.name as string,
    photographerUrl: `${p.user.links.html}?utm_source=quotable&utm_medium=referral`,
  }));

  console.log(JSON.stringify(picks, null, 2));
}

void main();
