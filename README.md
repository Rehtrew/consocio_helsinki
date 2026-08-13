# Helsinki 20.–23. august · Consocio

An interactive version of the trip programme — timeline, maps with walking
routes, venue links and photos, the budget, and a live "what's happening now"
card during the trip.

Next.js 16 (App Router) + Tailwind 4 + Leaflet. Fully static, no runtime
services, no API keys.

## Running it

```bash
npm install && npm run dev
```

## Deploying

Push to the repo and import it in Vercel. The framework preset is detected
automatically. The site works with no configuration at all — the only optional
piece is photo uploads, below.

## Turning on trip photos

Each stop can collect photos the group takes on the day. They live in a Vercel
Blob store; without one the site behaves exactly as before and the upload
buttons simply don't appear.

1. In the Vercel dashboard: **Storage → Create → Blob**, and connect it to
   this project.
2. Redeploy. Vercel injects `BLOB_READ_WRITE_TOKEN` on its own — nothing to
   copy by hand.
3. For local development, pull it down with `vercel env pull .env.local`.

The browser shrinks each photo to a 2400px long edge before sending — a
10 MB phone shot becomes a few hundred KB — and tries a harder pass if the
first is still too big. Anything already under 1 MB is left alone so small
PNGs keep their transparency.

Because the image is small by then, it is posted to `/api/photos` as a normal
form and written to Blob server-side. That is deliberately *not* the client-
token upload flow from Vercel's docs: it needs no token handshake, the server
owns the pathname so it always matches what `GET` can parse, and there is one
place for an upload to go wrong instead of three.

Everything a photo needs is encoded in its path
(`photos/<event id>/<name>--<random>.jpg`), so there is no database to keep in
step and no migration to run. The uploader's name is asked for once and kept
in `localStorage`.

**Worth knowing:** there are no accounts. Anyone who has the site's URL can
add a photo, and the delete button — shown only on your own photos — is an
honour-system convenience rather than a permission check. That is a fine
trade for an unlisted page shared between five friends; it would not be for a
public one.

## Editing the programme

Everything lives in [`src/data/trip.ts`](src/data/trip.ts) — days, events,
places, budget, packing list and who owes the group an evening. The rest of the
app derives from it:

- Adding an event to a `DAYS` entry puts it in the timeline and in "lige nu".
- Adding a `place` id to an event puts a numbered pin on that day's map.
- A place's photos, description and website link are shown on the **first**
  event that visits it (`FIRST_VISIT`), so repeat visits stay lean. Override
  per event with `images`. Two or more photos become a swipeable pile.
- `anchor: true` marks the events that matter, which get a bigger title and a
  filled dot on the rail.

Times are written the way they appear in the programme (`"19.30"`). They are
Helsinki time except the two Copenhagen departures, which are listed by id in
[`src/lib/trip-time.ts`](src/lib/trip-time.ts).

## Regenerating the map routes

`src/data/routes.json` holds precomputed walking geometry so the map never
depends on a routing service at runtime. After changing or adding places:

```bash
node scripts/routes.mjs
```

Every day header also shows a small non-interactive Leaflet map of that day's
walking, and the flight cards show the great-circle route (`src/lib/geo.ts`).
They mount only when scrolled near, so six maps don't all fetch tiles at once.

Note that the hike in Sipoonkorpi is deliberately **not** routed — road routing
returns 13.6 km on roads instead of the 7–9 km trail loop, so the map draws a
dashed bearing line and says so.

## Screenshots for review

```bash
node scripts/shots.mjs 1280 desktop light
```

Writes to `/tmp/shots`. Arguments are width, filename prefix, and
`light`/`dark`. Requires Google Chrome installed.

## Where the content came from

The programme text, times and budget are from
*«HELSINKI 20-23. AUGUST – CONSOCIO»*. Addresses and coordinates were verified
against each venue and geocoded via OpenStreetMap. Photos come from the venues'
own sites, MyHelsinki, and Wikimedia Commons — credits are in the site footer.
