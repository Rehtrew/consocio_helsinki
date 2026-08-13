import { CREW, PACKING, PLACES } from "@/data/trip";
import { mapsSearch, walkingDirections } from "@/lib/links";
import { Reveal } from "./Reveal";

const FLIGHTS = [
  { leg: "Ud", when: "Torsdag 20. august", detail: "CPH 08.20 → HEL 11.20", meet: "Mødetid 07.30" },
  { leg: "Hjem", when: "Søndag 23. august", detail: "HEL 15.35", meet: "Afgang fra byen 14.00" },
];

const KNOW = [
  {
    t: "Finsk tid",
    d: "En time foran dansk. Alle klokkeslæt her er finsk tid — undtagen mødetid og afgang i København.",
  },
  {
    t: "Sauna",
    d: "Vask dig inden du går ind, sid på dit håndklæde, og tag den i det tempo du har lyst til. Ved Löyly og Allas er der badetøj på i de blandede områder.",
  },
  {
    t: "Røgsauna",
    d: "Kuusijärvis røgsauna har ingen skorsten — den fyres i timevis, luftes ud, og varmen sidder i stenene. Blødere og tungere end en almindelig sauna.",
  },
  {
    t: "Betaling",
    d: "Euro, og kort virker overalt. Drikkepenge forventes ikke. Postevandet er blandt verdens bedste — køb ikke flaskevand.",
  },
];

export function Practical() {
  const base = PLACES.forenom;

  return (
    <section id="praktisk" className="scroll-mt-24">
      <Reveal>
        <div className="border-t border-line pt-10">
          <p className="text-[13px] text-ink-3">Praktisk</p>
          <h2 className="display mt-2.5 text-[clamp(1.9rem,5.5vw,2.9rem)]">
            Inden vi tager afsted
          </h2>
        </div>
      </Reveal>

      <div className="mt-9 grid gap-x-12 gap-y-11 lg:grid-cols-2">
        {/* Base */}
        <Reveal delay={40}>
          <div className="rounded-2xl bg-surface p-5 shadow-md sm:p-6">
            <p className="text-[13px] text-ink-3">Vores base</p>
            <h3 className="mt-1.5 text-[17px] font-medium">{base.name}</h3>
            <p className="mt-1 text-[14.5px] text-ink-2">{base.address}</p>
            <p className="mt-3 text-[14.5px] leading-relaxed text-ink-2">
              Tre værelser: 2 + 2 + 1. Indtjekning torsdag fra 16.00,
              udtjekning søndag 10.00.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={walkingDirections(base)}
                target="_blank"
                rel="noreferrer"
                className="press rounded-lg bg-accent px-3 py-2 text-[13.5px] font-medium text-white shadow-sm"
              >
                Rute hjem
              </a>
              <a
                href={mapsSearch(base)}
                target="_blank"
                rel="noreferrer"
                className="press rounded-lg bg-surface-2 px-3 py-2 text-[13.5px] font-medium text-ink-2 shadow-sm hover:text-ink"
              >
                Åbn i Google Maps
              </a>
            </div>
          </div>
        </Reveal>

        {/* Flights */}
        <Reveal delay={70}>
          <div>
            <h3 className="text-[15px] font-medium">Fly</h3>
            <div className="mt-3 space-y-2.5">
              {FLIGHTS.map((f) => (
                <div
                  key={f.leg}
                  className="flex items-baseline justify-between gap-5 rounded-xl bg-surface p-4 shadow-sm"
                >
                  <div>
                    <p className="text-[14.5px] font-medium">{f.detail}</p>
                    <p className="mt-0.5 text-[13px] text-ink-3">{f.when}</p>
                  </div>
                  <p className="tnum shrink-0 text-[13px] text-ink-2">
                    {f.meet}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-3.5 rounded-xl bg-heat-soft p-3.5 text-[13.5px] leading-relaxed text-ink-2">
              <span className="font-medium text-heat">Kun håndbagage.</span> 1
              stk. håndbagage plus 1 personlig genstand, der skal kunne ligge
              under sædet. Ingen indtjekket bagage — hverken ud eller hjem.
            </p>
          </div>
        </Reveal>

        {/* Packing */}
        <Reveal delay={100}>
          <div>
            <h3 className="text-[15px] font-medium">Pak det her</h3>
            <ul className="mt-3">
              {PACKING.map((p) => (
                <li
                  key={p.item}
                  className="grid grid-cols-[9.5rem_1fr] items-baseline gap-x-5 border-t border-line py-3 first:border-t-0 first:pt-0"
                >
                  <span className="text-[14.5px] font-medium">{p.item}</span>
                  <span className="text-[13px] leading-relaxed text-ink-3">
                    {p.why}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* Crew */}
        <Reveal delay={130}>
          <div>
            <h3 className="text-[15px] font-medium">Hvem har ansvaret</h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-ink-3">
              Der er steder i programmet, hvor nogle af jer skal finde en bar,
              et kaffested eller lignende.
            </p>
            <ul className="mt-3.5 space-y-2">
              {CREW.map((c) => (
                <li
                  key={c.who + c.task}
                  className="flex items-center gap-3.5 rounded-xl bg-surface p-3.5 shadow-sm"
                >
                  <span
                    aria-hidden
                    className={`h-2 w-2 shrink-0 rounded-full ${
                      c.done ? "bg-forest" : "bg-heat"
                    }`}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14.5px] font-medium">
                      {c.who}
                    </span>
                    <span className="block text-[13px] text-ink-3">
                      {c.task}
                    </span>
                  </span>
                  <span
                    className={`shrink-0 text-[13px] ${
                      c.done ? "text-forest" : "text-heat"
                    }`}
                  >
                    {c.done ? "Planlagt" : "Mangler"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      {/* Good to know */}
      <Reveal delay={160}>
        <div className="mt-11">
          <h3 className="text-[15px] font-medium">Godt at vide</h3>
          <div className="mt-4 grid gap-x-10 gap-y-6 sm:grid-cols-2">
            {KNOW.map((k) => (
              <div key={k.t}>
                <p className="text-[14.5px] font-medium">{k.t}</p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-ink-2">
                  {k.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
