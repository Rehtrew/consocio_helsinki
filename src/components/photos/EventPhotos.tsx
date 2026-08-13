"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePhotoStore, type TripPhoto } from "./PhotoStore";

function clock(iso: string) {
  return new Intl.DateTimeFormat("da-DK", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Helsinki",
  }).format(new Date(iso));
}

function Plus() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden>
      <path
        d="M8 3.5v9M3.5 8h9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** The strip of photos taken at one stop. Empty until somebody adds the
 *  first one, so days you haven't lived yet stay quiet. */
export function EventPhotos({ eventId }: { eventId: string }) {
  const store = usePhotoStore();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [asking, setAsking] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [lightbox, setLightbox] = useState<TripPhoto | null>(null);

  // Hold the page still behind the lightbox, and let Escape close it
  useEffect(() => {
    if (!lightbox) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLightbox(null);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox]);

  if (!store) return null;

  const photos = store.byEvent[eventId] ?? [];

  // Nothing to show and nowhere to put anything
  if (!store.enabled && photos.length === 0) return null;

  const pick = () => {
    setError(null);
    if (!store.who) {
      setDraftName("");
      setAsking(true);
      return;
    }
    input.current?.click();
  };

  const onFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError(null);
    try {
      for (const file of Array.from(files).slice(0, 6)) {
        await store.add(eventId, file, store.who);
      }
    } catch (e) {
      setError(
        e instanceof Error && /configured/i.test(e.message)
          ? "Billeder er ikke slået til endnu."
          : "Kunne ikke uploade. Prøv igen.",
      );
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center gap-2">
        {photos.map((p) => (
          <button
            key={p.pathname}
            onClick={() => setLightbox(p)}
            title={`${p.who} · ${clock(p.at)}`}
            className="press relative h-16 w-16 overflow-hidden rounded-lg shadow-sm"
          >
            <Image
              src={p.url}
              alt={`Taget af ${p.who}`}
              fill
              sizes="64px"
              className="object-cover"
            />
          </button>
        ))}

        {store.enabled &&
          (photos.length === 0 ? (
            // Quiet until the first photo lands, so empty days stay calm
            <button
              onClick={pick}
              disabled={busy}
              className="press -ml-1 flex items-center gap-1.5 rounded-lg px-1.5 py-1 text-[13px] text-ink-3 hover:text-accent disabled:opacity-60"
            >
              <Plus />
              {busy ? "Uploader …" : "Tilføj billede"}
            </button>
          ) : (
            <button
              onClick={pick}
              disabled={busy}
              className="press flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-line-strong text-[12px] text-ink-3 hover:border-accent hover:text-accent disabled:opacity-60"
            >
              <Plus />
              {busy ? "…" : "Tilføj"}
            </button>
          ))}

        <input
          ref={input}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          hidden
          onChange={(e) => onFiles(e.target.files)}
        />
      </div>

      {photos.length > 0 && (
        <p className="mt-2 text-[12.5px] text-ink-3">
          {photos
            .map((p) => `${p.who} ${clock(p.at)}`)
            .slice(0, 4)
            .join(" · ")}
          {photos.length > 4 ? ` · +${photos.length - 4}` : ""}
        </p>
      )}

      {error && <p className="mt-2 text-[12.5px] text-heat">{error}</p>}

      {/* Ask once who is adding, then remember it */}
      {asking && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input
            autoFocus
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && draftName.trim()) {
                store.setWho(draftName.trim());
                setAsking(false);
                setTimeout(() => input.current?.click(), 0);
              }
              if (e.key === "Escape") setAsking(false);
            }}
            placeholder="Hvem er du?"
            className="rounded-lg bg-surface px-3 py-2 text-[14px] shadow-sm outline-none"
          />
          <button
            onClick={() => {
              if (!draftName.trim()) return;
              store.setWho(draftName.trim());
              setAsking(false);
              setTimeout(() => input.current?.click(), 0);
            }}
            className="press rounded-lg bg-accent px-3 py-2 text-[13.5px] font-medium text-white shadow-sm"
          >
            Fortsæt
          </button>
        </div>
      )}

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[2000] grid place-items-center bg-ink/70 p-5 backdrop-blur-sm"
        >
          <div
            className="max-h-full w-full max-w-2xl overflow-hidden rounded-2xl bg-surface shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightbox.url}
              alt={`Taget af ${lightbox.who}`}
              className="max-h-[70vh] w-full object-contain"
            />
            <div className="flex items-center justify-between gap-4 p-4">
              <p className="text-[13.5px] text-ink-2">
                {lightbox.who} · {clock(lightbox.at)}
              </p>
              <div className="flex gap-2">
                {lightbox.who === store.who && (
                  <button
                    onClick={async () => {
                      const p = lightbox;
                      setLightbox(null);
                      await store.remove(p);
                    }}
                    className="press rounded-lg px-3 py-2 text-[13.5px] text-heat hover:bg-heat-soft"
                  >
                    Slet
                  </button>
                )}
                <button
                  onClick={() => setLightbox(null)}
                  className="press rounded-lg bg-surface-2 px-3 py-2 text-[13.5px] font-medium text-ink-2"
                >
                  Luk
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
