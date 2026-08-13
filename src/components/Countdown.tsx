"use client";

import { useEffect, useState } from "react";
import { TRIP_END, TRIP_START } from "@/lib/trip-time";

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
  };
}

export function Countdown() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  // Nothing until mounted — the server has no idea what time it is where you are.
  if (!now) {
    return <div className="h-[54px]" aria-hidden />;
  }

  if (now > TRIP_END) {
    return (
      <p className="text-[15px] text-ink-2">
        Turen er slut.{" "}
        <span className="text-ink-3">Tak for denne gang.</span>
      </p>
    );
  }

  if (now >= TRIP_START) {
    return (
      <p className="text-[15px] text-ink-2">
        <span className="relative mr-2 inline-flex h-2 w-2">
          <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-heat opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-heat" />
        </span>
        Vi er i Helsinki lige nu.
      </p>
    );
  }

  const { d, h, m } = parts(TRIP_START.getTime() - now.getTime());

  return (
    <div className="flex items-baseline gap-5">
      {[
        [d, d === 1 ? "dag" : "dage"],
        [h, h === 1 ? "time" : "timer"],
        [m, "min"],
      ].map(([value, label]) => (
        <div key={label as string} className="flex items-baseline gap-1.5">
          <span className="tnum display text-[30px] leading-none">{value}</span>
          <span className="text-[13px] text-ink-3">{label}</span>
        </div>
      ))}
      <span className="text-[13px] text-ink-3">til vi mødes i lufthavnen</span>
    </div>
  );
}
