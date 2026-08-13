"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { DAYS } from "@/data/trip";

const SECTIONS = [
  ...DAYS.map((d) => ({ id: d.id, label: d.short, full: d.weekday })),
  { id: "kort", label: "Kort", full: "Kort" },
  { id: "budget", label: "Budget", full: "Budget" },
  { id: "praktisk", label: "Praktisk", full: "Praktisk" },
];

export function DayNav() {
  const [active, setActive] = useState(SECTIONS[0].id);
  const [indicator, setIndicator] = useState<{ x: number; w: number } | null>(
    null,
  );
  const listRef = useRef<HTMLDivElement>(null);
  const refs = useRef<Record<string, HTMLAnchorElement | null>>({});

  // Which section is under the nav right now
  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
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

  // Slide the indicator to the active tab
  useLayoutEffect(() => {
    const el = refs.current[active];
    const list = listRef.current;
    if (!el || !list) return;
    setIndicator({ x: el.offsetLeft, w: el.offsetWidth });

    // Keep the active tab in view on narrow screens. Scroll the strip itself —
    // scrollIntoView would drag the whole page with it.
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
    <nav className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-xl">
      <div className="mx-auto max-w-5xl px-3">
        <div
          ref={listRef}
          className="relative flex items-center gap-0.5 overflow-x-auto py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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

          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              ref={(el) => {
                refs.current[s.id] = el;
              }}
              aria-current={active === s.id ? "true" : undefined}
              className={`press relative z-10 shrink-0 rounded-lg px-3.5 py-2 text-[14px] font-medium whitespace-nowrap ${
                active === s.id ? "text-ink" : "text-ink-3 hover:text-ink-2"
              }`}
            >
              <span className="sm:hidden">{s.label}</span>
              <span className="hidden sm:inline">{s.full}</span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
