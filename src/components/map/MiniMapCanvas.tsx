"use client";

import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, Marker, Polyline, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export type MiniPin = { lat: number; lng: number; label: string; kind: string };

function dot(label: string, kind: string) {
  // Airport codes need a lozenge; stop numbers fit a circle.
  const wide = label.length > 2;
  return L.divIcon({
    className: "pin-marker",
    html: `<div class="pin pin-sm${wide ? " pin-text" : ""}" data-kind="${kind}">${label}</div>`,
    iconSize: wide ? [40, 20] : [20, 20],
    iconAnchor: wide ? [20, 10] : [10, 10],
  });
}

function Fit({
  bounds,
  padding,
}: {
  bounds: [number, number][];
  padding: number;
}) {
  const map = useMap();
  useEffect(() => {
    if (bounds.length === 0) return;
    map.fitBounds(L.latLngBounds(bounds), {
      padding: [padding, padding],
      animate: false,
    });
  }, [map, bounds, padding]);
  return null;
}

/** A small, non-interactive map. It is a picture of where you are going, not
 *  a thing to pan around — the big map in "Kort" is for that. */
export default function MiniMapCanvas({
  pins,
  lines,
  dark,
  padding = 22,
  dashed = false,
}: {
  pins: MiniPin[];
  lines: [number, number][][];
  dark: boolean;
  padding?: number;
  dashed?: boolean;
}) {
  const bounds = [...lines.flat(), ...pins.map((p) => [p.lat, p.lng])] as [
    number,
    number,
  ][];

  return (
    <MapContainer
      center={[60.17, 24.94]}
      zoom={12}
      className="h-full w-full"
      zoomControl={false}
      attributionControl={false}
      dragging={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      touchZoom={false}
      keyboard={false}
      boxZoom={false}
    >
      <TileLayer
        key={dark ? "dark" : "light"}
        url={
          dark
            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        }
        maxZoom={19}
      />

      {lines.map((coords, i) => (
        <Polyline
          key={i}
          positions={coords}
          pathOptions={{
            color: dark ? "#7cb0e0" : "#1c4e80",
            weight: dashed ? 2 : 3,
            opacity: dashed ? 0.75 : 0.55,
            dashArray: dashed ? "3 7" : undefined,
            lineCap: "round",
            lineJoin: "round",
          }}
        />
      ))}

      {pins.map((p) => (
        <Marker
          key={`${p.label}-${p.lat}`}
          position={[p.lat, p.lng]}
          icon={dot(p.label, p.kind)}
          interactive={false}
        />
      ))}

      <Fit bounds={bounds} padding={padding} />
    </MapContainer>
  );
}
