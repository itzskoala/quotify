# Explore: category-view rebuild, real stock photos, Valley Sans

## Prompt

Three follow-on requests to the same Explore session, building on the
earlier Pinterest-feed rebuild:

1. Fix a spacing bug (screenshot showed the search bar crashing into
   scrolled content with no gap) and make the masonry cards more varied in
   shape ("notice how all the [cards] are different shapes"), referencing a
   Pinterest "Ideas like this" screenshot.
2. Two follow-ups landing back to back: (a) tapping a category pill should
   open a clean masonry view like a referenced "Todos" screenshot — plain
   image/quote tiles, a "···" corner mark, no avatar chrome; (b) Explore's
   *landing* screen should be just the "Browse by category" tile grid
   (another reference photo) — pick a category, then see that clean view.
3. Real stock photos: every category tile gets a real photo, category
   views mix real photos with plain text posts, tiles should be "different
   shapes and sizes" with even whitespace so they don't read as grouped.
   New taxonomy: Family/Anime/Music/Romance/Travel/Politics/Workout — only
   build Anime/Politics/Workout for now, the rest just need to be
   clickable. Referenced `drumnation/unsplash-smart-mcp-server` for
   sourcing. Mid-build, asked for a richer post mix too: plain-quote,
   quote-over-beautiful-background, and quote-over-the-real-author's-face
   (reference: a "Nelson Mandela" quote card over his actual portrait) —
   "be playful... this is a mental health + motivational app." Also
   mentioned `claude mcp add image-generator -- npx mcp-hf-images` and
   SerpApi/Google Images as options, with API keys pasted directly in chat.

## Response/plan

**Spacing/variety fix**: added a bottom `paddingBottom` on Explore's fixed
header (it never scrolls, so it needed its own permanent breathing room,
not just the scroll content's top padding) — then removed a hairline
border I'd added for the same purpose once told it looked wrong. Found the
real "shapes" bug: the masonry's social/pin interleave was a `sort()` by
`hash(id)`, which isn't a shuffle — short ids ("f1".."f8") and long ones
("pin-lib-N") hash into very different numeric ranges and sort back into
blocks. Replaced with a seeded Fisher-Yates shuffle (`explore-feed.ts`),
widened the pin aspect-ratio pool from 3 values to 8, and switched both
aspect and preset selection from `i % n` cycling to hash-of-id picks so
neighboring cards don't repeat.

**Landing → category-view flow**: rebuilt `explore.tsx` around two screens
sharing one header/search: a `browsing` boolean derived from
(topic-selected | Following-on | non-empty search). Landing renders
`TopicGrid` (rewritten from a horizontal 2-row scroller to a wrapping
full grid, matching the new reference). Category view renders a `back +
underlined title` header and a masonry of a new uniform `CategoryTile`
(a `WallpaperCanvas` tile + a "···" mark, no avatar/engagement chrome —
that detail lives one tap into `PostDetailOverlay` instead). This made
`ExploreCardSocial`/`ExploreCardPin` fully redundant — deleted both,
extracted their shared logic into `wallpaperForQuote`/`presetForQuote`/
`aspectForQuote` in `explore-feed.ts` so any quote (social- or pin-sourced)
renders the same way.

**Taxonomy replace**: per the user's explicit choice, `constants/topics.ts`
now lists For You/Anime/Politics/Workout/Family/Music/Romance/Travel.
Anime/Workout/Romance/Music reuse existing tagged `LIBRARY` quotes (the
old mood-based ones, plus a small batch written in the prior session);
Politics needed real content — authored 6 new quotes, deliberately
non-partisan/civic (Lincoln, LBJ, Gandhi, Salzberg, one anonymous), after
flagging the sensitivity and getting the user's sign-off on that framing
first. Family/Travel are real, clickable, empty for now (no content
authored) per "only focus on Anime/Politics/Workout."

**Real photos — sourcing decision**: the referenced Unsplash MCP server
needs an `UNSPLASH_ACCESS_KEY` I don't have, and installing a *new* MCP
server isn't something usable mid-session anyway (needs a config change +
restart). Explained that to the user; they provided an Unsplash key
directly in chat (flagged once, lightly, that it probably shouldn't be
pasted — then just saved it to `.env.local`, gitignored, never echoed
again). Rather than embed the key client-side or install the MCP server,
built two small one-off scripts (`scripts/fetch-unsplash.ts` to search,
`scripts/trigger-unsplash-download.ts` to ping `download_location` per
Unsplash's API Guidelines) and curated 9 photos into a static
`constants/photos.ts` — covers + post photos for Anime/Workout/Politics,
verified visually (downloaded + viewed each pick before committing to it).

When the user asked for "quote over the author's real face" posts and
separately offered an HF image-gen MCP server + SerpApi/Google Images:
declined image generation for real named people (fabricating imagery of
real people isn't something to do even for the historical figures already
in the library) and declined SerpApi/Google Images (scraped results carry
no redistribution license — real legal exposure). Used Wikimedia Commons
instead (no key needed, license-checked via its `imageinfo` API) for
verified public-domain/CC portraits of Lincoln, Gandhi, and Mandela
(retagged his existing `LIBRARY` quote into Politics) — downloaded and
visually confirmed all three before use.

**Wiring**: turns out `WallpaperCanvas` already renders a `photoUri`
background with a legibility scrim (Studio's custom-photo wallpapers use
the same path) — so `wallpaperForQuote()` just checks `QUOTE_PHOTOS` first
and sets `photoUri`/`ink:'light'` when a curated photo exists. No new post
"kind" or tile component needed. `TopicGrid` shows a real `Image` +
bottom-scrim for topics with a `CATEGORY_COVERS` entry, falling back to
the existing grayscale-gradient-+-glyph tile otherwise. `PostDetailOverlay`
swaps `PaperCard` for a full-size `WallpaperCanvas` hero + a small
photographer/license credit line whenever the quote has a real photo.
New `TopicArt` glyphs for the 5 categories without a photo yet (dumbbell/
heart/house/note/paper-airplane, reusing the old deleted `mood-art.tsx`'s
visual ideas where they overlapped). Bumped masonry gap from 16→24px
per the "equal whitespace, doesn't feel grouped" note.

**Font**: separately asked to switch Explore's whole typography to Valley
Sans. Installed `@expo-google-fonts/valley-sans`, added `BrandFonts.valley*`
scoped the same way onboarding's Google Sans Flex is — registered in
`_layout.tsx`, applied only inside Explore's own components
(`explore.tsx`, `TopicGrid`, `SearchBar`, `Pill`, `PostDetailOverlay`'s
chrome). Left `PaperCard`/`WallpaperCanvas` (shared with Home/Studio/
Profile) on Indie Flower so the rest of the app is untouched.

Verified everything end-to-end in the browser after each change: landing
grid (3 photo tiles + 5 monochrome), Anime/Politics/Workout category views
(real photo-backed tiles mixed with plain text ones, confirmed against the
Mandela reference), Travel's empty state, `tsc`/`npm run lint` clean
throughout.

## Outcome

12 real photos now in the app (9 Unsplash, 3 Wikimedia), all attributed in
`constants/photos.ts` and credited in the post detail overlay. Did not
install the HF image-gen MCP server or use SerpApi — explained why for
both rather than silently complying, and didn't persist the Hugging Face
key the user pasted anywhere since that path was never taken.
`.env.local` holds only `UNSPLASH_ACCESS_KEY` (gitignored, curation-only,
never shipped in the app bundle).
