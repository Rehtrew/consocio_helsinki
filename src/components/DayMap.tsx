import { PLACES } from "@/data/trip";
import routes from "@/data/routes.json";
import { MiniMap } from "./map/MiniMap";

type Leg = {
  from: string;
  to: string;
  distance: number;
  coords: [number, number][];
};
const ROUTES = routes as unknown as Record<string, Leg[]>;

/** The day's walking, on the actual map. Tapping the card jumps to the big
 *  map further down, where you can pan and get directions. */
export function DayMap({ dayId }: { dayId: string }) {
  const legs = ROUTES[dayId] ?? [];
  if (legs.length === 0) return null;

  const order: string[] = [];
  for (const leg of legs) {
    for (const id of [leg.from, leg.to]) {
      if (!order.includes(id)) order.push(id);
    }
  }

  const metres = legs.reduce((a, b) => a + b.distance, 0);

  return (
    <div className="stack relative rounded-2xl bg-surface p-3 shadow-md">
      <div className="flex items-baseline justify-between gap-4 px-1 pt-1 pb-2.5">
        <span className="text-[13.5px] font-medium">Dagens gåtur</span>
        <span className="tnum text-[13px] text-ink-3">
          {(metres / 1000).toFixed(1).replace(".", ",")} km i alt
        </span>
      </div>

      <MiniMap
        className="h-[190px] overflow-hidden rounded-xl"
        lines={legs.map((l) => l.coords)}
        pins={order.map((id, i) => ({
          lat: PLACES[id].lat,
          lng: PLACES[id].lng,
          label: String(i + 1),
          kind: PLACES[id].kind,
        }))}
      />

      <ol className="flex flex-wrap gap-x-4 gap-y-1 px-1 pt-2.5 pb-1">
        {order.map((id, i) => (
          <li key={id} className="text-[12.5px] text-ink-3">
            <span className="tnum text-ink-2">{i + 1}</span> {PLACES[id].name}
          </li>
        ))}
      </ol>

      <a
        href="#kort"
        className="absolute inset-0 rounded-2xl"
        aria-label="Se hele turen på det store kort"
      />
    </div>
  );
}
