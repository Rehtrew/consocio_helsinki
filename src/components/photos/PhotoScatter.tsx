"use client";

import Image from "next/image";
import { usePhotoStore, type TripPhoto } from "./PhotoStore";

/** A fixed angle per photo — scattered, but never reshuffling on re-render. */
function tilt(seed: string, i: number) {
  let n = i * 31;
  for (const ch of seed) n = (n + ch.charCodeAt(0) * 7) % 1000;
  return (n % 11) - 5.5;
}

/** Photos laid out overlapping and slightly askew, like a handful dropped on
 *  the table. Tapping one opens the whole set. */
export function PhotoScatter({
  photos,
  size = 72,
  overlap = 14,
  trailing,
}: {
  photos: TripPhoto[];
  size?: number;
  overlap?: number;
  /** Sits at the end of the pile — the "add another" tile */
  trailing?: React.ReactNode;
}) {
  const store = usePhotoStore();
  if (!store || (photos.length === 0 && !trailing)) return null;

  return (
    <div className="flex flex-wrap items-start">
      {photos.map((p, i) => (
        <button
          key={p.pathname}
          onClick={() => store.open(photos, i)}
          title={`${p.who} · ${p.eventId}`}
          aria-label={`Se billede taget af ${p.who}`}
          className="snap-tilt relative shrink-0"
          style={
            {
              "--tilt": `${tilt(p.pathname, i)}deg`,
              marginLeft: i === 0 ? 0 : -overlap,
              marginBottom: 6,
              zIndex: i + 1,
            } as React.CSSProperties
          }
        >
          <span className="snap block">
            <span
              className="relative block overflow-hidden rounded-[3px]"
              style={{ width: size, height: size }}
            >
              <Image
                src={p.url}
                alt={`Taget af ${p.who}`}
                fill
                sizes={`${size * 2}px`}
                className="object-cover"
              />
            </span>
          </span>
        </button>
      ))}

      {trailing && (
        <div
          className="shrink-0"
          style={{ marginLeft: photos.length ? 8 : 0, marginBottom: 6 }}
        >
          {trailing}
        </div>
      )}
    </div>
  );
}
