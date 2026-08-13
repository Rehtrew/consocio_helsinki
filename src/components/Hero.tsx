import Image from "next/image";
import { Countdown } from "./Countdown";

const FACTS = [
  { k: "20.–23. august", v: "fire dage, tre nætter" },
  { k: "Tre bade", v: "Löyly, Kuusijärvi, Allas" },
  { k: "7–9 km", v: "Sipoonkorpi fredag" },
  { k: "Kun håndbagage", v: "intet indtjekket" },
];

export function Hero() {
  return (
    <header className="relative overflow-hidden">
      <div className="mx-auto max-w-5xl px-5 pt-14 pb-0 sm:pt-20">
        <p className="rise text-[13px] tracking-[0.01em] text-ink-3">
          Consocio · Helsinki · 2026
        </p>

        <h1
          className="rise display mt-5 text-[clamp(3.25rem,13vw,7.5rem)]"
          style={{ animationDelay: "60ms" }}
        >
          Helsinki
        </h1>

        <p
          className="rise mt-6 max-w-xl text-[17px] leading-relaxed text-ink-2 sm:text-[19px]"
          style={{ animationDelay: "120ms" }}
        >
          Fire dage med god mad, byen, naturen, forskellige typer saunaer og
          hinandens selskab. Her er programmet — med links, kort og ruter, så
          ingen behøver spørge hvor vi skal hen.
        </p>

        <div className="rise mt-9" style={{ animationDelay: "180ms" }}>
          <Countdown />
        </div>
      </div>

      <div
        className="rise mx-auto mt-11 max-w-5xl px-5"
        style={{ animationDelay: "240ms" }}
      >
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl shadow-lg sm:aspect-[21/9]">
          <Image
            src="/places/helsinki.jpg"
            alt="Helsinkis silhuet set fra vandet"
            fill
            priority
            sizes="(max-width: 1152px) 100vw, 1152px"
            className="object-cover"
          />
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-5xl px-5">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-4">
          {FACTS.map((f, i) => (
            <div
              key={f.k}
              className="rise"
              style={{ animationDelay: `${300 + i * 45}ms` }}
            >
              <dt className="text-[15px] font-medium">{f.k}</dt>
              <dd className="mt-1 text-[13.5px] leading-snug text-ink-3">
                {f.v}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </header>
  );
}
