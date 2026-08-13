import { DAYS, PLACES, type EventItem } from "@/data/trip";

/** Helsinki is UTC+3 in August (EEST). All programme times are local Helsinki
 *  time, except the two Copenhagen departures which we treat as CPH local. */
const HELSINKI_OFFSET = "+03:00";
const COPENHAGEN_OFFSET = "+02:00";

const CPH_EVENTS = new Set(["t-moede", "t-afgang"]);

/** "07.30" + "2026-08-20" -> Date */
export function eventDate(day: string, time: string, id?: string): Date {
  const [h, m] = time.split(".");
  const offset = id && CPH_EVENTS.has(id) ? COPENHAGEN_OFFSET : HELSINKI_OFFSET;
  return new Date(`${day}T${h.padStart(2, "0")}:${m}:00${offset}`);
}

export type Scheduled = {
  event: EventItem;
  dayId: string;
  dayLabel: string;
  start: Date;
  end: Date;
};

/** Every timed event, in order, with a resolved start and end.
 *  Untimed events inherit the slot between their neighbours. */
export function schedule(): Scheduled[] {
  const out: Scheduled[] = [];

  for (const day of DAYS) {
    const items = day.events.map((event, i) => ({ event, i }));
    for (const { event, i } of items) {
      // Walk backwards to the last known time, forwards to the next one.
      let start: Date | null = event.start
        ? eventDate(day.date, event.start, event.id)
        : null;

      if (!start) {
        for (let j = i - 1; j >= 0; j--) {
          const prev = day.events[j];
          const t = prev.end ?? prev.start;
          if (t) {
            start = eventDate(day.date, t, prev.id);
            break;
          }
        }
      }
      if (!start) continue;

      let end: Date | null = event.end
        ? eventDate(day.date, event.end, event.id)
        : null;

      if (!end) {
        for (let j = i + 1; j < day.events.length; j++) {
          const next = day.events[j];
          if (next.start) {
            end = eventDate(day.date, next.start, next.id);
            break;
          }
        }
      }
      // Trailing open-ended events run to 03.00 the next morning.
      if (!end) {
        end = new Date(start.getTime() + 3 * 60 * 60 * 1000);
      }
      if (end <= start) end = new Date(start.getTime() + 45 * 60 * 1000);

      out.push({
        event,
        dayId: day.id,
        dayLabel: `${day.weekday} ${day.date.slice(8, 10)}.8.`,
        start,
        end,
      });
    }
  }

  return out.sort((a, b) => a.start.getTime() - b.start.getTime());
}

export const TRIP_START = eventDate(DAYS[0].date, "07.30", "t-moede");
export const TRIP_END = eventDate(DAYS[3].date, "15.35");

export function placeOf(event: EventItem) {
  return event.place ? PLACES[event.place] : undefined;
}

/** Great-circle metres — good enough to sanity-check a city walk. */
export function metresBetween(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
) {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
