"use client";

import { useEffect, useMemo } from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { PLACES, type Place } from "@/data/trip";
import routes from "@/data/routes.json";
import { mapsSearch, walkingDirections } from "@/lib/links";

type Leg = { from: string; to: string; distance: number; coords: [number, number][] };
const ROUTES = routes as unknown as Record<string, Leg[]>;

const CITY: [[number, number], [number, number]] = [
  [60.1495, 24.9185],
  [60.1755, 24.9625],
];

function pinIcon(n: number, kind: string) {
  return L.divIcon({
    className: "pin-marker",
    html: `<div class="pin" data-kind="${kind}">${n}</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -14],
  });
}

function FitTo({ places, token }: { places: Place[]; token: string }) {
  const map = useMap();

  useEffect(() => {
    if (places.length === 0) return;
    // "Alle" would otherwise zoom out to fit Kuusijärvi 30 km away and squash
    // every city pin into one blob. Frame the city; the jump buttons handle
    // the rest.
    const bounds =
      token === "alle"
        ? L.latLngBounds(CITY)
        : L.latLngBounds(places.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, {
      padding: [56, 56],
      maxZoom: 15,
      animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      duration: 0.45,
    });
  }, [map, places, token]);

  return null;
}

function Jump() {
  const map = useMap();
  const go = (b: L.LatLngBoundsExpression) =>
    map.fitBounds(b, { padding: [40, 40], duration: 0.45 });

  return (
    <div className="absolute top-3 right-3 z-[1000] flex gap-1.5">
      <button
        onClick={() => go(CITY)}
        className="press rounded-lg border border-line bg-surface px-2.5 py-1.5 text-[12.5px] font-medium text-ink-2 shadow-sm hover:text-ink"
      >
        Byen
      </button>
      <button
        onClick={() =>
          go([
            [60.3005, 25.105],
            [60.3175, 25.155],
          ])
        }
        className="press rounded-lg border border-line bg-surface px-2.5 py-1.5 text-[12.5px] font-medium text-ink-2 shadow-sm hover:text-ink"
      >
        Kuusijärvi
      </button>
    </div>
  );
}

export default function MapCanvas({
  places,
  dayId,
  dark,
}: {
  places: Place[];
  dayId: string;
  dark: boolean;
}) {
  const legs = useMemo(
    () => (dayId === "alle" ? Object.values(ROUTES).flat() : (ROUTES[dayId] ?? [])),
    [dayId],
  );

  const showHikeHint = dayId === "fredag" || dayId === "alle";

  const tiles = dark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  return (
    <MapContainer
      center={[60.1665, 24.9385]}
      zoom={13}
      scrollWheelZoom={false}
      className="h-full w-full"
      attributionControl
    >
      <TileLayer
        key={dark ? "dark" : "light"}
        url={tiles}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        maxZoom={19}
      />

      {legs.map((leg, i) => (
        <Polyline
          key={`${dayId}-${leg.from}-${leg.to}-${i}`}
          positions={leg.coords}
          pathOptions={{
            color: dark ? "#7cb0e0" : "#1c4e80",
            weight: 3,
            opacity: 0.5,
            lineCap: "round",
            lineJoin: "round",
          }}
        />
      ))}

      {showHikeHint && (
        <Polyline
          positions={[
            [PLACES.kuusijarvi.lat, PLACES.kuusijarvi.lng],
            [PLACES.sipoonkorpi.lat, PLACES.sipoonkorpi.lng],
          ]}
          pathOptions={{
            color: dark ? "#96b88c" : "#4a6b43",
            weight: 2.5,
            opacity: 0.6,
            dashArray: "2 7",
            lineCap: "round",
          }}
        />
      )}

      {places.map((p, i) => (
        <Marker
          key={p.id}
          position={[p.lat, p.lng]}
          icon={pinIcon(i + 1, p.kind)}
          title={p.name}
        >
          <Popup closeButton autoPan>
            <div>
              {p.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.image}
                  alt=""
                  className="h-28 w-full object-cover"
                  loading="lazy"
                />
              )}
              <div className="p-3.5">
                <p className="text-[14.5px] font-medium">{p.name}</p>
                {p.address && (
                  <p className="mt-0.5 text-[12.5px] text-ink-3">{p.address}</p>
                )}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <a
                    href={walkingDirections(p)}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md bg-accent px-2 py-1 text-[12.5px] font-medium !text-white no-underline"
                  >
                    Rute hertil
                  </a>
                  <a
                    href={p.url ?? mapsSearch(p)}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md bg-surface-2 px-2 py-1 text-[12.5px] font-medium !text-ink-2 no-underline"
                  >
                    {p.url ? "Hjemmeside" : "Google Maps"}
                  </a>
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}

      <FitTo places={places} token={dayId} />
      <Jump />
    </MapContainer>
  );
}
