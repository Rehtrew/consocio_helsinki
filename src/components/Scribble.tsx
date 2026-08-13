/** A handwritten margin note with a curving arrow, the way you'd annotate a
 *  printed programme. Decorative — hidden from screen readers. */
export function Scribble({
  text,
  direction = "down",
  className = "",
}: {
  text: string;
  /** Where the arrow points, relative to the note */
  direction?: "down" | "down-left" | "right";
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none flex select-none ${
        direction === "right"
          ? "items-center gap-1"
          : "flex-col items-end gap-0.5"
      } ${className}`}
    >
      <p
        className="hand text-[17px] leading-tight text-ink-3"
        style={{ transform: "rotate(-2.5deg)" }}
      >
        {text}
      </p>
      <Arrow direction={direction} />
    </div>
  );
}

function Arrow({ direction }: { direction: "down" | "down-left" | "right" }) {
  const common = {
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none",
  };

  if (direction === "right") {
    return (
      <svg width="46" height="18" viewBox="0 0 46 18" className="text-ink-3">
        <path d="M2 11c9-7 22-9 39-7" {...common} />
        <path d="M35 1.5 41.5 4 37 9.5" {...common} />
      </svg>
    );
  }

  if (direction === "down-left") {
    return (
      <svg
        width="42"
        height="40"
        viewBox="0 0 42 40"
        className="mr-3 text-ink-3"
      >
        <path d="M38 3C36 18 28 30 8 35" {...common} />
        <path d="M14 37.5 5.5 35.5 10 28" {...common} />
      </svg>
    );
  }

  return (
    <svg width="38" height="40" viewBox="0 0 38 40" className="mr-5 text-ink-3">
      <path d="M6 2c10 7 16 17 15 33" {...common} />
      <path d="M14 28.5 20.5 36 27 29" {...common} />
    </svg>
  );
}
