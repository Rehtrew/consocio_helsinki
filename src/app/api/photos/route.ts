import { del, list, put } from "@vercel/blob";
import { DAYS } from "@/data/trip";

export const dynamic = "force-dynamic";

const EVENT_IDS = new Set(DAYS.flatMap((d) => d.events.map((e) => e.id)));

/** photos/<event id>/<name>--<8 chars>.<ext> — everything we need to show a
 *  photo lives in the path, so there is no database to keep in step. */
const PATHNAME =
  /^photos\/([a-z0-9-]{2,40})\/([\p{L}0-9 -]{1,40})--([a-z0-9]{8})\.(jpe?g|png|webp)$/u;

/** Vercel caps a serverless request body at 4.5 MB. The browser shrinks
 *  photos well below that before sending, so this is only a guard. */
const MAX_BYTES = 4 * 1024 * 1024;

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function parse(pathname: string) {
  const m = PATHNAME.exec(pathname);
  if (!m) return null;
  const [, eventId, name] = m;
  if (!EVENT_IDS.has(eventId)) return null;
  return { eventId, who: name.replace(/-/g, " ") };
}

const configured = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

export async function GET() {
  // Before a Blob store is connected the site still works; the upload
  // buttons just stay hidden.
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
      .sort((a, b) => new Date(a!.at).getTime() - new Date(b!.at).getTime());

    return Response.json(
      { enabled: true, photos },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (e) {
    // The token is there, so uploading should still work — don't hide the UI
    // just because listing failed.
    console.error("photo list failed", e);
    return Response.json(
      { enabled: true, photos: [] },
      { headers: { "cache-control": "no-store" } },
    );
  }
}

/** The image is already small by the time it gets here, so it travels through
 *  this function rather than going direct with a client token — one hop, and
 *  one place for things to go wrong. */
export async function POST(request: Request) {
  if (!configured()) {
    return Response.json(
      { error: "Blob store not configured" },
      { status: 503 },
    );
  }

  try {
    const form = await request.formData();
    const eventId = String(form.get("eventId") ?? "");
    const who = String(form.get("who") ?? "").trim();
    const file = form.get("file");

    if (!EVENT_IDS.has(eventId)) {
      return Response.json(
        { error: `Ukendt punkt: ${eventId}` },
        { status: 400 },
      );
    }
    if (!(file instanceof File)) {
      return Response.json({ error: "Manglende fil" }, { status: 400 });
    }

    const ext = EXT[file.type];
    if (!ext) {
      return Response.json(
        { error: `Filtypen ${file.type || "ukendt"} kan ikke bruges` },
        { status: 400 },
      );
    }
    if (file.size > MAX_BYTES) {
      return Response.json(
        { error: `Billedet er for stort (${Math.round(file.size / 1024)} KB)` },
        { status: 400 },
      );
    }

    // The server owns the pathname, so it always matches what GET can parse.
    const name =
      who
        .replace(/\s+/g, "-")
        .replace(/[^\p{L}0-9-]/gu, "")
        .slice(0, 40) || "anonym";
    const rand = Math.random().toString(36).slice(2, 10).padEnd(8, "0");
    const pathname = `photos/${eventId}/${name}--${rand}.${ext}`;

    if (!parse(pathname)) {
      return Response.json({ error: "Ugyldigt navn" }, { status: 400 });
    }

    const blob = await put(pathname, file, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: file.type,
    });

    return Response.json({
      url: blob.url,
      pathname,
      eventId,
      who: name.replace(/-/g, " "),
      at: new Date().toISOString(),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upload failed";
    console.error("photo upload failed", message);
    return Response.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  if (!configured()) {
    return Response.json(
      { error: "Blob store not configured" },
      { status: 503 },
    );
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
