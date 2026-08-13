import type { Flight } from "@/data/trip";

function Plane({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor">
      <path d="M21.6 11.1 15 9.4l-3.5-6.1a1 1 0 0 0-1.8.1l-1.1 3 2 3.6-3.2-.8-1.5-2.2-1.3.4.9 2.6-.9 2.6 1.3.4 1.5-2.2 3.2-.8-2 3.6 1.1 3a1 1 0 0 0 1.8.1L15 10.4l6.6-1.7Z" />
    </svg>
  );
}

/** Boarding-pass style card: the route at a glance, over a strip of sky. */
export function FlightCard({
  flight,
  label,
  date,
}: {
  flight: Flight;
  label: string;
  date: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl bg-surface shadow-lg">
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-4">
          <p className="flex items-center gap-2 text-[13.5px] font-medium">
            <Plane className="h-3.5 w-3.5 text-accent" />
            {label}
          </p>
          <p className="text-[13px] text-ink-3">{date}</p>
        </div>

        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-[12.5px] text-ink-3">Afgang</p>
            <p className="tnum mt-0.5 text-[14.5px]">
              {flight.depart}, {flight.fromCity}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[12.5px] text-ink-3">Ankomst</p>
            <p className="tnum mt-0.5 text-[14.5px]">
              {flight.arriveEstimated && (
                <span className="text-ink-3">ca. </span>
              )}
              {flight.arrive}, {flight.toCity}
            </p>
          </div>
        </div>

        <div className="mt-2.5 flex items-center gap-3">
          <p className="display text-[30px] leading-none sm:text-[34px]">
            {flight.fromCode}
          </p>

          <div className="relative flex-1">
            <div className="h-px w-full bg-line-strong" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface px-2 text-[12.5px] whitespace-nowrap text-ink-2">
              {flight.duration}
            </span>
          </div>

          <p className="display text-[30px] leading-none sm:text-[34px]">
            {flight.toCode}
          </p>
        </div>
      </div>

      {/* A strip of sky, drawn rather than photographed */}
      <div
        className="relative h-24 overflow-hidden sm:h-28"
        style={{
          background:
            "linear-gradient(180deg, var(--sky-top) 0%, var(--sky-mid) 58%, var(--sky-bot) 100%)",
        }}
      >
        <div
          className="absolute -bottom-10 -left-8 h-24 w-56 rounded-full opacity-70 blur-xl"
          style={{ background: "var(--cloud)" }}
        />
        <div
          className="absolute -right-10 -bottom-14 h-28 w-64 rounded-full opacity-60 blur-xl"
          style={{ background: "var(--cloud)" }}
        />
        <div
          className="absolute bottom-2 left-1/3 h-16 w-40 rounded-full opacity-50 blur-lg"
          style={{ background: "var(--cloud)" }}
        />

        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 320 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d="M24 74C86 26 214 20 296 40"
            fill="none"
            stroke="var(--sky-ink)"
            strokeWidth="1.4"
            strokeDasharray="2 6"
            strokeLinecap="round"
            opacity="0.55"
          />
        </svg>

        <Plane
          className="absolute top-[26%] right-[10%] h-6 w-6 -rotate-[14deg]"
          style={{ color: "var(--sky-ink)" }}
        />
      </div>
    </div>
  );
}
