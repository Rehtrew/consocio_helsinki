import type { Place } from "@/data/trip";

export function mapsSearch(place: Place) {
  const q = place.address
    ? `${place.name}, ${place.address}`
    : `${place.lat},${place.lng}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

/** Walking directions. Origin left blank so the phone uses "your location". */
export function walkingDirections(to: Place, from?: Place) {
  const p = new URLSearchParams({
    api: "1",
    destination: `${to.lat},${to.lng}`,
    travelmode: "walking",
  });
  if (from) p.set("origin", `${from.lat},${from.lng}`);
  return `https://www.google.com/maps/dir/?${p.toString()}`;
}

export const kr = (n: number) =>
  new Intl.NumberFormat("da-DK", {
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(n);
