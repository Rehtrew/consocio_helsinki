"use client";

import { useRef, useState } from "react";
import { CREW_NAMES } from "@/data/trip";
import { usePhotoStore } from "./PhotoStore";
import { PhotoScatter } from "./PhotoScatter";

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

/** Only the "no store connected" case gets rewritten, and it is recognised by
 *  its status code. Matching on message text once swallowed the real reason
 *  for a failure — whatever the server says now reaches the screen. */
function describe(e: unknown) {
  const status = (e as { status?: number } | null)?.status;
  if (status === 503) return "Billed-uploads er ikke slået til endnu.";
  const raw = e instanceof Error ? e.message : String(e);
  return `Kunne ikke uploade: ${raw}`;
}

/** Photos the group takes at one stop. The button sits in the row of actions;
 *  the pile drops onto its own line underneath. */
export function EventPhotos({ eventId }: { eventId: string }) {
  const store = usePhotoStore();
  const input = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<[number, number] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [asking, setAsking] = useState(false);

  if (!store) return null;

  const photos = store.byEvent[eventId] ?? [];
  if (!store.enabled && photos.length === 0) return null;

  const busy = progress !== null;

  const pick = () => {
    setError(null);
    // Ask who is uploading the first time, then remember it
    if (!store.who) {
      setAsking(true);
      return;
    }
    input.current?.click();
  };

  const chooseName = (name: string) => {
    store.setWho(name);
    setAsking(false);
    setTimeout(() => input.current?.click(), 0);
  };

  const onFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const list = Array.from(files).slice(0, 20);
    setError(null);
    try {
      for (let i = 0; i < list.length; i++) {
        setProgress([i + 1, list.length]);
        await store.add(eventId, list[i], store.who);
      }
    } catch (e) {
      setError(describe(e));
    } finally {
      setProgress(null);
      if (input.current) input.current.value = "";
    }
  };

  const names = [...new Set(photos.map((p) => p.who))];

  return (
    <>
      {store.enabled && (
        <button
          onClick={pick}
          disabled={busy}
          className="press inline-flex items-center gap-1.5 rounded-lg bg-surface px-2.5 py-1.5 text-[13px] font-medium text-ink-2 shadow-sm hover:bg-accent-soft hover:text-accent-ink disabled:opacity-60"
        >
          <Camera />
          {progress
            ? progress[1] > 1
              ? `Uploader ${progress[0]} af ${progress[1]} …`
              : "Uploader …"
            : photos.length > 0
              ? "Upload flere"
              : "Upload billeder"}
        </button>
      )}

      <input
        ref={input}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => onFiles(e.target.files)}
      />

      {/* basis-full drops these onto their own line inside the actions row */}
      {asking && (
        <div className="basis-full pt-2">
          <p className="text-[13px] text-ink-3">Hvem uploader?</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {CREW_NAMES.map((name) => (
              <button
                key={name}
                onClick={() => chooseName(name)}
                className="press rounded-lg bg-surface px-3 py-2 text-[13.5px] font-medium text-ink-2 shadow-sm hover:bg-accent-soft hover:text-accent-ink"
              >
                {name}
              </button>
            ))}
            <button
              onClick={() => setAsking(false)}
              className="press rounded-lg px-2.5 py-2 text-[13px] text-ink-3 hover:text-ink-2"
            >
              Fortryd
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="basis-full pt-1 text-[12.5px] text-heat">{error}</p>
      )}

      {photos.length > 0 && (
        <div className="basis-full pt-3">
          <PhotoScatter photos={photos} />
          <p className="mt-1 text-[12.5px] text-ink-3">
            {photos.length === 1 ? "1 billede" : `${photos.length} billeder`} ·{" "}
            {names.join(", ")}
          </p>
        </div>
      )}
    </>
  );
}
