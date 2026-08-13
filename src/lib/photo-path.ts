import { DAYS } from "@/data/trip";

/** The Blob store is private, so images are read back through our own route
 *  rather than straight off a public CDN URL. */
export const BLOB_ACCESS = "private" as const;

export const EVENT_IDS = new Set(
  DAYS.flatMap((d) => d.events.map((e) => e.id)),
);

/** photos/<event id>/<name>--<8 chars>.<ext> — everything we need to show a
 *  photo lives in the path, so there is no database to keep in step. */
const PATHNAME =
  /^photos\/([a-z0-9-]{2,40})\/([\p{L}0-9 -]{1,40})--([a-z0-9]{8})\.(jpe?g|png|webp)$/u;

export function parsePhotoPath(pathname: string) {
  const m = PATHNAME.exec(pathname);
  if (!m) return null;
  const [, eventId, name] = m;
  if (!EVENT_IDS.has(eventId)) return null;
  return { eventId, who: name.replace(/-/g, " ") };
}

/** Same-origin, so next/image needs no remote host allow-listing. No query
 *  string either: the optimiser rejects local sources that have one. */
export function photoSrc(pathname: string) {
  const [, event, name] = pathname.split("/");
  return `/photo/${encodeURIComponent(event)}/${encodeURIComponent(name)}`;
}

export const configured = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);
