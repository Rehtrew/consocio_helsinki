import { get } from "@vercel/blob";
import { BLOB_ACCESS, configured, parsePhotoPath } from "@/lib/photo-path";

export const dynamic = "force-dynamic";

/** Streams one photo out of the private store.
 *
 *  The path carries the identity rather than a query string: next/image
 *  refuses to optimise a local source that has a search part, and a bare
 *  path is nicer to cache anyway. Paths include a random segment and are
 *  never rewritten, so the bytes can be cached hard. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ event: string; name: string }> },
) {
  if (!configured()) return new Response("Not found", { status: 404 });

  const { event, name } = await params;
  const pathname = `photos/${decodeURIComponent(event)}/${decodeURIComponent(name)}`;
  if (!parsePhotoPath(pathname)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const result = await get(pathname, { access: BLOB_ACCESS });
    if (!result || result.statusCode !== 200 || !result.stream) {
      return new Response("Not found", { status: 404 });
    }

    return new Response(result.stream, {
      headers: {
        "content-type": result.headers.get("content-type") ?? "image/jpeg",
        "cache-control": "public, max-age=31536000, immutable",
      },
    });
  } catch (e) {
    console.error("photo read failed", e);
    return new Response("Not found", { status: 404 });
  }
}
