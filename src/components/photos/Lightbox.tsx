"use client";

import { useEffect } from "react";
import { EVENT_LOOKUP } from "@/data/trip";
import type { TripPhoto } from "./PhotoStore";

function clock(iso: string) {
  return new Intl.DateTimeFormat("da-DK", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Helsinki",
  }).format(new Date(iso));
}

function Chevron({ back = false }: { back?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d={back ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Lightbox({
  photos,
  index,
  onClose,
  onMove,
  onDelete,
  canDelete,
}: {
  photos: TripPhoto[];
  index: number;
  onClose: () => void;
  onMove: (next: number) => void;
  onDelete: (photo: TripPhoto) => void;
  canDelete: (photo: TripPhoto) => boolean;
}) {
  const photo = photos[index];
  const many = photos.length > 1;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && many) onMove((index + 1) % photos.length);
      if (e.key === "ArrowLeft" && many)
        onMove((index - 1 + photos.length) % photos.length);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [index, many, photos.length, onClose, onMove]);

  if (!photo) return null;
  const where = EVENT_LOOKUP[photo.eventId];

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      // Leaflet's panes reach z-index 800, so this has to clear them
      className="fixed inset-0 z-[2000] grid place-items-center bg-ink/75 p-4 backdrop-blur-sm sm:p-6"
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl bg-surface shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-surface-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.url}
            alt={`Taget af ${photo.who}`}
            className="max-h-[68vh] w-full object-contain"
          />

          {many && (
            <>
              <button
                onClick={() =>
                  onMove((index - 1 + photos.length) % photos.length)
                }
                aria-label="Forrige billede"
                className="press absolute top-1/2 left-3 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-surface/90 text-ink-2 shadow-md backdrop-blur-sm"
              >
                <Chevron back />
              </button>
              <button
                onClick={() => onMove((index + 1) % photos.length)}
                aria-label="Næste billede"
                className="press absolute top-1/2 right-3 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-surface/90 text-ink-2 shadow-md backdrop-blur-sm"
              >
                <Chevron />
              </button>
            </>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div className="min-w-0">
            <p className="text-[14.5px] font-medium">{photo.who}</p>
            <p className="mt-0.5 text-[13px] text-ink-3">
              {where
                ? `${where.weekday} ${where.date}.8. · ${where.title}`
                : "Ukendt sted"}{" "}
              · {clock(photo.at)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {many && (
              <span className="tnum text-[13px] text-ink-3">
                {index + 1} / {photos.length}
              </span>
            )}
            {canDelete(photo) && (
              <button
                onClick={() => onDelete(photo)}
                className="press rounded-lg px-3 py-2 text-[13.5px] text-heat hover:bg-heat-soft"
              >
                Slet
              </button>
            )}
            <button
              onClick={onClose}
              className="press rounded-lg bg-surface-2 px-3 py-2 text-[13.5px] font-medium text-ink-2"
            >
              Luk
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
