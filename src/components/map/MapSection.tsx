"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { DAYS, PLACES, type Place } from "@/data/trip";
import { walkingDirections } from "@/lib/links";

const MapCanvas = dynamic(() => import("./MapCanvas"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center bg-surface-2">
      <span className="text-[13.5px] text-ink-3">Henter kort …</span>
    </div>
  ),
});

const FILTERS = [
  { id: "alle", label: "Alle" },
  ...DAYS.map((d) => ({ id: d.id, label: d.weekday })),
];

const LEGEND = [
  { label: "Mad", color: "var(--accent)" },
  { label: "Sauna og bad", color: "var(--heat)" },
  { label: "Bar", color: "var(--ink)" },
  { label: "Natur", color: "var(--forest)" },
  { label: "Lejligheden", color: "var(--line-strong)" },
];

/** Stops for a day, in programme order, airports left out. */
function stopsFor(dayId: string): Place[] {
  const ids: string[] = [];
  const days = dayId === "alle" ? DAYS : DAYS.filter((d) => d.id === dayId);

  for (const day of days) {
    for (const e of day.events) {
      if (!e.place || e.place === "cph" || e.place === "hel") continue;
      if (!ids.includes(e.place)) ids.push(e.place);
    }
    // The hike turnaround has no event of its own
    if (day.id === "fredag" && !ids.includes("sipoonkorpi")) {
      ids.splice(ids.indexOf("kuusijarvi") + 1, 0, "sipoonkorpi");
    }
  }

  return ids.map((id) => PLACES[id]);
}

function useDark() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setDark(mq.matches);
    const on = (e: MediaQueryListEvent) => setDark(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return dark;
}

export function MapSection() {
  const [dayId, setDayId] = useState("alle");
  const dark = useDark();
  const places = useMemo(() => stopsFor(dayId), [dayId]);

  const listRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [ind, setInd] = useState<{ x: number; w: number } | null>(null);

  useEffect(() => {
    const el = btnRefs.current[dayId];
    if (el) setInd({ x: el.offsetLeft, w: el.offsetWidth });
  }, [dayId]);

  return (
    <section id="kort" className="scroll-mt-24">
      <div className="border-t border-line pt-10">
        <p className="text-[13px] text-ink-3">Kort</p>
        <h2 className="display mt-2.5 text-[clamp(1.9rem,5.5vw,2.9rem)]">
          Hvor vi skal hen
        </h2>
        <p className="mt-3 max-w-xl text-[15.5px] leading-relaxed text-ink-2">
          Alle stop med gåruter mellem dem. Tryk på en nål for adresse,
          hjemmeside og en rute, din telefon kan navigere efter.
        </p>
      </div>

      {/* Day filter */}
      <div
        ref={listRef}
        className="relative mt-7 flex gap-0.5 overflow-x-auto rounded-xl bg-surface-2 p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {ind && (
          <span
            aria-hidden
            className="pointer-events-none absolute top-1 bottom-1 left-0 rounded-lg bg-surface shadow-sm"
            style={{
              transform: `translateX(${ind.x - 4}px)`,
              width: ind.w,
              transition:
                "transform 240ms var(--ease-out), width 240ms var(--ease-out)",
            }}
          />
        )}
        {FILTERS.map((f) => (
          <button
            key={f.id}
            ref={(el) => {
              btnRefs.current[f.id] = el;
            }}
            onClick={() => setDayId(f.id)}
            aria-pressed={dayId === f.id}
            className={`press relative z-10 flex-1 shrink-0 rounded-lg px-3 py-2 text-[14px] font-medium whitespace-nowrap ${
              dayId === f.id ? "text-ink" : "text-ink-3 hover:text-ink-2"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="relative mt-4 h-[420px] overflow-hidden rounded-2xl border border-line shadow-md sm:h-[520px]">
        <MapCanvas places={places} dayId={dayId} dark={dark} />
      </div>

      <div className="mt-3.5 flex flex-wrap items-center gap-x-5 gap-y-2">
        {LEGEND.map((l) => (
          <span
            key={l.label}
            className="flex items-center gap-2 text-[13px] text-ink-3"
          >
            <span
              aria-hidden
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: l.color }}
            />
            {l.label}
          </span>
        ))}
      </div>

      {(dayId === "fredag" || dayId === "alle") && (
        <p className="mt-3 text-[13px] leading-relaxed text-ink-3">
          Den stiplede grønne linje er kun en pejling. Selve vandringen går ad
          stierne i Sipoonkorpi og er 7–9 km rundt fra Kuusijärvi.
        </p>
      )}

      {/* The same stops as a list, so you can tap straight through to a route */}
      <ol className="mt-6 grid gap-2 sm:grid-cols-2">
        {places.map((p, i) => (
          <li key={p.id}>
            <a
              href={walkingDirections(p)}
              target="_blank"
              rel="noreferrer"
              className="press flex items-center gap-3 rounded-xl bg-surface p-3 shadow-sm hover:shadow-md"
            >
              <span className="tnum grid h-7 w-7 shrink-0 place-items-center rounded-full bg-surface-2 text-[12.5px] font-semibold text-ink-2">
                {i + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14.5px] font-medium">
                  {p.name}
                </span>
                <span className="block truncate text-[12.5px] text-ink-3">
                  {p.address}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
