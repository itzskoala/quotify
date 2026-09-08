/**
 * Pings a photo's `download_location` — per Unsplash's API Guidelines, this
 * should happen once for each photo actually chosen for use (not for every
 * search result browsed). Run once per photo when it's added to
 * `src/constants/photos.ts`.
 *
 * Usage: npx tsx scripts/trigger-unsplash-download.ts "<downloadLocation url>"
 */
import { config } from 'dotenv';

config({ path: '.env.local' });

const key = process.env.UNSPLASH_ACCESS_KEY;
const [, , downloadLocation] = process.argv;

if (!key || !downloadLocation) {
  console.error('Usage: npx tsx scripts/trigger-unsplash-download.ts "<downloadLocation url>"');
  process.exit(1);
}

async function main() {
  const res = await fetch(downloadLocation, { headers: { Authorization: `Client-ID ${key}` } });
  console.log(res.ok ? 'ok' : `failed: ${res.status} ${await res.text()}`);
}

void main();
