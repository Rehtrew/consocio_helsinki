"use client";

import { useRef, useState } from "react";
import { CREW_NAMES } from "@/data/trip";
import { usePhotoStore } from "./PhotoStore";
import { PhotoScatter } from "./PhotoScatter";

function Upload() {
  return (
    <svg width="15" height="15" viewBox="0 0 20 20" aria-hidden fill="none">
      <path
        d="M10 13.5V3.8M6.4 7.2 10 3.6l3.6 3.6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.5 12.5v2.6a1.4 1.4 0 0 0 1.4 1.4h10.2a1.4 1.4 0 0 0 1.4-1.4v-2.6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Three little cards, as a hint of what belongs here. */
function StackHint() {
  return (
    <span aria-hidden className="relative block h-9 w-10 shrink-0 sm:h-10 sm:w-11">
      {[
        { r: -15, x: 0, bg: "var(--accent-soft)" },
        { r: 8, x: 7, bg: "var(--heat-soft)" },
        { r: -3, x: 3, bg: "var(--surface)" },
      ].map((c, i) => (
        <span
          key={i}
          className="absolute top-0.5 h-8 w-7 rounded-[5px] shadow-sm sm:h-9 sm:w-8"
          style={{
            left: c.x,
            transform: `rotate(${c.r}deg)`,
            background: c.bg,
            border: "1px solid var(--line)",
            zIndex: i,
          }}
        />
      ))}
    </span>
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

/** Photos the group takes at one stop.
 *
 *  Two states: an invitation while the stop is empty, and once there are
 *  photos the pile itself carries the weight and adding more shrinks to a
 *  tile at the end of it. */
export function EventPhotos({ eventId }: { eventId: string }) {
  const store = usePhotoStore();
  const input = useRef<HTMLInputElement>(null);
  const pending = useRef<File[] | null>(null);
  const [progress, setProgress] = useState<[number, number] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [asking, setAsking] = useState(false);
  const [dragging, setDragging] = useState(false);

  if (!store) return null;

  const photos = store.byEvent[eventId] ?? [];
  if (!store.enabled && photos.length === 0) return null;

  const busy = progress !== null;

  const send = async (files: File[]) => {
    const list = files.filter((f) => f.type.startsWith("image/")).slice(0, 20);
    if (list.length === 0) return;
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

  /** Ask who is uploading the first time, holding on to any dropped files. */
  const withName = (files: File[] | null) => {
    if (!store.who) {
      pending.current = files;
      setAsking(true);
      return false;
    }
    return true;
  };

  const pick = () => {
    setError(null);
    if (!withName(null)) return;
    input.current?.click();
  };

  const chooseName = (name: string) => {
    store.setWho(name);
    setAsking(false);
    const held = pending.current;
    pending.current = null;
    if (held && held.length > 0) void send(held);
    else setTimeout(() => input.current?.click(), 0);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;
    setError(null);
    if (!withName(files)) return;
    void send(files);
  };

  const dropProps = {
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(true);
    },
    onDragLeave: () => setDragging(false),
    onDrop,
  };

  const label = progress
    ? progress[1] > 1
      ? `Uploader ${progress[0]} af ${progress[1]} …`
      : "Uploader …"
    : "Upload";

  const names = [...new Set(photos.map((p) => p.who))];

  return (
    <div className="basis-full pt-1">
      <input
        ref={input}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => void send(Array.from(e.target.files ?? []))}
      />

      {photos.length === 0 ? (
        // Nothing here yet — ask for photos properly. The whole strip is the
        // control, so the tap target on a phone is the full width of it.
        <button
          type="button"
          onClick={pick}
          disabled={busy}
          {...dropProps}
          className="press flex w-full max-w-xl items-center gap-3 rounded-xl border border-dashed p-2.5 text-left transition-colors duration-200 disabled:opacity-60 sm:gap-4 sm:p-3.5"
          style={{
            borderColor: dragging ? "var(--accent)" : "var(--line-strong)",
            background: dragging ? "var(--accent-soft)" : "transparent",
          }}
        >
          <StackHint />

          <span className="min-w-0 flex-1">
            <span className="block text-[14px] leading-tight font-medium">
              {busy ? label : "Upload billeder"}
            </span>
            {/* The hint only earns its space where there is room for one line */}
            <span className="mt-0.5 hidden text-[12.5px] leading-snug text-ink-3 sm:block">
              Træk dem ind, eller vælg — vi gør dem mindre automatisk
            </span>
          </span>

          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-accent px-2.5 py-2 text-[13.5px] font-medium text-white shadow-sm sm:px-3">
            <Upload />
            <span className="hidden sm:inline">Upload</span>
          </span>
        </button>
      ) : (
        // The pile speaks for itself; adding more is a tile at the end of it
        <div {...dropProps} className="rounded-xl">
          <PhotoScatter
            photos={photos}
            trailing={
              store.enabled ? (
                <button
                  onClick={pick}
                  disabled={busy}
                  aria-label="Upload flere billeder"
                  className="press grid h-[80px] w-[72px] place-items-center rounded-[6px] border border-dashed text-ink-3 transition-colors duration-200 hover:border-accent hover:text-accent disabled:opacity-60"
                  style={{
                    borderColor: dragging ? "var(--accent)" : "var(--line-strong)",
                    background: dragging ? "var(--accent-soft)" : "transparent",
                  }}
                >
                  <span className="flex flex-col items-center gap-1">
                    <Upload />
                    <span className="text-[11.5px] leading-none">
                      {busy ? "…" : "Tilføj"}
                    </span>
                  </span>
                </button>
              ) : null
            }
          />
          <p className="mt-1 text-[12.5px] text-ink-3">
            {progress
              ? label
              : `${photos.length === 1 ? "1 billede" : `${photos.length} billeder`} · ${names.join(", ")}`}
          </p>
        </div>
      )}

      {asking && (
        <div className="pt-3">
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
              onClick={() => {
                pending.current = null;
                setAsking(false);
              }}
              className="press rounded-lg px-2.5 py-2 text-[13px] text-ink-3 hover:text-ink-2"
            >
              Fortryd
            </button>
          </div>
        </div>
      )}

      {error && <p className="pt-2 text-[12.5px] text-heat">{error}</p>}
    </div>
  );
}
