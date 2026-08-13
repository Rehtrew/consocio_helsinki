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
  { id: "billeder", label: "Billeder" },
];

const ALL_IDS = [...DAY_TABS.map((d) => d.id), ...SECTIONS.map((s) => s.id)];

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      {[4, 9, 14].map((y, i) => (
        <line
          key={y}
          x1="2"
          x2="16"
          y1={y}
          y2={y}
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          style={{
            // The middle line fades, the outer two meet in the middle: a cross
            opacity: open && i === 1 ? 0 : 1,
            transform: open
              ? `translateY(${9 - y}px) rotate(${i === 0 ? 45 : i === 2 ? -45 : 0}deg)`
              : "none",
            transformOrigin: "9px 9px",
            transition: "transform 200ms var(--ease-out), opacity 140ms linear",
          }}
        />
      ))}
    </svg>
  );
}

export function DayNav() {
  const [active, setActive] = useState(DAY_TABS[0].id);
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);
  const [indicator, setIndicator] = useState<{ x: number; w: number } | null>(
    null,
  );
  const barRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const refs = useRef<Record<string, HTMLAnchorElement | null>>({});

  const openSection = SECTIONS.find((s) => s.id === active);

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

  // Escape, or a tap anywhere else, closes the menu
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onDown = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

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
      className="sticky top-0 z-50 mt-14 bg-paper/85 backdrop-blur-xl"
      style={{
        boxShadow: stuck
          ? "0 1px 0 var(--line), 0 6px 20px -12px rgb(26 24 21 / 0.35)"
          : "0 1px 0 var(--line)",
        transition: "box-shadow 220ms var(--ease-out)",
      }}
    >
      <div className="mx-auto flex max-w-5xl items-center gap-2 px-3">
        {/* Days — they get the whole bar, everything else lives in the menu */}
        <div
          ref={listRef}
          className="relative flex flex-1 items-center gap-0.5 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {indicator && (
            <span
              aria-hidden
              className="pointer-events-none absolute top-1 bottom-1 left-0 rounded-lg bg-surface shadow-sm"
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
              // flex-1 shares the bar evenly, min-w-fit keeps the label whole
              // on a narrow phone and lets the strip scroll instead.
              className={`press relative z-10 flex min-w-fit flex-1 items-baseline justify-center gap-1.5 rounded-lg px-2.5 py-2.5 text-[15px] font-medium whitespace-nowrap ${
                active === d.id ? "text-ink" : "text-ink-3 hover:text-ink-2"
              }`}
            >
              <span className="min-[500px]:hidden">{d.short}</span>
              <span className="hidden min-[500px]:inline">{d.full}</span>
              <span className="tnum text-[13px] opacity-60">{d.date}.</span>
            </a>
          ))}
        </div>

        {/* Everything that isn't a day */}
        <div ref={menuRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-haspopup="menu"
            aria-label={openSection ? `Menu — ${openSection.label}` : "Menu"}
            className={`press grid h-9 w-9 place-items-center rounded-lg ${
              open || openSection
                ? "bg-surface text-ink shadow-sm"
                : "text-ink-2 hover:text-ink"
            }`}
          >
            <MenuIcon open={open} />
          </button>

          {open && (
            <div
              role="menu"
              className="menu-drop absolute top-[calc(100%+6px)] right-0 w-44 overflow-hidden rounded-xl bg-surface p-1 shadow-lg"
            >
              {SECTIONS.map((s) => (
                <a
                  key={s.id}
                  role="menuitem"
                  href={`#${s.id}`}
                  onClick={() => setOpen(false)}
                  aria-current={active === s.id ? "true" : undefined}
                  className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-[14.5px] ${
                    active === s.id
                      ? "bg-surface-2 font-medium text-ink"
                      : "text-ink-2 hover:bg-surface-2"
                  }`}
                >
                  {s.label}
                  {active === s.id && (
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 rounded-full bg-accent"
                    />
                  )}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
