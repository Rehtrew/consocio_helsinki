import { writeFile } from "node:fs/promises";
const P = {
  onigiri: [60.160529, 24.941343], loyly: [60.152177, 24.930444], forenom: [60.166251, 24.925586],
  liberty: [60.164728, 24.944213], nolita: [60.159413, 24.936676], ahven: [60.160968, 24.937722],
  levain: [60.172742, 24.923303], finnjavel: [60.171944, 24.93147], allas: [60.167119, 24.958063],
  bardot: [60.168144, 24.947721], lazyfox: [60.164718, 24.932478],
  kuusijarvi: [60.312112, 25.114841], bisajarvi: [60.306393, 25.1456514],
};
const legs = {
  torsdag: [["onigiri","loyly"],["loyly","forenom"],["forenom","liberty"],["liberty","nolita"],["nolita","ahven"]],
  fredag: [["forenom","levain"],["levain","forenom"],["forenom","finnjavel"]],
  lordag: [["forenom","allas"],["allas","forenom"],["forenom","bardot"]],
  sondag: [["forenom","lazyfox"],["lazyfox","allas"]],
  vandring: [["kuusijarvi","bisajarvi"],["bisajarvi","kuusijarvi"]],
};
const out = {};
for (const [day, pairs] of Object.entries(legs)) {
  out[day] = [];
  for (const [a, b] of pairs) {
    const [la, na] = P[a], [lb, nb] = P[b];
    const url = `https://router.project-osrm.org/route/v1/foot/${na},${la};${nb},${lb}?overview=full&geometries=geojson`;
    try {
      const j = await (await fetch(url, { signal: AbortSignal.timeout(25000) })).json();
      const r = j.routes?.[0];
      if (!r) { console.log(day, a, b, "NO ROUTE", j.code); continue; }
      out[day].push({
        from: a, to: b,
        distance: Math.round(r.distance),
        minutes: Math.round(r.duration / 60),
        coords: r.geometry.coordinates.map(([lon, lat]) => [+lat.toFixed(5), +lon.toFixed(5)]),
      });
      console.log(day, `${a}→${b}`, Math.round(r.distance) + "m", Math.round(r.duration / 60) + "min", r.geometry.coordinates.length + "pts");
    } catch (e) { console.log(day, a, b, "ERR", e.message.slice(0, 40)); }
    await new Promise((z) => setTimeout(z, 400));
  }
}
await writeFile("src/data/routes.json", JSON.stringify(out));
console.log("bytes", JSON.stringify(out).length);
