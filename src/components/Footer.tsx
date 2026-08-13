const CREDITS = [
  {
    label: "Kuusijärvi og røgsaunaen",
    who: "Ximonic (Simo Räsänen)",
    lic: "CC BY 3.0 / CC BY-SA 4.0",
    href: "https://commons.wikimedia.org/wiki/User:Ximonic",
  },
  {
    label: "Sipoonkorpi",
    who: "Nemo bis",
    lic: "CC BY-SA 3.0",
    href: "https://commons.wikimedia.org/wiki/File:Sipoonkorpi_103.jpg",
  },
  {
    label: "Helsinki fra vandet",
    who: "William John Gauthier",
    lic: "CC BY-SA 2.0",
    href: "https://commons.wikimedia.org/wiki/File:Helsinki_Skyline_(52432702085).jpg",
  },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-surface-2">
      <div className="mx-auto max-w-5xl px-5 py-12">
        <p className="display text-[22px]">Consocio · Helsinki 2026</p>
        <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-ink-2">
          Bygget ud fra programmet «Helsinki 20-23. august – Consocio». Hvis
          noget ændrer sig i programmet, ændrer det sig her.
        </p>

        <div className="mt-9 grid gap-8 sm:grid-cols-2">
          <div>
            <p className="text-[13px] font-medium">Billeder</p>
            <ul className="mt-2.5 space-y-1.5">
              {CREDITS.map((c) => (
                <li key={c.label} className="text-[12.5px] text-ink-3">
                  {c.label} —{" "}
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noreferrer"
                    className="underline decoration-line-strong underline-offset-2 hover:text-ink-2"
                  >
                    {c.who}
                  </a>
                  , {c.lic}
                </li>
              ))}
              <li className="text-[12.5px] text-ink-3">
                Øvrige billeder er hentet fra stedernes egne hjemmesider og{" "}
                <a
                  href="https://www.myhelsinki.fi/"
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-line-strong underline-offset-2 hover:text-ink-2"
                >
                  MyHelsinki
                </a>
                .
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[13px] font-medium">Kort og ruter</p>
            <p className="mt-2.5 text-[12.5px] leading-relaxed text-ink-3">
              Kortdata fra{" "}
              <a
                href="https://www.openstreetmap.org/copyright"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-line-strong underline-offset-2 hover:text-ink-2"
              >
                OpenStreetMap
              </a>
              , kortfliser fra{" "}
              <a
                href="https://carto.com/attributions"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-line-strong underline-offset-2 hover:text-ink-2"
              >
                CARTO
              </a>
              . Gåruter er beregnet med{" "}
              <a
                href="https://project-osrm.org/"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-line-strong underline-offset-2 hover:text-ink-2"
              >
                OSRM
              </a>
              . Gåtiderne i programmet er dem, der stod i det oprindelige
              dokument.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
