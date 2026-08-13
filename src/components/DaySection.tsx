import Image from "next/image";
import { BUDGET, FIRST_VISIT, PLACES, type Day, type EventItem } from "@/data/trip";
import { kr, mapsSearch, walkingDirections } from "@/lib/links";
import { Reveal } from "./Reveal";

const DOT: Record<string, string> = {
  food: "bg-accent",
  sauna: "bg-heat",
  bar: "bg-ink",
  nature: "bg-forest",
  stay: "bg-ink-3",
  transport: "bg-ink-3",
  rest: "bg-ink-3",
};

function ArrowOut() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className="shrink-0 opacity-55"
    >
      <path
        d="M3.2 8.8 8.8 3.2M4.4 3.2h4.4v4.4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EventRow({ event, last }: { event: EventItem; last: boolean }) {
  const place = event.place ? PLACES[event.place] : undefined;
  // Introduce a place once. On later visits the card stays lean — no repeated
  // photo, description or website link.
  const intro = Boolean(place) && FIRST_VISIT[place!.id] === event.id;
  const photo = event.image ?? (intro ? place?.image : undefined);
  const isPin = place && place.id !== "cph" && place.id !== "hel";

  return (
    <li className="relative flex gap-4 sm:gap-6">
      {/* Time gutter */}
      <div className="w-[46px] shrink-0 pt-[3px] text-right sm:w-[58px]">
        {event.start ? (
          <p className="tnum text-[14px] leading-tight font-medium">
            {event.start}
          </p>
        ) : (
          <p className="text-[14px] leading-tight text-ink-3">–</p>
        )}
        {event.end && (
          <p className="tnum text-[12.5px] leading-tight text-ink-3">
            {event.end}
          </p>
        )}
      </div>

      {/* Rail */}
      <div className="relative flex w-3 shrink-0 justify-center">
        <span
          aria-hidden
          className={`absolute top-[7px] h-[9px] w-[9px] rounded-full ring-4 ring-paper ${
            DOT[event.kind] ?? "bg-ink-3"
          } ${event.anchor ? "" : "opacity-45"}`}
        />
        {!last && (
          <span
            aria-hidden
            className="absolute top-[22px] bottom-[-26px] w-px bg-line"
          />
        )}
      </div>

      {/* Card */}
      <div className="min-w-0 flex-1 pb-9">
        <div className="flex items-start gap-4">
          <div className="min-w-0 flex-1">
            <h3
              className={`${
                event.anchor
                  ? "text-[17px] font-medium sm:text-[18px]"
                  : "text-[15.5px] font-medium text-ink-2"
              } leading-snug`}
            >
              {event.title}
            </h3>

            {place && (
              <p className="mt-1 text-[13.5px] text-ink-3">
                {place.address ?? place.name}
              </p>
            )}

            {event.lead && (
              <p className="mt-2.5 max-w-prose text-[14.5px] leading-relaxed text-ink-2">
                {event.lead}
              </p>
            )}

            {place?.blurb && intro && (
              <p className="mt-2.5 max-w-prose text-[14.5px] leading-relaxed text-ink-2">
                {place.blurb}
              </p>
            )}

            {event.notes && (
              <ul className="mt-2.5 max-w-prose space-y-1.5">
                {event.notes.map((n) => (
                  <li
                    key={n}
                    className="relative pl-4 text-[14px] leading-relaxed text-ink-2 before:absolute before:top-[9px] before:left-0 before:h-[3px] before:w-[3px] before:rounded-full before:bg-ink-3"
                  >
                    {n}
                  </li>
                ))}
              </ul>
            )}

            {event.owner && (
              <p
                className={`mt-3 inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13.5px] ${
                  event.owner.done
                    ? "bg-forest-soft text-forest"
                    : "bg-heat-soft text-heat"
                }`}
              >
                <span className="font-medium">{event.owner.who}</span>
                <span className="opacity-85">{event.owner.task}</span>
                <span className="opacity-70">
                  {event.owner.done ? "· planlagt" : "· mangler"}
                </span>
              </p>
            )}

            {(event.walk || isPin) && (
              <div className="mt-3.5 flex flex-wrap items-center gap-2">
                {event.walk && (
                  <span className="rounded-lg bg-surface-2 px-2.5 py-1.5 text-[13px] text-ink-2">
                    {event.walk.minutes} min til fods fra{" "}
                    {PLACES[event.walk.from].id === "forenom"
                      ? "lejligheden"
                      : PLACES[event.walk.from].name}
                  </span>
                )}
                {isPin && (
                  <a
                    href={walkingDirections(place)}
                    target="_blank"
                    rel="noreferrer"
                    className="press rounded-lg bg-surface px-2.5 py-1.5 text-[13px] font-medium text-ink-2 shadow-sm hover:bg-accent-soft hover:text-accent-ink"
                  >
                    Vis rute
                  </a>
                )}
                {place?.url && intro && (
                  <a
                    href={place.url}
                    target="_blank"
                    rel="noreferrer"
                    className="press inline-flex items-center gap-1.5 rounded-lg bg-surface px-2.5 py-1.5 text-[13px] font-medium text-ink-2 shadow-sm hover:bg-accent-soft hover:text-accent-ink"
                  >
                    Hjemmeside
                    <ArrowOut />
                  </a>
                )}
              </div>
            )}
          </div>

          {photo && place && (
            <a
              href={place.url ?? mapsSearch(place)}
              target="_blank"
              rel="noreferrer"
              className="press relative block h-[76px] w-[76px] shrink-0 overflow-hidden rounded-xl shadow-md sm:h-[104px] sm:w-[104px]"
            >
              <Image
                src={photo}
                alt={place.name}
                fill
                sizes="104px"
                className="object-cover"
              />
            </a>
          )}
        </div>
      </div>
    </li>
  );
}

export function DaySection({ day, index }: { day: Day; index: number }) {
  const dayBudget = BUDGET.find((g) => g.label === day.weekday);
  const total = dayBudget?.lines.reduce((a, b) => a + b.amount, 0) ?? 0;
  const stops = new Set(
    day.events.map((e) => e.place).filter((p): p is string => Boolean(p)),
  ).size;

  return (
    <section id={day.id} className="scroll-mt-24">
      <Reveal>
        <div className="border-t border-line pt-10">
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <div>
              <p className="text-[13px] text-ink-3">
                Dag {index + 1} · {day.weekday} den{" "}
                {Number(day.date.slice(8, 10))}. august
              </p>
              <h2 className="display mt-2.5 text-[clamp(1.9rem,5.5vw,2.9rem)]">
                {day.title}
              </h2>
              <p className="mt-3 max-w-lg text-[15.5px] leading-relaxed text-ink-2">
                {day.subtitle}
              </p>
            </div>

            <dl className="flex gap-7 pb-1">
              <div>
                <dt className="text-[13px] text-ink-3">Stop</dt>
                <dd className="tnum mt-0.5 text-[19px]">{stops}</dd>
              </div>
              {total > 0 && (
                <div>
                  <dt className="text-[13px] text-ink-3">Budget</dt>
                  <dd className="tnum mt-0.5 text-[19px]">{kr(total)} kr.</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </Reveal>

      <Reveal delay={60}>
        <ol className="mt-10">
          {day.events.map((event, i) => (
            <EventRow
              key={event.id}
              event={event}
              last={i === day.events.length - 1}
            />
          ))}
        </ol>
      </Reveal>
    </section>
  );
}
