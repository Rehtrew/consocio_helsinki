const TINT: Record<string, { bg: string; fg: string }> = {
  food: { bg: "var(--accent-soft)", fg: "var(--accent)" },
  sauna: { bg: "var(--heat-soft)", fg: "var(--heat)" },
  bar: { bg: "var(--surface-2)", fg: "var(--ink-2)" },
  nature: { bg: "var(--forest-soft)", fg: "var(--forest)" },
  stay: { bg: "var(--surface-2)", fg: "var(--ink-2)" },
  transport: { bg: "var(--accent-soft)", fg: "var(--accent)" },
  rest: { bg: "var(--surface-2)", fg: "var(--ink-2)" },
};

function Glyph({ kind }: { kind: string }) {
  const s = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (kind) {
    case "transport": // airliner from above — the side view read as a bird
      return <path d="M12 2.2c.85 0 1.5.72 1.5 1.6v4.9l7.5 4.35v1.9l-7.5-2.25v4.55l2.35 1.65v1.6L12 19.55l-3.85 1-.05-1.6 2.4-1.65V12.7L3 14.95v-1.9l7.5-4.35V3.8c0-.88.65-1.6 1.5-1.6Z" fill="currentColor" />;
    case "food": // fork and knife
      return (
        <>
          <path d="M7 3v7a2 2 0 0 0 2 2v9M7 3v5M11 3v5" {...s} />
          <path d="M17 3c-1.2 1.4-1.8 3-1.8 5s.6 3 1.8 3v10" {...s} />
        </>
      );
    case "sauna": // rising steam over a stone
      return (
        <>
          <path d="M7 4c0 1.2 1 1.6 1 2.8S7 8.4 7 9.6M12 3.4c0 1.2 1 1.6 1 2.8s-1 1.6-1 2.8M17 4c0 1.2 1 1.6 1 2.8s-1 1.6-1 2.8" {...s} />
          <path d="M4 18c1.5-3 4.4-4.6 8-4.6s6.5 1.6 8 4.6" {...s} />
          <path d="M3 20.5h18" {...s} />
        </>
      );
    case "bar": // glass
      return (
        <>
          <path d="M5 4h14l-7 8-7-8Z" {...s} />
          <path d="M12 12v7M8.5 19.5h7" {...s} />
        </>
      );
    case "nature": // spruce
      return (
        <>
          <path d="M12 3.5 8 10h8l-4-6.5Z" {...s} />
          <path d="M12 9 6.5 17h11L12 9Z" {...s} />
          <path d="M12 17v3.5" {...s} />
        </>
      );
    case "stay": // a bed to drop into
      return (
        <>
          <path d="M3 18v-7M3 14h18v4M21 18v-4" {...s} />
          <path d="M7 11V8h9a3 3 0 0 1 3 3" {...s} />
          <circle cx="7.5" cy="11" r="0.2" {...s} />
        </>
      );
    default: // an unhurried hour
      return (
        <>
          <circle cx="12" cy="12" r="8" {...s} />
          <path d="M12 8v4.5l3 1.8" {...s} />
        </>
      );
  }
}

/** Stands in wherever there is no photograph — a plane for the airport, a
 *  fork for dinner — so a row never shows an empty grey square. */
export function KindIcon({
  kind,
  className = "",
}: {
  kind: string;
  className?: string;
}) {
  const tint = TINT[kind] ?? TINT.rest;

  return (
    <div
      aria-hidden
      className={`grid shrink-0 place-items-center ${className}`}
      style={{ background: tint.bg, color: tint.fg }}
    >
      <svg viewBox="0 0 24 24" className="h-1/2 w-1/2">
        <Glyph kind={kind} />
      </svg>
    </div>
  );
}
