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

function Camera() {
  return (
    <svg width="15" height="15" viewBox="0 0 20 20" aria-hidden fill="none">
      <path
        d="M2.5 6.5h3l1.3-2h6.4l1.3 2h3v9h-15v-9Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle
        cx="10"
        cy="10.5"
        r="2.9"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}

/** Photos the group takes at one stop. The button sits in the row of actions;
 *  the strip drops onto its own line underneath. */
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

  const confirmName = () => {
    if (!draftName.trim()) return;
    store.setWho(draftName.trim());
    setAsking(false);
    setTimeout(() => input.current?.click(), 0);
  };

  const onFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError(null);
    try {
      for (const file of Array.from(files).slice(0, 8)) {
        await store.add(eventId, file, store.who);
      }
    } catch (e) {
      setError(
        e instanceof Error && /configured|503/i.test(e.message)
          ? "Billed-uploads er ikke slået til endnu."
          : "Kunne ikke uploade. Prøv igen.",
      );
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };

  return (
    <>
      {store.enabled && (
        <button
          onClick={pick}
          disabled={busy}
          className="press inline-flex items-center gap-1.5 rounded-lg bg-surface px-2.5 py-1.5 text-[13px] font-medium text-ink-2 shadow-sm hover:bg-accent-soft hover:text-accent-ink disabled:opacity-60"
        >
          <Camera />
          {busy
            ? "Uploader …"
            : photos.length > 0
              ? "Tilføj billede"
              : "Tilføj jeres billeder"}
        </button>
      )}

      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        hidden
        onChange={(e) => onFiles(e.target.files)}
      />

      {/* basis-full drops these onto their own line inside the actions row */}
      {asking && (
        <div className="flex basis-full flex-wrap items-center gap-2 pt-1">
          <input
            autoFocus
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") confirmName();
              if (e.key === "Escape") setAsking(false);
            }}
            placeholder="Hvem er du?"
            aria-label="Dit navn"
            className="w-40 rounded-lg bg-surface px-3 py-2 text-[14px] shadow-sm outline-none"
          />
          <button
            onClick={confirmName}
            className="press rounded-lg bg-accent px-3 py-2 text-[13.5px] font-medium text-white shadow-sm"
          >
            Vælg billede
          </button>
        </div>
      )}

      {error && (
        <p className="basis-full pt-1 text-[12.5px] text-heat">{error}</p>
      )}

      {photos.length > 0 && (
        <div className="basis-full pt-2">
          <p className="text-[12.5px] text-ink-3">
            {photos.length === 1 ? "1 billede" : `${photos.length} billeder`}{" "}
            fra stedet
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
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
          </div>
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
    </>
  );
}
