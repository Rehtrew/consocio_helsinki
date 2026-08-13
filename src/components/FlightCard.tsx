import { PLACES, type Flight } from "@/data/trip";
import { greatCircle } from "@/lib/geo";
import { MiniMap } from "./map/MiniMap";

function Plane({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 2.2c.85 0 1.5.72 1.5 1.6v4.9l7.5 4.35v1.9l-7.5-2.25v4.55l2.35 1.65v1.6L12 19.55l-3.85 1-.05-1.6 2.4-1.65V12.7L3 14.95v-1.9l7.5-4.35V3.8c0-.88.65-1.6 1.5-1.6Z" />
    </svg>
  );
}

const AIRPORTS: Record<string, { lat: number; lng: number }> = {
  CPH: PLACES.cph,
  HEL: PLACES.hel,
};

/** Boarding-pass style card: the route at a glance, over the actual route. */
export function FlightCard({
  flight,
  label,
  date,
}: {
  flight: Flight;
  label: string;
  date: string;
}) {
  const from = AIRPORTS[flight.fromCode];
  const to = AIRPORTS[flight.toCode];
  const arc = greatCircle(from, to);

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

      <MiniMap
        className="h-36 sm:h-44"
        lines={[arc]}
        dashed
        padding={14}
        pins={[
          { ...from, label: flight.fromCode, kind: "transport" },
          { ...to, label: flight.toCode, kind: "transport" },
        ]}
      />
    </div>
  );
}
