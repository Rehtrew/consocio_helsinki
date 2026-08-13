import { del, list } from "@vercel/blob";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { DAYS } from "@/data/trip";

export const dynamic = "force-dynamic";

const EVENT_IDS = new Set(DAYS.flatMap((d) => d.events.map((e) => e.id)));

/** photos/<event id>/<name>--<8 chars>.<ext> — everything we need to show a
 *  photo lives in the path, so there is no database to keep in step. */
const PATHNAME =
  /^photos\/([a-z0-9-]{2,40})\/([\p{L}0-9 -]{1,40})--([a-z0-9]{8})\.(jpe?g|png|webp)$/u;

const MAX_BYTES = 12 * 1024 * 1024;

function parse(pathname: string) {
  const m = PATHNAME.exec(pathname);
  if (!m) return null;
  const [, eventId, name] = m;
  if (!EVENT_IDS.has(eventId)) return null;
  return { eventId, who: name.replace(/-/g, " ") };
}

const configured = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

export async function GET() {
  // Before a Blob store is connected the site still works; the photo strips
  // just say so rather than throwing.
  if (!configured()) {
    return Response.json(
      { enabled: false, photos: [] },
      { headers: { "cache-control": "no-store" } },
    );
  }

  try {
    const { blobs } = await list({ prefix: "photos/", limit: 1000 });
    const photos = blobs
      .map((b) => {
        const meta = parse(b.pathname);
        if (!meta) return null;
        return {
          url: b.url,
          pathname: b.pathname,
          eventId: meta.eventId,
          who: meta.who,
          at: b.uploadedAt,
        };
      })
      .filter(Boolean)
      .sort(
        (a, b) =>
          new Date(a!.at).getTime() - new Date(b!.at).getTime(),
      );

    return Response.json(
      { enabled: true, photos },
      { headers: { "cache-control": "no-store" } },
    );
  } catch {
    return Response.json(
      { enabled: false, photos: [] },
      { headers: { "cache-control": "no-store" } },
    );
  }
}

export async function POST(request: Request) {
  if (!configured()) {
    return Response.json({ error: "Blob store not configured" }, { status: 503 });
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!parse(pathname)) throw new Error("Bad pathname");
        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
          ],
          maximumSizeInBytes: MAX_BYTES,
          addRandomSuffix: false,
        };
      },
      onUploadCompleted: async () => {
        // Nothing to record — the pathname is the record.
      },
    });
    return Response.json(result);
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "Upload failed" },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request) {
  if (!configured()) {
    return Response.json({ error: "Blob store not configured" }, { status: 503 });
  }

  const pathname = new URL(request.url).searchParams.get("pathname");
  if (!pathname || !parse(pathname)) {
    return Response.json({ error: "Bad pathname" }, { status: 400 });
  }

  // No accounts, so this is the honour system: the button only shows on your
  // own photos, but the endpoint cannot actually prove who is calling it.
  await del(pathname);
  return Response.json({ ok: true });
}
