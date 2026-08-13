"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { PLACES } from "@/data/trip";
import { schedule, TRIP_END, type Scheduled } from "@/lib/trip-time";
import { walkingDirections } from "@/lib/links";

function Line({
  item,
  tone,
}: {
  item: Scheduled;
  tone: "now" | "next";
}) {
  const place = item.event.place ? PLACES[item.event.place] : undefined;

  return (
    <div className="flex items-start gap-3.5">
      {place?.images?.[0] ? (
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg shadow-sm">
          <Image
            src={place.images[0]}
            alt=""
            fill
            sizes="48px"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="h-12 w-12 shrink-0 rounded-lg bg-surface-2 shadow-sm" />
      )}

      <div className="min-w-0 flex-1">
        <p
          className={`truncate ${
            tone === "now"
              ? "text-[17px] font-medium"
              : "text-[15px] text-ink-2"
          }`}
        >
          {item.event.title}
        </p>
        {/* The programme's own clock time — the two Copenhagen items are
            written in CPH time, so reformatting them would shift them. */}
        <p className="tnum mt-0.5 text-[13px] text-ink-3">
          {item.event.start ? `${item.event.start} · ` : ""}
          {item.dayLabel}
          {place?.address ? ` · ${place.address.split(",")[0]}` : ""}
        </p>
      </div>

      {place && place.id !== "cph" && place.id !== "hel" ? (
        <a
          href={walkingDirections(place)}
          target="_blank"
          rel="noreferrer"
          className="press mt-0.5 shrink-0 rounded-lg bg-surface-2 px-3 py-1.5 text-[13px] font-medium text-ink-2 shadow-sm hover:bg-accent-soft hover:text-accent-ink"
        >
          Rute
        </a>
      ) : null}
    </div>
  );
}

export function NowNext() {
  const items = useMemo(() => schedule(), []);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  if (!now || now > TRIP_END) return null;

  const current = items.find((i) => now >= i.start && now < i.end) ?? null;
  const upcoming = items.filter((i) => i.start > now).slice(0, current ? 1 : 2);

  if (!current && upcoming.length === 0) return null;

  return (
    <section className="mx-auto max-w-5xl px-5">
      <div className="rounded-2xl border border-line bg-surface p-5 shadow-md sm:p-6">
        {current ? (
          <>
            <p className="flex items-center gap-2 text-[13px] text-heat">
              <span className="relative inline-flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-1.5 w-1.5 animate-ping rounded-full bg-heat opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-heat" />
              </span>
              Lige nu
            </p>
            <div className="mt-3.5">
              <Line item={current} tone="now" />
            </div>
          </>
        ) : (
          <p className="text-[13px] text-ink-3">Næste på programmet</p>
        )}

        {upcoming.length > 0 && (
          <div
            className={
              current
                ? "mt-5 space-y-4 border-t border-line pt-5"
                : "mt-3.5 space-y-4"
            }
          >
            {current && (
              <p className="text-[13px] text-ink-3">Derefter</p>
            )}
            {upcoming.map((item) => (
              <Line key={item.event.id} item={item} tone="next" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
