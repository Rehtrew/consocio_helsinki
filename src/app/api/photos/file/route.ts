import { get } from "@vercel/blob";
import { BLOB_ACCESS, configured, parsePhotoPath } from "@/lib/photo-path";

export const dynamic = "force-dynamic";

/** Streams one photo out of the private store. Paths carry a random segment
 *  and are never rewritten, so the bytes can be cached hard. */
export async function GET(request: Request) {
  if (!configured()) return new Response("Not found", { status: 404 });

  const pathname = new URL(request.url).searchParams.get("p");
  if (!pathname || !parsePhotoPath(pathname)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const result = await get(pathname, { access: BLOB_ACCESS });
    if (!result || result.statusCode !== 200 || !result.stream) {
      return new Response("Not found", { status: 404 });
    }

    return new Response(result.stream, {
      headers: {
        "content-type":
          result.headers.get("content-type") ?? "image/jpeg",
        "cache-control": "public, max-age=31536000, immutable",
      },
    });
  } catch (e) {
    console.error("photo read failed", e);
    return new Response("Not found", { status: 404 });
  }
}
