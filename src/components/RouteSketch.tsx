import { PLACES } from "@/data/trip";
import routes from "@/data/routes.json";

type Leg = {
  from: string;
  to: string;
  distance: number;
  coords: [number, number][];
};
const ROUTES = routes as unknown as Record<string, Leg[]>;

const PAD = 26;
/** Keep every card between roughly square and a gentle landscape, whatever
 *  shape the day's walk happens to be. */
const MIN_ASPECT = 0.95;
const MAX_ASPECT = 1.65;
const SCALE = 340;

/** A drawn map of the day's walking — the real route geometry, no tiles.
 *  Small enough to sit inside the day, cheap enough to repeat four times. */
export function RouteSketch({ dayId }: { dayId: string }) {
  const legs = ROUTES[dayId] ?? [];
  if (legs.length === 0) return null;

  // Stops in walking order, first appearance wins
  const order: string[] = [];
  for (const leg of legs) {
    for (const id of [leg.from, leg.to]) {
      if (!order.includes(id)) order.push(id);
    }
  }

  const all = legs.flatMap((l) => l.coords);
  const lats = all.map((c) => c[0]);
  const lngs = all.map((c) => c[1]);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  // Equirectangular, corrected so the city isn't stretched sideways
  const k = Math.cos(((minLat + maxLat) / 2) * (Math.PI / 180));
  const spanX = Math.max((maxLng - minLng) * k, 1e-6);
  const spanY = Math.max(maxLat - minLat, 1e-6);

  // Frame the drawing itself rather than fitting it into a fixed rectangle,
  // then pad the short axis so the card never gets absurdly tall or wide.
  const scale = SCALE / Math.max(spanX, spanY);
  let boxW = spanX * scale;
  let boxH = spanY * scale;
  if (boxW / boxH < MIN_ASPECT) boxW = boxH * MIN_ASPECT;
  if (boxW / boxH > MAX_ASPECT) boxH = boxW / MAX_ASPECT;

  const W = Math.round(boxW + PAD * 2);
  const H = Math.round(boxH + PAD * 2);
  const offX = (W - spanX * scale) / 2;
  const offY = (H - spanY * scale) / 2;

  const project = ([lat, lng]: [number, number]) => [
    offX + (lng - minLng) * k * scale,
    offY + (maxLat - lat) * scale,
  ];

  const metres = legs.reduce((a, b) => a + b.distance, 0);

  return (
    <figure className="relative">
      <div className="stack relative rounded-2xl bg-surface p-4 shadow-md">
        <figcaption className="flex items-baseline justify-between gap-4">
          <span className="text-[13.5px] font-medium">Dagens gåtur</span>
          <span className="tnum text-[13px] text-ink-3">
            {(metres / 1000).toFixed(1).replace(".", ",")} km i alt
          </span>
        </figcaption>

        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="mt-2 w-full"
          role="img"
          aria-label={`Gårute mellem ${order
            .map((id) => PLACES[id].name)
            .join(", ")}`}
        >
          {legs.map((leg, i) => (
            <path
              key={i}
              d={leg.coords
                .map((c, j) => {
                  const [x, y] = project(c);
                  return `${j === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
                })
                .join(" ")}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.5"
            />
          ))}

          {order.map((id, i) => {
            const place = PLACES[id];
            const [x, y] = project([place.lat, place.lng]);
            return (
              <g key={id}>
                <circle
                  cx={x}
                  cy={y}
                  r="10"
                  fill="var(--surface)"
                  stroke="var(--line-strong)"
                  strokeWidth="1.2"
                />
                <text
                  x={x}
                  y={y + 3.6}
                  textAnchor="middle"
                  fontSize="10.5"
                  fontWeight="600"
                  fill="var(--ink-2)"
                >
                  {i + 1}
                </text>
              </g>
            );
          })}
        </svg>

        <ol className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
          {order.map((id, i) => (
            <li key={id} className="text-[12.5px] text-ink-3">
              <span className="tnum text-ink-2">{i + 1}</span>{" "}
              {PLACES[id].name}
            </li>
          ))}
        </ol>
      </div>
    </figure>
  );
}
