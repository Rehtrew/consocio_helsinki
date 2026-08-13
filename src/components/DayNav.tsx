"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { DAYS } from "@/data/trip";

const DAY_TABS = DAYS.map((d) => ({
  id: d.id,
  short: d.short,
  full: d.weekday,
  date: Number(d.date.slice(8, 10)),
}));

const SECTIONS = [
  { id: "kort", label: "Kort" },
  { id: "budget", label: "Budget" },
  { id: "praktisk", label: "Praktisk" },
];

const ALL_IDS = [...DAY_TABS.map((d) => d.id), ...SECTIONS.map((s) => s.id)];

export function DayNav() {
  const [active, setActive] = useState(DAY_TABS[0].id);
  const [stuck, setStuck] = useState(false);
  const [indicator, setIndicator] = useState<{ x: number; w: number } | null>(
    null,
  );
  const barRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const refs = useRef<Record<string, HTMLAnchorElement | null>>({});

  // Which section is under the bar right now
  useEffect(() => {
    const els = ALL_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-88px 0px -62% 0px", threshold: 0 },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Once the bar reaches the top it gets a shadow, so it reads as pinned
  // rather than as a row that happens to be there.
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setStuck(e.intersectionRatio < 1),
      { threshold: [1], rootMargin: "-1px 0px 0px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Slide the indicator to the active day
  useLayoutEffect(() => {
    const el = refs.current[active];
    const list = listRef.current;
    if (!list) return;

    if (!el) {
      setIndicator(null); // a section, not a day — nothing to highlight
      return;
    }
    setIndicator({ x: el.offsetLeft, w: el.offsetWidth });

    // Scroll the strip itself; scrollIntoView would drag the whole page.
    if (list.scrollWidth > list.clientWidth) {
      const target = el.offsetLeft - list.clientWidth / 2 + el.offsetWidth / 2;
      list.scrollTo({
        left: Math.max(0, target),
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    }
  }, [active]);

  return (
    <nav
      ref={barRef}
      className="sticky top-0 z-40 mt-14 bg-paper/85 backdrop-blur-xl"
      style={{
        boxShadow: stuck
          ? "0 1px 0 var(--line), 0 6px 20px -12px rgb(26 24 21 / 0.35)"
          : "0 1px 0 var(--line)",
        transition: "box-shadow 220ms var(--ease-out)",
      }}
    >
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-3">
        {/* Days */}
        <div
          ref={listRef}
          className="relative flex flex-1 items-center gap-0.5 overflow-x-auto py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {indicator && (
            <span
              aria-hidden
              className="pointer-events-none absolute top-1.5 bottom-1.5 left-0 rounded-lg bg-surface shadow-sm"
              style={{
                transform: `translateX(${indicator.x}px)`,
                width: indicator.w,
                transition:
                  "transform 260ms var(--ease-out), width 260ms var(--ease-out)",
              }}
            />
          )}

          {DAY_TABS.map((d) => (
            <a
              key={d.id}
              href={`#${d.id}`}
              ref={(el) => {
                refs.current[d.id] = el;
              }}
              aria-current={active === d.id ? "true" : undefined}
              className={`press relative z-10 flex shrink-0 items-baseline gap-1.5 rounded-lg px-3 py-2 text-[14px] font-medium whitespace-nowrap ${
                active === d.id ? "text-ink" : "text-ink-3 hover:text-ink-2"
              }`}
            >
              <span className="sm:hidden">{d.short}</span>
              <span className="hidden sm:inline">{d.full}</span>
              <span className="tnum text-[12.5px] opacity-60">{d.date}.</span>
            </a>
          ))}
        </div>

        <span aria-hidden className="h-5 w-px shrink-0 bg-line" />

        {/* Everything that isn't a day */}
        <div className="flex shrink-0 items-center gap-0.5">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              aria-current={active === s.id ? "true" : undefined}
              className={`press rounded-lg px-2.5 py-2 text-[13.5px] whitespace-nowrap ${
                active === s.id
                  ? "text-ink underline decoration-line-strong underline-offset-[5px]"
                  : "text-ink-3 hover:text-ink-2"
              }`}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
